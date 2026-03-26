require('dotenv').config();
const oracledb = require('oracledb');

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING
};

async function updateSchema() {
    let connection;
    try {
        if (process.env.ORACLE_CLIENT_LIB_DIR) {
            oracledb.initOracleClient({ libDir: process.env.ORACLE_CLIENT_LIB_DIR });
        }

        connection = await oracledb.getConnection(dbConfig);
        console.log('Connected to database...');

        const sql = `
            ALTER TABLE Orders ADD (
                tracking_number VARCHAR2(100),
                carrier VARCHAR2(50),
                shipped_date DATE
            )
        `;

        console.log('Executing:', sql);
        await connection.execute(sql);
        console.log('Schema updated successfully!');

    } catch (err) {
        if (err.message.includes('ORA-01430')) {
            console.log('Columns already exist (ORA-01430). Skipping.');
        } else {
            console.error('Error updating schema:', err);
        }
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

updateSchema();
