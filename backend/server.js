const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cors = require("cors");
const moment = require("moment");

// Load environment variables
dotenv.config();

const app = express();
const port = 3008;

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors());

// Create MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to MySQL
db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database");
});

// generate JWT
function generateToken(username) {
  return jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "1h" });
}

// JWT Authentication Middleware
function authenticateJWT(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", ""); // Extract token from Authorization header

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  // Verify the JWT token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token." });
    }

    // Check if the token exists in the sessions table and is not expired
    const query =
      "SELECT * FROM sessions WHERE token = ? AND expires_at > NOW()";
    db.query(query, [token], (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error verifying token", error: err });
      }
      if (results.length === 0) {
        return res
          .status(403)
          .json({ message: "Token is invalid or expired." });
      }

      req.user = user; // Attach decoded user to the request object
      next();
    });
  });
}

// API MATCHES
var axios = require("axios");

var config = {
  method: "get",
  url: "https://v3.football.api-sports.io",
  headers: {
    "x-rapidapi-key": "a53cd76594d35df1c469769d8d576b9a",
    "x-rapidapi-host": "v3.football.api-sports.io",
  },
};

axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.log(error);
  });

// Register a new user
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Username, email, and password are required" });
  }

  try {
    // Verifică dacă e-mailul este deja folosit
    const emailCheckQuery = "SELECT * FROM users WHERE email = ?";
    db.query(emailCheckQuery, [email], async (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error checking email", error: err });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: "Email is already in use" });
      }

      // Hash the password before storing it
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user into the database
      const query =
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
      db.query(query, [username, email, hashedPassword], (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return res
            .status(500)
            .json({ message: "Error registering user", error: err });
        }
        res.status(201).json({ message: "User registered successfully" });
      });
    });
  } catch (err) {
    res.status(500).json({ message: "Error hashing password", error: err });
  }
});

// Log in a user
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  // Find user in the database
  const query = "SELECT * FROM users WHERE username = ?";
  db.query(query, [username], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = results[0];

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = generateToken(user.username);

    // Store the token in the sessions table with an expiration timestamp
    const expiresAt = moment().add(1, "hour").format("YYYY-MM-DD HH:mm:ss"); // Expiry time set to 1 hour from now
    const sessionQuery =
      "INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)";
    db.query(sessionQuery, [user.id, token, expiresAt], (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error storing session", error: err });
      }

      res.json({ message: "Login successful", token });
    });
  });
});

// Log out the user (invalidate the token)
app.post("/logout", authenticateJWT, (req, res) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  // Delete the token from the sessions table to invalidate it
  const query = "DELETE FROM sessions WHERE token = ?";
  db.query(query, [token], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out", error: err });
    }

    res.json({ message: "Logged out successfully" });
  });
});

// Get current user info
app.get("/user", authenticateJWT, (req, res) => {
  const username = req.user.username; // Username from the decoded JWT

  // Find user details
  const query = "SELECT username, email, balance FROM users WHERE username = ?";
  db.query(query, [username], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = results[0];
    res.json({ user });
  });
});

// Get user balance
app.get("/balance", authenticateJWT, (req, res) => {
  const username = req.user.username;

  const query =
    "SELECT CAST(balance AS DECIMAL(10,2)) as balance FROM users WHERE username = ?";
  db.query(query, [username], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Asigură-te că trimitem un număr, nu un string
    res.json({ balance: parseFloat(results[0].balance) });
  });
});

// get ticket info for current user
app.get("/data", authenticateJWT, (req, res) => {
  const username = req.user.username; // Username from the decoded JWT

  // Find the user's ticket
  const query =
    "SELECT ticket FROM tickets INNER JOIN users ON tickets.user_id = users.id WHERE users.username = ?";
  db.query(query, [username], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No ticket found for this user" });
    }

    const tickets = results.map((row) => row.ticket);

    // Return the list of tickets
    res.json({ tickets });
  });
});

// add ticket by current user
app.post("/ticket", authenticateJWT, (req, res) => {
  const { ticket } = req.body;
  const username = req.user.username; // Username from the decoded JWT

  if (!ticket) {
    return res.status(400).json({ message: "Ticket information is required" });
  }

  // Find user by username to get user_id
  const query = "SELECT id FROM users WHERE username = ?";
  db.query(query, [username], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const userId = results[0].id;

    // Insert the ticket into the tickets table
    const ticketQuery = "INSERT INTO tickets (user_id, ticket) VALUES (?, ?)";
    db.query(ticketQuery, [userId, ticket], (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error adding ticket", error: err });
      }

      res.status(201).json({ message: "Ticket added successfully" });
    });
  });
});

