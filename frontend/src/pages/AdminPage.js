import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Button,
  TextInput,
  Checkbox,
  Title,
  Group,
  Space,
  Table,
  Loader,
} from "@mantine/core";
import {
  createListing,
  updateListing,
  updateUserRole,
  fetchReports,
} from "../api/admin";
import { useAuth } from "../context/AuthContext";
import { notifications } from "@mantine/notifications";

const AdminPage = () => {
  const { token } = useAuth();
  const [listingData, setListingData] = useState({
    title: "",
    company: "",
    compensation: "",
    location: "",
    date: "",
    link: "",
    tags: "",
  });
  const [userId, setUserId] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);

  useEffect(() => {
    const loadReports = async () => {
      try {
        if (token) {
          console.log(token);
          const data = await fetchReports(token);
          setReports(data);
        }
      } catch (error) {
        notifications.show({
          title: "Error",
          message: "Failed to fetch reports",
          color: "red",
        });
      } finally {
        setLoadingReports(false);
      }
    };

    loadReports();
  }, [token]);

  const handleListingChange = (e) => {
    const { name, value } = e.target;
    setListingData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUserRoleChange = async () => {
    try {
      await updateUserRole(userId, isAdmin, token);
      notifications.show({
        title: "Success",
        message: "User role updated successfully",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to update user role",
        color: "red",
      });
    }
  };

  const handleCreateListing = async () => {
    try {
      await createListing(listingData, token);
      notifications.show({
        title: "Success",
        message: "Listing created successfully",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to create listing",
        color: "red",
      });
    }
  };

  const handleUpdateListing = async () => {
    try {
      await updateListing(listingData.id, listingData, token);
      notifications.show({
        title: "Success",
        message: "Listing updated successfully",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to update listing",
        color: "red",
      });
    }
  };

  return (
    <Container size="md" mt={16}>
      <Title align="center" mb="lg">
        Admin Page
      </Title>

      <Paper shadow="md" p="lg" withBorder>
        <Title order={3}>Create or Update Listing</Title>
        <Space h="md" />
        <TextInput
          label="Title"
          name="title"
          value={listingData.title}
          onChange={handleListingChange}
          placeholder="Title"
          mb="sm"
        />
        <TextInput
          label="Company"
          name="company"
          value={listingData.company}
          onChange={handleListingChange}
          placeholder="Company"
          mb="sm"
        />
        <TextInput
          label="Compensation"
          name="compensation"
          value={listingData.compensation}
          onChange={handleListingChange}
          placeholder="Compensation"
          mb="sm"
        />
        <TextInput
          label="Location"
          name="location"
          value={listingData.location}
          onChange={handleListingChange}
          placeholder="Location"
          mb="sm"
        />
        <TextInput
          label="Date"
          name="date"
          value={listingData.date}
          onChange={handleListingChange}
          placeholder="Date"
          mb="sm"
        />
        <TextInput
          label="Link"
          name="link"
          value={listingData.link}
          onChange={handleListingChange}
          placeholder="Link"
          mb="sm"
        />
        <TextInput
          label="Tags"
          name="tags"
          value={listingData.tags}
          onChange={handleListingChange}
          placeholder="Tags"
          mb="sm"
        />
        <Group position="apart" mt="md">
          <Button onClick={handleCreateListing}>Create Listing</Button>
          <Button onClick={handleUpdateListing}>Update Listing</Button>
        </Group>
      </Paper>

      <Space h="xl" />

      <Paper shadow="md" p="lg" withBorder>
        <Title order={3}>Update User Role</Title>
        <Space h="md" />
        <TextInput
          label="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="User ID"
          mb="sm"
        />
        <Checkbox
          label="Admin"
          checked={isAdmin}
          onChange={(e) => setIsAdmin(e.currentTarget.checked)}
          mb="sm"
        />
        <Button onClick={handleUserRoleChange}>Update User Role</Button>
      </Paper>

      <Space h="xl" />

      <Paper shadow="md" p="lg" withBorder>
        <Title order={3}>Reports</Title>
        <Space h="md" />
        {loadingReports ? (
          <Loader />
        ) : (
          <Table>
            <thead>
              <tr>
                <th>Listing ID</th>
                <th>Reason</th>
                <th>Message</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id}>
                  <td>{report.listingId}</td>
                  <td>{report.reason}</td>
                  <td>{report.message}</td>
                  <td>{report.status}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Paper>
    </Container>
  );
};

export default AdminPage;
