import React, { useEffect, useState, useContext } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
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
  const [selectedProjects, setSelectedProjects] = useState(["All Projects"]);
  const [selectedRange, setSelectedRange] = useState("customRange"); // Default to "customRange"
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
            selectedProjects.includes("All Projects") ||
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
        `Selected Range: ${start.toLocaleDateString()} - ${end.toLocaleDateString()}`
      );
      setSelectedRange("customRange"); // Setăm selectedRange la "customRange"

      // Actualizăm manualStartDate și manualEndDate cu valorile selectate din calendar
      setManualStartDate(start.toISOString().split("T")[0]); // Format: YYYY-MM-DD
      setManualEndDate(end.toISOString().split("T")[0]); // Format: YYYY-MM-DD
    } else {
      setSelectedRangeLabel("");
      setSelectedRange(""); // Resetăm selectedRange dacă nu este selectat niciun interval
      setManualStartDate("");
      setManualEndDate("");
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
        start = new Date(today.getFullYear(), today.getMonth(), 1); // Prima zi a lunii curente
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Ultima zi a lunii curente
        break;
      case "thisYear":
        start = new Date(today.getFullYear(), 0, 1); // Prima zi a anului curent
        end = new Date(today.getFullYear(), 11, 31); // Ultima zi a anului curent
        break;
      case "lastWeek":
        start = new Date(today.setDate(today.getDate() - today.getDay() - 7));
        end = new Date(today.setDate(today.getDate() + 6));
        break;
      case "lastMonth":
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1); // Prima zi a lunii trecute
        end = new Date(today.getFullYear(), today.getMonth(), 0); // Ultima zi a lunii trecute
        break;
      case "lastYear":
        start = new Date(today.getFullYear() - 1, 0, 1); // Prima zi a anului trecut
        end = new Date(today.getFullYear() - 1, 11, 31); // Ultima zi a anului trecut
        break;
      case "customRange":
        start = null;
        end = null;
        break;
      default:
        start = null;
        end = null;
    }

    setStartDate(start);
    setEndDate(end);
    setSelectedRange(range);

    if (start && end) {
      setSelectedRangeLabel(
        `Selected Range: ${start.toLocaleDateString()} - ${end.toLocaleDateString()}`
      );
    } else {
      setSelectedRangeLabel("");
    }

    // Resetăm manualStartDate și manualEndDate doar dacă nu este selectat Custom Range
    if (range !== "customRange") {
      setManualStartDate("");
      setManualEndDate("");
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
        `Selected Range: ${start.toLocaleDateString()} - ${end.toLocaleDateString()}`
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

  const totalProfit =
    balanceData.length > 0 ? balanceData[balanceData.length - 1].balance : 0;
  const winRate =
    pieData.length > 0 && pieData[0].value + pieData[1].value > 0
      ? (pieData[0].value / (pieData[0].value + pieData[1].value)) * 100
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-4 bg-gray-900 text-white min-h-screen"
    >
      <h1 className="text-2xl font-bold mb-4 text-green-400">History</h1>

      {/* Calendar și controale */}
      <div className="flex flex-col lg:flex-row gap-8 text-center">
        {/* Calendar și controale integrate */}
        <div className="p-6 rounded-lg w-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mr-8">
            {/* Coloana 1: Calendar */}
            <div>
              <h2 className="text-lg font-semibold mb-4">
                Select Time from Calendar
              </h2>
              <DatePicker
                selected={startDate}
                onChange={handleDateChange}
                startDate={startDate}
                endDate={endDate}
                selectsRange
                inline
                className="bg-gray-800 text-white custom-datepicker"
              />
              {selectedRangeLabel && (
                <div className="mt-4">
                  <p className="text-green-400 text-sm">{selectedRangeLabel}</p>
                </div>
              )}
            </div>

            {/* Coloana 2: Select Date Range */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-4 mr-8"
            >
              <h2 className="text-lg font-semibold">Select Time Range</h2>
              <select
                onChange={(e) => handleQuickRange(e.target.value)}
                className="w-full p-3 border-2 border-green-400 rounded-lg bg-gray-700 text-white text-center"
                value={selectedRange}
              >
                <option value="customRange">Custom Range</option>
                <option value="today">Today</option>
                <option value="thisWeek">This Week</option>
                <option value="thisMonth">This Month</option>
                <option value="thisYear">This Year</option>
                <option value="lastWeek">Last Week</option>
                <option value="lastMonth">Last Month</option>
                <option value="lastYear">Last Year</option>
                <option value="">All Time</option>
              </select>
              {selectedRange === "customRange" && (
                <div className="flex flex-col space-y-2">
                  <div className="flex flex-col">
                    <label className="text-gray-400 mb-1">Begin Date</label>
                    <input
                      type="date"
                      value={manualStartDate}
                      onChange={(e) => setManualStartDate(e.target.value)}
                      className="bg-gray-700 text-white p-2 rounded-lg text-center"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-gray-400 mb-1">End Date</label>
                    <input
                      type="date"
                      value={manualEndDate}
                      onChange={(e) => setManualEndDate(e.target.value)}
                      className="bg-gray-700 text-white p-2 rounded-lg text-center"
                    />
                  </div>
                  <button
                    onClick={handleManualRangeSubmit}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                  >
                    Apply
                  </button>
                </div>
              )}
            </motion.div>

            {/* Coloana 3: Statistici (Total Profit, Win Rate, Total Bets) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="space-y-4 mr-8"
            >
              <h2 className="text-lg font-semibold">Select Project</h2>
              <select
                value={selectedProjects[0]}
                onChange={handleProjectSelect}
                className="w-full p-3 border-2 border-green-400 rounded-lg bg-gray-700 text-white text-center"
              >
                <option value="All Projects">All Projects</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.name}>
                    {project.name}
                  </option>
                ))}
              </select>
              <h2 className="text-lg font-semibold">Statistics</h2>
              <div className="space-y-2">
                {/* Total Profit */}
                <div className="flex items-center justify-between p-2 bg-gray-700 rounded-lg gap-2">
                  <p className="text-gray-400">
                    {totalProfit >= 0 ? "Total Profit:" : "Total Lost:"}
                  </p>
                  <p
                    className={`text-xl ${
                      totalProfit >= 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {totalProfit.toFixed(2)}€
                  </p>
                </div>

                {/* Win Rate */}
                <div className="flex items-center justify-between p-2 bg-gray-700 rounded-lg gap-2">
                  <p className="text-gray-400">
                    {winRate >= 0 ? "Win Rate:" : "Lost Rate:"}
                  </p>
                  <p
                    className={`text-xl ${
                      winRate >= 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {winRate.toFixed(2)}%
                  </p>
                </div>

                {/* Total Bets */}
                <div className="flex items-center justify-between p-2 bg-gray-700 rounded-lg gap-2">
                  <p className="text-gray-400">Total Bets:</p>
                  <p className="text-green-400 text-xl">
                    {pieData.length > 0
                      ? pieData[0].value + pieData[1].value
                      : 0}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Grafic balanță */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h2 className="text-lg font-semibold mb-2 text-center">
            Balance Evolution
          </h2>
          <div className="overflow-x-auto">
            <div style={{ minWidth: `${sortedBalanceData.length * 25}px` }}>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={sortedBalanceData}
                  margin={{ top: 20, bottom: 30 }}
                >
                  <XAxis
                    dataKey="date"
                    stroke="#6B7280"
                    tick={{ fill: "#6B7280", fontSize: 12 }}
                    tickFormatter={(date) =>
                      new Date(date).toLocaleDateString()
                    }
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis stroke="#6B7280" tick={{ fill: "#6B7280" }} />
                  <CartesianGrid stroke="#374151" strokeDasharray="5 5" />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="balance"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Grafic profit/pierdere */}
        <div>
          <h2 className="text-lg font-semibold mb-2 text-center">
            Profit & Loss
          </h2>
          <div className="overflow-x-auto">
            <div style={{ minWidth: `${sortedProfitLossData.length * 25}px` }}>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={sortedProfitLossData}
                  margin={{ top: 20, bottom: 30 }}
                >
                  <XAxis
                    dataKey="date"
                    stroke="#6B7280"
                    tick={{ fill: "#6B7280", fontSize: 12 }}
                    tickFormatter={(date) =>
                      new Date(date).toLocaleDateString()
                    }
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis stroke="#6B7280" tick={{ fill: "#6B7280" }} />
                  <CartesianGrid stroke="#374151" strokeDasharray="5 5" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="netProfitLoss" barSize={20}>
                    {sortedProfitLossData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.netProfitLoss >= 0 ? "#10B981" : "#EF4444"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Grafic Win/Loss Ratio */}
        <div>
          <h2 className="text-lg font-semibold mb-2 text-center">
            Win/Loss Ratio
          </h2>
          <div>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
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
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Istoric tranzacții */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-6 text-center ">
          Transaction History
        </h2>
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
