import React from "react";
import { Anchor, Text } from "@mantine/core";

const HelpModal = () => {
  return (
    <>
      <Text mb="sm">
        Feel free to reach out to us at{" "}
        <Anchor href="mailto:hello@csjobs.lol">hello@csjobs.lol</Anchor>{" "}
      </Text>
    </>
  );
};

export default HelpModal;
