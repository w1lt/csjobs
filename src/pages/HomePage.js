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
import { listings as unsortedListings } from "../data/listings";
import CustomTable from "../components/CustomTable";
import { IconSun, IconMoon } from "@tabler/icons-react";
import { useColorSchemeToggle } from "../utils/useColorSchemeToggle";
import { useMediaQuery, useDisclosure } from "@mantine/hooks";
import Confetti from "react-confetti";

const convertToDate = (dateStr) => {
  const months = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };
  const [monthStr, day] = dateStr.split(" ");
  const month = months[monthStr];
  const year = new Date().getFullYear();
  return new Date(year, month, parseInt(day));
};

const listings = [...unsortedListings].sort(
  (a, b) => convertToDate(b.date) - convertToDate(a.date)
);

const Homepage = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const { toggleColorScheme, currentColorScheme } = useColorSchemeToggle();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [currentLink, setCurrentLink] = useState("");
  const [currentJobTitle, setCurrentJobTitle] = useState("");
  const [appliedJobs, setAppliedJobs] = useState(
    JSON.parse(localStorage.getItem("appliedJobs")) || {}
  );
  const [confettiVisible, setConfettiVisible] = useState(false);
  const { width, height } = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  const [selectedFilter] = useState("");

  const handleApplyClick = (link, title) => {
    if (!appliedJobs[link]) {
      setCurrentLink(link);
      setCurrentJobTitle(title);
      open();
      window.open(link, "_blank");
    }
  };

  const handleConfirmApply = () => {
    const updatedAppliedJobs = {
      ...appliedJobs,
      [currentLink]: { status: "pending", title: currentJobTitle },
    };
    setAppliedJobs(updatedAppliedJobs);
    localStorage.setItem("appliedJobs", JSON.stringify(updatedAppliedJobs));
    close();
    setConfettiVisible(true);
    setTimeout(() => {
      setConfettiVisible(false);
    }, 10000);
  };

  const handleChangeStatus = (link, status) => {
    const updatedAppliedJobs = {
      ...appliedJobs,
      [link]: { ...appliedJobs[link], status },
    };
    setAppliedJobs(updatedAppliedJobs);
    localStorage.setItem("appliedJobs", JSON.stringify(updatedAppliedJobs));
  };

  const handleRemoveStatus = (link) => {
    const { [link]: _, ...rest } = appliedJobs;
    setAppliedJobs(rest);
    localStorage.setItem("appliedJobs", JSON.stringify(rest));
  };

  const filteredListings = listings.filter((listing) => {
    if (selectedFilter === "applied") {
      return appliedJobs[listing.link];
    }
    if (selectedFilter === "not_applied") {
      return !appliedJobs[listing.link];
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
        const jobStatus = appliedJobs[row.original.link]?.status;
        const buttonColor =
          jobStatus === "pending"
            ? "yellow"
            : jobStatus === "denied"
            ? "red"
            : jobStatus === "interview"
            ? "green"
            : "blue";

        return appliedJobs[row.original.link] ? (
          <Menu trigger="hover" openDelay={0} closeDelay={50}>
            <Menu.Target>
              <Button color={buttonColor} size="xs">
                {jobStatus.charAt(0).toUpperCase() + jobStatus.slice(1)}
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Change Status</Menu.Label>
              <Menu.Item
                onClick={() => handleChangeStatus(row.original.link, "pending")}
              >
                Set to Pending
              </Menu.Item>

              <Menu.Item
                onClick={() =>
                  handleChangeStatus(row.original.link, "interview")
                }
              >
                Set to Interview
              </Menu.Item>
              <Menu.Item
                onClick={() => handleChangeStatus(row.original.link, "denied")}
              >
                Set to Denied
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                onClick={() => window.open(row.original.link, "_blank")}
              >
                Visit Application
              </Menu.Item>
              <Menu.Item
                color="red"
                onClick={() => handleRemoveStatus(row.original.link)}
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
              handleApplyClick(row.original.link, row.original.title)
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

  useEffect(() => {
    localStorage.setItem("appliedJobs", JSON.stringify(appliedJobs));
  }, [appliedJobs]);

  return (
    <Container size="md" mt={16}>
      <Text
        style={{ fontSize: "2rem" }}
        align="center"
        variant="gradient"
        gradient={{ from: "red", to: "indigo", deg: 149 }}
      >
        csjobs.lol
      </Text>
      <Space h="xs" />
      <Text align="center" size="lg" mb="md" c="dimmed">
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
    </Container>
  );
};

export default Homepage;
