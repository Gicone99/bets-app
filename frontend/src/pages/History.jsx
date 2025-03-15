import React, { useEffect, useState } from "react";
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

const History = () => {
  const [balanceData, setBalanceData] = useState([]); // Date pentru graficul balanței
  const [profitLossData, setProfitLossData] = useState([]); // Date pentru graficul profit/pierdere
  const [pieData, setPieData] = useState([]); // Date pentru graficul circular (Pie Chart)
  const [transactionHistory, setTransactionHistory] = useState([]); // Istoricul tranzacțiilor
  const [startDate, setStartDate] = useState(null); // Data de început
  const [endDate, setEndDate] = useState(null); // Data de sfârșit
  const [selectedRangeLabel, setSelectedRangeLabel] = useState(""); // Label pentru intervalul selectat
  const [manualStartDate, setManualStartDate] = useState(""); // Input manual pentru data de început
  const [manualEndDate, setManualEndDate] = useState(""); // Input manual pentru data de sfârșit

  // Culori pentru graficul circular
  const COLORS = ["#10B981", "#EF4444"];

  // Încarcă datele din localStorage la montarea componentei
  useEffect(() => {
    const storedBets = JSON.parse(localStorage.getItem("betsByDate")) || {};
    processBetsData(storedBets);
  }, []);

  // Procesează datele din `betsByDate` pentru a genera graficele și statisticile
  const processBetsData = (betsByDate, start = null, end = null) => {
    const balanceHistory = [];
    const profitLossHistory = [];
    const winLossCount = { won: 0, lost: 0 };
    const transactions = [];

    let currentBalance = 200;

    Object.keys(betsByDate).forEach((date) => {
      const betDate = new Date(date);
      if ((!start || betDate >= start) && (!end || betDate <= end)) {
        const bets = betsByDate[date];
        let dailyProfit = 0;
        let dailyLoss = 0;

        bets.forEach((bet) => {
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
                  ? `+${bet.winnings.toFixed(2)}€`
                  : `-${bet.stake.toFixed(2)}€`,
              details: bet.title,
            });
          }
        });

        currentBalance += dailyProfit - dailyLoss;
        balanceHistory.push({ date, balance: currentBalance });

        // Adăugăm profit/pierdere netă pentru ziua respectivă
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

    // Actualizează label-ul intervalului selectat
    if (start && end) {
      setSelectedRangeLabel(
        `Interval selectat: ${start.toLocaleDateString()} - ${end.toLocaleDateString()}`
      );
    } else {
      setSelectedRangeLabel("");
    }

    // Re-procesează datele pentru noul interval
    const storedBets = JSON.parse(localStorage.getItem("betsByDate")) || {};
    processBetsData(storedBets, start, end);
  };

  // Butoane rapide pentru intervale comune
  const handleQuickRange = (range) => {
    const today = new Date();
    let start, end;

    switch (range) {
      case "lastWeek":
        // Săptămâna anterioară (luni până duminică)
        start = new Date(today.setDate(today.getDate() - today.getDay() - 6)); // Luni săptămâna trecută
        end = new Date(today.setDate(today.getDate() + 6)); // Duminică săptămâna trecută
        break;
      case "lastMonth":
        // Luna anterioară (de la prima până la ultima zi)
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1); // Prima zi a lunii anterioare
        end = new Date(today.getFullYear(), today.getMonth(), 0); // Ultima zi a lunii anterioare
        break;
      case "lastYear":
        // Ultimul an (de la 1 ianuarie până la 31 decembrie)
        start = new Date(today.getFullYear() - 1, 0, 1); // 1 ianuarie anul trecut
        end = new Date(today.getFullYear() - 1, 11, 31); // 31 decembrie anul trecut
        break;
      default:
        start = null;
        end = null;
    }

    setStartDate(start);
    setEndDate(end);

    // Actualizează label-ul intervalului selectat
    if (start && end) {
      setSelectedRangeLabel(
        `Interval selectat: ${start.toLocaleDateString()} - ${end.toLocaleDateString()}`
      );
    } else {
      setSelectedRangeLabel("");
    }

    const storedBets = JSON.parse(localStorage.getItem("betsByDate")) || {};
    processBetsData(storedBets, start, end);
  };

  // Actualizează intervalul atunci când se introduc date manuale
  const handleManualRangeSubmit = () => {
    const start = new Date(manualStartDate);
    const end = new Date(manualEndDate);

    if (start && end && start <= end) {
      setStartDate(start);
      setEndDate(end);

      // Actualizează label-ul intervalului selectat
      setSelectedRangeLabel(
        `Interval selectat: ${start.toLocaleDateString()} - ${end.toLocaleDateString()}`
      );

      // Re-procesează datele pentru noul interval
      const storedBets = JSON.parse(localStorage.getItem("betsByDate")) || {};
      processBetsData(storedBets, start, end);
    } else {
      alert(
        "Date invalide! Asigură-te că data de început este mai mică sau egală cu data de sfârșit."
      );
    }
  };

  return (
    <div className="p-4 bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-green-400">History</h1>

      {/* Selector de interval de timp */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Select Date Range</h2>
        <div className="flex flex-col space-y-4 max-w-xs mx-auto">
          {/* Calendar pentru selecția intervalului */}
          <div className="bg-gray-800 p-2 rounded-lg">
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

          {/* Input-uri manuale pentru interval */}
          <div className="flex flex-col space-y-2">
            <div className="flex flex-col">
              <label className="text-gray-400 mb-1">Data de început</label>
              <input
                type="date"
                value={manualStartDate}
                onChange={(e) => setManualStartDate(e.target.value)}
                className="bg-gray-800 text-white p-2 rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-400 mb-1">Data de sfârșit</label>
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

          {/* Butoane rapide pentru intervale comune */}
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => handleQuickRange("lastWeek")}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              Last Week (Mon-Sun)
            </button>
            <button
              onClick={() => handleQuickRange("lastMonth")}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              Last Month
            </button>
            <button
              onClick={() => handleQuickRange("lastYear")}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              Last Year
            </button>
          </div>

          {/* Label pentru intervalul selectat */}
          {selectedRangeLabel && (
            <div className="mt-2">
              <p className="text-green-400 text-sm">{selectedRangeLabel}</p>
            </div>
          )}
        </div>
      </div>

      {/* Grafic balanță */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Balance Evolution</h2>
        <div className="overflow-x-auto">
          <LineChart width={600} height={300} data={balanceData}>
            <XAxis dataKey="date" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <CartesianGrid stroke="#374151" strokeDasharray="5 5" />
            <Tooltip
              contentStyle={{ backgroundColor: "#1F2937", border: "none" }}
            />
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
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Profit & Loss</h2>
        <div className="overflow-x-auto">
          <BarChart width={600} height={300} data={profitLossData}>
            <XAxis dataKey="date" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <CartesianGrid stroke="#374151" strokeDasharray="5 5" />
            <Tooltip
              contentStyle={{ backgroundColor: "#1F2937", border: "none" }}
            />
            <Legend />
            <Bar dataKey="netProfitLoss" name="Result">
              {profitLossData.map((entry, index) => (
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
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Statistics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-800 rounded-lg">
            <p className="text-gray-400">Total Profit</p>
            <p className="text-green-400 text-xl">
              {balanceData.length > 0
                ? `${(
                    balanceData[balanceData.length - 1].balance - 200
                  ).toFixed(2)}€`
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
      <div className="mb-6">
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
              contentStyle={{ backgroundColor: "#1F2937", border: "none" }}
            />
            <Legend />
          </PieChart>
        </div>
      </div>

      {/* Istoric tranzacții */}
      <div>
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
    </div>
  );
};

export default History;
