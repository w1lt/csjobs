import React, { useState } from "react";
import { Modal, Button, TextInput, Box } from "@mantine/core";
import { registerUser, loginUser } from "../api";

const AuthModal = ({ opened, onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        const data = await loginUser({ username, password });
        onLogin(data.token);
      } else {
        await registerUser({ username, password });
        setIsLogin(true);
      }
      onClose();
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={isLogin ? "Login" : "Register"}
    >
      <Box mb="sm">
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
      <Box mt="sm" style={{ display: "flex", justifyContent: "space-between" }}>
        <Button onClick={handleSubmit}>{isLogin ? "Login" : "Register"}</Button>
        <Button variant="outline" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Register" : "Login"}
        </Button>
      </Box>
    </Modal>
  );
};

export default AuthModal;
