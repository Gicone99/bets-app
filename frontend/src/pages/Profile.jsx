import React, { useState, useContext } from "react";
import { BalanceContext } from "../context/BalanceContext";
import { FaSignInAlt, FaUserPlus, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { balance, setBalance } = useContext(BalanceContext);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const handleLoginClick = () => navigate("/login");
  const navigate = useNavigate();
  const handleHomeClick = () => navigate("/");
  const handleRegisterClick = () => navigate("/register");
  const handleLogoutClick = () => navigate("/logout");
  const handleHistoryClick = () => navigate("/history");
  const handleProjectsClick = () => navigate("/projects");
  const handleUserIconClick = () => navigate("/profile");

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (isNaN(amount)) {
      alert("Please enter a valid number for deposit.");
      return;
    }
    if (amount <= 0) {
      alert("Deposit amount must be greater than 0.");
      return;
    }

    //sample fetch forceaddbalance
    // fetch("http://localhost:3000/forceaddbalance", {
    //   method: "post",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     username: "gicone",
    //     amount: amount,
    //   }),
    // })
    //   .then((response) => {
    //     if (!response.ok) {
    //       throw new Error("Invalid credentials");
    //     }
    //     return response.json();
    //   })
    //   .then((data) => {
    //     console.log(data.Raspuns);
    //   });

    setBalance((prevBalance) => prevBalance + amount);
    setDepositAmount("");
    alert(`Successfully deposited $${amount.toFixed(2)}.`);
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount)) {
      alert("Please enter a valid number for withdrawal.");
      return;
    }
    if (amount <= 0) {
      alert("Withdrawal amount must be greater than 0.");
      return;
    }
    if (amount > balance) {
      alert("Insufficient funds for withdrawal.");
      return;
    }
    setBalance((prevBalance) => prevBalance - amount);
    setWithdrawAmount("");
    alert(`Successfully withdrew $${amount.toFixed(2)}.`);
  };

  return (
    <div className="max-w-4xl mx-auto bg-gradient-to-b from-black via-gray-900 to-gray-900 shadow-xl rounded-2xl p-8">
      <h1 className="text-3xl font-semibold text-center mb-6 text-green-400">
        Profile
      </h1>

      {/* Balance Display */}
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-green-400">Current Balance</h2>
        <p className="text-2xl text-green-500">${balance.toFixed(2)}</p>
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
            className="bg-green-600 hover:bg-green-700 text-white px-6 rounded-lg focus:outline-none whitespace-nowrap"
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
            className="bg-green-600 hover:bg-green-700 text-white px-6 rounded-lg focus:outline-none whitespace-nowrap"
          >
            Withdraw
          </button>
        </div>
      </div>

      {/* Settings Section */}
      <div>
        <h2 className="text-xl font-bold text-green-400 mb-4">Settings</h2>
        <p className="text-gray-400">
          Settings functionality will be added later.
        </p>

        <div className="flex space-x-4">
          <button
            onClick={handleLoginClick}
            className="flex items-center text-green-400 hover:text-green-500 transition duration-200"
          >
            <FaSignInAlt className="mr-2" /> Login
          </button>
          <button
            onClick={handleLogoutClick}
            className="flex items-center text-green-400 hover:text-green-500 transition duration-200"
          >
            <FaSignOutAlt className="mr-2" /> Logout
          </button>
          <button
            onClick={handleRegisterClick}
            className="flex items-center text-green-400 hover:text-green-500 transition duration-200"
          >
            <FaUserPlus className="mr-2" /> Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
