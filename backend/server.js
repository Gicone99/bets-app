const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cors = require('cors');
const moment = require('moment');

// Load environment variables
dotenv.config();

const app = express();
const port = 3000;

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
    console.log('Connected to MySQL database');
});

// generate JWT
function generateToken(username) {
    return jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

// JWT Authentication Middleware
function authenticateJWT(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', ''); // Extract token from Authorization header

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Verify the JWT token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token.' });
        }

        // Check if the token exists in the sessions table and is not expired
        const query = 'SELECT * FROM sessions WHERE token = ? AND expires_at > NOW()';
        db.query(query, [token], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error verifying token', error: err });
            }
            if (results.length === 0) {
                return res.status(403).json({ message: 'Token is invalid or expired.' });
            }

            req.user = user; // Attach decoded user to the request object
            next();
        });
    });
}

// Register a new user
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into the database
        const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
        db.query(query, [username, hashedPassword], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Error registering user', error: err });
            }
            res.status(201).json({ message: 'User registered successfully' });
        });
    } catch (err) {
        res.status(500).json({ message: 'Error hashing password', error: err });
    }
});

// Log in a user
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    // Find user in the database
    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], async (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }

        if (results.length === 0) {
            return res.status(400).json({ message: 'User not found' });
        }

        const user = results[0];

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Generate JWT token
        const token = generateToken(user.username);

        // Store the token in the sessions table with an expiration timestamp
        const expiresAt = moment().add(1, 'hour').format('YYYY-MM-DD HH:mm:ss'); // Expiry time set to 1 hour from now
        const sessionQuery = 'INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)';
        db.query(sessionQuery, [user.id, token, expiresAt], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Error storing session', error: err });
            }

            res.json({ message: 'Login successful', token });
        });
    });
});

// Log out the user (invalidate the token)
app.post('/logout', authenticateJWT, (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // Delete the token from the sessions table to invalidate it
    const query = 'DELETE FROM sessions WHERE token = ?';
    db.query(query, [token], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error logging out', error: err });
        }

        res.json({ message: 'Logged out successfully' });
    });
});

// get ticket info for current user
app.get('/data', authenticateJWT, (req, res) => {
    const username = req.user.username;  // Username from the decoded JWT

    // Find the user's ticket
    const query = 'SELECT ticket FROM tickets INNER JOIN users ON tickets.user_id = users.id WHERE users.username = ?';
    db.query(query, [username], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'No ticket found for this user' });
        }

        res.json({ ticket: results[0].ticket });
    });
});

// add ticket by current user
app.post('/ticket', authenticateJWT, (req, res) => {
    const { ticket } = req.body;
    const username = req.user.username; // Username from the decoded JWT

    if (!ticket) {
        return res.status(400).json({ message: 'Ticket information is required' });
    }

    // Find user by username to get user_id
    const query = 'SELECT id FROM users WHERE username = ?';
    db.query(query, [username], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userId = results[0].id;

        // Insert the ticket into the tickets table
        const ticketQuery = 'INSERT INTO tickets (user_id, ticket) VALUES (?, ?)';
        db.query(ticketQuery, [userId, ticket], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Error adding ticket', error: err });
            }

            res.status(201).json({ message: 'Ticket added successfully' });
        });
    });
});

// all users - secured
app.get('/users', authenticateJWT, (req, res) => {
    // Fetch all users (username and ticket)
    const query = 'SELECT username FROM users';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }

        res.json(results);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
