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
function orderForClient(order) {
    const totalPrice = Number(order.totalPrice);
    return {
        ...order,
        meals: typeof order.meals === 'string' ? JSON.parse(order.meals) : order.meals,
        totalPrice,
        total_amount: totalPrice
    };
}

module.exports=(order)=>{

    return{

        ...order,

        meals:

        typeof order.meals==="string"

        ?JSON.parse(order.meals)

        :order.meals,

        totalPrice:Number(order.totalPrice),

        total_amount:Number(order.totalPrice)

    }

}