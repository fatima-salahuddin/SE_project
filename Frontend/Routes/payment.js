const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING
};

// Simulate Payment Process (Mock Gateway)
router.post('/process', async (req, res) => {
    const { amount, payment_method, card_details } = req.body;

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simple validation logic
    if (!amount || amount <= 0) {
        return res.status(400).json({ status: 'Failed', error: 'Invalid amount' });
    }

    // Mock success
    res.json({
        status: 'Success',
        transaction_id: 'TXN' + Date.now(),
        message: 'Payment processed successfully'
    });
});

// Get Payment Details by Order ID
router.get('/order/:orderId', async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const sql = `SELECT * FROM Payment WHERE order_id = :orderId`;

        const result = await connection.execute(sql, { orderId: req.params.orderId }, { outFormat: oracledb.OUT_FORMAT_OBJECT });

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Payment not found for this order' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch payment details' });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

module.exports = router;
