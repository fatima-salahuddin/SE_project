require('dotenv').config();
const express = require('express');
const oracledb = require('oracledb');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve frontend files

// Database Connection Configuration
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING
};

// Import Routes
const customerRoutes = require('./routes/customer');
const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order');
const paymentRoutes = require('./routes/payment');
const addressRoutes = require('./routes/address');
const sellerRoutes = require('./routes/seller');
const categoryRoutes = require('./routes/category');
const reviewRoutes = require('./routes/review');

// Use Routes
app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/sellers', sellerRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/reviews', reviewRoutes);

// Initialize Oracle Client (Required for Thick Mode / Older DB versions)
if (process.env.ORACLE_CLIENT_LIB_DIR) {
    try {
        oracledb.initOracleClient({ libDir: process.env.ORACLE_CLIENT_LIB_DIR });
        console.log('Oracle Client initialized in Thick mode from:', process.env.ORACLE_CLIENT_LIB_DIR);
    } catch (err) {
        console.error('================================================================');
        console.error('CRITICAL ERROR: Failed to initialize Oracle Client in Thick mode.');
        console.error('Path provided:', process.env.ORACLE_CLIENT_LIB_DIR);
        console.error('Error details:', err.message);
        console.error('Please ensure the path in .env points to the extracted Instant Client directory.');
        console.error('================================================================');
        process.exit(1);
    }
} else {
    console.log('ORACLE_CLIENT_LIB_DIR not set. Using default mode (Thin mode).');
    console.log('If you have an older database (Oracle 11g or older), you MUST set ORACLE_CLIENT_LIB_DIR in .env');
}

// Test Database Connection
async function checkConnection() {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        console.log('Successfully connected to Oracle Database');
    } catch (err) {
        console.error('Database connection error:', err);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}

checkConnection();

// API Routes
app.get('/', (req, res) => {
    res.send('E-Commerce Backend is running');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
