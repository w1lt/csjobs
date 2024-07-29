import React from "react";
import {
  Container,
  Title,
  Space,
  Paper,
  Button,
  Text,
  ActionIcon,
  Flex,
} from "@mantine/core";
import { listings as unsortedListings } from "../data/listings";
import CustomTable from "../components/CustomTable";
import { IconShare3, IconSun, IconMoon } from "@tabler/icons-react";
import { useColorSchemeToggle } from "../utils/useColorSchemeToggle";
import { useMediaQuery } from "@mantine/hooks";

// Function to convert "MMM DD" to a Date object
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

const columns = [
  { Header: "Job Title", accessor: "title" },
  { Header: "Company", accessor: "company" },
  { Header: "Location", accessor: "location" },
  { Header: "Compensation", accessor: "compensation" },
  { Header: "Date Posted", accessor: "date" },
  {
    Header: "Action",
    accessor: "action",
    Cell: ({ row }) => (
      <Button
        color="blue"
        size="xs"
        onClick={() => window.open(row.original.link, "_blank")}
      >
        Apply
      </Button>
    ),
  },
];

const Homepage = () => {
  const { toggleColorScheme, currentColorScheme } = useColorSchemeToggle();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const mobileColumns = columns.filter(
    (column) => column.accessor !== "compensation" && column.accessor !== "date"
  );

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
        </Container>
      </Paper>
    </Container>
  );
};

export default Homepage;
