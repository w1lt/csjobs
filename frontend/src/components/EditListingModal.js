import React, { useState, useEffect } from "react";
import { Button, TextInput, Box, LoadingOverlay } from "@mantine/core";
import { useAuth } from "../context/AuthContext"; // Adjust the path as needed
import { updateListing, getListingDetails, deleteListing } from "../api/admin"; // Adjust the path as needed

const EditListingModal = ({ context, id, innerProps }) => {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [link, setLink] = useState("");
  const [tags, setTags] = useState("");
  const [compensation, setCompensation] = useState("");
  const [error, setError] = useState("");
  const { loading, setLoading, token } = useAuth();

  useEffect(() => {
    const fetchListingDetails = async () => {
      try {
        setLoading(true);
        const listingDetails = await getListingDetails(
          innerProps.listingId,
          token
        );
        setTitle(listingDetails.title || "");
        setCompany(listingDetails.company || "");
        setLocation(
          listingDetails.location
            ? JSON.stringify(listingDetails.location, null, 2)
            : ""
        );
        setDate(listingDetails.date || "");
        setLink(listingDetails.link || "");
        setTags(
          listingDetails.tags
            ? JSON.stringify(listingDetails.tags, null, 2)
            : ""
        );
        setCompensation(
          listingDetails.compensation
            ? JSON.stringify(listingDetails.compensation, null, 2)
            : ""
        );
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred");
        setLoading(false);
      }
    };
    fetchListingDetails();
  }, [innerProps.listingId, setLoading, token]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await updateListing(
        innerProps.listingId,
        {
          title,
          company,
          location: location ? JSON.parse(location) : [],
          date,
          link,
          tags: tags ? JSON.parse(tags) : [],
          compensation: compensation
            ? JSON.parse(compensation).map((comp) => parseInt(comp, 10))
            : [],
        },
        token
      );
      setLoading(false);
      context.closeModal(id);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteListing(innerProps.listingId, token);
      setLoading(false);
      context.closeModal(id);
      window.location.reload(); // Reload the page to reflect the deletion
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
      setLoading(false);
    }
  };

  return (
    <>
      <LoadingOverlay visible={loading} zIndex={1000} />
      <Box mb="xs">
        <TextInput
          label="Title"
          placeholder="Listing title"
          value={title}
          onChange={(event) => setTitle(event.currentTarget.value)}
          required
        />
      </Box>
      <Box mb="xs">
        <TextInput
          label="Company"
          placeholder="Company name"
          value={company}
          onChange={(event) => setCompany(event.currentTarget.value)}
          required
        />
      </Box>
      <Box mb="xs">
        <TextInput
          label="Location"
          placeholder='Add locations as JSON array, e.g. ["New York, NY", "San Francisco, CA"]'
          value={location}
          onChange={(event) => setLocation(event.currentTarget.value)}
        />
      </Box>
      <Box mb="xs">
        <TextInput
          label="Date"
          placeholder="Date"
          value={date}
          onChange={(event) => setDate(event.currentTarget.value)}
          required
        />
      </Box>
      <Box mb="xs">
        <TextInput
          label="Link"
          placeholder="Link"
          value={link}
          onChange={(event) => setLink(event.currentTarget.value)}
          required
        />
      </Box>
      <Box mb="xs">
        <TextInput
          label='Tags (as JSON array, e.g. ["tag1", "tag2"])'
          placeholder='Add tags as JSON array, e.g. ["tag1", "tag2"]'
          value={tags}
          onChange={(event) => setTags(event.currentTarget.value)}
        />
      </Box>
      <Box mb="xs">
        <TextInput
          label="Compensation (as JSON array, e.g. [100, 200])"
          placeholder="Add compensation as JSON array, e.g. [100, 200]"
          value={compensation}
          onChange={(event) => setCompensation(event.currentTarget.value)}
        />
      </Box>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <Box mb="sm">
        <Button fullWidth onClick={handleSubmit}>
          Save Changes
        </Button>
      </Box>
      <Box mb="sm">
        <Button fullWidth color="red" onClick={handleDelete}>
          Delete Listing
        </Button>
      </Box>
    </>
  );
};

export default EditListingModal;
