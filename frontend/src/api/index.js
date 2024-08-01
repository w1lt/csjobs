import axios from "axios";

const API_URL = "https://api.csjobs.lol";

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
