import React, { createContext, useState, useContext, useEffect } from "react";
import { notifications } from "@mantine/notifications";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [appliedJobs, setAppliedJobs] = useState({});
  const [loading, setLoading] = useState(true);

  const login = (userToken, userInfo) => {
    setToken(userToken);
    setUser(userInfo);
    localStorage.setItem("token", userToken);
    localStorage.setItem("user", JSON.stringify(userInfo));
    notifications.show({
      title: "Welcome back",
      message: `Welcome back, ${userInfo.username}!`,
      color: "blue",
    });
  };

  const logout = () => {
    setLoading(true);
    setToken(null);
    setUser(null);
    setAppliedJobs({});
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setLoading(false);
    notifications.show({
      title: "Logged out",
      message: "You have been logged out.",
      color: "blue",
    });
  };

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
