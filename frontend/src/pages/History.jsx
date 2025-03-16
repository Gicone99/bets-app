import React, { useEffect, useState, useContext } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BalanceContext } from "../context/BalanceContext";
import { ProjectsContext } from "../context/ProjectsContext";
import { motion } from "framer-motion";

const History = () => {
  const [balanceData, setBalanceData] = useState([]);
  const [profitLossData, setProfitLossData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedRangeLabel, setSelectedRangeLabel] = useState("");
  const [manualStartDate, setManualStartDate] = useState("");
  const [manualEndDate, setManualEndDate] = useState("");
  const [selectedProjects, setSelectedProjects] = useState(["All"]);
  const { balancing } = useContext(BalanceContext);
  const { projects } = useContext(ProjectsContext);

  const COLORS = ["#10B981", "#EF4444"];

  // Componentă personalizată pentru Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const isPositive = value >= 0;
      const tooltipText = isPositive ? "Win" : "Loss";
      const tooltipColor = isPositive ? "#10B981" : "#EF4444";

      return (
        <div className="p-3 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm" style={{ color: tooltipColor }}>
            {tooltipText}
          </p>
          <p className="text-sm text-gray-400">{`Date: ${label}`}</p>
          <p className="text-sm" style={{ color: tooltipColor }}>
            {`Value: ${value.toFixed(2)}€`}
          </p>
        </div>
      );
    }

    return null;
  };

  // Încarcă datele din localStorage la montarea componentei
  useEffect(() => {
    const storedBets = JSON.parse(localStorage.getItem("betsByDate")) || {};
    processBetsData(storedBets);
  }, []);

  // Monitorizează schimbările în selectedProjects și re-procesează datele
  useEffect(() => {
    const storedBets = JSON.parse(localStorage.getItem("betsByDate")) || {};
    processBetsData(storedBets, startDate, endDate);
  }, [selectedProjects, startDate, endDate]);

  // Procesează datele din `betsByDate` pentru a genera graficele și statisticile
  const processBetsData = (betsByDate, start = null, end = null) => {
    if (!betsByDate || typeof betsByDate !== "object") {
      console.error("Invalid bets data");
      return;
    }

    const balanceHistory = [];
    const profitLossHistory = [];
    const winLossCount = { won: 0, lost: 0 };
    const transactions = [];

    let currentBalance = balancing || 0;

    Object.keys(betsByDate).forEach((date) => {
      const betDate = new Date(date);
      if ((!start || betDate >= start) && (!end || betDate <= end)) {
        const bets = betsByDate[date];
        let dailyProfit = 0;
        let dailyLoss = 0;

        bets.forEach((bet) => {
          if (
            selectedProjects.includes("All") ||
            selectedProjects.includes(bet.title)
          ) {
            if (bet.isReady) {
              if (bet.updatedStatus === "WON") {
                dailyProfit += bet.winnings - bet.stake;
                winLossCount.won += 1;
              } else if (bet.updatedStatus === "LOST") {
                dailyLoss += bet.stake;
                winLossCount.lost += 1;
              }

              transactions.push({
                id: bet.id,
                date,
                type: bet.updatedStatus === "WON" ? "Bet Won" : "Bet Lost",
                amount:
                  bet.updatedStatus === "WON"
                    ? `+${(bet.winnings - bet.stake).toFixed(2)}€`
                    : `-${bet.stake.toFixed(2)}€`,
                details: bet.title,
              });
            }
          }
        });

        currentBalance += dailyProfit - dailyLoss;
        balanceHistory.push({ date, balance: currentBalance });

        const netProfitLoss = dailyProfit - dailyLoss;
        profitLossHistory.push({ date, netProfitLoss });
      }
    });

    setBalanceData(balanceHistory);
    setProfitLossData(profitLossHistory);
    setPieData([
      { name: "Won", value: winLossCount.won },
      { name: "Lost", value: winLossCount.lost },
    ]);
    setTransactionHistory(transactions);
  };

  // Actualizează datele atunci când se schimbă intervalul selectat
  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);

    if (start && end) {
      setSelectedRangeLabel(
        `Interval selectat: ${start.toLocaleDateString()} - ${end.toLocaleDateString()}`
      );
    } else {
      setSelectedRangeLabel("");
    }
  };

  // Gestionează selectarea proiectelor
  const handleProjectSelect = (e) => {
    const selectedOption = e.target.value;
    setSelectedProjects([selectedOption]); // Actualizează starea cu un singur proiect
  };

  // Gestionează selectarea intervalului de timp din dropdown
  const handleQuickRange = (range) => {
    const today = new Date();
    let start, end;

    switch (range) {
      case "today":
        start = new Date(today);
        end = new Date(today);
        break;
      case "thisWeek":
        start = new Date(today.setDate(today.getDate() - today.getDay()));
        end = new Date(today.setDate(today.getDate() + 6));
        break;
      case "thisMonth":
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case "thisYear":
        start = new Date(today.getFullYear(), 0, 1);
        end = new Date(today.getFullYear(), 11, 31);
        break;
      case "lastWeek":
        start = new Date(today.setDate(today.getDate() - today.getDay() - 7));
        end = new Date(today.setDate(today.getDate() + 6));
        break;
      case "lastMonth":
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case "lastYear":
        start = new Date(today.getFullYear() - 1, 0, 1);
        end = new Date(today.getFullYear() - 1, 11, 31);
        break;
      default:
        start = null;
        end = null;
    }

    setStartDate(start);
    setEndDate(end);

    if (start && end) {
      setSelectedRangeLabel(
        `Interval selectat: ${start.toLocaleDateString()} - ${end.toLocaleDateString()}`
      );
    } else {
      setSelectedRangeLabel("");
    }
  };

  // Actualizează intervalul atunci când se introduc date manuale
  const handleManualRangeSubmit = () => {
    const start = new Date(manualStartDate);
    const end = new Date(manualEndDate);

    if (start && end && start <= end) {
      setStartDate(start);
      setEndDate(end);

      setSelectedRangeLabel(
        `Interval selectat: ${start.toLocaleDateString()} - ${end.toLocaleDateString()}`
      );
    } else {
      alert("Date invalide! Begin Date must be lower than End Date.");
    }
  };

  const sortedBalanceData = [...balanceData].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  const sortedProfitLossData = [...profitLossData].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-4 bg-gray-900 text-white min-h-screen"
    >
      <h1 className="text-2xl font-bold mb-4 text-green-400">History</h1>

      {/* Container principal pentru calendar și controale */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Calendar */}
        <div className="lg:w-1/2">
          <div className="bg-gray-800 p-4 rounded-lg">
            <DatePicker
              selected={startDate}
              onChange={handleDateChange}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              inline
              className="bg-gray-800 text-white"
            />
          </div>
        </div>

        {/* Controale în dreapta calendarului */}
        <div className="lg:w-1/2 space-y-6">
          {/* Begin Date, End Date și butonul Aplică */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Select Date Range</h2>
            <div className="flex flex-col space-y-2">
              <div className="flex flex-col">
                <label className="text-gray-400 mb-1">Begin Date</label>
                <input
                  type="date"
                  value={manualStartDate}
                  onChange={(e) => setManualStartDate(e.target.value)}
                  className="bg-gray-800 text-white p-2 rounded-lg"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-400 mb-1">End Date</label>
                <input
                  type="date"
                  value={manualEndDate}
                  onChange={(e) => setManualEndDate(e.target.value)}
                  className="bg-gray-800 text-white p-2 rounded-lg"
                />
              </div>
              <button
                onClick={handleManualRangeSubmit}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                Aplică
              </button>
            </div>
          </div>

          {/* Select Time Range */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Select Time Range</h2>
            <select
              onChange={(e) => handleQuickRange(e.target.value)}
              className="w-full p-3 border-2 border-green-400 rounded-lg bg-gray-800 text-white"
            >
              <option value="">All</option>
              <option value="today">Today</option>
              <option value="thisWeek">This Week</option>
              <option value="thisMonth">This Month</option>
              <option value="thisYear">This Year</option>
              <option value="lastWeek">Last Week</option>
              <option value="lastMonth">Last Month</option>
              <option value="lastYear">Last Year</option>
            </select>
            {/* Afișează intervalul selectat */}
            {selectedRangeLabel && (
              <div className="mt-2">
                <p className="text-green-400 text-sm">{selectedRangeLabel}</p>
              </div>
            )}
          </div>

          {/* Select Project și Selected Projects */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Select Project</h2>
            <select
              value={selectedProjects[0]}
              onChange={handleProjectSelect}
              className="w-full p-3 border-2 border-green-400 rounded-lg bg-gray-800 text-white"
            >
              <option value="All">All</option>
              {projects.map((project) => (
                <option key={project.id} value={project.name}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          {/* Afișează proiectele selectate */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Selected Projects</h2>
            <div className="flex flex-wrap gap-2">
              {selectedProjects.map((project) => (
                <motion.span
                  key={project}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-green-600 text-white px-3 py-1 rounded-lg"
                >
                  {project}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grafic balanță */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Balance Evolution</h2>
        <div className="overflow-x-auto">
          <LineChart
            width={600}
            height={300}
            data={sortedBalanceData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis dataKey="date" stroke="#6B7280" tick={{ fill: "#6B7280" }} />
            <YAxis stroke="#6B7280" tick={{ fill: "#6B7280" }} />
            <CartesianGrid stroke="#374151" strokeDasharray="5 5" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </div>
      </div>

      {/* Grafic profit/pierdere */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Profit & Loss</h2>
        <div className="overflow-x-auto">
          <BarChart
            width={600}
            height={300}
            data={sortedProfitLossData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis dataKey="date" stroke="#6B7280" tick={{ fill: "#6B7280" }} />
            <YAxis stroke="#6B7280" tick={{ fill: "#6B7280" }} />
            <CartesianGrid stroke="#374151" strokeDasharray="5 5" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="netProfitLoss" name="Result" barSize={20}>
              {sortedProfitLossData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.netProfitLoss >= 0 ? "#10B981" : "#EF4444"}
                />
              ))}
            </Bar>
          </BarChart>
        </div>
      </div>

      {/* Statistici */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Statistics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-800 rounded-lg">
            <p className="text-gray-400">Total Profit</p>
            <p className="text-green-400 text-xl">
              {balanceData.length > 0
                ? `${balanceData[balanceData.length - 1].balance.toFixed(2)}€`
                : "0€"}
            </p>
          </div>
          <div className="p-4 bg-gray-800 rounded-lg">
            <p className="text-gray-400">Win Rate</p>
            <p className="text-green-400 text-xl">
              {pieData.length > 0
                ? `${(
                    (pieData[0].value / (pieData[0].value + pieData[1].value)) *
                    100
                  ).toFixed(2)}%`
                : "0%"}
            </p>
          </div>
          <div className="p-4 bg-gray-800 rounded-lg">
            <p className="text-gray-400">Total Bets</p>
            <p className="text-green-400 text-xl">
              {pieData.length > 0 ? pieData[0].value + pieData[1].value : 0}
            </p>
          </div>
        </div>
      </div>

      {/* Grafic circular (Pie Chart) */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Win/Loss Ratio</h2>
        <div className="overflow-x-auto">
          <PieChart width={400} height={300}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "none",
                color: "#FFFFFF",
              }}
            />
            <Legend />
          </PieChart>
        </div>
      </div>

      {/* Istoric tranzacții */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Transaction History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded-lg">
            <thead>
              <tr>
                <th className="px-2 py-1 text-left text-gray-400">Date</th>
                <th className="px-2 py-1 text-left text-gray-400">Type</th>
                <th className="px-2 py-1 text-left text-gray-400">Amount</th>
                <th className="px-2 py-1 text-left text-gray-400">Details</th>
              </tr>
            </thead>
            <tbody>
              {transactionHistory.map((transaction) => (
                <tr key={transaction.id} className="border-b border-gray-700">
                  <td className="px-2 py-1">{transaction.date}</td>
                  <td className="px-2 py-1">{transaction.type}</td>
                  <td
                    className={`px-2 py-1 ${
                      transaction.amount.startsWith("+")
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {transaction.amount}
                  </td>
                  <td className="px-2 py-1">{transaction.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default History;
