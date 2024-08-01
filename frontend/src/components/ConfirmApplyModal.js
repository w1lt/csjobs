import React from "react";
import { Button, Text, Box, Flex } from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons-react";
import { useAuth } from "../context/AuthContext";
import { applyOrUpdateApplication } from "../api/index";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";

const ConfirmApplyModal = ({ context, id, innerProps }) => {
  const { token, appliedJobs, setAppliedJobs, setLoading } = useAuth();

  const openAuthModal = () => {
    modals.openContextModal({
      size: "sm",
      modal: "auth",
      title: "Authentication",
    });
  };

  const handleConfirmApply = async () => {
    try {
      if (token) {
        const applicationData = {
          listingId: innerProps.currentListingId,
          status: "pending",
        };
        console.log("Sending application data:", applicationData);
        setLoading(true);
        innerProps.setLoadingListingId(innerProps.currentListingId);
        context.closeModal(id);
        await applyOrUpdateApplication(applicationData, token);

        const updatedAppliedJobs = {
          ...appliedJobs,
          [innerProps.currentListingId]: {
            status: "pending",
            title: innerProps.currentJobTitle,
          },
        };
        setAppliedJobs(updatedAppliedJobs);

        setLoading(false);
        innerProps.setLoadingListingId(null);
        innerProps.setConfettiVisible(true);
        notifications.show({
          title: "Nice Work!",
          message: "You have successfully applied to the job.",
        });
        setTimeout(() => {
          innerProps.setConfettiVisible(false);
        }, 10000);
      } else {
        openAuthModal();
        notifications.show({
          title: "Please log in",
          message: "You must be logged in to save jobs.",
          color: "red",
        });
      }
    } catch (error) {
      console.error("Error confirming application:", error);
    }
  };

  const openReportListingModal = () => {
    context.closeModal(id);
    modals.openContextModal({
      modal: "reportListing",
      title: "Report Listing",
      innerProps: {
        listingId: innerProps.currentListingId,
        listingTitle: innerProps.jobTitle,
      },
    });
  };

  return (
    <>
      <Box mt="md" mb="lg" style={{ textAlign: "center" }}>
        <Text>Did you apply to the job:</Text>
        <Text weight={700}>{innerProps.jobTitle}?</Text>
      </Box>
      <Flex justify="center" gap="md" mt="md">
        <Button color="green" onClick={handleConfirmApply}>
          Yeah!
        </Button>
        <Button color="red" onClick={() => context.closeModal(id)}>
          Nope
        </Button>
        <Button
          rightSection={<IconAlertTriangle size={18} />}
          color="yellow"
          onClick={openReportListingModal}
        >
          Report
        </Button>
      </Flex>
    </>
  );
};

export default ConfirmApplyModal;
