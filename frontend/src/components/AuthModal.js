import React, { useState } from "react";
import {
  Button,
  TextInput,
  Box,
  LoadingOverlay,
  Anchor,
  Center,
} from "@mantine/core";
import { useAuth } from "../context/AuthContext"; // Adjust the path as needed

const AuthModal = ({ context, id, innerProps }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, register, loading, setLoading } = useAuth();

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (isLogin) {
        await login({ username, password });
      } else {
        await register({ username, password });
      }
      setLoading(false);
      context.closeModal(id);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
      setLoading(false);
    }
  };

  return (
    <>
      <LoadingOverlay visible={loading} zIndex={1000} />
      <Box mb="xs">
        <TextInput
          label="Username"
          placeholder="Your username"
          value={username}
          onChange={(event) => setUsername(event.currentTarget.value)}
          required
        />
      </Box>
      <Box mb="sm">
        <TextInput
          label="Password"
          placeholder="Your password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
          required
        />
      </Box>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <Box mb="sm">
        <Button fullWidth onClick={handleSubmit}>
          {isLogin ? "Login" : "Register"}
        </Button>
      </Box>
      <Center>
        <Anchor variant="outline" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Register" : "Login"} instead
        </Anchor>
      </Center>
    </>
  );
};

export default AuthModal;
