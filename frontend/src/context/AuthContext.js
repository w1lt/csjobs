import React, { createContext, useState, useContext, useEffect } from "react";
import { getApplications } from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState({});
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchApplications = async () => {
      if (token) {
        try {
          const data = await getApplications(token);
          const applied = {};
          data.forEach((app) => {
            applied[app.Listing.url] = {
              status: app.status,
              title: app.Listing.title,
            };
          });
          setAppliedJobs(applied);
        } catch (error) {
          console.error("Error fetching applications:", error);
        } finally {
          setLoading(false); // Set loading to false once data is fetched
        }
      } else {
        setLoading(false); // Set loading to false if no token is present
      }
    };

    fetchApplications();
  }, [token]);

  const login = (userToken) => {
    setToken(userToken);
    localStorage.setItem("token", userToken);
  };

  const logout = () => {
    setToken(null);
    setAppliedJobs({});
    localStorage.removeItem("token");
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
    setLoading(false); // Set loading to false after checking local storage
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, appliedJobs, setAppliedJobs, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
