import React, { useState } from "react";
import {
  Modal,
  Button,
  TextInput,
  Box,
  LoadingOverlay,
  Anchor,
  Center,
} from "@mantine/core";
import { registerUser, loginUser } from "../api";
import { useAuth } from "../context/AuthContext";

const AuthModal = ({ opened, onClose, onLogin, login = true }) => {
  const [isLogin, setIsLogin] = useState(login);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { loading, setLoading } = useAuth();

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (isLogin) {
        const data = await loginUser({ username, password });
        onLogin(data.token, data.user);
      } else {
        await registerUser({ username, password });
        setIsLogin(true);
      }
      setLoading(false);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={isLogin ? "Login" : "Register"}
      size="xs"
    >
      <LoadingOverlay visible={loading} zIndex={1000} />
      <Box mb="xs">
        <TextInput
          label="Username"
          placeholder="Your username"
          value={username}
          onChange={(event) => setUsername(event.currentTarget.value)}
          onKeyDown={handleKeyDown}
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
          onKeyDown={handleKeyDown}
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
    </Modal>
  );
};

export default AuthModal;
