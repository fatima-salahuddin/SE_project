const oracledb = require('oracledb');
const fs = require('fs');
const path = require('path');
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
        console.log('Connected to database...');

        const sqlScript = fs.readFileSync(path.join(__dirname, '../database/advanced.sql'), 'utf8');
        const statements = sqlScript.split('/').filter(s => s.trim().length > 0);

        for (const statement of statements) {
            try {
                // Remove comments and whitespace
                const sql = statement.trim();
                if (sql) {
                    await connection.execute(sql);
                    console.log('Executed statement successfully.');
                }
            } catch (err) {
                // Ignore "name is already used" errors for idempotency
                if (err.message.includes('ORA-00955')) {
                    console.log('Object already exists, skipping.');
                } else if (err.message.includes('ORA-04080')) {
                    console.log('Trigger already exists, skipping.');
                } else {
                    console.error('Error executing statement:', err.message);
                    console.error('Statement:', statement);
                }
            }
        }
        console.log('✅ Advanced DB features applied.');

    } catch (err) {
        console.error('❌ Error:', err);
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
}

run();
