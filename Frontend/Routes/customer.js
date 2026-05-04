const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');

// Database configuration (should be imported or passed, but for now using env)
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING
};

// Register Customer
router.post('/register', async (req, res) => {
    const { name, email, password, dob, phone } = req.body;
    let connection;

    try {
        connection = await oracledb.getConnection(dbConfig);
        const sql = `INSERT INTO Customer (name, email, password, dob, phone) 
                     VALUES (:name, :email, :password, TO_DATE(:dob, 'YYYY-MM-DD'), :phone)`;

        // Handle empty DOB string from frontend
        const dobValue = dob ? dob : null;

        await connection.execute(sql, {
            name, email, password, dob: dobValue, phone
        }, { autoCommit: true });

        res.status(201).json({ message: 'Customer registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Registration failed', details: err.message });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

// Login Customer
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    let connection;

    try {
        connection = await oracledb.getConnection(dbConfig);
        const sql = `SELECT customer_id, name, email FROM Customer WHERE email = :email AND password = :password`;

        const result = await connection.execute(sql, { email, password }, { outFormat: oracledb.OUT_FORMAT_OBJECT });

        if (result.rows.length > 0) {
            res.json({ message: 'Login successful', user: result.rows[0] });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Login failed', details: err.message });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

module.exports = router;
