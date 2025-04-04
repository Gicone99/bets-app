import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";

export const BalanceContext = createContext();

export const BalanceProvider = ({ children }) => {
  const [balance, setBalance] = useState(0);
  const { user } = useContext(UserContext);

  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !user) return;

      const response = await axios.get("http://localhost:3001/balance", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBalance(response.data.balance);
    } catch (error) {
      console.error("Error fetching balance:", error);
      setBalance(0);
    }
  };

  // Fetch balance when user changes
  useEffect(() => {
    fetchBalance();
  }, [user]);

  return (
    <BalanceContext.Provider value={{ balance, setBalance, fetchBalance }}>
      {children}
    </BalanceContext.Provider>
  );
};
