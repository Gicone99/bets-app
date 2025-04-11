import React, { useState, useContext, useEffect } from "react";
import { SportsContext } from "../context/SportsContext";
import { UserContext } from "../context/UserContext";

const Sports = () => {
  const { selectedSports, setSelectedSports, isLoading, error } =
    useContext(SportsContext);
  const { user } = useContext(UserContext);

  // Lista completă de sporturi disponibile
  const allSports = [
    { id: 1, name: "Soccer", category: "Popular" },
    { id: 2, name: "Basketball", category: "Popular" },
    { id: 3, name: "Tennis", category: "Popular" },
    { id: 4, name: "Ice Hockey", category: "Popular" },
    { id: 5, name: "Handball", category: "Popular" },
    { id: 6, name: "Volleyball", category: "Popular" },
    { id: 7, name: "Baseball", category: "American" },
    { id: 8, name: "American Football", category: "American" },
    { id: 9, name: "Cricket", category: "International" },
    { id: 10, name: "Rugby Union", category: "International" },
    { id: 11, name: "Rugby League", category: "International" },
    { id: 12, name: "Boxing", category: "Fighting" },
    { id: 13, name: "MMA", category: "Fighting" },
    { id: 14, name: "Table Tennis", category: "Other" },
    { id: 15, name: "Badminton", category: "Other" },
    { id: 16, name: "Snooker", category: "Other" },
    { id: 17, name: "Darts", category: "Other" },
    { id: 18, name: "Esports", category: "Virtual" },
    { id: 19, name: "Cycling", category: "Other" },
    { id: 20, name: "Golf", category: "Other" },
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

  const saveSelectedSports = async () => {
    try {
      console.log("Selected sports:", selectedSports);
      alert("Sports preferences saved successfully!");
    } catch (err) {
      console.error("Error saving sports:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-gradient-to-b from-black via-gray-900 to-gray-900 shadow-xl rounded-2xl p-8">
      <h1 className="text-3xl font-semibold text-center mb-6 text-green-400">
        Select Your Sports
      </h1>
      <p className="text-gray-300 text-center mb-8">
        Choose which sports you want to see in your app
      </p>

      {error && (
        <div className="mb-4 p-2 bg-red-500 text-white rounded text-center">
          {error}
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
                    <span className="text-lg font-medium text-white capitalize">
                      {sport.name}
                    </span>
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
          onClick={saveSelectedSports}
          disabled={isLoading}
          className={`bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg focus:outline-none ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
};

export default Sports;
