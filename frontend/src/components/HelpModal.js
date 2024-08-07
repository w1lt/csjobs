import React from "react";
import { Anchor, Text, Stack, Divider, Group } from "@mantine/core";

const HelpModal = () => {
  return (
    <Stack spacing="sm">
      <Text>
        Feel free to reach out to us at{" "}
        <Anchor href="mailto:hello@csjobs.lol">hello@csjobs.lol</Anchor>
      </Text>

      <Divider />

      <Text>Credits</Text>
      <Group spacing="xs" direction="column">
        <Anchor href="https://www.linkedin.com/in/willwhitehead122/">
          Will Whitehead
        </Anchor>
        <Anchor href="https://www.linkedin.com/in/sebastian-alturck-carlos/">
          Sebastian Alturck-Carlos
        </Anchor>
      </Group>
    </Stack>
  );
};

export default HelpModal;
