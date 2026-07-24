# MARS Burger 電子商務網站

## 啟動

1. 在 `backend` 複製 `.env.example` 為 `.env`，填入 MySQL 資料，並設定安全的 `JWT_SECRET` 與 `ADMIN_*` 管理員帳密。
2. 執行 `npm.cmd run init-db` 建立資料庫、資料表和首位管理員。
3. 執行 `npm.cmd start`，開啟 `http://localhost:3000`。

## 功能

- 商品瀏覽、購物車與線上訂餐
- 會員註冊、登入、個人訂單查詢
- 管理員訂單狀態更新與刪除
- 日／週／月 KPI、銷售圖、餐點用量排行
- 管理員 CSV 銷售報表下載

管理員只會在首次初始化時依 `.env` 的 `ADMIN_*` 資料建立；正式環境請採用私有強密碼與 JWT 金鑰。
