import React from "react";
import { Container, Text, Anchor } from "@mantine/core";

const Footer = () => {
  return (
    <Container size="md" py={20}>
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
        {" - "}
        <Anchor
          href="https://www.linkedin.com/company/104124163/"
          target="
        _blank 
        "
        >
          Careers
        </Anchor>
      </Text>
    </Container>
  );
};

export default Footer;
