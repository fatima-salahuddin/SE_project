const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING
};

// Get Addresses for a Customer
router.get('/:customerId', async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const sql = `SELECT * FROM Address WHERE customer_id = :customerId`;
        const result = await connection.execute(sql, { customerId: req.params.customerId }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch addresses' });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

// Add New Address
router.post('/', async (req, res) => {
    const { customer_id, street, apartment, city, state, pincode } = req.body;
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const sql = `INSERT INTO Address (customer_id, street, apartment, city, state, pincode) 
                     VALUES (:customer_id, :street, :apartment, :city, :state, :pincode)`;

        await connection.execute(sql, {
            customer_id, street, apartment, city, state, pincode
        }, { autoCommit: true });

        res.status(201).json({ message: 'Address added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add address' });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

module.exports = router;
