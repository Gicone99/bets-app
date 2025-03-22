import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Divider,
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
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:3080/login", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Invalid credentials");
        }
        return response.json();
      })
      .then((data) => {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        setError(false);
      })
      .catch(() => {
        setError(true);
      });
  };

  React.useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <>
      {token ? <p>Token: {localStorage.getItem("token")}</p> : <p>No token</p>}
      <Background>
        <Box sx={{ textAlign: "center" }}>
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
          {error && (
            <Box
              sx={{
                marginTop: 2,
                maxWidth: 400,
                marginX: "auto",
                textAlign: "center",
              }}
            >
              <Alert severity="error" onClose={() => setError(false)}>
                <Typography sx={{ fontWeight: "bold", marginBottom: 0.5 }}>
                  Invalid username or password.
                </Typography>
                <Typography variant="body1"> Please try again.</Typography>
              </Alert>
            </Box>
          )}
        </Box>
      </Background>
    </>
  );
};

export default Login;
