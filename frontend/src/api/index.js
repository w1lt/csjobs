import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL || "https://api.csjobs.lol";

export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/login`, userData);
  return response.data;
};

export const validateUserToken = async (token) => {
  const response = await axios.get(`${API_URL}/auth/validate-token`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getListings = async () => {
  const response = await axios.get(`${API_URL}/listings`);
  return response.data;
};

export const applyOrUpdateApplication = async (applicationData, token) => {
  const response = await axios.post(
    `${API_URL}/applications/apply-or-update`,
    applicationData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const getApplications = async (token) => {
  const response = await axios.get(`${API_URL}/applications`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const reportListing = async (reportData, token) => {
  const response = await axios.post(`${API_URL}/reports`, reportData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const uploadResume = async (formData, token) => {
  const response = await axios.post(`${API_URL}/file/upload`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const downloadResume = async (fileId) => {
  const response = await axios.get(`${API_URL}/file/download/${fileId}`, {
    responseType: "blob",
  });
  return response.data;
};

export const generateCoverLetter = async (fileId, jobTitle, companyName) => {
  const response = await axios.post(`${API_URL}/cover-letter`, {
    fileId,
    jobTitle,
    companyName,
  });
  return response.data;
};
