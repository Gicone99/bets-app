import React, { useState, useEffect } from "react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [token, setToken] = useState("");
  const [error, setError] = useState(false);

  // La încărcarea componentei, verifică dacă există un username salvat în localStorage
  useEffect(() => {
    const savedUsername = localStorage.getItem("rememberedUsername");
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true); // Bifează "Remember Me" dacă username-ul este salvat
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3008/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      setToken(data.token);
      localStorage.setItem("token", data.token);
      setError(false);

      // Salvează username-ul în localStorage dacă "Remember Me" este bifat
      if (rememberMe) {
        localStorage.setItem("rememberedUsername", username);
      } else {
        localStorage.removeItem("rememberedUsername"); // Șterge username-ul salvat dacă nu este bifat
      }
    } catch (err) {
      setError(true);
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(false), 3004);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-gray-900">
      <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-4xl font-bold text-white mb-4">Login to Bet App</h1>
        <p className="text-gray-300 mb-6">
          Enter your credentials below to continue.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-300"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              required
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-green-500 rounded focus:ring-green-500"
            />
            <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-300">
              Remember Me
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200"
          >
            Login
          </button>
        </form>
        <p className="text-gray-300 mt-4">
          Don’t have an account?{" "}
          <a href="/register" className="text-green-500 hover:underline">
            Sign up
          </a>
        </p>
      </div>

      {/* Afișează mesajul de eroare */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md">
          <p className="font-bold">Invalid username or password.</p>
          <p>Please try again.</p>
        </div>
      )}

      {/* Afișează token-ul (pentru debug) */}
      {token && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md">
          <p>Token: {localStorage.getItem("token")}</p>
        </div>
      )}
    </div>
  );
};

export default Login;
