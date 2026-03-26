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
        console.log('Connected...');

        // 1. Fix Smartphone X (All instances)
        await connection.execute(
            `UPDATE Product SET image_url = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80' WHERE name = 'Smartphone X'`,
            {}, { autoCommit: true }
        );
        console.log('✅ Updated Smartphone X images.');

        // 2. Fix Laptop Pro (All instances)
        await connection.execute(
            `UPDATE Product SET image_url = 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80' WHERE name = 'Laptop Pro'`,
            {}, { autoCommit: true }
        );
        console.log('✅ Updated Laptop Pro images.');

        // 3. Fix T-Shirt (All instances)
        await connection.execute(
            `UPDATE Product SET image_url = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80' WHERE name = 'T-Shirt'`,
            {}, { autoCommit: true }
        );
        console.log('✅ Updated T-Shirt images.');

    } catch (err) {
        console.error('❌ Error:', err);
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
}

run();
