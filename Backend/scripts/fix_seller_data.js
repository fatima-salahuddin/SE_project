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

        // 1. Get Default Seller ID
        const sellerResult = await connection.execute(`SELECT seller_id FROM Seller WHERE username = 'seller'`);
        if (sellerResult.rows.length === 0) {
            console.error('Default seller not found!');
            return;
        }
        const sellerId = sellerResult.rows[0][0];
        console.log(`Default Seller ID: ${sellerId}`);

        // 2. Assign some products to this seller (e.g., first 5 products)
        // Using ROWNUM for older Oracle compatibility
        await connection.execute(
            `UPDATE Product SET seller_id = :sid WHERE product_id IN (SELECT product_id FROM (SELECT product_id FROM Product ORDER BY product_id) WHERE ROWNUM <= 5)`,
            { sid: sellerId },
            { autoCommit: true }
        );
        console.log('✅ Assigned 5 products to Default Seller.');

        // 3. Create a Dummy Order for one of these products
        // First, get a customer and a product owned by this seller
        const custResult = await connection.execute(`SELECT customer_id FROM Customer WHERE ROWNUM = 1`);
        const prodResult = await connection.execute(`SELECT product_id, price FROM Product WHERE seller_id = :sid AND ROWNUM = 1`, [sellerId]);
        const addrResult = await connection.execute(`SELECT address_id FROM Address WHERE ROWNUM = 1`);

        if (custResult.rows.length > 0 && prodResult.rows.length > 0 && addrResult.rows.length > 0) {
            const custId = custResult.rows[0][0];
            const prodId = prodResult.rows[0][0];
            const price = prodResult.rows[0][1];
            const addrId = addrResult.rows[0][0];

            // Create Order
            const orderSql = `INSERT INTO Orders (customer_id, total_amount, shipping_address_id, status) 
                              VALUES (:cid, :amt, :aid, 'Delivered') RETURNING order_id INTO :oid`;

            const orderRes = await connection.execute(orderSql, {
                cid: custId, amt: price, aid: addrId,
                oid: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
            }, { autoCommit: false });

            const orderId = orderRes.outBinds.oid[0];

            // Create Order Item
            await connection.execute(
                `INSERT INTO OrderItem (order_id, product_id, quantity, price_at_purchase) VALUES (:oid, :pid, 1, :price)`,
                { oid: orderId, pid: prodId, price: price },
                { autoCommit: true }
            );

            console.log(`✅ Created dummy order #${orderId} for Product #${prodId}.`);
        } else {
            console.log('⚠️  Could not create dummy order (missing customer, product, or address).');
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
