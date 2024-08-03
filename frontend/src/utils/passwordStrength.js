import React from "react";
import { Text } from "@mantine/core";

export function PasswordRequirement({ meets, label }) {
  return (
    <Text color={meets ? "green" : "red"} size="xs">
      {meets ? "✓" : "✗"} {label}
    </Text>
  );
}

export function getStrength(password) {
  const requirements = [
    { re: /.{6,}/, label: "Includes at least 6 characters" },
    { re: /[0-9]/, label: "Includes at least one number" },
    { re: /[A-Z]/, label: "Includes at least one uppercase letter" },
    { re: /[a-z]/, label: "Includes at least one lowercase letter" },
    { re: /[^A-Za-z0-9]/, label: "Includes at least one special character" },
  ];

  const passed = requirements.filter((req) => req.re.test(password)).length;

  const strength = {
    0: { message: "Weak", color: "red" },
    1: { message: "Weak", color: "red" },
    2: { message: "Moderate", color: "yellow" },
    3: { message: "Moderate", color: "yellow" },
    4: { message: "Strong", color: "green" },
    5: { message: "Very Strong", color: "green" },
  };

  return strength[passed];
}
