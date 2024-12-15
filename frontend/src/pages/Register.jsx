import { useState } from "react";
import React from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Divider,
  Snackbar,
  Alert,
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

const RegisterContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 400,
  width: "100%",
  borderRadius: theme.spacing(2),
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.37)",
}));

const RegisterButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#4CAF50",
  color: "#fff",
  fontWeight: "bold",
  "&:hover": {
    backgroundColor: "#45A049",
  },
}));

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  function handleSubmit(e) {
    e.preventDefault();
    fetch("http://localhost:3000/register", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((response) => response.text())
      .then((data) => {
        console.log(data);
      });

    setOpenSnackbar(true);
  }

  return (
    <Background>
      <RegisterContainer>
        <Typography variant="h4" gutterBottom>
          Sign Up for Bet App
        </Typography>
        <Typography variant="body1" gutterBottom>
          Create your account below to get started.
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
            label="New Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            variant="outlined"
            required
            InputProps={{ style: { color: "#fff" } }}
            InputLabelProps={{ style: { color: "#bbb" } }}
          />
          <RegisterButton type="submit" fullWidth>
            Sign Up
          </RegisterButton>
        </Box>
        <Typography variant="body2" sx={{ marginTop: 2, color: "#bbb" }}>
          Already have an account?{" "}
          <a href="/login" style={{ color: "#4CAF50" }}>
            Login
          </a>
        </Typography>
      </RegisterContainer>

      {/* Snackbar pentru mesaj de succes */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Account successfully created!
        </Alert>
      </Snackbar>
    </Background>
  );
};

export default Register;
