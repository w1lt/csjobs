import axios from "axios";

const API_URL = "http://localhost:5000/api"; // Adjust the URL as needed

export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/login`, userData);
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
  try {
    const response = await axios.get(`${API_URL}/applications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Get applications error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
