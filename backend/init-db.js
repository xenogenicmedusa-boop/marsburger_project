const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function main() {
  const database = process.env.DB_NAME || 'mars_lab_db';
  if (!/^[A-Za-z0-9_]+$/.test(database)) throw new Error('DB_NAME 僅能使用英數字與底線。');
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost', port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root', password: process.env.DB_PASSWORD || '', multipleStatements: true
  });
  try {
    const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8').replaceAll('mars_lab_db', database);
    await connection.query(sql);
    // Upgrade installations created by an older project version.
    const [columns] = await connection.query(`SHOW COLUMNS FROM \`${database}\`.users`);
    if (!columns.some(c => c.Field === 'role')) await connection.query(`ALTER TABLE \`${database}\`.users ADD role ENUM('customer','admin') NOT NULL DEFAULT 'customer'`);
    const [orderColumns] = await connection.query(`SHOW COLUMNS FROM \`${database}\`.orders`);
    const orderFields = new Set(orderColumns.map(column => column.Field));
    if (orderFields.has('items')) {
      await connection.query(`UPDATE \`${database}\`.orders SET meals=items WHERE meals IS NULL`);
      await connection.query(`ALTER TABLE \`${database}\`.orders DROP COLUMN items`);
    }
    if (!orderFields.has('updated_at')) await connection.query(`ALTER TABLE \`${database}\`.orders ADD updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
    await connection.query(`UPDATE \`${database}\`.orders SET status='pending' WHERE status IN ('PENDING', '待處理')`);
    await connection.query(`UPDATE \`${database}\`.orders SET status='processing' WHERE status IN ('PROCESSING', '製作中')`);
    await connection.query(`UPDATE \`${database}\`.orders SET status='completed' WHERE status IN ('COMPLETED', '已完成')`);
    await connection.query(`UPDATE \`${database}\`.orders SET status='cancelled' WHERE status IN ('CANCELLED', '已取消')`);
    if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      const bcrypt = require('bcrypt');
      const [existing] = await connection.query(`SELECT id FROM \`${database}\`.users WHERE email=?`, [process.env.ADMIN_EMAIL]);
      if (!existing.length) await connection.query(`INSERT INTO \`${database}\`.users (username,email,password,role) VALUES (?,?,?,'admin')`, [process.env.ADMIN_USERNAME || 'admin', process.env.ADMIN_EMAIL, await bcrypt.hash(process.env.ADMIN_PASSWORD, 12)]);
    }
    console.log(`資料庫 ${database} 已就緒。`);
  } finally { await connection.end(); }
}
main().catch(error => { console.error(`初始化失敗：${error.code || error.name} ${error.message || '未知錯誤'}`); process.exitCode = 1; });
