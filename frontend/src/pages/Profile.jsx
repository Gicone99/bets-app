import React, { useState, useContext } from "react";
import { BalanceContext } from "../context/BalanceContext";
import { UserContext } from "../context/UserContext";
import { FaSignInAlt, FaUserPlus, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const { balance, setBalance } = useContext(BalanceContext);
  const { user } = useContext(UserContext);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const navigate = useNavigate();

  // Navigation handlers
  const handleLoginClick = () => navigate("/login");
  const handleHomeClick = () => navigate("/");
  const handleRegisterClick = () => navigate("/register");
  const handleLogoutClick = () => navigate("/logout");
  const handleHistoryClick = () => navigate("/history");
  const handleProjectsClick = () => navigate("/projects");

  const handleTransaction = async (type, amount) => {
    const endpoint = type === "deposit" ? "/deposit" : "/withdraw";
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "http://localhost:3001/updatebalance",
        { amount }, // Trimite amount pozitiv pentru deposit
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setBalance(response.data.newBalance);
        return true;
      }
      alert(`Transaction failed: ${response.data.message}`);
      return false;
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
      return false;
    }
  };

  const handleDeposit = async () => {
    const amount = parseFloat(depositAmount);

    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid positive number");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3001/deposit",
        { amount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Actualizează starea CU VALOAREA DIN RĂSPUNS
        setBalance(response.data.newBalance);
        setDepositAmount("");
        alert(
          `Deposit successful! New balance: $${response.data.newBalance.toFixed(
            2
          )}`
        );
      }
    } catch (error) {
      console.error("Deposit error:", error);
      alert(`Error: ${error.response?.data?.message || error.message}`);

      // Reîmprospătează balanța indiferent de eroare
      try {
        const balanceResponse = await axios.get(
          "http://localhost:3001/balance",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setBalance(balanceResponse.data.balance);
      } catch (refreshError) {
        console.error("Balance refresh failed:", refreshError);
      }
    }
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);

    // Validare frontend
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid positive number");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You need to login first");
        return;
      }

      const response = await axios.post(
        "http://localhost:3001/withdraw",
        { amount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setBalance(response.data.newBalance);
        setWithdrawAmount("");
        alert(`Successfully withdrew $${amount.toFixed(2)}`);
      } else {
        alert(`Withdrawal failed: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Withdraw error:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message;

      // Mesaj special pentru fonduri insuficiente
      if (error.response?.data?.message === "Insufficient funds") {
        alert(
          `Insufficient funds. Current balance: $${error.response.data.currentBalance}`
        );
      } else {
        alert(`Error: ${errorMsg}`);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-gradient-to-b from-black via-gray-900 to-gray-900 shadow-xl rounded-2xl p-8">
      <h1 className="text-3xl font-semibold text-center mb-6 text-green-400">
        Profile
      </h1>

      {/* Balance Display */}
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-green-400">Current Balance</h2>
        <p className="text-2xl text-green-500">
          {(() => {
            return `Balance: ${Number(user?.balance || 0).toFixed(2)}`;
          })()}
        </p>
      </div>

      {/* Deposit Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-green-400 mb-4">Deposit</h2>
        <div className="flex justify-between gap-8">
          <input
            type="text"
            placeholder="Enter deposit amount"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            className="w-full p-3 border-2 border-green-400 rounded-lg bg-gray-800 text-white text-center"
          />
          <button
            onClick={handleDeposit}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
          >
            Deposit
          </button>
        </div>
      </div>

      {/* Withdraw Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-green-400 mb-4">Withdraw</h2>
        <div className="flex justify-between gap-8">
          <input
            type="text"
            placeholder="Enter withdrawal amount"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            className="w-full p-3 border-2 border-green-400 rounded-lg bg-gray-800 text-white text-center"
          />
          <button
            onClick={handleWithdraw}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
          >
            Withdraw
          </button>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-wrap gap-4 justify-center mt-8">
        <button
          onClick={handleHomeClick}
          className="flex items-center text-green-400 hover:text-green-500 transition px-4 py-2 border border-green-400 rounded-lg"
        >
          Home
        </button>
        <button
          onClick={handleHistoryClick}
          className="flex items-center text-green-400 hover:text-green-500 transition px-4 py-2 border border-green-400 rounded-lg"
        >
          History
        </button>
        <button
          onClick={handleProjectsClick}
          className="flex items-center text-green-400 hover:text-green-500 transition px-4 py-2 border border-green-400 rounded-lg"
        >
          Projects
        </button>
        <button
          onClick={handleLoginClick}
          className="flex items-center text-green-400 hover:text-green-500 transition px-4 py-2 border border-green-400 rounded-lg"
        >
          <FaSignInAlt className="mr-2" /> Login
        </button>
        <button
          onClick={handleLogoutClick}
          className="flex items-center text-green-400 hover:text-green-500 transition px-4 py-2 border border-green-400 rounded-lg"
        >
          <FaSignOutAlt className="mr-2" /> Logout
        </button>
        <button
          onClick={handleRegisterClick}
          className="flex items-center text-green-400 hover:text-green-500 transition px-4 py-2 border border-green-400 rounded-lg"
        >
          <FaUserPlus className="mr-2" /> Register
        </button>
      </div>
    </div>
  );
};

export default Profile;
