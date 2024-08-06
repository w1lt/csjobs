import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Paper,
  Text,
  TextInput,
  Box,
  Group,
  ActionIcon,
} from "@mantine/core";
import CustomTable from "../components/CustomTable";
import { useMediaQuery } from "@mantine/hooks";
import Confetti from "react-confetti";
import { modals } from "@mantine/modals";
import useListingsData from "../hooks/useListingsData";
import formatDate from "../utils/formatDate";
import ListingActionMenu from "../components/ListingActionMenu";
import { notifications } from "@mantine/notifications";
import FilterPopover from "../components/FilterPopover";
import { IconSearch, IconBriefcase2, IconX } from "@tabler/icons-react";
import { useAuth } from "../context/AuthContext";
import { BarChart } from "@mantine/charts";

const ApplicationsPage = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [confettiVisible, setConfettiVisible] = useState(false);
  const { width, height } = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  const [loadingListingId, setLoadingListingId] = useState(null);
  const notificationShownRef = useRef(false); // Ref to track notification

  const {
    filteredData,
    globalFilter,
    setGlobalFilter,
    statusFilter,
    setStatusFilter,
    removeSelectedStatus,
    setListings,
  } = useListingsData(true);

  const { token, appliedJobs, loading } = useAuth();

  const pendingApplications = Object.values(appliedJobs).filter(
    (job) => job.status === "pending"
  ).length;
  const interviewApplications = Object.values(appliedJobs).filter(
    (job) => job.status === "interview"
  ).length;
  const deniedApplications = Object.values(appliedJobs).filter(
    (job) => job.status === "denied"
  ).length;

  const data = [
    { status: "Pending", count: pendingApplications, color: "yellow" },
    { status: "Interview", count: interviewApplications, color: "green" },
    { status: "Denied", count: deniedApplications, color: "red" },
  ];

  const openAuthModal = () => {
    modals.openContextModal({
      size: "sm",
      modal: "auth",
      title: "Authentication",
    });
  };

  useEffect(() => {
    if (token) {
      return;
    } else {
      if (!notificationShownRef.current) {
        notifications.show({
          title: "Please log in",
          message: "You must be logged in to view your applications.",
          color: "red",
        });
        openAuthModal();
        notificationShownRef.current = true;
      }
    }
  }, [token]);

  const openEditModal = (listingId) => {
    modals.openContextModal({
      title: "Edit Listing",
      modal: "editListing",
      innerProps: { listingId },
    });
  };

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

  const shareListing = (link) => {
    navigator.clipboard.writeText(link);
    notifications.show({
      title: "Link copied",
      message: `The link has been copied to your clipboard!`,
    });
  };

  const columns = [
    { Header: "Title", accessor: "title" },
    { Header: "Company", accessor: "company" },
    { Header: "Location", accessor: "location" },
    { Header: "Compensation", accessor: "compensation" },
    {
      Header: "Posted On",
      accessor: "date",
      Cell: ({ value }) => formatDate(value),
    },
    {
      Header: "Status",
      accessor: "action",
      Cell: ({ row }) => (
        <ListingActionMenu
          listingId={row.original.id}
          row={row}
          setListings={setListings}
          setLoadingListingId={setLoadingListingId}
          openEditModal={openEditModal}
          openReportListingModal={openReportListingModal}
          shareListing={shareListing}
          setConfettiVisible={setConfettiVisible}
          loadingListingId={loadingListingId} // Pass the loadingListingId state
        />
      ),
    },
  ];

  const mobileColumns = columns.filter(
    (column) => column.accessor !== "compensation" && column.accessor !== "date"
  );
  const statusFilterApplied = statusFilter.length > 0;

  if (!token) {
    return (
      <Container size="md">
        <Text align="center" size="xl" weight={700} mt="lg" mb="sm">
          Applications
        </Text>
        <Text align="center" size="lg" mb="sm" c="dimmed">
          Please log in to view your applications.
        </Text>
      </Container>
    );
  }

  return (
    <Container size="md">
      <Text align="center" size="xl" weight={700} mt="lg" mb="sm">
        Applied Listings
      </Text>
      <Text align="center" size="lg" mb="sm" c="dimmed">
        Here are all the listings you have applied to.
      </Text>
      <Group justify="space-between" align="center" spacing="sm" mb="md">
        <Box style={{ flex: 1 }}>
          <TextInput
            value={globalFilter}
            leftSection={<IconSearch size={18} />}
            onChange={(e) => setGlobalFilter(e.target.value || "")}
            placeholder={`Search ${filteredData.length} listings`}
            fullWidth
            rightSection={
              globalFilter && (
                <ActionIcon
                  onClick={() => setGlobalFilter("")}
                  variant="transparent"
                >
                  <IconX size={16} />
                </ActionIcon>
              )
            }
          />
        </Box>
        <FilterPopover
          label="Application Status"
          placeholder="Select status"
          data={["pending", "interview", "denied"]}
          value={statusFilter}
          onChange={setStatusFilter}
          applied={statusFilterApplied}
          removeSelected={removeSelectedStatus}
          inputType="select"
          inputValue={null}
          onInputChange={null}
          icon={IconBriefcase2}
        />
      </Group>
      <Paper shadow="md" py="sm" withBorder>
        <Container>
          <CustomTable
            columns={isMobile ? mobileColumns : columns}
            data={filteredData}
          />
        </Container>
      </Paper>
      <Box mt="lg">
        <Text align="center" size="lg" mb="sm" weight={700}>
          Application Stats
        </Text>
        {appliedJobs && (
          <BarChart
            h={300}
            data={loading ? [] : data.filter((item) => item.count > 0)}
            dataKey="status"
            withLegend={false}
            withTooltip={false}
            series={[{ name: "count", color: "yellow" }]}
            mr={30}
          />
        )}
      </Box>
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

export default ApplicationsPage;
