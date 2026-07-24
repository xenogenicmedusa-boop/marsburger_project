const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const secret = process.env.JWT_SECRET || 'change-this-secret-in-production';
const publicUser = ({ id, username, email, role }) => ({ id, username, email, role });
const tokenFor = user => jwt.sign({ userId: user.id, username: user.username, role: user.role }, secret, { expiresIn: '24h' });

exports.register = async (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username?.trim() || !email?.trim() || !password || password.length < 6) return res.status(400).json({ message: '請輸入帳號、Email 與至少 6 碼密碼。' });
  try {
    const [exists] = await pool.query('SELECT id FROM users WHERE username=? OR email=?', [username.trim(), email.trim().toLowerCase()]);
    if (exists.length) return res.status(409).json({ message: '帳號或 Email 已被使用。' });
    const hash = await bcrypt.hash(password, 12);
    const [result] = await pool.query('INSERT INTO users (username,email,password) VALUES (?,?,?)', [username.trim(), email.trim().toLowerCase(), hash]);
    const user = { id: result.insertId, username: username.trim(), email: email.trim().toLowerCase(), role: 'customer' };
    res.status(201).json({ message: '註冊成功。', token: tokenFor(user), user });
  } catch (error) { next(error); }
};
exports.login = async (req, res, next) => {
  const { account, password } = req.body;
  if (!account || !password) return res.status(400).json({ message: '請輸入帳號與密碼。' });
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE username=? OR email=? LIMIT 1', [account, account]);
    if (!rows.length || !(await bcrypt.compare(password, rows[0].password))) return res.status(401).json({ message: '帳號或密碼錯誤。' });
    res.json({ message: '登入成功。', token: tokenFor(rows[0]), user: publicUser(rows[0]) });
  } catch (error) { next(error); }
};
