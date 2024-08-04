import React, { useState } from "react";
import {
  Container,
  Paper,
  Text,
  Flex,
  TextInput,
  Box,
  Group,
  Button,
  Popover,
  Slider,
  InputLabel,
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
import {
  IconSearch,
  IconMapPin,
  IconCurrencyDollar,
  IconBriefcase2,
  IconChevronDown,
  IconChevronUp,
} from "@tabler/icons-react";

const Homepage = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [confettiVisible, setConfettiVisible] = useState(false);
  const { width, height } = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  const [setLoadingListingId] = useState(null);
  const [showApplied] = useState(false);
  const [minPayPopoverOpened, setMinPayPopoverOpened] = useState(false);

  const {
    filteredData,
    filterOptions,
    locationOptions,
    globalFilter,
    setGlobalFilter,
    selectedFilter,
    setSelectedFilter,
    locationFilter,
    setLocationFilter,
    removeSelectedJobType,
    removeSelectedLocation,
    minPay,
    setMinPay,
    clearFilters,
  } = useListingsData(showApplied);

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
          setListings={() => {}}
          setLoadingListingId={setLoadingListingId}
          openEditModal={openEditModal}
          openReportListingModal={openReportListingModal}
          shareListing={shareListing}
          setConfettiVisible={setConfettiVisible}
        />
      ),
    },
  ];

  const mobileColumns = columns.filter(
    (column) => column.accessor !== "compensation" && column.accessor !== "date"
  );

  const jobTypeFilterApplied = selectedFilter.length > 0;
  const locationFilterApplied = locationFilter.length > 0;
  const minPayFilterApplied = minPay > 0;

  const availableJobTypes = filterOptions.filter(
    (option) => !selectedFilter.includes(option)
  );
  const availableLocations = locationOptions.filter(
    (option) => !locationFilter.includes(option)
  );

  return (
    <>
      <Text align="center" size="lg" mb="md" c="dimmed">
        Browse, apply, and secure your dream internship. New listings added
        daily.
      </Text>
      <Group justify="space-between" align="center" spacing="sm" mb="md">
        <Box style={{ flex: 1 }}>
          <TextInput
            value={globalFilter}
            leftSection={<IconSearch size={18} />}
            onChange={(e) => setGlobalFilter(e.target.value || "")}
            placeholder={`Search ${filteredData.length} listings`}
            fullWidth
          />
        </Box>
        <FilterPopover
          label="Job Type"
          placeholder="Select job types"
          data={availableJobTypes}
          value={selectedFilter}
          onChange={setSelectedFilter}
          applied={jobTypeFilterApplied}
          removeSelected={removeSelectedJobType}
          inputType="select"
          inputValue={null}
          onInputChange={null}
          icon={IconBriefcase2}
        />
        <FilterPopover
          label="Location"
          placeholder="Select locations"
          data={availableLocations}
          value={locationFilter}
          onChange={setLocationFilter}
          applied={locationFilterApplied}
          removeSelected={removeSelectedLocation}
          inputType="select"
          inputValue={null}
          onInputChange={null}
          icon={IconMapPin}
        />
        <Popover
          position="bottom-end"
          withArrow
          width={"300"}
          opened={minPayPopoverOpened}
          onClose={() => setMinPayPopoverOpened(false)}
          onOpen={() => setMinPayPopoverOpened(true)}
        >
          <Popover.Target>
            <Button
              variant={minPayFilterApplied ? "filled" : "light"}
              leftSection={<IconCurrencyDollar size={18} />}
              rightSection={
                minPayPopoverOpened ? (
                  <IconChevronUp size={18} />
                ) : (
                  <IconChevronDown size={18} />
                )
              }
              onClick={() => setMinPayPopoverOpened((o) => !o)}
            >
              Min. Pay
            </Button>
          </Popover.Target>
          <Popover.Dropdown>
            <Box pb={15}>
              <InputLabel>Minimum Pay</InputLabel>
              <Slider
                label={(value) => `$${value} `}
                value={minPay}
                onChange={setMinPay}
                min={0}
                max={100}
                step={1}
                marks={[
                  { value: 0, label: "$0" },
                  { value: 20, label: "$20" },
                  { value: 40, label: "$40" },
                  { value: 60, label: "$60" },
                  { value: 80, label: "$80" },
                  { value: 100, label: "$100" },
                ]}
              />
            </Box>
          </Popover.Dropdown>
        </Popover>
        <Text
          align="center"
          size="sm"
          opacity={
            jobTypeFilterApplied || locationFilterApplied || minPayFilterApplied
              ? 1
              : 0
          }
          style={{ cursor: "pointer" }}
          onClick={clearFilters}
        >
          Clear Filters
        </Text>
      </Group>
      <Paper shadow="md" py="sm" withBorder>
        <Container>
          <CustomTable
            columns={isMobile ? mobileColumns : columns}
            data={filteredData}
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
    </>
  );
};

export default Homepage;
