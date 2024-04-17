const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3000;

// Track requests from each IP address
const ipRequests = new Map();

const rateLimit = (req, res, next) => {
    const clientIP = req.ip; // Get client's IP address
    const requestCount = ipRequests.get(clientIP) || 0;
    if (requestCount >= 3) {
        return res.status(429).send('Rate limit exceeded. Try again later.');
    }
    console.log(clientIP);
    ipRequests.set(clientIP, requestCount + 1);
    next();
};

// MySQL Connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'phrases_db'
});

// Connect to MySQL Database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database');
});

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Save Phrase Route with rate limiting middleware applied
app.post('/save', rateLimit, (req, res) => {
    console.log("Hej")
    const { phrase } = req.body;
    const sql = `INSERT INTO phrases (phrase) VALUES ('${phrase}')`;
    connection.query(sql, (err, result) => {
        if (err) {
            console.error('Error saving phrase:', err);
            res.status(500).send('Error saving phrase');
            return;
        }
        console.log("1 record inserted");
        res.status(200).send('Phrase saved successfully');
    });
});
app.get('/hej', (req, res) => {
    res.send("hej")
})
// Get Phrases Route
app.get('/phrases', (req, res) => {
    const sql = "SELECT * FROM phrases";
    connection.query(sql, (err, result) => {
        if (err) {
            console.error('Error retrieving phrases:', err);
            res.status(500).send('Error retrieving phrases');
            return;
        }
        res.json(result);
    });
});

// Start Server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
