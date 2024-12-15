import { useState } from "react";
import React from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import { styled } from "@mui/system";

const Background = styled(Box)(({ theme }) => ({
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
  color: "#fff",
  textAlign: "center",
}));

const LoginContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 400,
  width: "100%",
  borderRadius: theme.spacing(2),
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.37)",
}));

const LoginButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#4CAF50",
  color: "#fff",
  fontWeight: "bold",
  "&:hover": {
    backgroundColor: "#45A049",
  },
}));

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  function handleSubmit(e) {
    e.preventDefault(); // this blocks the default behavior as we don't want to reload or go somewhere else
    fetch("http://localhost:3000/login", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // if logged successfully we then get token in a data object which we then store in localstorage
        console.log(data);
        console.log(data.token);
        setToken(data.token);
        console.log(token);
        localStorage.setItem("token", data.token);
      });
  }

  return (
    <>
      {token ? <p>Token: {localStorage.getItem("token")}</p> : <p>No token</p>}
      <Background>
        <LoginContainer>
          <Typography variant="h4" gutterBottom>
            Login to Bet App
          </Typography>
          <Typography variant="body1" gutterBottom>
            Enter your credentials below to continue.
          </Typography>
          <Divider sx={{ marginY: 2 }} />
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              variant="outlined"
              required
              InputProps={{ style: { color: "#fff" } }}
              InputLabelProps={{ style: { color: "#bbb" } }}
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              variant="outlined"
              required
              InputProps={{ style: { color: "#fff" } }}
              InputLabelProps={{ style: { color: "#bbb" } }}
            />
            <LoginButton type="submit" fullWidth>
              Login
            </LoginButton>
          </Box>
          <Typography variant="body2" sx={{ marginTop: 2, color: "#bbb" }}>
            Don’t have an account?{" "}
            <a href="/register" style={{ color: "#4CAF50" }}>
              Sign up
            </a>
          </Typography>
        </LoginContainer>
      </Background>
    </>
  );
};

export default Login;
