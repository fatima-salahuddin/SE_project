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
        console.log('Connected to database...');

        const result = await connection.execute(
            `SELECT product_id, name FROM Product`
        );

        console.log('Current Products visible to App:');
        console.log(result.rows);
        console.log(`Total Count: ${result.rows.length}`);

    } catch (err) {
        console.error(err);
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error(err); }
        }
    }
}

run();
