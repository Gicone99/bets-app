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
import { SportsContext } from "../context/SportsContext";
import { FaBasketballBall } from "react-icons/fa";
import {
  MdOutlineSportsHandball,
  MdOutlineSportsRugby,
  MdOutlineSportsMartialArts,
  MdSportsTennis,
  MdSportsMotorsports,
  MdSportsGymnastics,
} from "react-icons/md";
import {
  GiHockey,
  GiVolleyballBall,
  GiBaseballBat,
  GiAmericanFootballBall,
  GiCricketBat,
  GiBoxingGlove,
  GiPingPongBat,
  GiTennisRacket,
  GiPoolTriangle,
  GiDart,
  GiGamepad,
  GiCycling,
  GiGolfFlag,
} from "react-icons/gi";

const sportIcons = {
  Football: <FaFutbol className="text-2xl mx-auto text-green-400" />,
  Basketball: <FaBasketballBall className="text-2xl mx-auto text-green-400" />,
  Tennis: <MdSportsTennis className="text-2xl mx-auto text-green-400" />,
  Hockey: <GiHockey className="text-2xl mx-auto text-green-400" />,
  Handball: (
    <MdOutlineSportsHandball className="text-2xl mx-auto text-green-400" />
  ),
  Volleyball: <GiVolleyballBall className="text-2xl mx-auto text-green-400" />,
  Baseball: <GiBaseballBat className="text-2xl mx-auto text-green-400" />,
  "American Football": (
    <GiAmericanFootballBall className="text-2xl mx-auto text-green-400" />
  ),
  Cricket: <GiCricketBat className="text-2xl mx-auto text-green-400" />,
  Motorsport: (
    <MdSportsMotorsports className="text-2xl mx-auto text-green-400" />
  ),
  Rugby: <MdOutlineSportsRugby className="text-2xl mx-auto text-green-400" />,
  "Other Sports": (
    <MdSportsGymnastics className="text-2xl mx-auto text-green-400" />
  ),
  Boxing: <GiBoxingGlove className="text-2xl mx-auto text-green-400" />,
  MMA: (
    <MdOutlineSportsMartialArts className="text-2xl mx-auto text-green-400" />
  ),
  "Table Tennis": <GiPingPongBat className="text-2xl mx-auto text-green-400" />,
  Badminton: <GiTennisRacket className="text-2xl mx-auto text-green-400" />,
  Snooker: <GiPoolTriangle className="text-2xl mx-auto text-green-400" />,
  Darts: <GiDart className="text-2xl mx-auto text-green-400" />,
  Esports: <GiGamepad className="text-2xl mx-auto text-green-400" />,
  Cycling: <GiCycling className="text-2xl mx-auto text-green-400" />,
  Golf: <GiGolfFlag className="text-2xl mx-auto text-green-400" />,
};

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

