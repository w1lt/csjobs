import React, { useState } from "react";
import { Modal, Textarea, Button, Text, Select } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { reportListing } from "../api";
import { useAuth } from "../context/AuthContext";

const ReportListingModal = ({ opened, onClose, listingId, listingTitle }) => {
  const { token } = useAuth();
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReport = async () => {
    setLoading(true);
    try {
      if (token) {
        console.log("Submitting report with token:", token);
        await reportListing({ listingId, reason, message }, token);
        notifications.show({
          title: "Report submitted",
          message: "Your report has been submitted successfully.",
          color: "green",
        });
        onClose();
      } else {
        notifications.show({
          title: "Please log in",
          message: "You must be logged in to submit a report.",
          color: "red",
        });
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to submit your report. Please try again later.",
        color: "red",
      });
      console.error("Error reporting listing:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Report Listing">
      <Text size="sm" mb="sm">
        Reporting: {listingTitle}
      </Text>
      <Select
        label="Reason"
        data={[
          { value: "incorrect_info", label: "Incorrect Information" },
          { value: "link_broken", label: "Link Broken" },
          { value: "duplicate_listing", label: "Duplicate Listing" },
          { value: "expired_listing", label: "Expired Listing" },
          { value: "other", label: "Other" },
        ]}
        placeholder="Select a reason"
        mb="sm"
        value={reason}
        onChange={(value) => setReason(value)}
      />
      {reason === "other" && (
        <Textarea
          label="Message"
          placeholder="Please provide more details"
          value={message}
          onChange={(event) => setMessage(event.currentTarget.value)}
          mb="sm"
        />
      )}
      <Button fullWidth onClick={handleReport} loading={loading}>
        Submit Report
      </Button>
    </Modal>
  );
};

export default ReportListingModal;
