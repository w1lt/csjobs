import React, { createContext, useState, useContext, useEffect } from "react";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser } from "../api";
import { nprogress } from "@mantine/nprogress";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [appliedJobs, setAppliedJobs] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (userInfo) => {
    try {
      const response = await loginUser(userInfo);
      const userToken = response.token;
      setToken(userToken);
      setUser(response.user);
      localStorage.setItem("token", userToken);
      localStorage.setItem("user", JSON.stringify(response.user));
      notifications.show({
        title: "Welcome back",
        message: `Welcome back, ${response.user.username}!`,
        color: "blue",
      });
    } catch (error) {
      notifications.show({
        title: "Login failed",
        message: error.response?.data?.message || "An error occurred",
        color: "red",
      });
    }
  };

  const register = async (userInfo) => {
    try {
      await registerUser(userInfo);
      await login(userInfo);
    } catch (error) {
      notifications.show({
        title: "Registration failed",
        message: error.response?.data?.message || "An error occurred",
        color: "red",
      });
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    navigate("/");
    setAppliedJobs({});
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    notifications.show({
      title: "Logged out",
      message: "You have been logged out.",
      color: "blue",
    });
  };

  useEffect(() => {
    if (loading) {
      nprogress.start();
    } else {
      nprogress.complete();
    }
  }, [loading]);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        appliedJobs,
        setAppliedJobs,
        login,
        register,
        logout,
        loading,
        setLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
