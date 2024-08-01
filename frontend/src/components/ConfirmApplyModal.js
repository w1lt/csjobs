import React from "react";
import { Modal, Button, Text, Box, Flex } from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons-react";

const ConfirmApplyModal = ({ opened, onClose, onConfirm, jobTitle }) => {
  return (
    <Modal
      title="Confirm Application"
      opened={opened}
      onClose={onClose}
      size="sm"
    >
      <Box mt="md" mb="lg" style={{ textAlign: "center" }}>
        <Text>Did you apply to the job:</Text>
        <Text weight={700}>{jobTitle}?</Text>
      </Box>
      <Flex justify="center" gap="md" mt="md">
        <Button color="green" onClick={onConfirm}>
          Yeah!
        </Button>
        <Button color="red" onClick={onClose}>
          Nope
        </Button>
        <Button
          rightSection={<IconAlertTriangle size={18} />}
          color="yellow"
          onClick={onClose}
        >
          Report
        </Button>
      </Flex>
    </Modal>
  );
};

export default ConfirmApplyModal;
