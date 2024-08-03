import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL || "https://api.csjobs.lol";

export const createListing = async (listingData, token) => {
  const response = await axios.post(`${API_URL}/listings`, listingData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateUser = async (userId, userData, token) => {
  const response = await axios.put(
    `${API_URL}/admin/users/${userId}`,
    userData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const deleteUser = async (userId, token) => {
  const response = await axios.delete(`${API_URL}/admin/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

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

export const fetchUsers = async (token) => {
  const response = await axios.get(`${API_URL}/admin/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const triggerScraping = async (token) => {
  const response = await axios.post(
    `${API_URL}/admin/scrape`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const updateListing = async (listingId, listingData, token) => {
  const response = await axios.put(
    `${API_URL}/listings/${listingId}`,
    listingData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const getListingDetails = async (listingId, token) => {
  const response = await axios.get(`${API_URL}/listings/${listingId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteListing = async (listingId, token) => {
  const response = await axios.delete(`${API_URL}/listings/${listingId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const disableListing = async (listingId, token) => {
  const response = await axios.patch(
    `${API_URL}/listings/${listingId}/disable`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
