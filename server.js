const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin12',
    database: 'BrightPath'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// Routes

// Signup Route
app.post('/signup', (req, res) => {
    const { name, email, username, password } = req.body;
    const query = 'INSERT INTO users (name, email, username, password) VALUES (?, ?, ?, ?)';
    db.query(query, [name, email, username, password], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ message: 'Error during signup' });
        }
        res.status(200).json({ message: 'Signup successful' });
    });
});

// Login Route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ message: 'Error during login' });
        }
        if (results.length > 0) {
            res.status(200).json({ message: 'Login successful', user: results[0] });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    });
});

// Contact Route
app.post('/contact', (req, res) => {
    const { firstName, lastName, email, message } = req.body;
    const query = 'INSERT INTO contacts (first_name, last_name, email, message) VALUES (?, ?, ?, ?)';
    const values = [firstName, lastName, email, message];
    db.query(query, values, (err, results) => { // Updated from connection.query to db.query
        if (err) {
            console.error('Error inserting data:', err.stack);
            res.status(500).json({ message: 'Failed to save data.' });
            return;
        }
        res.status(200).json({ message: 'Message sent successfully!' });
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
