import React, { useState, useEffect } from "react";
import {
  Container,
  Space,
  Paper,
  Button,
  Text,
  Flex,
  Menu,
} from "@mantine/core";
import { getListings, applyOrUpdateApplication, getApplications } from "../api";
import CustomTable from "../components/CustomTable";
import {
  IconLoader,
  IconTie,
  IconExclamationCircle,
  IconSquareArrowUp,
  IconRestore,
  IconAlertTriangleFilled,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";
import Confetti from "react-confetti";
import convertToDate from "../utils/convertToDate";
import formatDate from "../utils/formatDate"; // Import the new formatDate function
import { useAuth } from "../context/AuthContext";
import { notifications } from "@mantine/notifications";
import Header from "../components/Header"; // Import Header component
import { modals } from "@mantine/modals";
import { deleteListing } from "../api/admin";

const Homepage = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [confettiVisible, setConfettiVisible] = useState(false);
  const { width, height } = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  const [selectedFilter] = useState("");
  const [loadingListingId, setLoadingListingId] = useState(null);

  const { token, appliedJobs, setAppliedJobs, setLoading, user } = useAuth();
  const [listings, setListings] = useState([]);

  const openEditModal = (listingId) => {
    modals.openContextModal({
      title: "Edit Listing",
      modal: "editListing",
      innerProps: { listingId },
    });
  };

  const handleDelete = async (listingId) => {
    try {
      setLoading(true);
      const id = notifications.show({
        title: "Deleting listing...",
        message: "Please wait...",
        loading: true,
        autoClose: false,
        withCloseButton: false,
      });
      await deleteListing(listingId, token);
      notifications.update(id, {
        title: "Listing deleted",
        message: "The listing has been successfully deleted.",
        color: "blue",
      });
      setLoading(false);
    } catch (err) {
      console.error("Error deleting listing:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await getApplications(token);
        const applied = {};
        data.forEach((app) => {
          applied[app.ListingId] = {
            status: app.status,
            title: app.Listing.title,
          };
        });
        setAppliedJobs(applied);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchListings = async () => {
      setLoading(true);
      const data = await getListings();
      console.log("Fetched listings:", data); // Debug statement
      const sortedListings = [...data].sort(
        (a, b) => convertToDate(b.date) - convertToDate(a.date)
      );
      setListings(sortedListings);
      if (token) {
        fetchApplications();
      } else {
        setLoading(false);
      }
    };

    fetchListings();
  }, [token, setAppliedJobs, setLoading]);

  const openReportListingModal = (listingId, listingTitle) => {
    modals.openContextModal({
      modal: "reportListing",
      title: "Report Listing",
      innerProps: {
        listingId: listingId,
        listingTitle: listingTitle,
      },
    });
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
      const listing = listings.find((listing) => listing.id === listingId);
      window.open(listing.link, "_blank");
    }
  };

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
    } catch (error) {
      console.error("Error updating application status:", error);
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
    } catch (error) {
      console.error("Error removing application status:", error);
    }
  };

  const filteredListings = listings.filter((listing) => {
    if (selectedFilter === "applied") {
      return appliedJobs[listing.id];
    }
    if (selectedFilter === "not_applied") {
      return !appliedJobs[listing.id];
    }
    return true;
  });

  const renderActionButton = (listingId, row) => {
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
                  leftSection={<IconTrash size={18} />}
                  onClick={() => handleDelete(listingId)}
                  c={"red"}
                >
                  Delete Listing
                </Menu.Item>
              </>
            )}
          </Menu.Dropdown>
        </Menu>
      );
    }
  };

  const columns = [
    { Header: "Title", accessor: "title" },
    { Header: "Company", accessor: "company" },
    { Header: "Location", accessor: "location" },
    { Header: "Compensation", accessor: "compensation" },
    {
      Header: "Date Posted",
      accessor: "date",
      Cell: ({ value }) => formatDate(value),
    },
    {
      Header: "Status",
      accessor: "action",
      Cell: ({ row }) => renderActionButton(row.original.id, row),
    },
  ];

  const mobileColumns = columns.filter(
    (column) => column.accessor !== "compensation" && column.accessor !== "date"
  );

  return (
    <Container size="md">
      <Header />
      <Space h="xs" />
      <Text align="center" size="lg" mb="sm" c="dimmed">
        Browse, apply, and secure your dream internship. New listings added
        daily.
      </Text>
      <Paper shadow="md" py="sm" withBorder>
        <Container>
          <CustomTable
            columns={isMobile ? mobileColumns : columns}
            data={filteredListings}
            appliedJobs={appliedJobs}
            handleApplyClick={handleApplyClick}
            handleChangeStatus={handleChangeStatus}
            handleRemoveStatus={handleRemoveStatus}
          />
          <Flex justify="center" align="center" direction="row" mt="lg">
            <Text align="center" c="dimmed">
              + More jobs coming soon...
            </Text>
          </Flex>
        </Container>
      </Paper>
      {confettiVisible && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={50}
        />
      )}
    </Container>
  );
};

export default Homepage;
