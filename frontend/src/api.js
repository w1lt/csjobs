import axios from "axios";

const API_URL = "http://localhost:5000/api"; // Adjust the URL as needed

export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);
  return response.data;
};

export const loginUser = async (userData) => {
  console.log(userData);
  const response = await axios.post(`${API_URL}/auth/login`, userData);
  console.log(response.data);
  return response.data;
};

export const getListings = async () => {
  const response = await axios.get(`${API_URL}/listings`);
  return response.data;
};

export const applyToListing = async (applicationData, token) => {
  const response = await axios.post(
    `${API_URL}/applications/apply`,
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

export const updateApplicationStatus = async (applicationData, token) => {
  const response = await axios.put(
    `${API_URL}/applications/update-status`,
    applicationData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const deleteApplication = async (applicationId, token) => {
  const response = await axios.delete(`${API_URL}/applications/delete`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { applicationId },
  });
  return response.data;
};
