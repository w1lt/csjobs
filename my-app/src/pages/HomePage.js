// src/components/Homepage/Homepage.js
import React from "react";
import { Container, Title, Space, Paper, Button, Text } from "@mantine/core";
import { listings } from "../data/listings";
import CustomTable from "../components/CustomTable";
import { IconShare3 } from "@tabler/icons-react";

const columns = [
  { Header: "Job Title", accessor: "title" },
  { Header: "Company", accessor: "company" },
  { Header: "Location", accessor: "location" },
  { Header: "Compensation", accessor: "compensation" },
  { Header: "Date Posted", accessor: "date" },
  {
    Header: "Actions",
    accessor: "action",
    Cell: ({ row }) => (
      <Button
        color="blue"
        size="xs"
        onClick={() => window.open(row.original.link, "_blank")}
      >
        Apply
        <IconShare3 width={16} height={16} />
      </Button>
    ),
  },
];

const Homepage = () => {
  return (
    <Container size="md">
      <Title order={1} align="center" className="homepage-title">
        Welcome to csjobs.lol
      </Title>
      <Space h="md" />
      <Text align="center" size="lg" mb="md">
        Discover the latest job listings in computer science. Our platform
        aggregates job postings from various sources, providing you with a
        comprehensive view of available opportunities. Explore, apply, and
        advance your career!
      </Text>
      <Paper shadow="md" padding="md">
        <CustomTable columns={columns} data={listings} />
      </Paper>
    </Container>
  );
};

export default Homepage;
