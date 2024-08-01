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
import ReportListingModal from "../components/ReportListingModal";
import {
  IconLoader,
  IconTie,
  IconExclamationCircle,
  IconSquareArrowUp,
  IconRestore,
  IconUpload,
  IconZoomExclamation,
} from "@tabler/icons-react";
import { useMediaQuery, useDisclosure } from "@mantine/hooks";
import Confetti from "react-confetti";
import convertToDate from "../utils/convertToDate";
import formatDate from "../utils/formatDate"; // Import the new formatDate function
import AuthModal from "../components/AuthModal";
import AccountModal from "../components/AccountModal";
import ConfirmApplyModal from "../components/ConfirmApplyModal";
import { useAuth } from "../context/AuthContext";
import { notifications } from "@mantine/notifications";
import Header from "../components/Header"; // Import Header component
import { nprogress } from "@mantine/nprogress";

const Homepage = () => {
  const [accountOpened, { open: openAccount, close: closeAccount }] =
    useDisclosure(false);
  const [
    confirmApplyOpened,
    { open: openConfirmApply, close: closeConfirmApply },
  ] = useDisclosure(false);
  const [reportOpened, { open: openReport, close: closeReport }] =
    useDisclosure(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [currentListingId, setCurrentListingId] = useState(null);
  const [currentJobTitle, setCurrentJobTitle] = useState("");
  const [confettiVisible, setConfettiVisible] = useState(false);
  const { width, height } = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  const [selectedFilter] = useState("");
  const [authOpened, { open: openAuth, close: closeAuth }] =
    useDisclosure(false);
  const [loadingListingId, setLoadingListingId] = useState(null);

  const {
    token,
    appliedJobs,
    setAppliedJobs,
    login,
    setLoading,
    loading,
    logout,
  } = useAuth();
  const [listings, setListings] = useState([]);

  useEffect(() => {
    if (loading) {
      nprogress.start();
    } else {
      nprogress.complete();
    }
  }, [loading]);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await getApplications(token);
        console.log(data);
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
        setLoading(false);
      }
    };

    const fetchListings = async () => {
      setLoading(true);
      const data = await getListings();
      const sortedListings = [...data].sort(
        (a, b) => convertToDate(b.date) - convertToDate(a.date)
      );
      setListings(sortedListings);
      if (token) {
        fetchApplications(sortedListings);
      } else {
        setLoading(false);
      }
    };

    fetchListings();
  }, [setLoading, token, setAppliedJobs]);

  const handleApplyClick = async (listingId, title) => {
    if (!appliedJobs[listingId]) {
      setCurrentListingId(listingId);
      setCurrentJobTitle(title);
      openConfirmApply();
      const listing = listings.find((listing) => listing.id === listingId);
      window.open(listing.link, "_blank");
    }
  };

  const handleConfirmApply = async () => {
    try {
      if (token) {
        closeConfirmApply();
        const applicationData = {
          listingId: currentListingId,
          status: "pending",
        };
        console.log("Sending application data:", applicationData);
        setLoading(true);
        setLoadingListingId(currentListingId);
        await applyOrUpdateApplication(applicationData, token);

        const updatedAppliedJobs = {
          ...appliedJobs,
          [currentListingId]: { status: "pending", title: currentJobTitle },
        };
        setAppliedJobs(updatedAppliedJobs);

        setLoading(false);
        setLoadingListingId(null);
        setConfettiVisible(true);
        setTimeout(() => {
          setConfettiVisible(false);
        }, 10000);
      } else {
        closeConfirmApply();
        notifications.show({
          title: "Please log in",
          message: "You must be logged in to save jobs.",
          color: "red",
        });
        openAuth();
      }
    } catch (error) {
      console.error("Error confirming application:", error);
    }
  };

  const shareListing = (link) => {
    navigator.clipboard.writeText(link);
    notifications.show({
      title: "Link copied",
      message: `The link has been copied to your clipboard!`,
    });
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

  const handleReportListing = (listingId, title) => {
    setCurrentListingId(listingId);
    setCurrentJobTitle(title);
    openReport();
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
            <Menu.Item
              leftSection={<IconUpload size={18} />}
              onClick={() => shareListing(row.original.link)}
            >
              Share Listing
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
              leftSection={<IconZoomExclamation size={18} />}
              onClick={() => handleReportListing(listingId, row.original.title)}
            >
              Report Listing
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      );
    } else {
      return (
        <Button
          color={buttonColor}
          size="xs"
          onClick={() => handleApplyClick(listingId, row.original.title)}
          fullWidth
          loading={loadingListingId === listingId}
        >
          Apply
        </Button>
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
    <Container size="md" mt={16}>
      <Header openAccount={openAccount} openAuth={openAuth} logout={logout} />
      <Space h="xs" />
      <Text align="center" size="lg" mb="sm" c="dimmed">
        Browse, apply, and secure your dream internship. New listings added
        daily.
      </Text>
      <Text c="dimmed" align="center" size="sm" mb={16}>
        Last updated: July 29
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
              More jobs coming soon...
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
      <ConfirmApplyModal
        opened={confirmApplyOpened}
        onClose={closeConfirmApply}
        onConfirm={handleConfirmApply}
        jobTitle={currentJobTitle}
        loading={loading}
      />
      <ReportListingModal
        opened={reportOpened}
        onClose={closeReport}
        listingId={currentListingId}
        listingTitle={currentJobTitle}
      />
    </Container>
  );
};

export default Homepage;
