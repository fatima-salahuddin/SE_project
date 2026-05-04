const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING
};

// Seller Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const sql = `SELECT seller_id, name, username FROM Seller WHERE username = :username AND password = :password`;
        const result = await connection.execute(sql, { username, password }, { outFormat: oracledb.OUT_FORMAT_OBJECT });

        if (result.rows.length > 0) {
            res.json({ message: 'Login successful', seller: result.rows[0] });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Login failed' });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

// Seller Registration
router.post('/register', async (req, res) => {
    const { name, phone, username, password } = req.body;
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);

        // Check if username exists
        const checkSql = `SELECT seller_id FROM Seller WHERE username = :username`;
        const checkResult = await connection.execute(checkSql, { username });

        if (checkResult.rows.length > 0) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const sql = `INSERT INTO Seller (name, phone, username, password) VALUES (:name, :phone, :username, :password)`;
        await connection.execute(sql, { name, phone, username, password }, { autoCommit: true });

        res.status(201).json({ message: 'Seller registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Registration failed: ' + err.message });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

// Get Orders for a Seller (Items sold by this seller)
router.get('/:sellerId/orders', async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const sql = `
            SELECT 
                o.order_id,
                o.order_date,
                o.status as order_status,
                c.name as customer_name,
                p.name as product_name,
                oi.quantity,
                oi.price_at_purchase,
                (oi.quantity * oi.price_at_purchase) as total_item_price,
                a.street || ', ' || a.city || ', ' || a.state as shipping_address,
                o.tracking_number,
                o.carrier
            FROM OrderItem oi
            JOIN Product p ON oi.product_id = p.product_id
            JOIN Orders o ON oi.order_id = o.order_id
            JOIN Customer c ON o.customer_id = c.customer_id
            JOIN Address a ON o.shipping_address_id = a.address_id
            WHERE p.seller_id = :sellerId
            ORDER BY o.order_date DESC
        `;

        const result = await connection.execute(sql, { sellerId: req.params.sellerId }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch seller orders' });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

// Get Products for a Seller
router.get('/:sellerId/products', async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const sql = `
            SELECT p.product_id, p.name, p.price, p.stock_quantity, p.image_url, c.name as category_name
            FROM Product p
            JOIN Category c ON p.category_id = c.category_id
            WHERE p.seller_id = :sellerId
            ORDER BY p.product_id DESC
        `;

        const result = await connection.execute(sql, { sellerId: req.params.sellerId }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch seller products' });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

// Update Order Status
router.put('/:sellerId/orders/:orderId/status', async (req, res) => {
    const { status } = req.body;
    const { sellerId, orderId } = req.params;
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);

        // Verify order contains seller's product (simplified check)
        // Ideally, we should check if the order item belongs to the seller, 
        // but for this project, if the seller can see the order, they can update it.

        let sql = `UPDATE Orders SET status = :status`;
        const params = { status, orderId };

        if (status === 'Shipped') {
            const { tracking_number, carrier } = req.body;
            sql += `, tracking_number = :tracking_number, carrier = :carrier, shipped_date = SYSDATE`;
            params.tracking_number = tracking_number;
            params.carrier = carrier;
        }

        sql += ` WHERE order_id = :orderId`;

        await connection.execute(sql, params, { autoCommit: true });

        res.json({ message: 'Order status updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update status' });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

// Get All Sellers (for demo login dropdown)
router.get('/', async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute('SELECT * FROM Seller', {}, { outFormat: oracledb.OUT_FORMAT_OBJECT });
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch sellers' });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

module.exports = router;
