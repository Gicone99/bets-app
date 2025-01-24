import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const EditBetPopup = ({
  onClose,
  onSubmit,
  existingTitle,
  betId,
  existingStake,
}) => {
  const [title, setTitle] = useState(existingTitle || "");
  const [stake, setStake] = useState(existingStake || "");

  const handleStakeChange = (e) => {
    let newStake = e.target.value;

    // Replace comma with period for decimal points
    newStake = newStake.replace(",", ".");

    // Allow only numeric input and two decimal places
    const regex = /^\d*\.?\d{0,2}$/;
    if (regex.test(newStake)) {
      setStake(newStake);
    }
  };

  const handleSubmit = () => {
    if (!title.trim() || !stake.trim()) {
      alert("Title and Stake cannot be empty");
      return;
    }
    onSubmit(betId, title, stake);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50 text-center">
      <div className="bg-gradient-to-b from-gray-900 via-black to-gray-900 rounded-lg shadow-2xl p-6 w-96">
        <h2 className="text-2xl font-bold text-green-400 mb-4">Bet Title</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter new title"
          className="w-full p-3 border-2 border-green-400 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
        />
        <h2 className="text-2xl font-bold text-green-400 mb-4">Stake</h2>
        <input
          type="text"
          value={stake}
          onChange={handleStakeChange}
          placeholder="Enter stake"
          className="w-full p-3 border-2 border-green-400 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500 mb-6"
        />
        <div className="flex justify-between gap-8">
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105 shadow-md w-1/2"
          >
            Submit
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition duration-300 ease-in-out transform hover:scale-105 shadow-md w-1/2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Popup pentru adăugarea/editarera unei piețe de pariu
const Popup = ({ onClose, onSubmit, betId, marketId, existingMarket }) => {
  const [bettingMarket, setBettingMarket] = useState(
    existingMarket?.title || ""
  );
  const [status, setStatus] = useState(existingMarket?.status || "PENDING");
  const [odds, setOdds] = useState(existingMarket?.odds || "");

  const handleSubmit = () => {
    if (!bettingMarket.trim() || !odds.trim()) {
      alert("Please fill all fields");
      return;
    }
    onSubmit(betId, marketId, bettingMarket, status, odds);
    onClose();
  };

  const handlebettingMarketChange = (e) => {
    const newbettingMarket = e.target.value;
    // Limitează la 50 de caractere
    if (newbettingMarket.length <= 50) {
      setBettingMarket(newbettingMarket);
    }
  };

  const handleOddsChange = (e) => {
    let newOdds = e.target.value;

    // Înlocuiește virgula cu punct
    newOdds = newOdds.replace(",", ".");

    // Permite doar numere și până la 2 zecimale
    const regex = /^\d*\.?\d{0,2}$/;
    if (regex.test(newOdds)) {
      setOdds(newOdds);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50 text-center">
      <div className="bg-gradient-to-b from-gray-900 via-black to-gray-900 rounded-lg shadow-2xl p-6 w-96">
        <div className="mb-6">
          <label className="block text-xl font-bold text-green-400 mb-2">
            Betting Market
          </label>
          <input
            type="text"
            placeholder="Enter market name"
            value={bettingMarket}
            onChange={handlebettingMarketChange}
            className="place-items-center w-full p-3 border-2 border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-800 text-white"
          />
        </div>

        <div className="flex justify-between mb-6">
          <div className="w-48">
            <label className="block text-xl font-bold text-green-400 mb-2">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="place-items-center w-full p-3 border-2 border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-800 text-white"
            >
              <option value="PENDING">PENDING</option>
              <option value="WON">WON</option>
              <option value="LOST">LOST</option>
            </select>
          </div>
          <div className="w-24 ml-6">
            <label className="block text-xl font-bold text-green-400 mb-2">
              Odds
            </label>
            <input
              type="text"
              placeholder="Enter odds"
              value={odds}
              onChange={handleOddsChange}
              className="place-items-center w-full p-3 border-2 border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-800 text-white"
            />
          </div>
        </div>

        <div className="flex justify-between gap-8 mt-10">
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105 shadow-md w-1/2"
          >
            Submit
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition duration-300 ease-in-out transform hover:scale-105 shadow-md w-1/2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Componenta principală Calendar
const Calendar = () => {
  const [betsByDate, setBetsByDate] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [newBetTitle, setNewBetTitle] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupBetId, setPopupBetId] = useState(null);
  const [popupMarketId, setPopupMarketId] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editBetId, setEditBetId] = useState(null);

  // Încărcăm pariurile din localStorage
  useEffect(() => {
    const storedBets = JSON.parse(localStorage.getItem("betsByDate"));
    if (storedBets) {
      setBetsByDate(storedBets);
    }
  }, []);

  // Salvăm pariurile la fiecare modificare
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

  // Adăugarea unui nou pariu
  const addBet = () => {
    if (!newBetTitle.trim() || !selectedDate) return;

    const newBet = {
      id: Date.now().toString(),
      title: newBetTitle,
      status: "PENDING",
      bettingMarkets: [],
    };

    setBetsByDate((prev) => ({
      ...prev,
      [selectedDate]: [...(prev[selectedDate] || []), newBet],
    }));

    setNewBetTitle("");
  };

  // Deschide popup-ul pentru a adăuga/edita o piață de pariu
  const editBettingMarket = (betId, marketId) => {
    const bet = betsByDate[selectedDate].find((bet) => bet.id === betId);
    const market = bet.bettingMarkets.find((market) => market.id === marketId);
    setPopupBetId(betId);
    setPopupMarketId(marketId);
    setShowPopup(true);
  };

  // Salvează piața de pariu (adăugare/actualizare)
  const submitBettingMarket = (
    betId,
    marketId,
    bettingMarket,
    status,
    odds,
    stake
  ) => {
    setBetsByDate((prev) => {
      const updatedBets = { ...prev };
      Object.keys(updatedBets).forEach((date) => {
        updatedBets[date] = updatedBets[date].map((bet) => {
          if (bet.id === betId) {
            if (marketId) {
              bet.bettingMarkets = bet.bettingMarkets.map((market) =>
                market.id === marketId
                  ? { ...market, title: bettingMarket, status, odds }
                  : market
              );
            } else {
              bet.bettingMarkets.push({
                id: Date.now().toString(),
                title: bettingMarket,
                status,
                odds,
              });
            }
            bet.stake = stake; // Add stake value here
          }
          return bet;
        });
      });
      return updatedBets;
    });
  };

  // Ștergerea unui pariu
  const deleteBet = (betId) => {
    setBetsByDate((prev) => ({
      ...prev,
      [selectedDate]: prev[selectedDate].filter((bet) => bet.id !== betId),
    }));
  };

  const editBetTitle = (betId, newTitle) => {
    setBetsByDate((prev) => ({
      ...prev,
      [selectedDate]: prev[selectedDate].map((bet) =>
        bet.id === betId ? { ...bet, title: newTitle } : bet
      ),
    }));
  };

  // Ștergerea unei piețe de pariu
  const deleteBettingMarket = (betId, marketId) => {
    setBetsByDate((prev) => {
      const updatedBets = { ...prev };
      Object.keys(updatedBets).forEach((date) => {
        updatedBets[date] = updatedBets[date].map((bet) => {
          if (bet.id === betId) {
            bet.bettingMarkets = bet.bettingMarkets.filter(
              (market) => market.id !== marketId
            );
          }
          return bet;
        });
      });
      return updatedBets;
    });
  };

  // Mergi la luna precedentă
  const goToPreviousMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  // Mergi la luna următoare
  const goToNextMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const hasBets = (date) => {
    return (betsByDate[date] || []).length > 0;
  };

  const calculateBetStatus = (bettingMarkets) => {
    if (!bettingMarkets.length) {
      return "PENDING"; // biletele fara evenimente sunt în mod implicit "PENDING"
    }
    if (bettingMarkets.some((market) => market.status === "LOST")) {
      return "LOST";
    }
    if (bettingMarkets.every((market) => market.status === "WON")) {
      return "WON";
    }
    if (bettingMarkets.some((market) => market.status === "PENDING")) {
      return "PENDING";
    }
    return "unknown";
  };

  return (
    <div className="max-w-4xl mx-auto bg-gradient-to-b from-black via-gray-900 to-gray-900 shadow-xl rounded-2xl p-8">
      <h1 className="text-3xl font-semibold text-center mb-6 text-green-400">
        Betting Calendar
      </h1>
      <div className="flex justify-between items-center mb-6">
        <button
          className="text-2xl text-green-400 hover:text-blue-500 transition duration-200"
          onClick={goToPreviousMonth}
        >
          ←
        </button>
        <span className="text-xl font-medium text-green-400">
          {currentDate.toLocaleString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </span>
        <button
          className="text-2xl text-green-400 hover:text-blue-500 transition duration-200"
          onClick={goToNextMonth}
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {weekDays.map((day) => (
          <div key={day} className="text-center font-medium text-green-400">
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
              date ? "bg-gray-800 text-white" : "bg-transparent"
            } ${date && selectedDate === date ? "ring-2 ring-green-400" : ""} ${
              date && hasBets(date) ? "bg-green-500" : ""
            }`}
          >
            {date ? date.split("-")[2] : ""}
            {date && betsByDate[date]?.length > 0 && (
              <div className="mt-2 text-xs text-gray-500">
                {betsByDate[date].length} Bets
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedDate && (
        <div className="mt-10">
          <h2 className="text-xl font-medium text-green-400 mb-4 text-center">
            Betting Markets for {selectedDate}
          </h2>
          <input
            type="text"
            placeholder="Enter bet title"
            value={newBetTitle}
            onChange={(e) => setNewBetTitle(e.target.value)}
            className="w-full p-3 mb-4 border-2 border-green-400 rounded-lg bg-gray-800 text-white text-center"
          />
          <button
            onClick={addBet}
            className="w-full py-2 bg-green-600 text-white rounded-lg mb-4"
          >
            Add Bet
          </button>
          <div className="mt-4">
            {betsByDate[selectedDate]?.map((bet) => {
              // Calculăm statusul actualizat al pariului
              const updatedStatus = calculateBetStatus(bet.bettingMarkets);

              // Calculăm cotele totale
              const totalOdds = bet.bettingMarkets.reduce((acc, market) => {
                const odds = parseFloat(market.odds);
                return acc * odds; // Înmulțim cotele pentru a obține cota finală
              }, 1);

              // Calculate winnings for each bet if stake is provided
              const stake = parseFloat(bet.stake) || 0;
              const winnings = stake * totalOdds;

              return (
                <div
                  key={bet.id}
                  className="p-6 bg-gradient-to-b from-gray-800 via-gray-700 to-gray-800 text-white rounded-lg shadow-xl mb-4 flex flex-col"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-500">
                        Stake
                      </p>
                      <p
                        className={`text-sm ${
                          updatedStatus === "LOST"
                            ? "text-red-500"
                            : updatedStatus === "WON"
                            ? "text-green-500"
                            : "text-gray-300"
                        }`}
                      >
                        {stake.toFixed(2)}
                      </p>
                    </div>
                    <h3
                      className={`text-xl font-bold text-center flex-1 ${
                        updatedStatus === "LOST"
                          ? "text-red-500"
                          : updatedStatus === "WON"
                          ? "text-green-500"
                          : "text-gray-300"
                      }`}
                    >
                      {bet.title}
                    </h3>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => {
                          setEditBetId(bet.id);
                          setShowEditPopup(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => deleteBet(bet.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>

                  {bet.bettingMarkets.length > 0 && (
                    <div className="mt-4 space-y-3">
                      {bet.bettingMarkets.map((market) => (
                        <div
                          key={market.id}
                          className="p-4 bg-gradient-to-b from-gray-700 via-gray-600 to-gray-700 text-white rounded-lg shadow-md mb-4"
                        >
                          <div className="flex justify-between items-center mb-2">
                            {/* Status - Stânga */}
                            <div className="flex-1 text-left">
                              <label className="block font-semibold text-gray-500">
                                Status
                              </label>
                              <p
                                className={`${
                                  market.status === "LOST"
                                    ? "text-red-500"
                                    : market.status === "WON"
                                    ? "text-green-500"
                                    : "text-gray-300"
                                }`}
                              >
                                {market.status}
                              </p>
                            </div>

                            {/* Descriere Betting Market - Centrat */}
                            <div
                              className={`flex-1 text-sm text-center ${
                                market.status === "LOST"
                                  ? "text-red-500"
                                  : market.status === "WON"
                                  ? "text-green-500"
                                  : "text-gray-300"
                              }`}
                            >
                              <p>{market.title}</p>
                            </div>

                            {/* Odds - Dreapta */}
                            <div className="flex-1 text-right mr-6">
                              <label className="block font-semibold text-gray-500">
                                Odds
                              </label>
                              <p
                                className={`mr-2 ${
                                  market.status === "LOST"
                                    ? "text-red-500"
                                    : market.status === "WON"
                                    ? "text-green-500"
                                    : "text-gray-300"
                                }`}
                              >
                                {market.odds}
                              </p>
                            </div>

                            {/* Distanțare între Odds și Butoane */}
                            <div className="flex space-x-4 ml-4">
                              {/* Editare Betting Market */}
                              <button
                                onClick={() =>
                                  editBettingMarket(bet.id, market.id)
                                }
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <FaEdit />
                              </button>
                              {/* Ștergere Betting Market */}
                              <button
                                onClick={() =>
                                  deleteBettingMarket(bet.id, market.id)
                                }
                                className="text-red-600 hover:text-red-800"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-6 border-t border-gray-600 pt-4"></div>
                  <div className="flex justify-between items-center mt-4 space-x-4">
                    <div className="flex-1 text-left">
                      <p className="text-sm font-semibold text-gray-500">
                        Status
                      </p>
                      <p
                        className={`text-sm ${
                          updatedStatus === "LOST"
                            ? "text-red-500"
                            : updatedStatus === "WON"
                            ? "text-green-500"
                            : "text-gray-300"
                        }`}
                      >
                        {updatedStatus}
                      </p>
                    </div>

                    <div className="flex-1 text-center">
                      <button
                        onClick={() => editBettingMarket(bet.id, null)}
                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg focus:outline-none"
                      >
                        Add Betting Market
                      </button>
                    </div>

                    <div className="flex-1 text-right">
                      <p className="text-sm font-semibold text-gray-500">
                        Total Odds
                      </p>
                      <p
                        className={`text-sm ${
                          updatedStatus === "LOST"
                            ? "text-red-500"
                            : updatedStatus === "WON"
                            ? "text-green-500"
                            : "text-gray-300"
                        }`}
                      >
                        {totalOdds.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-500">
                        Winnings
                      </p>
                      <p
                        className={`text-sm ${
                          updatedStatus === "LOST"
                            ? "text-red-500"
                            : updatedStatus === "WON"
                            ? "text-green-500"
                            : "text-gray-300"
                        }`}
                      >
                        {winnings.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showPopup && (
        <Popup
          onClose={() => setShowPopup(false)}
          onSubmit={submitBettingMarket}
          betId={popupBetId}
          marketId={popupMarketId}
          existingMarket={
            popupMarketId &&
            betsByDate[selectedDate]
              .find((bet) => bet.id === popupBetId)
              .bettingMarkets.find((market) => market.id === popupMarketId)
          }
        />
      )}

      {showEditPopup && (
        <EditBetPopup
          onClose={() => setShowEditPopup(false)}
          onSubmit={editBetTitle}
          betId={editBetId}
          existingTitle={
            betsByDate[selectedDate]?.find((bet) => bet.id === editBetId)?.title
          }
        />
      )}
    </div>
  );
};

export default Calendar;
