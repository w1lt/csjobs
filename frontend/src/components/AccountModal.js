import React from "react";
import { Button, TextInput, Box } from "@mantine/core";
import { useAuth } from "../context/AuthContext";

const AccountModal = ({ opened, onClose }) => {
  const { user } = useAuth();

  const handleSave = () => {};

  return (
    <>
      <Box mb="xs">
        <TextInput
          label="Username"
          placeholder="Your username"
          value={user?.username}
          required
        />
      </Box>
      <Box mt="md">
        <Button fullWidth onClick={handleSave}>
          Save
        </Button>
      </Box>
    </>
  );
};

export default AccountModal;
