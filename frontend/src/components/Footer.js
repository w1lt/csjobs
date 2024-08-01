import React from "react";
import { Container, Text, Space, Anchor } from "@mantine/core";

const Footer = () => {
  return (
    <Container size="md">
      <Space h="xl" />
      <Text align="center" size="sm">
        &copy; {new Date().getFullYear()} csjobs.lol{" - "}
        <Anchor
          href="https://status.csjobs.lol/"
          target="
        _blank 
        "
        >
          Server Status
        </Anchor>
      </Text>
      <Space h="md" />
    </Container>
  );
};

export default Footer;
