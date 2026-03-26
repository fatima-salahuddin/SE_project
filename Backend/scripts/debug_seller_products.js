require('dotenv').config();
const oracledb = require('oracledb');

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING
};

async function testSellerProducts() {
    let connection;
    try {
        if (process.env.ORACLE_CLIENT_LIB_DIR) {
            try {
                oracledb.initOracleClient({ libDir: process.env.ORACLE_CLIENT_LIB_DIR });
            } catch (err) {
                // Ignore if already initialized
            }
        }

        connection = await oracledb.getConnection(dbConfig);
        console.log('Connected to database');

        // 1. Get a seller ID
        const sellerResult = await connection.execute('SELECT seller_id FROM Seller WHERE ROWNUM <= 1', {}, { outFormat: oracledb.OUT_FORMAT_OBJECT });

        if (sellerResult.rows.length === 0) {
            console.log('No sellers found in database.');
            return;
        }

        const sellerId = String(sellerResult.rows[0].SELLER_ID);
        console.log(`Testing with Seller ID (String): "${sellerId}"`);

        // 2. Run the query from the route
        const sql = `
            SELECT p.product_id, p.name, p.price, p.stock_quantity, p.image_url, c.name as category_name
            FROM Product p
            JOIN Category c ON p.category_id = c.category_id
            WHERE p.seller_id = :sellerId
            ORDER BY p.product_id DESC
        `;

        const result = await connection.execute(sql, { sellerId }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
        console.log('Query successful!');
        console.log('Rows found:', result.rows.length);
        console.log('First row:', result.rows[0]);

    } catch (err) {
        console.error('ERROR:', err);
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

testSellerProducts();
