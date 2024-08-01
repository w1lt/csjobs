import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const createListing = async (listingData, token) => {
  const response = await axios.post(`${API_URL}/admin/listings`, listingData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateListing = async (listingId, listingData, token) => {
  const response = await axios.put(
    `${API_URL}/admin/listings/${listingId}`,
    listingData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const updateUserRole = async (userId, isAdmin, token) => {
  const response = await axios.put(
    `${API_URL}/admin/users/${userId}role`,
    { isAdmin },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const fetchReports = async (token) => {
  const response = await axios.get(`${API_URL}/reports`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
