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
    Header: "Action",
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
      <Space h="xl" />
      <Title order={1} align="center">
        csjobs.lol
      </Title>
      <Space h="md" />
      <Text align="center" size="lg" mb="md">
        Check out the latest tech jobs all in one spot. Browse, apply, secure
        your dream internship.
      </Text>

      <Text c="dimmed" align="center" size="sm">
        Last updated: July 29
      </Text>
      <Paper shadow="xl" py="md">
        <Container>
          <CustomTable columns={columns} data={listings} />
          <Text align="center" mt="lg" c="dimmed">
            More jobs coming soon...
          </Text>
        </Container>
      </Paper>
    </Container>
  );
};

export default Homepage;
