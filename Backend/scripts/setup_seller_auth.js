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
        console.error('Oracle Client init error:', err);
        process.exit(1);
    }
}

async function run() {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        console.log('Connected to database...');

        // 1. Alter Table (Ignore error if columns exist)
        try {
            await connection.execute(`ALTER TABLE Seller ADD (username VARCHAR2(50) UNIQUE, password VARCHAR2(100))`);
            console.log('✅ Added username and password columns to Seller table.');
        } catch (err) {
            if (err.message.includes('ORA-01430')) {
                console.log('ℹ️  Columns already exist.');
            } else {
                throw err;
            }
        }

        // 2. Insert Default Seller
        // Check if exists first to avoid unique constraint error
        const check = await connection.execute(`SELECT seller_id FROM Seller WHERE username = 'seller'`);

        if (check.rows.length === 0) {
            await connection.execute(
                `INSERT INTO Seller (name, username, password, phone) VALUES (:name, :username, :password, :phone)`,
                {
                    name: 'Default Seller',
                    username: 'seller',
                    password: '1234567', // In real app, hash this!
                    phone: '555-0199'
                },
                { autoCommit: true }
            );
            console.log('✅ Registered default seller (user: seller, pass: 1234567).');
        } else {
            console.log('ℹ️  Default seller already exists.');
        }

    } catch (err) {
        console.error('❌ Error:', err);
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
}

run();
