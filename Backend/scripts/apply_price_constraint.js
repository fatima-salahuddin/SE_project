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

        const sqlScript = fs.readFileSync(path.join(__dirname, '../database/add_price_constraint.sql'), 'utf8');
        const statements = sqlScript.split(';').filter(s => s.trim().length > 0);

        for (const statement of statements) {
            try {
                const sql = statement.trim();
                if (sql) {
                    await connection.execute(sql);
                    console.log('Executed statement successfully.');
                }
            } catch (err) {
                if (err.message.includes('ORA-02293')) {
                    console.log('Constraint validation failed (should not happen after update).');
                } else if (err.message.includes('ORA-02275')) {
                    console.log('Constraint already exists.');
                } else {
                    console.error('Error executing statement:', err.message);
                }
            }
        }

        // Commit the update
        await connection.commit();
        console.log('✅ Price constraint applied.');

    } catch (err) {
        console.error('❌ Error:', err);
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
}

run();
