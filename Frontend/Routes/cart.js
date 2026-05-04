const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING
};

// Get Cart Items for a Customer
router.get('/:customerId', async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const sql = `SELECT c.cart_id, c.product_id, p.name, p.price, c.quantity, (p.price * c.quantity) as total_price
                     FROM Cart c
                     JOIN Product p ON c.product_id = p.product_id
                     WHERE c.customer_id = :customerId`;

        const result = await connection.execute(sql, { customerId: req.params.customerId }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch cart' });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

// Add Item to Cart
router.post('/add', async (req, res) => {
    const { customer_id, product_id, quantity } = req.body;
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);

        // Check if item already exists in cart
        const checkSql = `SELECT cart_id, quantity FROM Cart WHERE customer_id = :customer_id AND product_id = :product_id`;
        const checkResult = await connection.execute(checkSql, { customer_id, product_id }, { outFormat: oracledb.OUT_FORMAT_OBJECT });

        if (checkResult.rows.length > 0) {
            // Update quantity
            const updateSql = `UPDATE Cart SET quantity = quantity + :quantity WHERE cart_id = :cart_id`;
            await connection.execute(updateSql, { quantity, cart_id: checkResult.rows[0].CART_ID }, { autoCommit: true });
        } else {
            // Insert new item
            const insertSql = `INSERT INTO Cart (customer_id, product_id, quantity) VALUES (:customer_id, :product_id, :quantity)`;
            await connection.execute(insertSql, { customer_id, product_id, quantity }, { autoCommit: true });
        }

        res.json({ message: 'Item added to cart' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add to cart' });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

// Remove Item from Cart
router.delete('/:cartId', async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const sql = `DELETE FROM Cart WHERE cart_id = :cartId`;
        await connection.execute(sql, { cartId: req.params.cartId }, { autoCommit: true });
        res.json({ message: 'Item removed from cart' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to remove item' });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

module.exports = router;
