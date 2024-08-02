import React, { useState } from "react";
import { Textarea, Button, Text, Select } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { reportListing } from "../api";
import { useAuth } from "../context/AuthContext";
import { IconCheck } from "@tabler/icons-react";

const ReportListingModal = ({ innerProps }) => {
  const { token } = useAuth();
  const [reason, setReason] = useState("link_broken");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReport = async () => {
    setLoading(true);
    try {
      if (token) {
        console.log("Submitting report with token:", token);
        const id = notifications.show({
          loading: true,
          title: "Submitting report...",
          message: "Please wait...",
        });
        await reportListing(
          { listingId: innerProps.listingId, reason, message },
          token
        );
        notifications.update(id, {
          title: "Report submitted",
          message: "Thank you for reporting this listing.",
          color: "blue",
          icon: <IconCheck width={18} />,
        });
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
    <>
      <Text size="sm" mb="sm">
        {innerProps.listingTitle}
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

      <Textarea
        label="Message"
        placeholder="Provide more details... (optional)"
        value={message}
        onChange={(event) => setMessage(event.currentTarget.value)}
        mb="sm"
      />
      <Button fullWidth onClick={handleReport} loading={loading}>
        Submit Report
      </Button>
    </>
  );
};

export default ReportListingModal;
