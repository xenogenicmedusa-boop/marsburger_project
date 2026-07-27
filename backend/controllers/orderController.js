const pool = require('../config/db');
const allowedStatuses = ['pending', 'processing', 'completed', 'cancelled'];
const format = row => ({ ...row, totalPrice: Number(row.totalPrice), meals: typeof row.meals === 'string' ? JSON.parse(row.meals) : row.meals });
const baseSelect = `SELECT o.id,o.order_number AS orderNumber,o.customer_name AS customerName,o.phone,o.customer_count AS customerCount,o.memo,o.meals,o.pay_type AS payType,o.pickup_type AS pickupType,o.delivery_address AS deliveryAddress,o.selected_count AS selectedCount,o.total_amount AS totalPrice,o.status,o.created_at AS createdAt,u.username FROM orders o LEFT JOIN users u ON u.id=o.user_id`;

exports.createOrder = async (req, res, next) => {
  const { customerName, phone, customerCount = 1, memo = '', meals, payType, pickupType, deliveryAddress = '', totalPrice } = req.body;
  if (!customerName?.trim() || !phone?.trim() || !Array.isArray(meals) || !meals.length || !payType || !pickupType || (pickupType === '外送' && !deliveryAddress.trim()) || !Number.isFinite(Number(totalPrice)) || Number(totalPrice) < 0) return res.status(400).json({ message: '訂單資料不完整。' });
  try {
    const orderNumber = `MARS-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`;
    const [r] = await pool.query(`INSERT INTO orders (user_id,order_number,customer_name,phone,customer_count,memo,meals,pay_type,pickup_type,delivery_address,selected_count,total_amount) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`, [req.user?.userId || null, orderNumber, customerName.trim(), phone.trim(), customerCount, memo, JSON.stringify(meals), payType, pickupType, deliveryAddress.trim() || null, meals.reduce((n, meal) => n + Number(meal.quantity || 1), 0), Number(totalPrice)]);
    res.status(201).json({ message: '訂單已成立。', id: r.insertId, orderNumber });
  } catch (e) { next(e); }
};
exports.getUserOrders = async (req, res, next) => { try { const [rows] = await pool.query(`${baseSelect} WHERE o.user_id=? ORDER BY o.created_at DESC`, [req.user.userId]); res.json({ orders: rows.map(format) }); } catch (e) { next(e); } };
exports.getOrders = async (req, res, next) => { try { const [rows] = await pool.query(`${baseSelect} ORDER BY o.created_at DESC`); res.json({ orders: rows.map(format) }); } catch (e) { next(e); } };
exports.updateOrder = async (req, res, next) => { const { status } = req.body; if (!allowedStatuses.includes(status)) return res.status(400).json({ message: '無效的訂單狀態。' }); try { const [r] = await pool.query('UPDATE orders SET status=? WHERE id=?', [status, req.params.id]); if (!r.affectedRows) return res.status(404).json({ message: '找不到訂單。' }); res.json({ message: '訂單狀態已更新。' }); } catch (e) { next(e); } };
exports.deleteOrder = async (req, res, next) => { try { const [r] = await pool.query('DELETE FROM orders WHERE id=?', [req.params.id]); if (!r.affectedRows) return res.status(404).json({ message: '找不到訂單。' }); res.json({ message: '訂單已刪除。' }); } catch (e) { next(e); } };
