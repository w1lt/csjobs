import React from "react";
import { TextInput, Box, Text, Group, Divider } from "@mantine/core";
import { useAuth } from "../context/AuthContext";

const AccountModal = () => {
  const { user, appliedJobs } = useAuth(); // Retrieve user and appliedJobs from AuthContext

  const totalApplications = Object.keys(appliedJobs).length;
  const pendingApplications = Object.values(appliedJobs).filter(
    (job) => job.status === "pending"
  ).length;

  return (
    <>
      <Box mx="lg" my="sm">
        {/* User Information */}
        <TextInput
          label="Username"
          placeholder="Your username"
          value={user?.username || "No username available"}
          readOnly
        />

        <Divider my="sm" />

        {/* Application Stats */}
        <Box mb="xs">
          <Text size="md" weight={500} mb="xs">
            Application Stats
          </Text>
          <Group position="apart">
            <Text size="sm">Total Applications: {totalApplications}</Text>
          </Group>

          <Group position="apart" mt="xs">
            <Text size="sm">Pending Applications: {pendingApplications}</Text>
          </Group>
        </Box>
      </Box>
    </>
  );
};

export default AccountModal;
