const express = require("express");
const multer = require("multer");
const { uploadFile, downloadFile } = require("../controllers/fileController");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), uploadFile);
router.get("/download/:fileId", downloadFile);

module.exports = router;
