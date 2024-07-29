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
} from "@mantine/core";
import { listings as unsortedListings } from "../data/listings";
import CustomTable from "../components/CustomTable";
import { IconSun, IconMoon } from "@tabler/icons-react";
import { useColorSchemeToggle } from "../utils/useColorSchemeToggle";
import { useMediaQuery, useDisclosure } from "@mantine/hooks";

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
  const [appliedJobs, setAppliedJobs] = useState(
    JSON.parse(localStorage.getItem("appliedJobs")) || []
  );

  const handleApplyClick = (link) => {
    setCurrentLink(link);
    open();
    window.open(link, "_blank");
  };

  const handleConfirmApply = () => {
    const updatedAppliedJobs = [...appliedJobs, currentLink];
    setAppliedJobs(updatedAppliedJobs);
    localStorage.setItem("appliedJobs", JSON.stringify(updatedAppliedJobs));
    close();
  };

  const columns = [
    { Header: "Title", accessor: "title" },
    { Header: "Company", accessor: "company" },
    { Header: "Location", accessor: "location" },
    { Header: "Pay", accessor: "compensation" },
    { Header: "Date Posted", accessor: "date" },
    {
      Header: "Action",
      accessor: "action",
      Cell: ({ row }) => (
        <Button
          color={appliedJobs.includes(row.original.link) ? "green" : "blue"}
          size="xs"
          onClick={() => handleApplyClick(row.original.link)}
        >
          {appliedJobs.includes(row.original.link) ? "Applied" : "Apply"}
        </Button>
      ),
    },
  ];

  const mobileColumns = columns.filter(
    (column) => column.accessor !== "compensation" && column.accessor !== "date"
  );

  useEffect(() => {
    localStorage.setItem("appliedJobs", JSON.stringify(appliedJobs));
  }, [appliedJobs]);

  return (
    <Container size="md" style={{ padding: "0 16px" }}>
      <Space h="xl" />
      <Text
        style={{ fontSize: "2rem" }}
        align="center"
        variant="gradient"
        gradient={{ from: "red", to: "indigo", deg: 149 }}
      >
        csjobs.lol
      </Text>
      <Space h="xs" />
      <Text align="center" size="lg" mb="md">
        Browse, apply, and secure your dream internship. New listings added
        daily.
      </Text>

      <Text c="dimmed" align="center" size="sm">
        Last updated: July 29
      </Text>
      <Paper shadow="xl" py="md">
        <Container>
          <CustomTable
            columns={isMobile ? mobileColumns : columns}
            data={listings}
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
            opened={opened}
            onClose={close}
            title="Application Confirmation"
          >
            <Text>Did you apply to this job?</Text>
            <Flex justify="space-between" mt="md">
              <Button onClick={handleConfirmApply}>Yes</Button>
              <Button onClick={close}>No</Button>
            </Flex>
          </Modal>
        </Container>
      </Paper>
    </Container>
  );
};

export default Homepage;
