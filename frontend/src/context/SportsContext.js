import React, { createContext, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";

export const SportsContext = createContext();

export const SportsProvider = ({ children }) => {
  const [selectedSports, setSelectedSports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);

  // Funcție pentru încărcarea sporturilor selectate
  const loadSelectedSports = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token || !user) return;

      const response = await axios.get("http://localhost:3008/user/sports", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSelectedSports(response.data.selectedSports || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Funcție pentru salvarea sporturilor selectate
  const saveSelectedSports = async (sports) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token || !user) return;

      await axios.post(
        "http://localhost:3008/user/sports",
        { sports },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      setError(err.message);
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
