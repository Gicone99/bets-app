import React, { useState, useContext, useEffect } from "react";
import { SportsContext } from "../context/SportsContext";
import { UserContext } from "../context/UserContext";
import { FaFutbol, FaBasketballBall } from "react-icons/fa";
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

const Sports = () => {
  const {
    selectedSports,
    setSelectedSports,
    saveSelectedSports,
    isLoading,
    error,
  } = useContext(SportsContext);
  const { user } = useContext(UserContext);
  const [localError, setLocalError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Lista completă de sporturi disponibile cu icoane
  const allSports = [
    {
      id: 1,
      name: "Football",
      category: "Popular",
      icon: <FaFutbol className="mr-2" />,
    },
    {
      id: 2,
      name: "Basketball",
      category: "Popular",
      icon: <FaBasketballBall className="mr-2" />,
    },
    {
      id: 3,
      name: "Tennis",
      category: "Popular",
      icon: <MdSportsTennis className="mr-2" />,
    },
    {
      id: 4,
      name: "Hockey",
      category: "Popular",
      icon: <GiHockey className="mr-2" />,
    },
    {
      id: 5,
      name: "Handball",
      category: "Popular",
      icon: <MdOutlineSportsHandball className="mr-2" />,
    },
    {
      id: 6,
      name: "Volleyball",
      category: "Popular",
      icon: <GiVolleyballBall className="mr-2" />,
    },
    {
      id: 7,
      name: "Baseball",
      category: "International",
      icon: <GiBaseballBat className="mr-2" />,
    },
    {
      id: 8,
      name: "American Football",
      category: "International",
      icon: <GiAmericanFootballBall className="mr-2" />,
    },
    {
      id: 9,
      name: "Cricket",
      category: "International",
      icon: <GiCricketBat className="mr-2" />,
    },
    {
      id: 10,
      name: "Motorsport",
      category: "International",
      icon: <MdSportsMotorsports className="mr-2" />,
    },
    {
      id: 11,
      name: "Rugby",
      category: "International",
      icon: <MdOutlineSportsRugby className="mr-2" />,
    },
    {
      id: 12,
      name: "Other Sports",
      category: "International",
      icon: <MdSportsGymnastics className="mr-2" />,
    },
    {
      id: 13,
      name: "Boxing",
      category: "Fighting",
      icon: <GiBoxingGlove className="mr-2" />,
    },
    {
      id: 14,
      name: "MMA",
      category: "Fighting",
      icon: <MdOutlineSportsMartialArts className="mr-2" />,
    },
    {
      id: 15,
      name: "Table Tennis",
      category: "Other",
      icon: <GiPingPongBat className="mr-2" />,
    },
    {
      id: 16,
      name: "Badminton",
      category: "Other",
      icon: <GiTennisRacket className="mr-2" />,
    },
    {
      id: 17,
      name: "Snooker",
      category: "Other",
      icon: <GiPoolTriangle className="mr-2" />,
    },
    {
      id: 18,
      name: "Darts",
      category: "Other",
      icon: <GiDart className="mr-2" />,
    },
    {
      id: 19,
      name: "Esports",
      category: "Virtual",
      icon: <GiGamepad className="mr-2" />,
    },
    {
      id: 20,
      name: "Cycling",
      category: "Other",
      icon: <GiCycling className="mr-2" />,
    },
    {
      id: 21,
      name: "Golf",
      category: "Other",
      icon: <GiGolfFlag className="mr-2" />,
    },
  ];

  // Grupează sporturile pe categorii
  const sportsByCategory = allSports.reduce((acc, sport) => {
    if (!acc[sport.category]) {
      acc[sport.category] = [];
    }
    acc[sport.category].push(sport);
    return acc;
  }, {});

  const toggleSportSelection = (sportId) => {
    setSelectedSports((prev) => {
      if (prev.includes(sportId)) {
        return prev.filter((id) => id !== sportId);
      } else {
        return [...prev, sportId];
      }
    });
  };

  const handleSave = async () => {
    try {
      setLocalError(null);
      const result = await saveSelectedSports(selectedSports);
      setSuccessMessage("Sports preferences saved successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setLocalError(err.message);
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto bg-gradient-to-b from-black via-gray-900 to-gray-900 shadow-xl rounded-2xl p-8 text-center">
        <h1 className="text-3xl font-semibold mb-6 text-green-400">Sports</h1>
        <p className="text-white mb-4">
          You need to be logged in to select sports
        </p>
        <a
          href="/login"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
        >
          Go to Login
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-gradient-to-b from-black via-gray-900 to-gray-900 shadow-xl rounded-2xl p-8">
      <h1 className="text-3xl font-semibold text-center mb-6 text-green-400">
        Select Your Sports
      </h1>
      <p className="text-gray-300 text-center mb-8">
        Choose which sports you want to see in your app
      </p>

      {(error || localError) && (
        <div className="mb-4 p-2 bg-red-500 text-white rounded text-center">
          {error || localError}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-2 bg-green-500 text-white rounded text-center">
          {successMessage}
        </div>
      )}

      {isLoading && (
        <div className="mb-4 text-center text-green-400">Loading sports...</div>
      )}

      <div className="space-y-8">
        {Object.entries(sportsByCategory).map(([category, sports]) => (
          <div key={category}>
            <h2 className="text-xl font-semibold text-white mb-4 border-b border-gray-600 pb-2">
              {category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {sports.map((sport) => (
                <div
                  key={sport.id}
                  className={`p-4 rounded-lg border-2 ${
                    selectedSports.includes(sport.id)
                      ? "border-green-500 bg-green-500/10"
                      : "border-gray-600 bg-gray-700/50"
                  } transition-all hover:shadow-lg cursor-pointer`}
                  onClick={() => toggleSportSelection(sport.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-lg text-green-400">
                        {sport.icon}
                      </span>
                      <span className="text-lg font-medium text-white capitalize">
                        {sport.name}
                      </span>
                    </div>
                    <div
                      className={`w-5 h-5 rounded border-2 ${
                        selectedSports.includes(sport.id)
                          ? "bg-green-500 border-green-500"
                          : "bg-transparent border-gray-400"
                      } flex items-center justify-center`}
                    >
                      {selectedSports.includes(sport.id) && (
                        <span className="text-white text-xs">✓</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className={`bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg focus:outline-none ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Saving..." : "Save Preferences"}
        </button>
      </div>
    </div>
  );
};

export default Sports;
