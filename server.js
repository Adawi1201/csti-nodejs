// Updated server.js with new SQLite implementation

const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const db = new sqlite3.Database(':memory:');

// Middleware to parse JSON
app.use(express.json());

// Create a new table for users
db.serialize(() => {
    db.run(`CREATE TABLE users (id INT, name TEXT)`);
});

// API endpoint to add a user
app.post('/users', (req, res) => {
    const { id, name } = req.body;
    const stmt = db.prepare(`INSERT INTO users VALUES (?, ?)`);
    stmt.run(id, name);
    stmt.finalize();
    res.status(201).send(`User ${name} added`);
});

// API endpoint to get all users
app.get('/users', (req, res) => {
    db.all(`SELECT * FROM users`, [], (err, rows) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.json(rows);
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
