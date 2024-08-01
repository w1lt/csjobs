import React from "react";
import { Modal, Button, TextInput, Box } from "@mantine/core";
import { useAuth } from "../context/AuthContext";

const AccountModal = ({ opened, onClose }) => {
  const { user } = useAuth();

  const handleSave = () => {
    onClose();
  };

  return (
    <Modal opened={opened} onClose={onClose} title="My Account" size="sm">
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
    </Modal>
  );
};

export default AccountModal;
