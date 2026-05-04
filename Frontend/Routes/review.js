const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING
};

// Get Reviews for a Product
router.get('/:productId', async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const sql = `
            SELECT r.review_id, r.rating, r.comment_text, r.review_date, c.name as customer_name
            FROM Review r
            JOIN Customer c ON r.customer_id = c.customer_id
            WHERE r.product_id = :productId
            ORDER BY r.review_date DESC
        `;

        const result = await connection.execute(sql, { productId: req.params.productId }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

// Add a Review
router.post('/', async (req, res) => {
    const { product_id, customer_id, rating, comment_text } = req.body;
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const sql = `INSERT INTO Review (product_id, customer_id, rating, comment_text) 
                     VALUES (:product_id, :customer_id, :rating, :comment_text)`;

        await connection.execute(sql, {
            product_id, customer_id, rating, comment_text
        }, { autoCommit: true });

        res.status(201).json({ message: 'Review added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add review' });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

module.exports = router;
