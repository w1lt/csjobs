import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { getApplications } from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchApplications = useCallback(async () => {
    if (token) {
      try {
        const data = await getApplications(token);
        const applied = {};
        data.forEach((app) => {
          applied[app.ListingId] = {
            status: app.status,
            title: app.Listing.title,
          };
        });
        setAppliedJobs(applied);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

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
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        appliedJobs,
        setAppliedJobs,
        login,
        logout,
        loading,
        fetchApplications,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
