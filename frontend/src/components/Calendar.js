import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const Calendar = () => {
  const [betsByDate, setBetsByDate] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [newBetTitle, setNewBetTitle] = useState("");
  const [bettingMarketsInputs, setBettingMarketsInputs] = useState({});
  const [bettingMarketsCotes, setBettingMarketsCotes] = useState({});
  const [editingBet, setEditingBet] = useState(null);
  const [editingBettingMarkets, setEditingBettingMarkets] = useState({
    betId: null,
    bettingMarketsIndex: null,
    newBettingMarketsName: "",
  });

  useEffect(() => {
    const storedBets = JSON.parse(localStorage.getItem("betsByDate"));
    if (storedBets) {
      setBetsByDate(storedBets);
    }
  }, []);

  useEffect(() => {
    if (Object.keys(betsByDate).length > 0) {
      localStorage.setItem("betsByDate", JSON.stringify(betsByDate));
    }
  }, [betsByDate]);

  const generateDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    let days = [];
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const adjustedFirstDayOfWeek = firstDayOfWeek === 0 ? 7 : firstDayOfWeek;

    for (let i = 0; i < adjustedFirstDayOfWeek - 1; i++) {
      days.push(null);
    }

    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const formattedDate = `${year}-${month + 1}-${day}`;
      days.push(formattedDate);
    }

    return days;
  };

  const addBet = () => {
    if (!newBetTitle.trim() || !selectedDate) return;
    const newBet = {
      id: Date.now().toString(),
      title: newBetTitle,
      bettingMarketss: [],
      status: "pending", // Statusul inițial al betului
    };

    setBetsByDate((prev) => ({
      ...prev,
      [selectedDate]: [...(prev[selectedDate] || []), newBet],
    }));

    setNewBetTitle("");
  };

  const deleteBet = (betId) => {
    setBetsByDate((prev) => ({
      ...prev,
      [selectedDate]: prev[selectedDate].filter((bet) => bet.id !== betId),
    }));
  };

  const updateBet = (betId, updatedTitle) => {
    setBetsByDate((prev) => {
      const updatedBets = (prev[selectedDate] || []).map((bet) =>
        bet.id === betId ? { ...bet, title: updatedTitle } : bet
      );
      return { ...prev, [selectedDate]: updatedBets };
    });
    setEditingBet(null);
  };

  const handleBettingMarketsInputChange = (betId, value) => {
    // Limitează input-ul la 50 de caractere
    if (value.length <= 50) {
      setBettingMarketsInputs((prev) => ({ ...prev, [betId]: value }));
    }
  };

  const handleBettingMarketsCoteChange = (
    betId,
    bettingMarketsIndex,
    value
  ) => {
    // Înlocuiește virgula cu punctul pentru a permite punctul decimal
    value = value.replace(",", ".");

    // Permite doar două zecimale
    const parts = value.split(".");
    if (parts.length > 1 && parts[1].length > 2) {
      return; // Nu permite să introduci mai mult de două zecimale
    }

    // Actualizează valoarea
    setBettingMarketsCotes((prev) => ({
      ...prev,
      [betId]: {
        ...prev[betId],
        [bettingMarketsIndex]: parseFloat(value),
      },
    }));
  };

  const addBettingMarketsToBet = (betId) => {
    const bettingMarkets = bettingMarketsInputs[betId]?.trim();
    if (!bettingMarkets) return;

    setBetsByDate((prev) => {
      const updatedBets = (prev[selectedDate] || []).map((bet) =>
        bet.id === betId
          ? {
              ...bet,
              bettingMarketss: [
                ...bet.bettingMarketss,
                { bettingMarkets, status: "pending" },
              ],
            }
          : bet
      );
      return { ...prev, [selectedDate]: updatedBets };
    });

    setBettingMarketsInputs((prev) => ({ ...prev, [betId]: "" }));
  };

  const deleteBettingMarkets = (betId, bettingMarketsIndex) => {
    setBetsByDate((prev) => {
      const updatedBets = (prev[selectedDate] || []).map((bet) =>
        bet.id === betId
          ? {
              ...bet,
              bettingMarketss: bet.bettingMarketss.filter(
                (_, index) => index !== bettingMarketsIndex
              ),
            }
          : bet
      );
      return { ...prev, [selectedDate]: updatedBets };
    });

    setBettingMarketsCotes((prev) => {
      const updatedCotes = { ...prev };
      delete updatedCotes[betId][bettingMarketsIndex];
      return updatedCotes;
    });
  };

  const updateBettingMarketsStatus = (betId, bettingMarketsIndex, status) => {
    setBetsByDate((prev) => {
      const updatedBets = (prev[selectedDate] || []).map((bet) =>
        bet.id === betId
          ? {
              ...bet,
              bettingMarketss: bet.bettingMarketss.map(
                (bettingMarkets, index) =>
                  index === bettingMarketsIndex
                    ? { ...bettingMarkets, status }
                    : bettingMarkets
              ),
            }
          : bet
      );
      return { ...prev, [selectedDate]: updatedBets };
    });
  };

  const updateBettingMarketsName = (betId, bettingMarketsIndex) => {
    setBetsByDate((prev) => {
      const updatedBets = (prev[selectedDate] || []).map((bet) =>
        bet.id === betId
          ? {
              ...bet,
              bettingMarketss: bet.bettingMarketss.map(
                (bettingMarkets, index) =>
                  index === bettingMarketsIndex
                    ? {
                        ...bettingMarkets,
                        bettingMarkets:
                          editingBettingMarkets.newBettingMarketsName,
                      }
                    : bettingMarkets
              ),
            }
          : bet
      );
      return { ...prev, [selectedDate]: updatedBets };
    });
    setEditingBettingMarkets({
      betId: null,
      bettingMarketsIndex: null,
      newBettingMarketsName: "",
    });
  };

  const calculateTotalCote = (betId) => {
    const bettingMarketssCotes = bettingMarketsCotes[betId] || {};
    return Object.values(bettingMarketssCotes).reduce(
      (total, cote) => total * cote,
      1
    );
  };

  const calculateBetStatus = (bettingMarketss) => {
    const hasLost = bettingMarketss.some(
      (bettingMarkets) => bettingMarkets.status === "lost"
    );
    const allWon = bettingMarketss.every(
      (bettingMarkets) => bettingMarkets.status === "won"
    );

    if (hasLost) return "lost";
    if (allWon) return "won";
    return "pending";
  };

  const goToPreviousMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const hasBets = (date) => {
    return (betsByDate[date] || []).length > 0;
  };

  return (
    <div className="max-w-4xl mx-auto bg-gradient-to-b from-blue-200 via-white to-blue-100 shadow-xl rounded-2xl p-8">
      <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">
        Betting Calendar
      </h1>
      <div className="flex justify-between items-center mb-6">
        <button
          className="text-2xl text-gray-600 hover:text-blue-500 transition duration-200"
          onClick={goToPreviousMonth}
        >
          ←
        </button>
        <span className="text-xl font-medium text-gray-700">
          {currentDate.toLocaleString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </span>
        <button
          className="text-2xl text-gray-600 hover:text-blue-500 transition duration-200"
          onClick={goToNextMonth}
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {weekDays.map((day) => (
          <div key={day} className="text-center font-medium text-gray-700">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {generateDays().map((date, index) => (
          <div
            key={index}
            onClick={() => date && setSelectedDate(date)}
            className={`cursor-pointer p-2 rounded-lg text-center ${
              date ? "bg-white shadow-lg" : "bg-transparent"
            } ${date && selectedDate === date ? "ring-2 ring-cyan-600" : ""} ${
              date && hasBets(date) ? "bg-yellow-100" : ""
            }`}
          >
            {date ? date.split("-")[2] : ""}
            {date && betsByDate[date]?.length > 0 && (
              <div className="mt-2 text-xs text-gray-600">
                {betsByDate[date].length} Bets
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedDate && (
        <div className="mt-6">
          <h2 className="text-xl font-medium text-gray-800 mb-4">
            Betting Markets for {selectedDate}
          </h2>
          <input
            type="text"
            value={newBetTitle}
            onChange={(e) => setNewBetTitle(e.target.value)}
            placeholder="New bet title"
            className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
          />
          <button
            onClick={addBet}
            className="w-full py-2 bg-blue-600 text-white rounded-lg"
          >
            Add Bet
          </button>

          <div className="mt-6">
            {betsByDate[selectedDate]?.map((bet) => (
              <div
                key={bet.id}
                className="shadow-lg rounded-lg p-4 bg-white mb-4"
              >
                {editingBet === bet.id ? (
                  <div className="flex flex-col">
                    <input
                      type="text"
                      defaultValue={bet.title}
                      onBlur={(e) => updateBet(bet.id, e.target.value.trim())}
                      className="border rounded p-2 mb-2"
                    />
                    <button
                      onClick={() => setEditingBet(null)}
                      className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <h3 className="text-xl font-semibold text-gray-700 mb-2 flex items-center justify-between">
                    {bet.title}
                    <div className="flex gap-2">
                      <FaEdit
                        onClick={() => setEditingBet(bet.id)}
                        className="text-blue-600 cursor-pointer hover:text-blue-800"
                      />
                      <FaTrash
                        onClick={() => deleteBet(bet.id)}
                        className="text-red-600 cursor-pointer hover:text-red-800"
                      />
                    </div>
                  </h3>
                )}
                <div className="mt-4">
                  {bet.bettingMarketss.map((bettingMarkets, index) => (
                    <div
                      key={index}
                      className="flex items-center mb-2 justify-between"
                    >
                      <select
                        value={bettingMarkets.status}
                        onChange={(e) =>
                          updateBettingMarketsStatus(
                            bet.id,
                            index,
                            e.target.value
                          )
                        }
                        className="bg-gray-200 p-1 rounded-lg"
                      >
                        <option value="pending">Pending</option>
                        <option value="won">WON</option>
                        <option value="lost">LOST</option>
                      </select>
                      {editingBettingMarkets.betId === bet.id &&
                      editingBettingMarkets.bettingMarketsIndex === index ? (
                        <input
                          type="text"
                          value={editingBettingMarkets.newBettingMarketsName}
                          onChange={(e) =>
                            setEditingBettingMarkets({
                              ...editingBettingMarkets,
                              newBettingMarketsName: e.target.value,
                            })
                          }
                          onBlur={() => updateBettingMarketsName(bet.id, index)}
                          className="ml-2 p-1 border rounded"
                        />
                      ) : (
                        <span
                          className={`${
                            bettingMarkets.status === "won"
                              ? "text-green-600 font-bold"
                              : bettingMarkets.status === "lost"
                              ? "text-red-600 font-bold"
                              : "text-gray-600"
                          }`}
                        >
                          {bettingMarkets.bettingMarkets}
                        </span>
                      )}

                      {/* Cota pentru BettingMarkets */}
                      <div className="flex items-center gap-2 ml-4">
                        <input
                          type="number"
                          value={bettingMarketsCotes[bet.id]?.[index] || ""}
                          onChange={(e) =>
                            handleBettingMarketsCoteChange(
                              bet.id,
                              index,
                              e.target.value
                            )
                          }
                          onBlur={(e) => {
                            const updatedValue = e.target.value.replace(
                              ",",
                              "."
                            );
                            handleBettingMarketsCoteChange(
                              bet.id,
                              index,
                              updatedValue
                            );
                          }}
                          placeholder="Odds"
                          className="w-20 p-1 border border-gray-300 rounded-lg ml-4"
                        />

                        {/* <div className="flex gap-2"> */}
                        <FaEdit
                          onClick={() =>
                            setEditingBettingMarkets({
                              betId: bet.id,
                              bettingMarketsIndex: index,
                              newBettingMarketsName:
                                bettingMarkets.bettingMarkets,
                            })
                          }
                          className="text-blue-600 cursor-pointer hover:text-blue-800 ml-2"
                        />
                        <FaTrash
                          onClick={() => deleteBettingMarkets(bet.id, index)}
                          className="text-red-600 cursor-pointer hover:text-red-800"
                        />
                      </div>
                    </div>
                  ))}
                  <input
                    type="text"
                    value={bettingMarketsInputs[bet.id] || ""}
                    onChange={(e) =>
                      handleBettingMarketsInputChange(bet.id, e.target.value)
                    }
                    placeholder="Add betting markets"
                    className="w-full p-2 border border-gray-300 rounded-lg mt-4"
                  />
                  <button
                    onClick={() => addBettingMarketsToBet(bet.id)}
                    className="w-full py-2 bg-blue-600 text-white rounded-lg mt-2"
                  >
                    Add Betting Markets
                  </button>

                  {/* Cota Totală pe aceeași linie cu statusul betului */}
                  {bet.bettingMarketss.length > 0 && (
                    <div className="mt-4 flex items-center justify-between">
                      <span>
                        Status:{" "}
                        {calculateBetStatus(bet.bettingMarketss).toUpperCase()}
                      </span>
                      <span className="font-semibold text-gray-800">
                        Odds: {calculateTotalCote(bet.id).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
