import React, { useState, useEffect } from "react";
import {
  Container,
  Space,
  Paper,
  Button,
  Text,
  ActionIcon,
  Flex,
  Modal,
  Menu,
  Box,
} from "@mantine/core";
import {
  getListings,
  applyToListing,
  getApplications,
  updateApplicationStatus,
  deleteApplication,
} from "../api";
import CustomTable from "../components/CustomTable";
import { IconSun, IconMoon } from "@tabler/icons-react";
import { useColorSchemeToggle } from "../utils/useColorSchemeToggle";
import { useMediaQuery, useDisclosure } from "@mantine/hooks";
import Confetti from "react-confetti";
import convertToDate from "../utils/convertToDate";
import AuthModal from "../components/AuthModal";

const Homepage = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const { toggleColorScheme, currentColorScheme } = useColorSchemeToggle();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [currentLink, setCurrentLink] = useState("");
  const [currentJobTitle, setCurrentJobTitle] = useState("");
  const [confettiVisible, setConfettiVisible] = useState(false);
  const { width, height } = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  const [selectedFilter] = useState("");
  const [authOpened, { open: openAuth, close: closeAuth }] =
    useDisclosure(false);
  const [token, setToken] = useState(null);
  const [listings, setListings] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState({});

  useEffect(() => {
    const fetchListings = async () => {
      const data = await getListings();
      const sortedListings = [...data].sort(
        (a, b) => convertToDate(b.date) - convertToDate(a.date)
      );
      setListings(sortedListings);
    };

    const fetchApplications = async () => {
      if (token) {
        const data = await getApplications(token);
        const applied = {};
        data.forEach((app) => {
          applied[app.Listing.url] = {
            status: app.status,
            title: app.Listing.title,
          };
        });
        setAppliedJobs(applied);
      }
    };

    fetchListings();
    fetchApplications();
  }, [token]);

  const handleApplyClick = async (link, title) => {
    if (!appliedJobs[link]) {
      setCurrentLink(link);
      setCurrentJobTitle(title);
      open();
      window.open(link, "_blank");
    }
  };

  const handleConfirmApply = async () => {
    try {
      const listingId = listings.find(
        (listing) => listing.url === currentLink
      ).id;
      await applyToListing({ listingId, status: "pending" }, token);
      const updatedAppliedJobs = {
        ...appliedJobs,
        [currentLink]: { status: "pending", title: currentJobTitle },
      };
      setAppliedJobs(updatedAppliedJobs);
      close();
      setConfettiVisible(true);
      setTimeout(() => {
        setConfettiVisible(false);
      }, 10000);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeStatus = async (link, status) => {
    try {
      const applicationId = Object.keys(appliedJobs).find(
        (key) => appliedJobs[key].title === link
      );
      await updateApplicationStatus({ applicationId, status }, token);
      const updatedAppliedJobs = {
        ...appliedJobs,
        [link]: { ...appliedJobs[link], status },
      };
      setAppliedJobs(updatedAppliedJobs);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveStatus = async (link) => {
    try {
      const applicationId = Object.keys(appliedJobs).find(
        (key) => appliedJobs[key].title === link
      );
      await deleteApplication(applicationId, token);
      const { [link]: _, ...rest } = appliedJobs;
      setAppliedJobs(rest);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredListings = listings.filter((listing) => {
    if (selectedFilter === "applied") {
      return appliedJobs[listing.url];
    }
    if (selectedFilter === "not_applied") {
      return !appliedJobs[listing.url];
    }
    return true;
  });

  const columns = [
    { Header: "Title", accessor: "title" },
    { Header: "Company", accessor: "company" },
    { Header: "Location", accessor: "location" },
    { Header: "Compensation", accessor: "compensation" },
    { Header: "Date Posted", accessor: "date" },
    {
      Header: "Status",
      accessor: "action",
      Cell: ({ row }) => {
        const jobStatus = appliedJobs[row.original.url]?.status;
        const buttonColor =
          jobStatus === "pending"
            ? "yellow"
            : jobStatus === "denied"
            ? "red"
            : jobStatus === "interview"
            ? "green"
            : "blue";

        return appliedJobs[row.original.url] ? (
          <Menu trigger="hover" openDelay={0} closeDelay={50}>
            <Menu.Target>
              <Button color={buttonColor} size="xs">
                {jobStatus.charAt(0).toUpperCase() + jobStatus.slice(1)}
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Change Status</Menu.Label>
              <Menu.Item
                onClick={() => handleChangeStatus(row.original.url, "pending")}
              >
                Set to Pending
              </Menu.Item>

              <Menu.Item
                onClick={() =>
                  handleChangeStatus(row.original.url, "interview")
                }
              >
                Set to Interview
              </Menu.Item>
              <Menu.Item
                onClick={() => handleChangeStatus(row.original.url, "denied")}
              >
                Set to Denied
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                onClick={() => window.open(row.original.url, "_blank")}
              >
                Visit Application
              </Menu.Item>
              <Menu.Item
                color="red"
                onClick={() => handleRemoveStatus(row.original.url)}
              >
                Reset Status
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        ) : (
          <Button
            color={buttonColor}
            size="xs"
            onClick={() =>
              handleApplyClick(row.original.url, row.original.title)
            }
          >
            Apply
          </Button>
        );
      },
    },
  ];

  const mobileColumns = columns.filter(
    (column) => column.accessor !== "compensation" && column.accessor !== "date"
  );

  return (
    <Container size="md" mt={16}>
      <Text
        style={{ fontSize: "2rem" }}
        align="center"
        variant="gradient"
        gradient={{ from: "indigo", to: "red", deg: 149 }}
      >
        csjobs.lol
      </Text>
      <Space h="xs" />
      <Text align="center" size="lg" mb="sm" c="dimmed">
        Browse, apply, and secure your dream internship. New listings added
        daily.
      </Text>

      <Text c="dimmed" align="center" size="sm" mb={16}>
        Last updated: July 29
      </Text>

      <Button onClick={openAuth} style={{ marginBottom: "1rem" }}>
        Login / Register
      </Button>

      <Paper shadow="md" py="sm" withBorder>
        <Container>
          <CustomTable
            columns={isMobile ? mobileColumns : columns}
            data={filteredListings}
            appliedJobs={appliedJobs}
            setAppliedJobs={setAppliedJobs}
            handleApplyClick={handleApplyClick}
            handleChangeStatus={handleChangeStatus}
            handleRemoveStatus={handleRemoveStatus}
          />
          <Flex justify="center" align="center" direction="row" mt="lg">
            <Text align="center" c="dimmed">
              More jobs coming soon...
            </Text>
            <ActionIcon
              onClick={toggleColorScheme}
              size={20}
              variant="subtle"
              style={{ marginLeft: 8 }}
            >
              {currentColorScheme === "dark" ? <IconSun /> : <IconMoon />}
            </ActionIcon>
          </Flex>
          <Modal
            title="Confirm Application"
            opened={opened}
            onClose={close}
            size="sm"
          >
            <Box mt="md" mb="lg" style={{ textAlign: "center" }}>
              <Text>Did you apply to the job: </Text>
              <Text weight={700}>{currentJobTitle}?</Text>
            </Box>
            <Flex justify="center" gap="md" mt="md">
              <Button color="green" onClick={handleConfirmApply}>
                Yeah!
              </Button>
              <Button color="red" onClick={close}>
                Nope
              </Button>
            </Flex>
          </Modal>
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
      <AuthModal opened={authOpened} onClose={closeAuth} onLogin={setToken} />
    </Container>
  );
};

export default Homepage;
