import React, { useState } from "react";
import {
  Button,
  TextInput,
  Box,
  LoadingOverlay,
  Anchor,
  PasswordInput,
  Text,
  Group,
  Progress,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useAuth } from "../context/AuthContext"; // Adjust the path as needed

const requirements = [
  { re: /[0-9]/, label: "Includes number" },
  { re: /[a-z]/, label: "Includes lowercase letter" },
  { re: /[A-Z]/, label: "Includes uppercase letter" },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: "Includes special symbol" },
];

const getStrength = (password) => {
  if (password.length < 5) {
    return 10;
  }

  let multiplier = password.length > 5 ? 0 : 1;

  requirements.forEach((requirement) => {
    if (!requirement.re.test(password)) {
      multiplier += 1;
    }
  });

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
};

const getStrengthColor = (strength) => {
  switch (true) {
    case strength < 30:
      return "red";
    case strength < 50:
      return "orange";
    case strength < 70:
      return "yellow";
    default:
      return "teal";
  }
};

const AuthModal = ({ context, id, innerProps }) => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register, loading, setLoading } = useAuth();

  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },

    validate: {
      username: (value) =>
        value.trim().length < 1
          ? "Username must be at least 1 character"
          : null,
      password: (value) =>
        value.length < 1 ? "Password must be at least 1 characters" : null,
    },
  });

  const strength = getStrength(form.values.password);
  const color = getStrengthColor(strength);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      if (isLogin) {
        await login(values);
      } else {
        await register(values);
      }
      setLoading(false);
      context.closeModal(id);
    } catch (err) {
      form.setErrors({
        username: err.response?.data?.message || "An error occurred",
      });
      setLoading(false);
    }
  };

  return (
    <>
      <LoadingOverlay visible={loading} zIndex={1000} />
      <Text align="center" size="lg" weight={500} mb="lg">
        {isLogin ? "Login to Your Account" : "Create a New Account"}
      </Text>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Box mb="xs">
          <TextInput
            label="Username"
            placeholder="Your username"
            {...form.getInputProps("username")}
            required
          />
        </Box>
        <Box mb="sm">
          <PasswordInput
            label="Password"
            placeholder="Your password"
            {...form.getInputProps("password")}
            required
          />
          {!isLogin && (
            <>
              <Group grow gap={5} mt="xs">
                <Progress
                  size="xs"
                  color={color}
                  value={form.values.password.length > 0 ? 100 : 0}
                  transitionDuration={0}
                />
                <Progress
                  size="xs"
                  color={color}
                  transitionDuration={0}
                  value={strength < 30 ? 0 : 100}
                />
                <Progress
                  size="xs"
                  color={color}
                  transitionDuration={0}
                  value={strength < 50 ? 0 : 100}
                />
                <Progress
                  size="xs"
                  color={color}
                  transitionDuration={0}
                  value={strength < 70 ? 0 : 100}
                />
              </Group>
            </>
          )}
        </Box>
        {form.errors.username && (
          <div style={{ color: "red" }}>{form.errors.username}</div>
        )}
        <Box mb="sm">
          <Button fullWidth type="submit">
            {isLogin ? "Login" : "Register"}
          </Button>
        </Box>
      </form>
      <Text align="center" size="sm" c="dimmed">
        {isLogin ? "Don't have an account?" : "Already have an account?"}&nbsp;
        <Anchor variant="outline" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Register" : "Login"}
        </Anchor>
      </Text>
    </>
  );
};

export default AuthModal;
