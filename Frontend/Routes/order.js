const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING
};

// Place Order (Checkout) - Using Stored Procedure with Locking
router.post('/checkout', async (req, res) => {
    const { customer_id, shipping_address_id, payment_method, payment_details } = req.body;

    // Mock Payment Validation
    if (payment_method === 'Credit Card') {
        const { number, expiry, cvv } = payment_details || {};
        if (!number || number.length !== 16 || isNaN(number)) {
            return res.status(400).json({ error: 'Invalid Credit Card Number (must be 16 digits)' });
        }
        if (!expiry || !expiry.match(/^\d{2}\/\d{2}$/)) {
            return res.status(400).json({ error: 'Invalid Expiry Date (MM/YY)' });
        }
        if (!cvv || cvv.length !== 3 || isNaN(cvv)) {
            return res.status(400).json({ error: 'Invalid CVV' });
        }
    } else if (payment_method === 'UPI') {
        const { upiId } = payment_details || {};
        if (!upiId || !upiId.includes('@')) {
            return res.status(400).json({ error: 'Invalid UPI ID' });
        }
    }

    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);

        const result = await connection.execute(
            `BEGIN proc_checkout_order(:cid, :aid, :pm, :oid); END;`,
            {
                cid: customer_id,
                aid: shipping_address_id,
                pm: payment_method,
                oid: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
            },
            { autoCommit: true } // Procedure handles commit/rollback internally
        );

        const orderId = result.outBinds.oid;
        res.status(201).json({ message: 'Order placed successfully', orderId });

    } catch (err) {
        console.error(err);
        // Extract application error message if available
        const msg = err.message.includes('ORA-2000') ? err.message.split('\n')[0] : 'Checkout failed';
        res.status(500).json({ error: msg });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

// Get Order History
router.get('/:customerId', async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const sql = `SELECT * FROM Orders WHERE customer_id = :customerId ORDER BY order_date DESC`;
        const result = await connection.execute(sql, { customerId: req.params.customerId }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch orders' });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

module.exports = router;
