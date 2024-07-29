import React from "react";
import { Container, Text, Space, Center, Anchor, Group } from "@mantine/core";
import {
  IconBrandLinkedin,
  IconBrandGithub,
  IconWorldWww,
  IconListLetters,
} from "@tabler/icons-react";

const Footer = () => {
  return (
    <Container size="md">
      <Space h="xl" />
      <Text align="center" size="sm">
        &copy; {new Date().getFullYear()} csjobs.lol. All rights reserved.
      </Text>
      <Space h="md" />
      <Center>
        <Group mb="sm">
          <Anchor href="https://linked.whitehead.wiki/" target="_blank">
            <IconBrandLinkedin size={24} className="icon-hover" />
          </Anchor>
          <Anchor href="https://git.whitehead.wiki/" target="_blank">
            <IconBrandGithub size={24} className="icon-hover" />
          </Anchor>
          <Anchor href="https://whitehead.wiki/" target="_blank">
            <IconWorldWww size={24} className="icon-hover" />
          </Anchor>
          <Anchor href="/todo">
            <IconListLetters size={24} className="icon-hover" />
          </Anchor>
        </Group>
      </Center>
    </Container>
  );
};

export default Footer;
