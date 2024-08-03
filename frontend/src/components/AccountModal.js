import React from "react";
import { TextInput, Box, Text } from "@mantine/core";
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

        <Box mb="xs">
          <Text size="md" weight={500} mb="xs">
            Application Stats
          </Text>
          <Box display="flex" alignItems="center">
            <Text size="sm">Total Applications:</Text>
            <Text size="sm" ml="xs" weight={600}>
              {totalApplications}
            </Text>
          </Box>

          <Box display="flex" alignItems="center" mt="xs">
            <Text size="sm">Pending Applications:</Text>
            <Text size="sm" ml="xs" weight={600}>
              {pendingApplications}
            </Text>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default AccountModal;
