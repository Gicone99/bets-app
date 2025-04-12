import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";

export const SportsContext = createContext();

export const SportsProvider = ({ children }) => {
  const [selectedSports, setSelectedSports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);

  // Load selected sports when user changes
  useEffect(() => {
    if (user) {
      loadSelectedSports();
    } else {
      setSelectedSports([]);
    }
  }, [user]);

  const loadSelectedSports = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      if (!token || !user) return;

      const response = await axios.get("http://localhost:3008/user/sports", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSelectedSports(response.data.selectedSports || []);
    } catch (err) {
      console.error("Error loading sports:", err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSelectedSports = async (sports) => {
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      if (!token || !user) throw new Error("Not authenticated");

      const response = await axios.post(
        "http://localhost:3008/user/sports",
        { sports },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state only after successful save
      setSelectedSports(sports);
      return response.data;
    } catch (err) {
      console.error("Error saving sports:", err);
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SportsContext.Provider
      value={{
        selectedSports,
        setSelectedSports,
        loadSelectedSports,
        saveSelectedSports,
        isLoading,
        error,
      }}
    >
      {children}
    </SportsContext.Provider>
  );
};
