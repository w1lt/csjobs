import React from "react";
import {
  Container,
  Title,
  Space,
  Paper,
  Button,
  Text,
  Group,
  Anchor,
  Center,
} from "@mantine/core";
import { listings } from "../data/listings";
import CustomTable from "../components/CustomTable";
import {
  IconShare3,
  IconBrandLinkedin,
  IconBrandGithub,
  IconWorldWww,
} from "@tabler/icons-react";

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
      <Space h="xl" />
      <Title order={1} align="center" style={{ fontWeight: "normal" }}>
        csjobs.lol
      </Title>
      <Space h="md" />
      <Text align="center" size="lg" mb="md">
        Check out the latest tech jobs all in one spot. Browse, apply, secure
        your dream internship.
      </Text>
      <Center>
        <Group mb="sm">
          <Anchor href="https://linked.whitehead.wiki/" target="_blank">
            <IconBrandLinkedin size={24} />
          </Anchor>
          <Anchor href="https://git.whitehead.wiki/" target="_blank">
            <IconBrandGithub size={24} />
          </Anchor>
          <Anchor href="https://whitehead.wiki/" target="_blank">
            <IconWorldWww size={24} />
          </Anchor>
        </Group>
      </Center>
      <Paper shadow="xl" py="md">
        <Container>
          <CustomTable columns={columns} data={listings} />
          <Text align="center" mt="lg">
            More jobs coming soon...
          </Text>
        </Container>
      </Paper>
    </Container>
  );
};

export default Homepage;
