import React from "react";
import { Container, Text, Space, Center, Anchor, Group } from "@mantine/core";
import {
  IconBrandLinkedin,
  IconBrandGithub,
  IconWorldWww,
  IconListLetters,
} from "@tabler/icons-react";
import { Flex } from "@mantine/core";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <Container size="md">
      <Space h="xl" />
      <Text align="center" size="sm">
        &copy; {new Date().getFullYear()} csjobs.lol. All rights reserved.
      </Text>
      <Space h="md" />
      <Center>
        <Group mb="sm" position="center" spacing="md">
          <Flex
            mih={50}
            gap="md"
            justify="flex-start"
            align="flex-start"
            direction="row"
            wrap="wrap"
          >
            <Anchor href="https://linked.whitehead.wiki/" target="_blank">
              <IconBrandLinkedin size={24} className="icon-hover" />
            </Anchor>
            <Anchor href="https://git.whitehead.wiki/" target="_blank">
              <IconBrandGithub size={24} className="icon-hover" />
            </Anchor>
            <Anchor href="https://whitehead.wiki/" target="_blank">
              <IconWorldWww size={24} className="icon-hover" />
            </Anchor>
            <Text mb={12} align="center">
              |
            </Text>
            <Anchor
              href="https://www.linkedin.com/in/sebastian-alturck-carlos/"
              target="_blank"
            >
              <IconBrandLinkedin size={24} className="icon-hover" />
            </Anchor>
            <Anchor
              href="https://github.com/SebastianAlturckCarlos"
              target="_blank"
            >
              <IconBrandGithub size={24} className="icon-hover" />
            </Anchor>
            <Anchor href="/todo">
              <IconListLetters size={24} className="icon-hover" />
            </Anchor>
          </Flex>
        </Group>
      </Center>
    </Container>
  );
};

export default Footer;
