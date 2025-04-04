import React, { useState, useEffect } from "react";
import axios from "axios";

const LiveMatches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/matches");

        // Transformă datele pentru afișare
        const formattedMatches = response.data.map((match) => ({
          id: match.id,
          homeTeam: match.homeTeam?.name || "Echipă necunoscută",
          awayTeam: match.awayTeam?.name || "Echipă necunoscută",
          time: match.utcDate
            ? new Date(match.utcDate).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Ora necunoscută",
          league: match.competition?.name || "Competiție necunoscută",
          score: match.score?.fullTime
            ? `${match.score.fullTime.home} - ${match.score.fullTime.away}`
            : "VS",
        }));

        setMatches(formattedMatches);
      } catch (err) {
        setError("Nu am putut încărca meciurile. Încearcă mai târziu.");
        console.error("Eroare:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  return (
    <div className="matches-container">
      <h1 className="title">Meciuri de Fotbal Astăzi ⚽</h1>

      {loading ? (
        <div className="loading">Se încarcă...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="matches-list">
          {matches.map((match) => (
            <div key={match.id} className="match-card">
              <div className="match-header">
                <span className="league">{match.league}</span>
                <span className="time">{match.time}</span>
              </div>

              <div className="teams">
                <span className="team home">{match.homeTeam}</span>
                <span className="score">{match.score}</span>
                <span className="team away">{match.awayTeam}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .matches-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }

        .title {
          color: #2ecc71;
          text-align: center;
          margin-bottom: 30px;
        }

        .loading,
        .error {
          text-align: center;
          padding: 20px;
          font-size: 18px;
        }

        .error {
          color: #e74c3c;
        }

        .match-card {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 15px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .match-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 14px;
          color: #7f8c8d;
        }

        .teams {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .team {
          flex: 1;
          font-weight: bold;
        }

        .home {
          text-align: left;
        }

        .away {
          text-align: right;
        }

        .score {
          font-weight: bold;
          font-size: 18px;
          margin: 0 20px;
        }
      `}</style>
    </div>
  );
};

export default LiveMatches;
