const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const B2 = require("backblaze-b2");
const pdf = require("pdf-parse");
const Resume = require("../models/Resume");
const User = require("../models/User");
const axios = require("axios");

const b2 = new B2({
  accountId: process.env.B2_KEY_ID,
  applicationKey: process.env.B2_APPLICATION_KEY,
});

let authorized = false;
let downloadUrl = "";
let bucketId = "";

const authorizeB2 = async () => {
  try {
    if (!authorized) {
      const response = await b2.authorize();
      authorized = true;
      downloadUrl = response.data.downloadUrl;
      console.log("B2 authorized");

      const bucketsResponse = await b2.listBuckets();
      const bucket = bucketsResponse.data.buckets.find(
        (bucket) => bucket.bucketName === process.env.B2_BUCKET_NAME
      );
      if (bucket) {
        bucketId = bucket.bucketId;
      } else {
        throw new Error("Bucket not found");
      }
    }
  } catch (err) {
    console.error("Error authorizing B2:", err);
    authorized = false;
    throw err;
  }
};

const uploadFile = async (req, res) => {
  const file = req.file;
  const userId = req.body.userId;

  try {
    await authorizeB2();

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Get the upload URL and token
    const uploadUrlResponse = await b2.getUploadUrl({ bucketId });
    const uploadUrl = uploadUrlResponse.data.uploadUrl;
    const uploadAuthToken = uploadUrlResponse.data.authorizationToken;

    const uniqueName = `${uuidv4()}-${encodeURIComponent(file.originalname)}`;
    const fileData = fs.readFileSync(file.path);

    // Upload the file
    const uploadResponse = await b2.uploadFile({
      uploadUrl,
      uploadAuthToken,
      fileName: uniqueName,
      data: fileData,
    });

    // Parse the PDF file
    const dataBuffer = fs.readFileSync(file.path);
    const parsedData = await pdf(dataBuffer);
    const parsedContent = parsedData.text;

    // Delete the file from the server after upload
    fs.unlinkSync(file.path);

    // Create a resume record in the database
    const resume = await Resume.create({
      userId: user.id,
      originalName: file.originalname,
      uniqueName: uniqueName,
      fileId: uploadResponse.data.fileId,
      parsedContent: parsedContent,
    });

    res.send({
      message: "File uploaded and parsed successfully",
      resume: resume,
    });
  } catch (err) {
    console.error("Error uploading file:", err);
    res.status(500).send("An error occurred while uploading the file.");
  }
};

const downloadFile = async (req, res) => {
  const fileId = req.params.fileId;

  try {
    await authorizeB2();

    // Generate a URL to download the file
    const downloadAuthResponse = await b2.getDownloadAuthorization({
      bucketId,
      fileNamePrefix: "", // Empty prefix to allow access to all files in the bucket
      validDurationInSeconds: 3600,
    });

    const downloadAuthorizationToken =
      downloadAuthResponse.data.authorizationToken;
    const downloadUrlFull = `${downloadUrl}/b2api/v2/b2_download_file_by_id?fileId=${fileId}`;

    // Proxy the file download
    const fileResponse = await axios({
      method: "get",
      url: downloadUrlFull,
      responseType: "stream",
      headers: {
        Authorization: downloadAuthorizationToken,
      },
    });

    res.setHeader("Content-Disposition", `attachment; filename="${fileId}"`);
    fileResponse.data.pipe(res);
  } catch (err) {
    console.error("Error downloading file:", err);
    if (err.response) {
      switch (err.response.status) {
        case 400:
          res.status(400).send("Bad request");
          break;
        case 401:
          res.status(401).send("Unauthorized");
          break;
        case 404:
          res.status(404).send("File not found");
          break;
        case 416:
          res.status(416).send("Range not satisfiable");
          break;
        case 429:
          res.status(429).send("Too many requests");
          break;
        default:
          res.status(500).send("An error occurred while downloading the file.");
          break;
      }
    } else {
      res.status(500).send("An error occurred while downloading the file.");
    }
  }
};

module.exports = {
  uploadFile,
  downloadFile,
};
