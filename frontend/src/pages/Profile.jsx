import React, { useState, useContext } from "react";
import { BalanceContext } from "../context/BalanceContext";
import { UserContext } from "../context/UserContext";
import { FaSignInAlt, FaUserPlus, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const { setBalance } = useContext(BalanceContext);
  const { user } = useContext(UserContext);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const navigationHandlers = {
    login: () => navigate("/login"),
    home: () => navigate("/"),
    register: () => navigate("/register"),
    logout: () => navigate("/logout"),
    history: () => navigate("/history"),
    projects: () => navigate("/projects"),
  };

  const handleAmountChange = (value, setter) => {
    if (value === "") {
      setter("");
      return;
    }

    const regex = /^\d*\.?\d{0,2}$/;
    if (regex.test(value)) {
      setter(value);
    }
  };

  const handleTransaction = async (amount, isDeposit) => {
    const numericAmount = parseFloat(amount);
    const currentBalance = parseFloat(user?.balance || 0);

    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      setError(
        `Please enter a valid ${isDeposit ? "deposit" : "withdrawal"} amount`
      );
      return;
    }

    if (!isDeposit && numericAmount > currentBalance) {
      setError(
        `You cannot withdraw more than your current balance (${currentBalance.toFixed(
          2
        )})`
      );
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const transactionAmount = isDeposit ? numericAmount : -numericAmount;
      const response = await axios.post(
        "http://localhost:3008/addbalance",
        { amount: transactionAmount },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.data?.newBalance) {
        throw new Error("Invalid server response");
      }

      setBalance(response.data.newBalance);
      isDeposit ? setDepositAmount("") : setWithdrawAmount("");

      // Set success message
      const successMessage = isDeposit
        ? `Successfully deposited $${numericAmount.toFixed(2)}`
        : `Successfully withdrew $${numericAmount.toFixed(2)}`;
      setSuccess(successMessage);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          `${isDeposit ? "Deposit" : "Withdrawal"} failed. Please try again.`
      );
    } finally {
      setIsLoading(false);
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
          Balance: {Number(user?.balance || 0).toFixed(2)}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-2 bg-red-500 text-white rounded text-center">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-2 bg-green-500 text-white rounded text-center">
          {success}
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="mb-4 text-center text-green-400">Processing...</div>
      )}

      {/* Transaction Sections */}
      {["deposit", "withdraw"].map((type) => {
        const isDeposit = type === "deposit";
        const amount = isDeposit ? depositAmount : withdrawAmount;
        const setAmount = isDeposit ? setDepositAmount : setWithdrawAmount;

        return (
          <div key={type} className="mb-8">
            <h2 className="text-xl font-bold text-green-400 mb-4">
              {isDeposit ? "Deposit" : "Withdraw"}
            </h2>
            <div className="flex justify-between gap-8">
              <input
                type="text"
                inputMode="decimal"
                pattern="\d*\.?\d{0,2}"
                placeholder={`Enter ${type} amount`}
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value, setAmount)}
                className="w-full p-3 border-2 border-green-400 rounded-lg bg-gray-800 text-white text-center"
                disabled={isLoading}
              />
              <button
                onClick={() => handleTransaction(amount, isDeposit)}
                disabled={isLoading || !amount}
                className={`bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isDeposit ? "Deposit" : "Withdraw"}
              </button>
            </div>
          </div>
        );
      })}

      {/* Navigation Buttons */}
      <div className="flex flex-wrap gap-4 justify-center mt-8">
        {[
          { label: "Home", handler: "home" },
          { label: "History", handler: "history" },
          { label: "Projects", handler: "projects" },
          {
            label: "Login",
            handler: "login",
            icon: <FaSignInAlt className="mr-2" />,
          },
          {
            label: "Logout",
            handler: "logout",
            icon: <FaSignOutAlt className="mr-2" />,
          },
          {
            label: "Register",
            handler: "register",
            icon: <FaUserPlus className="mr-2" />,
          },
        ].map((btn) => (
          <button
            key={btn.handler}
            onClick={navigationHandlers[btn.handler]}
            className="flex items-center text-green-400 hover:text-green-500 transition px-4 py-2 border border-green-400 rounded-lg"
          >
            {btn.icon}
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Profile;
