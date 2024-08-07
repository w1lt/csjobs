import React from "react";
import { TextInput, Box } from "@mantine/core";
import { useAuth } from "../context/AuthContext";

const AccountModal = () => {
  const { user } = useAuth(); // Retrieve user and appliedJobs from AuthContext

  return (
    <>
      <Box mx="lg">
        <TextInput
          label="Username"
          placeholder="Your username"
          value={user?.username || "No username available"}
          readOnly
        />
      </Box>
    </>
  );
};

export default AccountModal;
