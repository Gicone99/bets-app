import React, { useState, useEffect, useContext, useRef } from "react";
import { BalanceContext } from "../context/BalanceContext";
import { UserContext } from "../context/UserContext";
import {
  FaCreditCard,
  FaHistory,
  FaSyncAlt,
  FaCrown,
  FaGem,
  FaUserCog,
  FaKey,
  FaSignOutAlt,
  FaGlobe,
  FaHome,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const { setBalance } = useContext(BalanceContext);
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  // Navigation handlers
  const navigationHandlers = {
    home: () => navigate("/"),
    logout: () => handleLogout(),
  };

  // State for transactions
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // State for subscription
  const [subscription, setSubscription] = useState({
    type: "free",
    start_date: new Date().toISOString(),
    end_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
  });

  const [daysRemaining, setDaysRemaining] = useState(2);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("subscription");
  const [settings, setSettings] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    email: user?.email || "",
    language: "english",
  });

  // Transaction history state
  const [transactions, setTransactions] = useState([]);

  // Calculate remaining days effect
  useEffect(() => {
    const calculateDays = () => {
      if (subscription.end_date) {
        const endDate = new Date(subscription.end_date);
        const today = new Date();
        const days = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
        setDaysRemaining(days > 0 ? days : 0);

        if (days <= 0 && subscription.status !== "expired") {
          setSubscription((prev) => ({ ...prev, status: "expired" }));
        }
      }
    };

    calculateDays();
    const interval = setInterval(calculateDays, 86400000);
    return () => clearInterval(interval);
  }, [subscription]);

  // Load transactions on component mount
  useEffect(() => {
    if (user) {
      const mockTransactions = [
        {
          id: 1,
          date: new Date(user.createdAt || Date.now()).toLocaleDateString(),
          description: "Account created",
          amount: "+0.00€",
        },
        {
          id: 2,
          date: new Date().toLocaleDateString(),
          description: "Initial deposit",
          amount: "+100.00€",
        },
      ];
      setTransactions(mockTransactions);
    }
  }, [user]);

  // Handle logout
  const handleLogout = () => {
    if (localStorage.getItem("token")) {
      axios
        .post(
          "http://localhost:3008/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then(() => {
          localStorage.removeItem("token");
          navigate("/");
        })
        .catch((err) => {
          console.error("Logout error:", err);
        });
    }
  };

  // Transaction handler
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

      const newTransaction = {
        id: transactions.length + 1,
        date: new Date().toLocaleDateString(),
        description: isDeposit ? "Deposit" : "Withdrawal",
        amount: `${isDeposit ? "+" : "-"}${numericAmount.toFixed(2)}€`,
      };
      setTransactions([...transactions, newTransaction]);

      isDeposit ? setDepositAmount("") : setWithdrawAmount("");

      const successMessage = isDeposit
        ? `Successfully deposited $${numericAmount.toFixed(2)}`
        : `Successfully withdrew $${numericAmount.toFixed(2)}`;
      setSuccess(successMessage);

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

  // Subscription handler
  const handleSubscribe = async (plan) => {
    setIsProcessing(true);

    try {
      let startDate = new Date();
      let endDate = new Date();

      if (plan === "monthly") {
        endDate.setMonth(endDate.getMonth() + 1);
      } else if (plan === "yearly") {
        endDate.setFullYear(endDate.getFullYear() + 1);
      } else {
        endDate.setDate(endDate.getDate() + 2);
      }

      setSubscription({
        type: plan,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        status: "active",
      });

      setDaysRemaining(plan === "monthly" ? 30 : plan === "yearly" ? 365 : 2);
      setSuccess(`Successfully subscribed to ${plan} plan!`);
      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      setError("Subscription failed. Please try again.");
      console.error("Subscription error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Settings functions
  const handleSettingsChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveSettings = async () => {
    try {
      const updatedUser = {
        ...user,
        email: settings.email,
        language: settings.language,
      };

      setUser(updatedUser);
      setSuccess("Settings saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to save settings");
      console.error(err);
    }
  };

  const changeLanguage = (lang) => {
    setSettings((prev) => ({ ...prev, language: lang }));
    setUser((prev) => ({ ...prev, language: lang }));
    setSuccess(`Language changed to ${lang}`);
    setTimeout(() => setSuccess(""), 3000);
  };

  // Format date helper
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Subscription Status Component
  const SubscriptionStatus = () => {
    const isActive = subscription.status === "active";
    const isFree = subscription.type === "free";
    const isExpired = !isActive || daysRemaining <= 0;

    const subscriptionPlans = [
      {
        name: "Free Trial",
        price: "0€",
        duration: "2 days",
        features: ["Limited access", "Basic statistics"],
        type: "free",
        featured: false,
      },
      {
        name: "Monthly Pro",
        price: "10€",
        duration: "30 days",
        features: ["Full access", "Advanced stats", "Priority support"],
        type: "monthly",
        featured: true,
      },
      {
        name: "Yearly Elite",
        price: "100€",
        duration: "1 year",
        features: [
          "Full access",
          "Premium statistics",
          "24/7 support",
          "Custom reports",
        ],
        type: "yearly",
        featured: false,
      },
    ];

    if (isExpired) {
      return (
        <div className="bg-gradient-to-r from-red-900 to-red-700 p-6 rounded-xl shadow-lg mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white">
                Subscription Expired
              </h3>
              <p className="text-red-100">
                Your access to premium features has ended
              </p>
            </div>
            <FaCrown className="text-green-400 text-4xl" />
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {subscriptionPlans.map((plan) => (
              <div
                key={plan.type}
                className={`bg-gray-800 rounded-lg p-4 border-2 ${
                  plan.featured
                    ? "border-green-400 transform scale-105"
                    : "border-gray-700"
                }`}
              >
                <h4 className="text-xl font-bold text-white mb-2">
                  {plan.name}
                </h4>
                <p className="text-3xl font-bold text-green-400 mb-4">
                  {plan.price}
                </p>
                <p className="text-gray-300 mb-4">{plan.duration}</p>
                <ul className="mb-6 space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <span className="text-green-400 mr-2">✓</span>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleSubscribe(plan.type)}
                  disabled={isProcessing}
                  className={`w-full py-3 rounded-lg font-bold ${
                    plan.featured
                      ? "bg-green-600 hover:bg-green-700 text-gray-900"
                      : plan.type === "yearly"
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-700 hover:bg-gray-600 text-white"
                  }`}
                >
                  {isProcessing ? "Processing..." : "Choose Plan"}
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="bg-gradient-to-r from-green-900 to-blue-900 p-6 rounded-xl shadow-lg mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white">
              {isFree
                ? "FREE TRIAL"
                : `${subscription.type.toUpperCase()} SUBSCRIPTION`}
            </h3>
            <p className="text-blue-100">
              {isFree
                ? "Explore basic features"
                : "Full access to all features"}
            </p>
          </div>
          <div className="bg-black bg-opacity-30 px-4 py-2 rounded-full flex items-center">
            <FaGem className="text-green-400 mr-2" />
            <span className="text-white font-bold">
              {Math.floor(daysRemaining)} days remaining
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-black bg-opacity-30 p-4 rounded-lg">
            <h4 className="text-gray-400 mb-2">Start Date</h4>
            <p className="text-xl text-white font-bold">
              {formatDate(subscription.start_date)}
            </p>
          </div>
          <div className="bg-black bg-opacity-30 p-4 rounded-lg">
            <h4 className="text-gray-400 mb-2">End Date</h4>
            <p className="text-xl text-white font-bold">
              {formatDate(subscription.end_date)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-end">
          <button
            onClick={() => handleSubscribe("monthly")}
            disabled={isProcessing}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold flex items-center"
          >
            <FaSyncAlt className="mr-2" />
            {isProcessing ? "Processing..." : "Renew (10€/month)"}
          </button>

          <button
            onClick={() => handleSubscribe("yearly")}
            disabled={isProcessing}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold flex items-center"
          >
            <FaCrown className="mr-2" />
            {isProcessing ? "Processing..." : "Upgrade (100€/year)"}
          </button>
        </div>
      </div>
    );
  };

  // Wallet Component
  const TransactionSection = () => {
    const [transactionType, setTransactionType] = useState("deposit");
    const [amount, setAmount] = useState("");

    const handleAmountChange = (value) => {
      if (value === "") {
        setAmount("");
        return;
      }

      const regex = /^\d*\.?\d{0,2}$/;
      if (regex.test(value)) {
        setAmount(value);
      }
    };

    return (
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-2xl font-bold text-white mb-6">Wallet</h3>

        {/* Balance Display */}
        <div className="bg-black bg-opacity-30 p-4 rounded-lg mb-6">
          <h4 className="text-gray-400 mb-1">Available Balance</h4>
          <p className="text-3xl font-bold text-green-400">
            {Number(user?.balance || 0).toFixed(2)}€
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

        <div className="flex mb-4 border-b border-gray-700">
          <button
            className={`px-4 py-2 font-medium ${
              transactionType === "deposit"
                ? "text-green-400 border-b-2 border-green-400"
                : "text-gray-400"
            }`}
            onClick={() => setTransactionType("deposit")}
          >
            Deposit
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              transactionType === "withdraw"
                ? "text-green-400 border-b-2 border-green-400"
                : "text-gray-400"
            }`}
            onClick={() => setTransactionType("withdraw")}
          >
            Withdraw
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            inputMode="decimal"
            pattern="\d*\.?\d{0,2}"
            placeholder={`Enter ${transactionType} amount`}
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            className="flex-1 bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-center"
            disabled={isLoading}
          />
          <button
            onClick={() =>
              handleTransaction(amount, transactionType === "deposit")
            }
            disabled={isLoading || !amount}
            className={`bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {transactionType === "deposit" ? "Deposit" : "Withdraw"}
          </button>
        </div>
      </div>
    );
  };

  // History Component
  const HistorySection = () => {
    // Formatare data pentru expirare abonament
    const formatSubscriptionDate = (dateString) => {
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return new Date(dateString).toLocaleDateString("en-US", options);
    };

    return (
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-2xl font-bold text-white mb-6">Account History</h3>

        <div className="space-y-4">
          {/* Card special pentru crearea contului */}
          <div className="bg-gradient-to-r bg-gray-700 p-5 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center mb-2">
                  <FaUserCog className=" text-green-400 mr-2 text-xl" />
                  <h4 className="text-lg font-bold text-white">
                    Account Created
                  </h4>
                </div>
                <p className="text-blue-100">
                  {new Date(user?.createdAt || Date.now()).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-white mb-1">
                  Subscription expires:
                </p>
                <p className=" text-green-400 font-medium">
                  {subscription.end_date
                    ? formatSubscriptionDate(subscription.end_date)
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Istoric tranzacții */}
          <div className="bg-gray-700 p-4 rounded-lg">
            <h4 className="text-lg font-bold text-white mb-4 flex items-center">
              <FaHistory className="mr-2 text-green-400" />
              Transaction History
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-left py-3 text-gray-300">Date</th>
                    <th className="text-left py-3 text-gray-300">
                      Description
                    </th>
                    <th className="text-right py-3 text-gray-300">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions
                    .filter((t) => t.id !== 1)
                    .map((transaction) => (
                      <tr
                        key={transaction.id}
                        className="border-b border-gray-600 hover:bg-gray-600"
                      >
                        <td className="py-3 text-gray-300">
                          {transaction.date}
                        </td>
                        <td className="py-3 text-white">
                          {transaction.description}
                        </td>
                        <td
                          className={`py-3 text-right font-medium ${
                            transaction.amount.startsWith("+")
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {transaction.amount}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Settings Component
  const SettingsSection = () => {
    // Folosim useRef pentru a stoca valorile temporare
    const emailRef = useRef(user?.email || "");
    const currentPasswordRef = useRef("");
    const newPasswordRef = useRef("");
    const confirmPasswordRef = useRef("");

    // Actualizăm ref-urile când user-ul se schimbă
    useEffect(() => {
      emailRef.current = user?.email || "";
    }, [user]);

    const handleSaveSettings = async () => {
      try {
        const updatedSettings = {
          email: emailRef.current,
          currentPassword: currentPasswordRef.current,
          newPassword: newPasswordRef.current,
          confirmPassword: confirmPasswordRef.current,
          language: settings.language,
        };

        const updatedUser = {
          ...user,
          email: updatedSettings.email,
          language: updatedSettings.language,
        };

        setUser(updatedUser);
        setSuccess("Settings saved successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        setError("Failed to save settings");
        console.error(err);
      }
    };

    return (
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-2xl font-bold text-white mb-6">Account Settings</h3>

        <div className="space-y-6">
          {/* Account Information */}
          <div className="bg-black bg-opacity-30 p-4 rounded-lg">
            <h4 className="text-xl font-bold text-white mb-4 flex items-center">
              <FaUserCog className="mr-2 text-green-400" />
              Personal Information
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-1">Username</label>
                <div className="bg-gray-700 text-white p-3 rounded-lg">
                  {user?.username}
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  defaultValue={emailRef.current}
                  onChange={(e) => (emailRef.current = e.target.value)}
                  className="w-full bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-black bg-opacity-30 p-4 rounded-lg">
            <h4 className="text-xl font-bold text-white mb-4 flex items-center">
              <FaKey className="mr-2 text-green-400" />
              Security
            </h4>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  defaultValue={currentPasswordRef.current}
                  onChange={(e) =>
                    (currentPasswordRef.current = e.target.value)
                  }
                  className="w-full bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">New Password</label>
                <input
                  type="password"
                  defaultValue={newPasswordRef.current}
                  onChange={(e) => (newPasswordRef.current = e.target.value)}
                  className="w-full bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  defaultValue={confirmPasswordRef.current}
                  onChange={(e) =>
                    (confirmPasswordRef.current = e.target.value)
                  }
                  className="w-full bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
            </div>
          </div>

          {/* Language Selector */}
          <div className="bg-black bg-opacity-30 p-4 rounded-lg">
            <h4 className="text-xl font-bold text-white mb-4 flex items-center">
              <FaGlobe className="mr-2 text-green-400" />
              Language Preferences
            </h4>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => changeLanguage("english")}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  (user?.language || "english") === "english"
                    ? "bg-green-600 text-white"
                    : "bg-gray-700 text-gray-300"
                }`}
              >
                <span className="mr-2">🇬🇧</span> English
              </button>
              <button
                onClick={() => changeLanguage("german")}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  user?.language === "german"
                    ? "bg-green-600 text-white"
                    : "bg-gray-700 text-gray-300"
                }`}
              >
                <span className="mr-2">🇩🇪</span> German
              </button>
              <button
                onClick={() => changeLanguage("romanian")}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  user?.language === "romanian"
                    ? "bg-green-600 text-white"
                    : "bg-gray-700 text-gray-300"
                }`}
              >
                <span className="mr-2">🇷🇴</span> Romanian
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleSaveSettings}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
              MindStake PRO
            </h1>
            <div className="hidden md:flex space-x-2">
              <button
                onClick={navigationHandlers.home}
                className="text-gray-300 hover:text-green-400 transition px-3 py-1 rounded-lg flex items-center"
              >
                <FaHome className="mr-1" />
                Home
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <span className="font-medium">{user?.username}</span>
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center font-bold">
                    <span>{user?.username?.charAt(0).toUpperCase()}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-red-400 transition px-3 py-1 rounded-lg flex items-center"
                >
                  <FaSignOutAlt className="mr-1" />
                  Logout
                </button>
              </>
            )}
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="flex mb-6 border-b border-gray-700 overflow-x-auto">
          <button
            className={`px-4 py-2 font-medium whitespace-nowrap flex items-center ${
              activeTab === "subscription"
                ? "text-green-400 border-b-2 border-green-400"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("subscription")}
          >
            <FaCreditCard className="mr-2" />
            Subscription
          </button>
          <button
            className={`px-4 py-2 font-medium whitespace-nowrap flex items-center ${
              activeTab === "wallet"
                ? "text-green-400 border-b-2 border-green-400"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("wallet")}
          >
            <FaGem className="mr-2" />
            Wallet
          </button>
          <button
            className={`px-4 py-2 font-medium whitespace-nowrap flex items-center ${
              activeTab === "history"
                ? "text-green-400 border-b-2 border-green-400"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("history")}
          >
            <FaHistory className="mr-2" />
            History
          </button>
          <button
            className={`px-4 py-2 font-medium whitespace-nowrap flex items-center ${
              activeTab === "settings"
                ? "text-green-400 border-b-2 border-green-400"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("settings")}
          >
            <FaUserCog className="mr-2" />
            Settings
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "subscription" && <SubscriptionStatus />}
        {activeTab === "wallet" && <TransactionSection />}
        {activeTab === "history" && <HistorySection />}
        {activeTab === "settings" && <SettingsSection />}
      </div>
    </div>
  );
};

export default Profile;
