import React from "react";
import { Container, Text, Space } from "@mantine/core";

const Footer = () => {
  return (
    <Container size="md">
      <Space h="xl" />
      <Text align="center" size="sm">
        &copy; {new Date().getFullYear()} csjobs.lol. All rights reserved.
      </Text>
      <Space h="md" />
    </Container>
  );
};

export default Footer;
