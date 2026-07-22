const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrateOrders(connection) {
    const [columns] = await connection.query('SHOW COLUMNS FROM orders');
    const columnNames = new Set(columns.map((column) => column.Field));
    const additions = [
        ['customer_name', "VARCHAR(100) NOT NULL DEFAULT '舊版訂單'"],
        ['customer_count', 'TINYINT UNSIGNED NOT NULL DEFAULT 1'],
        ['memo', "VARCHAR(255) NOT NULL DEFAULT ''"],
        ['meals', 'JSON NULL'],
        ['pay_type', "VARCHAR(50) NOT NULL DEFAULT '未指定'"],
        ['pickup_type', "VARCHAR(50) NOT NULL DEFAULT '未指定'"],
        ['selected_count', 'SMALLINT UNSIGNED NOT NULL DEFAULT 0']
    ];

    for (const [name, definition] of additions) {
        if (!columnNames.has(name)) {
            await connection.query(`ALTER TABLE orders ADD COLUMN \`${name}\` ${definition}`);
        }
    }

    if (columnNames.has('items')) {
        await connection.query('UPDATE orders SET meals = items WHERE meals IS NULL');
    }
    await connection.query("UPDATE orders SET status = '待處理' WHERE status = 'PENDING'");

    const [foreignKeys] = await connection.query(
        `SELECT CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'orders'
           AND COLUMN_NAME = 'user_id' AND REFERENCED_TABLE_NAME IS NOT NULL`
    );
    for (const { CONSTRAINT_NAME: name } of foreignKeys) {
        await connection.query(`ALTER TABLE orders DROP FOREIGN KEY \`${name}\``);
    }
    // Keep the legacy signed INT type so it remains compatible with an existing users.id column.
    await connection.query('ALTER TABLE orders MODIFY user_id INT NULL');
    await connection.query(
        'ALTER TABLE orders ADD CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL'
    );
}

async function initialiseDatabase() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 3306),
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        multipleStatements: true
    });

    try {
        const database = process.env.DB_NAME || 'mars_lab_db';
        if (!/^[A-Za-z0-9_]+$/.test(database)) {
            throw new Error('DB_NAME 只能包含英文字母、數字與底線');
        }
        const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8')
            .replaceAll('mars_lab_db', database);
        await connection.query(schema);
        await migrateOrders(connection);
        console.log(`資料庫 ${process.env.DB_NAME || 'mars_lab_db'} 已初始化。`);
    } finally {
        await connection.end();
    }
}

initialiseDatabase().catch((error) => {
    console.error('資料庫初始化失敗:', error.message);
    process.exitCode = 1;
});
