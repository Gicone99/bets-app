import React, { useState, useEffect, useContext } from "react";
import {
  FaEdit,
  FaTrash,
  FaUser,
  FaHome,
  FaHistory,
  FaRProject,
  FaFutbol,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { BalanceContext } from "../context/BalanceContext";
import { ProjectsContext } from "../context/ProjectsContext";
import { UserContext } from "../context/UserContext";

const EditBetPopup = ({
  onClose,
  onSubmit,
  existingTitle,
  betId,
  existingStake,
  balance,
  projects,
}) => {
  const [title, setTitle] = useState(existingTitle || "");
  const [stake, setStake] = useState(existingStake || "");
  const [selectedProject, setSelectedProject] = useState(() => {
    return projects.find((project) => project.name === existingTitle) || null;
  });

  const handleStakeChange = (e) => {
    let newStake = e.target.value;
    newStake = newStake.replace(",", ".");
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

    const newStake = parseFloat(stake);
    if (newStake > balance) {
      alert("Insufficient funds! Your balance is " + balance);
      return;
    }

    onSubmit(betId, title, newStake);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50 text-center">
      <div className="bg-gradient-to-b from-gray-900 via-black to-gray-900 rounded-lg shadow-2xl p-6 w-96">
        <h2 className="text-2xl font-bold text-green-400 mb-4">Bet Title</h2>
        <select
          value={selectedProject ? selectedProject.id : ""}
          onChange={(e) => {
            const project = projects.find(
              (p) => p.id.toString() === e.target.value
            );
            setSelectedProject(project);
            setTitle(project?.name || "");
          }}
          className="w-full p-3 mb-4 border-2 border-green-400 rounded-lg bg-gray-800 text-white text-center"
        >
          <option value="">Select a project</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
        <h2 className="text-2xl font-bold text-green-400 mb-4">Stake</h2>
        <input
          type="text"
          value={stake}
          onChange={handleStakeChange}
          placeholder="Enter stake"
          className="w-full p-3 border-2 border-green-400 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500 mb-6 text-center"
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
  const { balance, setBalance } = useContext(BalanceContext);
  const { user, setUser } = useContext(UserContext);
  const { projects, setProjects } = useContext(ProjectsContext);
  const [selectedProject, setSelectedProject] = useState(null);

  const navigate = useNavigate();
  const handleHomeClick = () => navigate("/");
  const handleHistoryClick = () => navigate("/history");
  const handleProjectsClick = () => navigate("/projects");
  const handleUserIconClick = () => navigate("/profile");
  const handleMatchesClick = () => navigate("/livematches");

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

  // Încărcăm proiectele din localStorage
  useEffect(() => {
    const storedProjects = JSON.parse(localStorage.getItem("projects"));
    if (storedProjects) {
      setProjects(storedProjects);
    }
  }, []);

  // Salvăm proiectele la fiecare modificare
  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  const handleProjectSelect = (project) => {
    if (project) {
      setSelectedProject(project);
      setNewBetTitle(project.name);
    } else {
      setSelectedProject(null);
      setNewBetTitle("");
    }
  };

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

  const handleReadyClick = (betId) => {
    setBetsByDate((prev) => {
      const updatedBets = { ...prev };
      const betList = updatedBets[selectedDate] || [];
      const betToUpdate = betList.find((bet) => bet.id === betId);

      if (!betToUpdate) {
        console.warn("Pariul nu a fost găsit!");
        return prev;
      }

      // Verificăm dacă stake-ul este 0
      if (parseFloat(betToUpdate.stake) === 0) {
        alert("Stake must not be 0!");
        return prev;
      }

      // Verificăm dacă există cel puțin un betting market
      if (betToUpdate.bettingMarkets.length === 0) {
        alert("Betting market must not be empty!");
        return prev;
      }

      // Verificăm dacă există cel puțin un betting market cu statusul "PENDING"
      const hasPendingMarkets = betToUpdate.bettingMarkets.some(
        (market) => market.status === "PENDING"
      );
      if (hasPendingMarkets) {
        alert("Bet cannot be closed because status is pending");
        return prev;
      }

      // Calculăm statusul, total odds și winnings
      const updatedStatus = calculateBetStatus(betToUpdate.bettingMarkets);
      const totalOdds = betToUpdate.bettingMarkets.reduce((acc, market) => {
        const odds = parseFloat(market.odds);
        return acc * odds;
      }, 1);

      const stake = parseFloat(betToUpdate.stake) || 0;
      const winnings =
        updatedStatus === "LOST" || updatedStatus === "PENDING"
          ? 0
          : updatedStatus === "WON"
          ? stake * totalOdds
          : 0;

      // Actualizăm balanța doar dacă pariul este câștigător și nu a fost deja procesat
      if (updatedStatus === "WON" && !betToUpdate.isReady) {
        setBalance((prevBalance) => prevBalance + winnings);
      }

      // Actualizăm starea bet-ului
      betToUpdate.isReady = true;
      betToUpdate.updatedStatus = updatedStatus;
      betToUpdate.totalOdds = totalOdds;
      betToUpdate.winnings = winnings;

      return updatedBets;
    });
  };

  // Deschide popup-ul pentru a adăuga/edita o piață de pariu
  const editBettingMarket = (betId, marketId) => {
    // const bet = betsByDate[selectedDate].find((bet) => bet.id === betId);
    // const market = bet.bettingMarkets.find((market) => market.id === marketId);
    setPopupBetId(betId);
    setPopupMarketId(marketId);
    setShowPopup(true);
  };

  const getProfitLossColor = (profitLoss) => {
    if (profitLoss > 0) return "text-green-500"; // Verde pentru profit
    if (profitLoss < 0) return "text-red-500"; // Roșu pentru pierdere
    return "text-gray-400"; // Gri pentru nici profit, nici pierdere
  };

  const getProfitLossLabel = (profitLoss) => {
    if (profitLoss > 0) return "Today's Profit"; // Profit
    if (profitLoss < 0) return "Today's Loss"; // Loss
    return "Today's Result"; // Default (no profit, no loss)
  };

  const calculateDailyProfitLoss = (date) => {
    const bets = betsByDate[date] || [];
    let totalProfitLoss = 0;

    bets.forEach((bet) => {
      if (bet.isReady) {
        if (bet.updatedStatus === "WON") {
          totalProfitLoss += bet.winnings - bet.stake;
        } else if (bet.updatedStatus === "LOST") {
          totalProfitLoss -= bet.stake;
        }
      }
    });

    return totalProfitLoss;
  };

  // Adăugarea unui nou pariu cu actualizarea balansului
  const addBet = () => {
    if (!newBetTitle.trim() || !selectedDate || !selectedProject) return;

    const newBet = {
      id: Date.now().toString(),
      title: newBetTitle,
      status: "PENDING",
      bettingMarkets: [],
      stake: 0, // Stake-ul inițial este 0
      isReady: false, // Starea inițială pentru butonul "Close Bet"
      updatedStatus: "PENDING", // Statusul actualizat
      totalOdds: 1, // Total odds inițial
      winnings: 0, // Câștiguri inițiale
    };

    setBetsByDate((prev) => ({
      ...prev,
      [selectedDate]: [...(prev[selectedDate] || []), newBet],
    }));

    setNewBetTitle("");
    setSelectedProject(null); // Resetează selecția proiectului după adăugarea pariului
  };

  // Salvarea unei piețe de pariu cu actualizarea balansului
  const submitBettingMarket = (
    betId,
    marketId,
    bettingMarket,
    status,
    odds
  ) => {
    setBetsByDate((prev) => {
      const updatedBets = { ...prev };

      Object.keys(updatedBets).forEach((date) => {
        updatedBets[date] = updatedBets[date].map((bet) => {
          if (bet.id === betId) {
            if (marketId) {
              // Actualizare piață de pariu existentă
              bet.bettingMarkets = bet.bettingMarkets.map((market) =>
                market.id === marketId
                  ? { ...market, title: bettingMarket, status, odds }
                  : market
              );
            } else {
              // Adăugare piață de pariu nouă
              bet.bettingMarkets.push({
                id: Date.now().toString(),
                title: bettingMarket,
                status,
                odds,
              });
            }
          }
          return bet;
        });
      });

      return updatedBets;
    });
  };

  // Actualizarea titlului și balansului când se editează un pariu
  const editBetTitle = (betId, newTitle, newStake) => {
    setBetsByDate((prev) => ({
      ...prev,
      [selectedDate]: prev[selectedDate].map((bet) => {
        if (bet.id === betId) {
          const currentStake = bet.stake || 0;

          // Verificăm dacă noua valoare a stake-ului este validă
          if (newStake !== undefined) {
            const stakeDifference = newStake - currentStake;

            // Verificăm dacă balanța este suficientă
            if (balance - stakeDifference < 0) {
              alert("Insufficient funds! Your balance is " + balance);
              return bet; // Nu actualizăm dacă fondurile sunt insuficiente
            }

            // Actualizăm balanța
            setBalance((prevBalance) => prevBalance - stakeDifference);
            bet.stake = newStake;
          }

          return { ...bet, title: newTitle };
        }
        return bet;
      }),
    }));
  };

  // Ștergerea unui pariu
  const deleteBet = (betId) => {
    // Obținem lista de pariuri pentru data selectată
    const betList = betsByDate[selectedDate] || [];
    const betToDelete = betList.find((bet) => bet.id === betId);

    if (!betToDelete) {
      console.warn("Pariul nu a fost găsit!");
      return;
    }

    const stakeToAddBack = parseFloat(betToDelete.stake) || 0;
    const winningsToSubtract = parseFloat(betToDelete.winnings) || 0; // Obținem câștigurile bet-ului

    // Verificăm dacă balanța ar deveni negativă după ștergere
    const newBalance = balance + stakeToAddBack - winningsToSubtract;
    if (newBalance < 0) {
      alert(
        "Operation not possible due to negative balance! Your balance cannot be " +
          newBalance
      );
      return; // Nu continuăm dacă balanța ar deveni negativă
    }

    // Ștergem pariul din lista de bets
    setBetsByDate((prev) => {
      const updatedBets = { ...prev };
      updatedBets[selectedDate] = betList.filter((bet) => bet.id !== betId);
      return updatedBets;
    });

    // Actualizăm balanța
    setBalance(newBalance);
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
      <div className="flex justify-between items-center mb-6">
        {/* Butoanele din stânga */}
        <div className="flex space-x-4">
          <button
            onClick={handleHomeClick}
            className="flex items-center text-green-400 hover:text-green-500 transition duration-200"
          >
            <FaHome className="mr-2" /> Home
          </button>
          <button
            onClick={handleHistoryClick}
            className="flex items-center text-green-400 hover:text-green-500 transition duration-200"
          >
            <FaHistory className="mr-2" /> History
          </button>

          <button
            onClick={handleProjectsClick}
            className="flex items-center text-green-400 hover:text-green-500 transition duration-200"
          >
            <FaRProject className="mr-2" /> Projects
          </button>

          <button
            onClick={handleMatchesClick}
            className="flex items-center text-green-400 hover:text-green-500 transition duration-200"
          >
            <FaFutbol className="mr-2" /> Live Matches
          </button>

          {/* Butonul pentru User și Balance în dreapta */}
          <button
            onClick={handleUserIconClick}
            className="flex items-center text-green-400 hover:text-green-500 transition duration-200"
          >
            <FaUser className="mr-2" /> Profile
          </button>
        </div>
        <span className="text-right text-green-400">
          {(() => {
            return `Balance: ${Number(user?.balance || 0).toFixed(2)}`;
          })()}
        </span>
        <span className="text-green-400">User: {user.username}</span>
      </div>
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
        {generateDays().map((date, index) => {
          const profitLoss = date ? calculateDailyProfitLoss(date) : 0;
          const bgColor =
            profitLoss > 0
              ? "bg-green-500"
              : profitLoss < 0
              ? "bg-red-500"
              : "bg-gray-800";

          return (
            <div
              key={index}
              onClick={() => date && setSelectedDate(date)}
              className={`cursor-pointer p-2 rounded-lg text-center ${
                date ? bgColor : "bg-transparent"
              } ${
                date && selectedDate === date ? "ring-2 ring-green-400" : ""
              }`}
            >
              {date ? date.split("-")[2] : ""}
              {date && betsByDate[date]?.length > 0 && (
                <div className="mt-2 text-xs text-gray-500">
                  {betsByDate[date].length} Bets
                </div>
              )}
            </div>
          );
        })}
      </div>
      {selectedDate && (
        <div className="mt-10">
          <h2 className="text-xl font-medium text-green-400 mb-4 text-center">
            Betting Markets for {selectedDate}
          </h2>
          <div className="flex justify-between gap-8">
            <select
              value={selectedProject ? selectedProject.id : ""}
              onChange={(e) => {
                const projectId = e.target.value;
                const project = projects.find(
                  (p) => p.id.toString() === projectId
                );
                console.log(
                  "Selected project ID:",
                  projectId,
                  "Project:",
                  project
                ); // Debug
                setSelectedProject(project || null);
                setNewBetTitle(project?.name || "");
              }}
              className="w-full p-3 mb-4 border-2 border-green-400 rounded-lg bg-gray-800 text-white text-center"
            >
              <option value="">Select a project</option>
              {Array.isArray(projects) &&
                projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
            </select>
            {selectedProject && (
              <button
                onClick={() => {
                  setSelectedProject(null);
                  setNewBetTitle("");
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-6 rounded-lg focus:outline-none mb-4 whitespace-nowrap"
              >
                Clear Selection
              </button>
            )}
            <button
              onClick={addBet}
              className="bg-green-600 hover:bg-green-700 text-white px-6 rounded-lg focus:outline-none mb-4 whitespace-nowrap"
            >
              Add Bet
            </button>
          </div>
          <div className="mt-4">
            {betsByDate[selectedDate]?.map((bet) => {
              const { updatedStatus, totalOdds, winnings } = bet;

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
                        {bet.stake.toFixed(2)}
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
                      <div>
                        {!bet.isReady && (
                          <button
                            onClick={() => {
                              setEditBetId(bet.id);
                              setShowEditPopup(true);
                            }}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <FaEdit />
                          </button>
                        )}
                      </div>
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

                            <div className="flex space-x-4 ml-4">
                              {!bet.isReady && (
                                <>
                                  <button
                                    onClick={() =>
                                      editBettingMarket(bet.id, market.id)
                                    }
                                    className="text-blue-600 hover:text-blue-800"
                                  >
                                    <FaEdit />
                                  </button>
                                  <button
                                    onClick={() =>
                                      deleteBettingMarket(bet.id, market.id)
                                    }
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <FaTrash />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-6 border-t border-gray-600 pt-4"></div>
                  <div className="flex justify-between items-center mt-4 space-x-4">
                    <div className="flex text-left justify-between gap-16">
                      {bet.isReady ? (
                        <button
                          className="bg-gray-600 text-white py-2 px-4 rounded-lg focus:outline-none"
                          disabled
                        >
                          Done
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReadyClick(bet.id)}
                          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg focus:outline-none"
                        >
                          Close Bet
                        </button>
                      )}

                      {!bet.isReady && (
                        <button
                          onClick={() => editBettingMarket(bet.id, null)}
                          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg focus:outline-none"
                        >
                          Add Betting Market
                        </button>
                      )}
                    </div>

                    <div className="flex justify-between gap-12">
                      <div className="text-right">
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

                      <div className="text-right">
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
          existingStake={
            betsByDate[selectedDate]?.find((bet) => bet.id === editBetId)?.stake
          }
          balance={balance}
          projects={projects} // Trimitem lista de proiecte
        />
      )}
      {calculateDailyProfitLoss(selectedDate) !== 0 && (
        <div
          className={`text-xl font-medium mb-6 text-right ${getProfitLossColor(
            calculateDailyProfitLoss(selectedDate)
          )}`}
        >
          <hr></hr>
          <br></br>
          {getProfitLossLabel(calculateDailyProfitLoss(selectedDate))}:{" "}
          {calculateDailyProfitLoss(selectedDate).toFixed(2)}
        </div>
      )}
    </div>
  );
};

export default Calendar;
