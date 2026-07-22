exports.getOrders=async(req,res)=>{
// ----------------------------------------------------
// API 3: 查詢登入會員的專屬訂單 (GET /api/user/orders)
// ----------------------------------------------------
app.get('/api/user/orders', async (req, res) => {
    // 驗證前端傳來的 Authorization Token
    const token = getToken(req);

    if (!token) {
        return res.status(401).json({ success: false, message: '未獲授權：缺少驗證金鑰' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        // 使用解碼出來的 userId 查詢個人訂單
        const [orders] = await pool.query(
            `SELECT id, order_number, customer_name AS customerName, customer_count AS customerCount,
                    memo, meals, pay_type AS payType, pickup_type AS pickupType,
                    selected_count AS selectedCount, total_amount AS totalPrice, status, created_at
             FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
            [decoded.userId]
        );

        res.json({ success: true, orders: orders.map(orderForClient) });
    } catch (err) {
        return res.status(403).json({ success: false, message: '金鑰無效或已過期，請重新登入' });
    }
});
// ----------------------------------------------------
// API 4: 訂單管理。管理頁可直接使用；若夾帶登入 Token，建立的訂單會歸屬給該會員。
// ----------------------------------------------------
app.get('/api/orders', async (_req, res) => {
    try {
        const [orders] = await pool.query(
            `SELECT id, order_number, customer_name AS customerName, customer_count AS customerCount,
                    memo, meals, pay_type AS payType, pickup_type AS pickupType,
                    selected_count AS selectedCount, total_amount AS totalPrice, status, created_at
             FROM orders ORDER BY created_at DESC`
        );
        res.json(orders.map(orderForClient));
    } catch (err) {
        console.error('讀取訂單失敗:', err);
        res.status(500).json({ success: false, message: '讀取訂單失敗' });
    }
});

app.post('/api/orders', async (req, res) => {
    try {
        const { customerName, customerCount, memo, meals, payType, pickupType, selectedCount, totalPrice, status = '待處理' } = req.body;
        if (!customerName || !customerCount || !Array.isArray(meals) || meals.length === 0 || !payType || !pickupType) {
            return res.status(400).json({ success: false, message: '請填寫完整訂單資料' });
        }
        const token = getToken(req);
        let userId = null;
        if (token) {
            userId = jwt.verify(token, JWT_SECRET).userId;
        }

        const orderNumber = `MARS-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const [result] = await pool.query(
            `INSERT INTO orders (user_id, order_number, customer_name, customer_count, memo, meals, pay_type, pickup_type, selected_count, total_amount, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [userId, orderNumber, customerName, customerCount, memo || '', JSON.stringify(meals), payType, pickupType, selectedCount || meals.length, totalPrice, status]
        );

        res.status(201).json({ success: true, message: '訂單建立成功，準備傳送物資！', id: result.insertId, orderNumber });
    } catch (err) {
        console.error('建立訂單失敗:', err);
        res.status(500).json({ success: false, message: '訂單建立失敗' });
    }
});

app.patch('/api/orders/:id', async (req, res) => {
    const allowed = { customerCount: 'customer_count', memo: 'memo', payType: 'pay_type', pickupType: 'pickup_type', status: 'status' };
    const updates = Object.entries(req.body).filter(([key]) => allowed[key]);
    if (updates.length === 0) return res.status(400).json({ success: false, message: '沒有可更新的欄位' });
    try {
        const assignments = updates.map(([key]) => `\`${allowed[key]}\` = ?`).join(', ');
        const values = updates.map(([, value]) => value);
        const [result] = await pool.query(`UPDATE orders SET ${assignments} WHERE id = ?`, [...values, req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: '找不到訂單' });
        res.json({ success: true, message: '訂單修改成功' });
    } catch (err) {
        console.error('更新訂單失敗:', err);
        res.status(500).json({ success: false, message: '更新訂單失敗' });
    }
});

app.delete('/api/orders/:id', async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM orders WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: '找不到訂單' });
        res.json({ success: true, message: '訂單刪除成功' });
    } catch (err) {
        console.error('刪除訂單失敗:', err);
        res.status(500).json({ success: false, message: '刪除訂單失敗' });
    }
});
}
// 啟動伺服器，監聽 3000 Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 MARS-NET 後端伺服器已啟動：http://localhost:${PORT}`);
});