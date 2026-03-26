const oracledb = require('oracledb');
require('dotenv').config();

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING
};

if (process.env.ORACLE_CLIENT_LIB_DIR) {
    try {
        oracledb.initOracleClient({ libDir: process.env.ORACLE_CLIENT_LIB_DIR });
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

async function run() {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);

        console.log('--- Sellers ---');
        const sellers = await connection.execute('SELECT seller_id, name, username FROM Seller');
        console.log(sellers.rows);

        console.log('\n--- Products (Sample) ---');
        const products = await connection.execute('SELECT product_id, name, seller_id FROM Product FETCH FIRST 5 ROWS ONLY');
        console.log(products.rows);

        // Check if Default Seller has products
        const defaultSeller = sellers.rows.find(s => s[2] === 'seller'); // username is index 2
        if (defaultSeller) {
            const id = defaultSeller[0];
            const count = await connection.execute('SELECT COUNT(*) FROM Product WHERE seller_id = :id', [id]);
            console.log(`\nDefault Seller (ID: ${id}) has ${count.rows[0][0]} products.`);
        }

    } catch (err) {
        console.error(err);
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
}

run();
