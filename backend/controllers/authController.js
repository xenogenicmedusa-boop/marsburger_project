const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors()); // 允許跨網域請求 (CORS)
app.use(express.json()); // 解析 JSON Request Body
app.use(express.static(path.join(__dirname, '..')));

// 1. 設定資料庫連接池
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'mars_lab_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const JWT_SECRET = process.env.JWT_SECRET || 'mars_lab_super_secret_key_2026';

function getToken(req) {
    const authHeader = req.headers.authorization;
    return authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
}
exports.register=async(req,res)=>{
// ----------------------------------------------------
// API 1: 會員註冊 (POST /api/register)
// ----------------------------------------------------
app.post('/api/register', async (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({ success: false, message: '請填寫完整註冊欄位' });
    }

    try {
        // 檢查帳號或 Email 是否重複
        const [existing] = await pool.query(
            'SELECT id FROM users WHERE username = ? OR email = ?',
            [username, email]
        );

        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: '該帳號編碼或 Email 已被註冊！' });
        }

        // 密碼加鹽加密
        const hashedPassword = await bcrypt.hash(password, 10);

        // 存入資料庫
        await pool.query(
            'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
            [username, hashedPassword, email]
        );

        res.json({ success: true, message: 'MARS-NET 註冊成功，歡迎加入基地！' });
    } catch (err) {
        console.error('註冊失敗:', err);
        res.status(500).json({ success: false, message: '伺服器內部錯誤' });
    }
});

}
exports.login=async(req,res)=>{
// ----------------------------------------------------
// API 2: 會員登入 (POST /api/login)
// ----------------------------------------------------
app.post('/api/login', async (req, res) => {
    const { account, password } = req.body;

    if (!account || !password) {
        return res.status(400).json({ success: false, message: '請輸入帳號與密碼' });
    }

    try {
        // 比對帳號或 Email
        const [users] = await pool.query(
            'SELECT * FROM users WHERE username = ? OR email = ?',
            [account, account]
        );

        if (users.length === 0) {
            return res.status(401).json({ success: false, message: '帳號不存在或驗證失敗' });
        }

        const user = users[0];

        // 驗證密碼
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ success: false, message: '存取密碼錯誤' });
        }

        // 簽發 JWT Token (有效期限 24 小時)
        const token = jwt.sign(
            { userId: user.id, username: user.username, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: '驗證成功，連線建立！',
            token: token,
            user: { id: user.id, username: user.username, email: user.email }
        });
    } catch (err) {
        console.error('登入失敗:', err);
        res.status(500).json({ success: false, message: '伺服器內部錯誤' });
    }
});
}
// 啟動伺服器，監聽 3000 Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 MARS-NET 後端伺服器已啟動：http://localhost:${PORT}`);
});
