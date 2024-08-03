import React, { useState } from "react";
import {
  Container,
  TextInput,
  Textarea,
  Box,
  Text,
  Divider,
  FileInput,
  Button,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { uploadResume, generateCoverLetter } from "../api";
import Header from "../components/Header";

const CoverLetter = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");

  const handleResumeUpload = async () => {
    if (!resumeFile) return;

    const formData = new FormData();
    formData.append("file", resumeFile);
    const id = notifications.show({
      title: "Uploading resume...",
      message: "Please wait while your resume is uploaded.",
      loading: true,
      autoClose: false,
      withCloseButton: false,
    });

    try {
      const response = await uploadResume(formData);
      console.log("Resume upload response:", response); // Log the response for debugging
      notifications.update({
        id,
        title: "Resume Uploaded",
        message:
          "Notification will close in 2 seconds, you can close this notification now",
        loading: false,
        icon: <IconCheck size={18} />,
        autoClose: 2000,
      });
      generateCoverLetterFromResume(response.fileId);
    } catch (error) {
      console.error("Error uploading resume:", error); // Log the error for debugging
      notifications.update({
        id,
        title: "Upload Failed",
        message: "There was an issue uploading your resume. Please try again.",
        loading: false,
        autoClose: 2000,
      });
    }
  };

  const generateCoverLetterFromResume = async (fileId) => {
    const id = notifications.show({
      title: "Generating cover letter...",
      message: "Please wait while your cover letter is generated.",
      loading: true,
      autoClose: false,
      withCloseButton: false,
    });

    try {
      const response = await generateCoverLetter(fileId, jobTitle, companyName);
      console.log("Cover letter generation response:", response); // Log the response for debugging
      setCoverLetter(response.coverLetter);
      notifications.update({
        id,
        title: "Cover Letter Generated",
        message:
          "Notification will close in 2 seconds, you can close this notification now",
        loading: false,
        icon: <IconCheck size={18} />,
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Error generating cover letter:", error); // Log the error for debugging
      notifications.update({
        id,
        title: "Generation Failed",
        message:
          "There was an issue generating your cover letter. Please try again.",
        loading: false,
        autoClose: 2000,
      });
    }
  };

  const handleGenerate = () => {
    if (!resumeFile || !jobTitle || !companyName) {
      notifications.show({
        title: "Missing Information",
        message:
          "Please upload a resume and provide the job title and company name.",
        color: "red",
        autoClose: 3000,
      });
      return;
    }
    handleResumeUpload();
  };

  return (
    <Container size={"md"}>
      <Header />
      <Text size="xl" weight={700} align="center" mb="xl">
        Generate Your Cover Letter
      </Text>
      <Box mb="md">
        <TextInput
          label="Job Title"
          placeholder="Enter the job title"
          value={jobTitle}
          onChange={(event) => setJobTitle(event.currentTarget.value)}
          required
        />
      </Box>
      <Box mb="md">
        <TextInput
          label="Company Name"
          placeholder="Enter the company name"
          value={companyName}
          onChange={(event) => setCompanyName(event.currentTarget.value)}
          required
        />
      </Box>
      <Divider my="sm" />
      <Box mt="md">
        <FileInput
          label="Upload Resume"
          placeholder="Choose file"
          onChange={(file) => setResumeFile(file)}
        />
        <Button fullWidth mt="md" onClick={handleGenerate}>
          Generate Cover Letter
        </Button>
      </Box>
      {coverLetter && (
        <>
          <Divider my="xl" />
          <Box mt="md">
            <Textarea
              label="Generated Cover Letter"
              placeholder="Your cover letter will appear here"
              value={coverLetter}
              readOnly
              autosize
              minRows={10}
            />
          </Box>
        </>
      )}
    </Container>
  );
};

export default CoverLetter;