// add balance by current user
app.post("/addbalance", authenticateJWT, (req, res) => {
  const { amount } = req.body;
  const username = req.user.username;

  if (!amount) {
    return res.status(400).json({ message: "Amount is required" });
  }

  // First update the balance
  const updateQuery =
    "UPDATE users SET balance = balance + ? WHERE username = ?";
  db.query(updateQuery, [amount, username], (err, updateResult) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    // Then get the new balance to return it
    const selectQuery = "SELECT balance FROM users WHERE username = ?";
    db.query(selectQuery, [username], (err, selectResults) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (selectResults.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const newBalance = selectResults[0].balance;
      res.json({
        message: "Balance updated successfully",
        newBalance,
      });
    });
  });
});

// add force balance by current user
app.post("/forceaddbalance", (req, res) => {
  const { amount, username } = req.body;

  if (!amount || !username) {
    return res.status(400).json({ message: "Amount and username is required" });
  }

  const query = "UPDATE users SET balance = balance + ? WHERE username = ?";
  db.query(query, [amount, username], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.json({
      Raspuns: "Valoare adaugata",
    });
  });
});

// all users - secured
app.get("/users", authenticateJWT, (req, res) => {
  // Fetch all users (username and ticket)
  const query = "SELECT username FROM users";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    res.json(results);
  });
});

// Get all projects for current user
app.get("/projects", authenticateJWT, (req, res) => {
  const username = req.user.username;

  const query = `
    SELECT p.id, p.name 
    FROM projects p
    JOIN users u ON p.user_id = u.id
    WHERE u.username = ?
    ORDER BY p.name ASC
  `;

  db.query(query, [username], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({
        message: "Error fetching projects",
        error: err.message,
      });
    }

    res.json({ projects: results });
  });
});

// Add a new project for current user
app.post("/projects", authenticateJWT, (req, res) => {
  console.log("Add project request:", req.body); // Debug
  const { name } = req.body;
  const username = req.user.username;

  if (!name) {
    console.log("Project name missing"); // Debug
    return res.status(400).json({ message: "Project name is required" });
  }

  // First get user ID
  const userQuery = "SELECT id FROM users WHERE username = ?";
  db.query(userQuery, [username], (err, userResults) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (userResults.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const userId = userResults[0].id;

    // Insert project
    const insertQuery = "INSERT INTO projects (user_id, name) VALUES (?, ?)";
    db.query(insertQuery, [userId, name], (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error adding project", error: err });
      }

      res.status(201).json({
        message: "Project added successfully",
        project: { id: result.insertId, name },
      });
    });
  });
});

// Update a project
app.put("/projects/:id", authenticateJWT, (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const username = req.user.username;

  if (!name) {
    return res.status(400).json({ message: "Project name is required" });
  }

  // Verify project belongs to user and update
  const query = `
    UPDATE projects p
    JOIN users u ON p.user_id = u.id
    SET p.name = ?
    WHERE p.id = ? AND u.username = ?
  `;

  db.query(query, [name, id, username], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Project not found or not owned by user" });
    }

    res.json({ message: "Project updated successfully" });
  });
});

// Delete a project
app.delete("/projects/:id", authenticateJWT, (req, res) => {
  const { id } = req.params;
  const username = req.user.username;

  // Verify project belongs to user and delete
  const query = `
    DELETE p FROM projects p
    JOIN users u ON p.user_id = u.id
    WHERE p.id = ? AND u.username = ?
  `;

  db.query(query, [id, username], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Project not found or not owned by user" });
    }

    res.json({ message: "Project deleted successfully" });
  });
});

// Frontend code to fetch projects
const fetchProjects = async () => {
  if (!authToken) return;

  setIsLoading(true);
  try {
    const response = await axios.get("http://localhost:3008/projects", {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    console.log("Projects API response:", response.data); // Debug
    setProjects(response.data.projects);
  } catch (error) {
    console.error(
      "Error fetching projects:",
      error.response?.data || error.message
    );
    setError("Failed to load projects. Please try again.");
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      setToken("");
    }
  } finally {
    setIsLoading(false);
  }
};

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
