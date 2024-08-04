import React from "react";
import { Button, Menu } from "@mantine/core";
import {
  IconLoader,
  IconTie,
  IconExclamationCircle,
  IconSquareArrowUp,
  IconRestore,
  IconAlertTriangleFilled,
  IconEdit,
  IconCopy,
  IconEyeOff,
} from "@tabler/icons-react";
import { applyOrUpdateApplication } from "../api";
import { disableListing } from "../api/admin";
import { notifications } from "@mantine/notifications";
import { useAuth } from "../context/AuthContext";
import { modals } from "@mantine/modals";

const ListingActionMenu = ({
  listingId,
  row,
  setListings,
  openEditModal,
  openReportListingModal,
  shareListing,
  setConfettiVisible,
  setLoadingListingId,
  loadingListingId,
}) => {
  const { token, appliedJobs, setAppliedJobs, setLoading, user } = useAuth();

  const handleChangeStatus = async (listingId, status) => {
    try {
      setLoading(true);
      setLoadingListingId(listingId);
      await applyOrUpdateApplication({ listingId, status }, token);
      setLoading(false);
      notifications.show({
        title: "Application status updated",
        message: `Your application status has been updated to ${status}.`,
        color: "green",
      });
      setLoadingListingId(null);
      const updatedAppliedJobs = {
        ...appliedJobs,
        [listingId]: { ...appliedJobs[listingId], status },
      };
      setAppliedJobs(updatedAppliedJobs);
      setListings((prevListings) =>
        prevListings.map((listing) =>
          listing.id === listingId ? { ...listing, applied: true } : listing
        )
      );
    } catch (error) {
      console.error("Error updating application status:", error);
      setLoadingListingId(null); // Ensure to reset loadingListingId in case of error
    }
  };

  const handleRemoveStatus = async (listingId) => {
    try {
      setLoading(true);
      setLoadingListingId(listingId);
      await applyOrUpdateApplication({ listingId, status: "reset" }, token);
      setLoading(false);
      setLoadingListingId(null);
      const { [listingId]: _, ...rest } = appliedJobs;
      setAppliedJobs(rest);
      setListings((prevListings) =>
        prevListings.map((listing) =>
          listing.id === listingId ? { ...listing, applied: false } : listing
        )
      );
    } catch (error) {
      console.error("Error removing application status:", error);
      setLoadingListingId(null); // Ensure to reset loadingListingId in case of error
    }
  };

  const handleDisableListing = async (listingId) => {
    try {
      setLoading(true);
      await disableListing(listingId, token);
      setListings((prevListings) =>
        prevListings.map((listing) =>
          listing.id === listingId ? { ...listing, disabled: true } : listing
        )
      );
      notifications.show({
        title: "Listing Disabled",
        message: "The listing has been successfully disabled.",
        color: "green",
      });
    } catch (error) {
      console.error("Error disabling listing:", error);
      notifications.show({
        title: "Error",
        message: "There was an error disabling the listing.",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const openConfirmApplyModal = (listingId, title) => {
    modals.openContextModal({
      modal: "confirmApply",
      title: "Confirm Application",
      innerProps: {
        currentListingId: listingId,
        setLoadingListingId: setLoadingListingId,
        setConfettiVisible: setConfettiVisible,
        jobTitle: title,
      },
    });
  };

  const handleApplyClick = async (listingId, title) => {
    if (!appliedJobs[listingId]) {
      openConfirmApplyModal(listingId, title);
      const listing = row.original;
      window.open(listing.link, "_blank");
    }
  };

  const jobStatus = appliedJobs[listingId]?.status;
  const buttonColor =
    jobStatus === "pending"
      ? "yellow"
      : jobStatus === "denied"
      ? "red"
      : jobStatus === "interview"
      ? "green"
      : "blue";

  if (appliedJobs[listingId]) {
    return (
      <Menu
        position="right"
        withArrow
        trigger="click-hover"
        openDelay={25}
        closeDelay={100}
      >
        <Menu.Target>
          <Button
            color={buttonColor}
            size="xs"
            fullWidth
            loading={loadingListingId === listingId}
          >
            {jobStatus.charAt(0).toUpperCase() + jobStatus.slice(1)}
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Update Status</Menu.Label>
          <Menu.Item
            leftSection={<IconLoader size={18} />}
            onClick={() => handleChangeStatus(listingId, "pending")}
          >
            Pending
          </Menu.Item>
          <Menu.Item
            leftSection={<IconTie size={18} />}
            onClick={() => handleChangeStatus(listingId, "interview")}
          >
            Interview
          </Menu.Item>
          <Menu.Item
            leftSection={<IconExclamationCircle size={18} />}
            onClick={() => handleChangeStatus(listingId, "denied")}
          >
            Denied
          </Menu.Item>
          <Menu.Item
            leftSection={<IconRestore size={18} />}
            color="red"
            onClick={() => handleRemoveStatus(listingId)}
          >
            Reset Status
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item
            leftSection={<IconSquareArrowUp size={18} />}
            onClick={() => window.open(row.original.link, "_blank")}
          >
            View Application
          </Menu.Item>
          <Menu.Item
            leftSection={<IconCopy size={18} />}
            onClick={() => shareListing(row.original.link)}
          >
            Copy Link
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item
            leftSection={<IconAlertTriangleFilled size={18} />}
            onClick={() =>
              openReportListingModal(listingId, row.original.title)
            }
          >
            Report Listing
          </Menu.Item>
          {user?.isAdmin && (
            <>
              <Menu.Item
                leftSection={<IconEdit size={18} />}
                onClick={() => openEditModal(listingId)}
              >
                Edit Listing
              </Menu.Item>
              <Menu.Item
                leftSection={<IconEyeOff size={18} />}
                onClick={() => handleDisableListing(listingId)}
              >
                Disable Listing
              </Menu.Item>
            </>
          )}
        </Menu.Dropdown>
      </Menu>
    );
  } else {
    return (
      <Menu
        position="right"
        withArrow
        trigger="hover"
        openDelay={25}
        closeDelay={100}
      >
        <Menu.Target>
          <Button
            color={buttonColor}
            size="xs"
            fullWidth
            loading={loadingListingId === listingId}
            onClick={() => handleApplyClick(listingId, row.original.title)}
          >
            Apply
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Other Actions</Menu.Label>
          <Menu.Item
            leftSection={<IconSquareArrowUp size={18} />}
            onClick={() => window.open(row.original.link, "_blank")}
          >
            View Application
          </Menu.Item>
          <Menu.Item
            leftSection={<IconAlertTriangleFilled size={18} />}
            onClick={() =>
              openReportListingModal(listingId, row.original.title)
            }
          >
            Report Listing
          </Menu.Item>
          {user?.isAdmin && (
            <>
              <Menu.Divider />
              <Menu.Label>Admin</Menu.Label>
              <Menu.Item
                leftSection={<IconEdit size={18} />}
                onClick={() => openEditModal(listingId)}
              >
                Edit Listing
              </Menu.Item>
              <Menu.Item
                leftSection={<IconEyeOff size={18} />}
                onClick={() => handleDisableListing(listingId)}
              >
                Disable Listing
              </Menu.Item>
            </>
          )}
        </Menu.Dropdown>
      </Menu>
    );
  }
};

export default ListingActionMenu;
