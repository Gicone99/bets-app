import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";

const LiveMatches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [date] = useState(dayjs().format("YYYY-MM-DD"));

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);

        const config = {
          method: "get",
          url: "https://v3.football.api-sports.io/fixtures",
          params: {
            date: date, // Folosește data curentă
          },
          headers: {
            "x-rapidapi-key": "a53cd76594d35df1c469769d8d576b9a",
            "x-rapidapi-host": "v3.football.api-sports.io",
          },
        };

        const response = await axios(config);

        const formattedMatches = response.data.response.map((match) => ({
          id: match.fixture.id,
          home: match.teams.home.name,
          away: match.teams.away.name,
          score:
            match.fixture.status.short === "NS"
              ? "VS"
              : `${match.goals.home} - ${match.goals.away}`,
          time: getMatchTime(match.fixture),
          league: match.league.name,
          country: match.league.country,
          status: match.fixture.status.short,
          homeLogo: match.teams.home.logo,
          awayLogo: match.teams.away.logo,
          timestamp: match.fixture.timestamp,
        }));

        // Sortează meciurile: live > următoare > terminate
        const sortedMatches = sortMatches(formattedMatches);
        setMatches(sortedMatches);
        setError(null);
      } catch (err) {
        setError("Nu am putut încărca meciurile. Încercăm date demo...");
        console.error("Eroare API:", err);
        setMatches(getDemoMatches());
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();

    // Actualizează la fiecare 5 minute
    const interval = setInterval(fetchMatches, 300000);
    return () => clearInterval(interval);
  }, [date]);

  // Funcții helper
  const getMatchTime = (fixture) => {
    if (fixture.status.short === "NS") {
      return dayjs(fixture.date).format("HH:mm");
    }
    return fixture.status.elapsed
      ? `${fixture.status.elapsed}'`
      : fixture.status.short;
  };

  const sortMatches = (matches) => {
    return matches.sort((a, b) => {
      // Meciuri live primele
      if (a.status === "LIVE") return -1;
      if (b.status === "LIVE") return 1;

      // Apoi meciurile care urmează (cele mai apropiate)
      if (a.status === "NS" && b.status === "NS") {
        return a.timestamp - b.timestamp;
      }
      if (a.status === "NS") return -1;
      if (b.status === "NS") return 1;

      // Ultimele meciurile terminate
      return b.timestamp - a.timestamp;
    });
  };

  const getDemoMatches = () => {
    return [
      {
        id: "demo1",
        home: "Arsenal",
        away: "Chelsea",
        score: "2 - 1",
        time: "64'",
        league: "Premier League",
        country: "England",
        status: "LIVE",
        homeLogo: "https://media.api-sports.io/football/teams/42.png",
        awayLogo: "https://media.api-sports.io/football/teams/49.png",
        timestamp: Date.now() / 1000,
      },
      {
        id: "demo2",
        home: "Barcelona",
        away: "Real Madrid",
        score: "VS",
        time: "20:45",
        league: "La Liga",
        country: "Spain",
        status: "NS",
        homeLogo: "https://media.api-sports.io/football/teams/529.png",
        awayLogo: "https://media.api-sports.io/football/teams/541.png",
        timestamp: Date.now() / 1000 + 3600,
      },
    ];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "LIVE":
        return "bg-red-500";
      case "HT":
        return "bg-yellow-500";
      case "FT":
        return "bg-gray-500";
      default:
        return "bg-green-500";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "LIVE":
        return "Live";
      case "HT":
        return "Pauză";
      case "FT":
        return "Terminat";
      case "NS":
        return "Urmează";
      default:
        return status;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-sans">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <span className="animate-pulse mr-2">📅</span>
          Meciuri - {dayjs(date).format("DD/MM/YYYY")}
          <span className="text-green-600 ml-2">Football API</span>
        </h1>

        <button
          onClick={() => window.location.reload()}
          className="bg-blue-100 text-blue-600 px-3 py-1 rounded-md text-sm hover:bg-blue-200"
        >
          Actualizează
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-6 text-center font-medium">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500 mb-4"></div>
          <p>Se încarcă meciurile...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map((match) => (
            <div
              key={match.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div
                className={`px-4 py-2 flex justify-between items-center ${getStatusColor(
                  match.status
                )} text-white`}
              >
                <span className="text-sm font-medium">
                  {match.country} • {match.league}
                </span>
                <span className="px-2 py-1 rounded text-xs font-bold bg-black bg-opacity-20">
                  {getStatusText(match.status)}
                </span>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center w-2/5">
                    <img
                      src={match.homeLogo}
                      alt={match.home}
                      className="w-8 h-8 mr-2 object-contain"
                      onError={(e) =>
                        (e.target.src = "https://via.placeholder.com/32")
                      }
                    />
                    <span className="font-medium truncate text-right">
                      {match.home}
                    </span>
                  </div>

                  <div className="flex flex-col items-center mx-2 w-1/5">
                    <div
                      className={`text-lg font-bold ${
                        match.status === "NS"
                          ? "text-gray-500"
                          : "text-gray-800"
                      }`}
                    >
                      {match.score}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {match.time}
                    </div>
                  </div>

                  <div className="flex items-center justify-end w-2/5">
                    <span className="font-medium truncate text-left">
                      {match.away}
                    </span>
                    <img
                      src={match.awayLogo}
                      alt={match.away}
                      className="w-8 h-8 ml-2 object-contain"
                      onError={(e) =>
                        (e.target.src = "https://via.placeholder.com/32")
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {matches.length === 0 && !loading && (
        <div className="text-center py-10 text-gray-500">
          Nu există meciuri programate pentru astăzi.
        </div>
      )}
    </div>
  );
};

export default LiveMatches;
