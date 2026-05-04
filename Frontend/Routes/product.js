const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING
};

// Get All Products (with optional category filter)
router.get('/', async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        let sql = `SELECT p.product_id, p.name, p.description, p.price, p.stock_quantity, p.image_url, c.name as category_name, s.name as seller_name 
                   FROM Product p
                   JOIN Category c ON p.category_id = c.category_id
                   JOIN Seller s ON p.seller_id = s.seller_id`;

        const binds = {};
        if (req.query.category_id) {
            sql += ` WHERE p.category_id = :category_id`;
            binds.category_id = req.query.category_id;
        }

        const result = await connection.execute(sql, binds, { outFormat: oracledb.OUT_FORMAT_OBJECT });
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch products' });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

// Get Product by ID
router.get('/:id', async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const sql = `SELECT p.*, c.name as category_name, s.name as seller_name 
                     FROM Product p
                     JOIN Category c ON p.category_id = c.category_id
                     JOIN Seller s ON p.seller_id = s.seller_id
                     WHERE p.product_id = :id`;

        const result = await connection.execute(sql, { id: req.params.id }, { outFormat: oracledb.OUT_FORMAT_OBJECT });

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch product' });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

// Add Product (Seller/Admin)
router.post('/', async (req, res) => {
    const { name, description, price, stock_quantity, brand, category_id, seller_id, image_url } = req.body;
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const sql = `INSERT INTO Product (name, description, price, stock_quantity, brand, category_id, seller_id, image_url)
                     VALUES (:name, :description, :price, :stock_quantity, :brand, :category_id, :seller_id, :image_url)`;

        await connection.execute(sql, {
            name, description, price, stock_quantity, brand, category_id, seller_id, image_url
        }, { autoCommit: true });

        res.status(201).json({ message: 'Product added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add product: ' + err.message });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

// Update Stock
router.put('/:id/stock', async (req, res) => {
    const { stock_quantity } = req.body;
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const sql = `UPDATE Product SET stock_quantity = :stock_quantity WHERE product_id = :id`;

        const result = await connection.execute(sql, {
            stock_quantity,
            id: req.params.id
        }, { autoCommit: true });

        if (result.rowsAffected > 0) {
            res.json({ message: 'Stock updated successfully' });
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update stock' });
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

// Delete Product
router.delete('/:id', async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const sql = `DELETE FROM Product WHERE product_id = :id`;

        const result = await connection.execute(sql, { id: req.params.id }, { autoCommit: true });

        if (result.rowsAffected > 0) {
            res.json({ message: 'Product deleted successfully' });
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (err) {
        console.error(err);
        if (err.message.includes('integrity constraint')) {
            res.status(400).json({ error: 'Cannot delete product because it is part of existing orders.' });
        } else {
            res.status(500).json({ error: 'Failed to delete product' });
        }
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
});

module.exports = router;