const Popup = ({ onClose, onSubmit, betId, marketId, existingMarket }) => {
  const [bettingMarket, setBettingMarket] = useState(
    existingMarket?.title || ""
  );
  const [status, setStatus] = useState(existingMarket?.status || "PENDING");
  const [odds, setOdds] = useState(existingMarket?.odds || "");
  const [selectedSport, setSelectedSport] = useState(
    existingMarket?.sport || "Football" // Default to Football
  );
  const { selectedSports } = useContext(SportsContext);

  // Get available sports based on user's selection
  const availableSports = [
    { id: 1, name: "Football" },
    { id: 2, name: "Basketball" },
    { id: 3, name: "Tennis" },
    { id: 4, name: "Hockey" },
    { id: 5, name: "Handball" },
    { id: 6, name: "Volleyball" },
    { id: 7, name: "Baseball" },
    { id: 8, name: "American Football" },
    { id: 9, name: "Cricket" },
    { id: 10, name: "Motorsport" },
    { id: 11, name: "Rugby" },
    { id: 12, name: "Other Sports" },
    { id: 13, name: "Boxing" },
    { id: 14, name: "MMA" },
    { id: 15, name: "Table Tennis" },
    { id: 16, name: "Badminton" },
    { id: 17, name: "Snooker" },
    { id: 18, name: "Darts" },
    { id: 19, name: "Esports" },
    { id: 20, name: "Cycling" },
    { id: 21, name: "Golf" },
  ].filter((sport) => selectedSports.includes(sport.id));

  // Set Football as default if available
  useEffect(() => {
    if (
      availableSports.some((sport) => sport.name === "Football") &&
      !selectedSport
    ) {
      setSelectedSport("Football");
    }
  }, [availableSports, selectedSport]);

  const handleSubmit = () => {
    if (!bettingMarket.trim() || !odds.trim()) {
      alert("Please fill all fields");
      return;
    }
    onSubmit(betId, marketId, bettingMarket, status, odds, selectedSport);
    onClose();
  };

  const handlebettingMarketChange = (e) => {
    const newbettingMarket = e.target.value;
    if (newbettingMarket.length <= 50) {
      setBettingMarket(newbettingMarket);
    }
  };

  const handleOddsChange = (e) => {
    let newOdds = e.target.value;
    newOdds = newOdds.replace(",", ".");
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
            Sport
          </label>
          <div className="flex flex-wrap gap-2 justify-center">
            {availableSports.map((sport) => (
              <div
                key={sport.id}
                onClick={() => setSelectedSport(sport.name)}
                className={`p-3 rounded-lg border-2 cursor-pointer ${
                  selectedSport === sport.name
                    ? "border-green-500 bg-green-500/10"
                    : "border-gray-600 bg-gray-700/50"
                }`}
                title={sport.name}
              >
                {sportIcons[sport.name] || sport.name}
              </div>
            ))}
          </div>
          {selectedSport && (
            <p className="text-green-400 mt-2">Selected: {selectedSport}</p>
          )}
        </div>

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
  const { selectedSports } = useContext(SportsContext);
  const [selectedProject, setSelectedProject] = useState(null);

  const navigate = useNavigate();
  const handleHomeClick = () => navigate("/");
  const handleHistoryClick = () => navigate("/history");
  const handleProjectsClick = () => navigate("/projects");
  const handleSportsClick = () => navigate("/sports");
  const handleUserIconClick = () => navigate("/profile");
  const handleMatchesClick = () => navigate("/livematches");

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

  useEffect(() => {
    const storedProjects = JSON.parse(localStorage.getItem("projects"));
    if (storedProjects) {
      setProjects(storedProjects);
    }
  }, []);

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

      if (parseFloat(betToUpdate.stake) === 0) {
        alert("Stake must not be 0!");
        return prev;
      }

      if (betToUpdate.bettingMarkets.length === 0) {
        alert("Betting market must not be empty!");
        return prev;
      }

      const hasPendingMarkets = betToUpdate.bettingMarkets.some(
        (market) => market.status === "PENDING"
      );
      if (hasPendingMarkets) {
        alert("Bet cannot be closed because status is pending");
        return prev;
      }

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

      if (updatedStatus === "WON" && !betToUpdate.isReady) {
        setBalance((prevBalance) => prevBalance + winnings);
      }

      betToUpdate.isReady = true;
      betToUpdate.updatedStatus = updatedStatus;
      betToUpdate.totalOdds = totalOdds;
      betToUpdate.winnings = winnings;

      return updatedBets;
    });
  };

  const editBettingMarket = (betId, marketId) => {
    setPopupBetId(betId);
    setPopupMarketId(marketId);
    setShowPopup(true);
  };

  const getProfitLossColor = (profitLoss) => {
    if (profitLoss > 0) return "text-green-500";
    if (profitLoss < 0) return "text-red-500";
    return "text-gray-400";
  };

  const getProfitLossLabel = (profitLoss) => {
    if (profitLoss > 0) return "Today's Profit";
    if (profitLoss < 0) return "Today's Loss";
    return "Today's Result";
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

  const addBet = () => {
    if (!newBetTitle.trim() || !selectedDate || !selectedProject) return;

    const newBet = {
      id: Date.now().toString(),
      title: newBetTitle,
      status: "PENDING",
      bettingMarkets: [],
      stake: 0,
      isReady: false,
      updatedStatus: "PENDING",
      totalOdds: 1,
      winnings: 0,
    };

    setBetsByDate((prev) => ({
      ...prev,
      [selectedDate]: [...(prev[selectedDate] || []), newBet],
    }));

    setNewBetTitle("");
    setSelectedProject(null);
  };

  const submitBettingMarket = (
    betId,
    marketId,
    bettingMarket,
    status,
    odds,
    sport
  ) => {
    setBetsByDate((prev) => {
      const updatedBets = { ...prev };

      Object.keys(updatedBets).forEach((date) => {
        updatedBets[date] = updatedBets[date].map((bet) => {
          if (bet.id === betId) {
            if (marketId) {
              bet.bettingMarkets = bet.bettingMarkets.map((market) =>
                market.id === marketId
                  ? { ...market, title: bettingMarket, status, odds, sport }
                  : market
              );
            } else {
              bet.bettingMarkets.push({
                id: Date.now().toString(),
                title: bettingMarket,
                status,
                odds,
                sport,
              });
            }
          }
          return bet;
        });
      });

      return updatedBets;
    });
  };

  const editBetTitle = (betId, newTitle, newStake) => {
    setBetsByDate((prev) => ({
      ...prev,
      [selectedDate]: prev[selectedDate].map((bet) => {
        if (bet.id === betId) {
          const currentStake = bet.stake || 0;

          if (newStake !== undefined) {
            const stakeDifference = newStake - currentStake;

            if (balance - stakeDifference < 0) {
              alert("Insufficient funds! Your balance is " + balance);
              return bet;
            }

            setBalance((prevBalance) => prevBalance - stakeDifference);
            bet.stake = newStake;
          }

          return { ...bet, title: newTitle };
        }
        return bet;
      }),
    }));
  };

  const deleteBet = (betId) => {
    const betList = betsByDate[selectedDate] || [];
    const betToDelete = betList.find((bet) => bet.id === betId);

    if (!betToDelete) {
      console.warn("Pariul nu a fost găsit!");
      return;
    }

    const stakeToAddBack = parseFloat(betToDelete.stake) || 0;
    const winningsToSubtract = parseFloat(betToDelete.winnings) || 0;

    const newBalance = balance + stakeToAddBack - winningsToSubtract;
    if (newBalance < 0) {
      alert(
        "Operation not possible due to negative balance! Your balance cannot be " +
          newBalance
      );
      return;
    }

    setBetsByDate((prev) => {
      const updatedBets = { ...prev };
      updatedBets[selectedDate] = betList.filter((bet) => bet.id !== betId);
      return updatedBets;
    });

    setBalance(newBalance);
  };

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

  const calculateBetStatus = (bettingMarkets) => {
    if (!bettingMarkets.length) {
      return "PENDING";
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
            onClick={handleSportsClick}
            className="flex items-center text-green-400 hover:text-green-500 transition duration-200"
          >
            <FaFutbol className="mr-2" /> Sports
          </button>
          <button
            onClick={handleMatchesClick}
            className="flex items-center text-green-400 hover:text-green-500 transition duration-200"
          >
            <FaFutbol className="mr-2" /> Live Matches
          </button>

          <button
            onClick={handleUserIconClick}
            className="flex items-center text-green-400 hover:text-green-500 transition duration-200"
          >
            <FaUser className="mr-2" /> Profile
          </button>
        </div>
        <span className="text-right text-green-400">
          {`Balance: ${Number(user?.balance || 0).toFixed(2)}`}
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

                            {/* Înlocuim secțiunea pentru sport */}
                            <div className="flex-1 text-center">
                              {React.cloneElement(
                                sportIcons[market.sport] || (
                                  <p className="text-gray-300">
                                    {market.sport}
                                  </p>
                                ),
                                {
                                  className: `text-2xl mx-auto ${
                                    market.status === "LOST"
                                      ? "text-red-500"
                                      : market.status === "WON"
                                      ? "text-green-500"
                                      : "text-gray-300"
                                  }`,
                                }
                              )}
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
          projects={projects}
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
