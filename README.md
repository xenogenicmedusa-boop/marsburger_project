# MARS Burger 點餐系統整合專案

MARS Burger 是一套整合會員、線上點餐、訂單追蹤與管理後台的電子商務網站。前台提供商品瀏覽、購物車與會員訂單查詢；管理端可檢視訂單、調整訂單狀態、統計銷售 KPI 與匯出報表。

## 1. 功能簡介與測試帳號

### 前台功能

- 首頁 Hero Carousel 與火星實驗菜單
- 商品卡片、購物車、金額統計與線上建立訂單
- 會員註冊、登入、忘記密碼 Email 聯絡入口
- 會員通訊協議條款、隱私權政策與履歷投遞 Email 入口
- 會員個人訂單查詢
- 外送訂單地址欄位與電話號碼收集

### 管理後台功能

- 管理員登入與全部訂單查詢
- 訂單狀態更新：待處理、製作中、已完成、已取消
- 本日／本週／本月／全部期間的訂單數、營收、完成數與完成率
- 餐點用量統計與銷售資料
- CSV 銷售報表下載
- 回首頁導覽按鈕

### 測試帳號

| 身分 | 帳號 | 密碼 | 用途 |
| --- | --- | --- | --- |
| 管理員 | `admin@example.com` | `admin123456` | 登入管理後台、檢視 KPI、管理訂單與下載報表 |
| 一般會員 | 請自行註冊 | 自訂 | 測試會員登入、線上點餐與我的訂單 |

> 正式環境請在 `backend/.env` 修改 `ADMIN_PASSWORD` 與 `JWT_SECRET`，不可沿用測試密碼。

### 本機啟動

```powershell
cd backend
npm.cmd run init-db
npm.cmd start
```

開啟 `http://localhost:3000`。資料庫設定位於 `backend/.env`；預設使用本機 MySQL。

## 2. 技術與說明

### 使用技術總覽

| 類別 | 使用技術 | 專案用途 |
| --- | --- | --- |
| 前端 | HTML5、CSS3、JavaScript ES6、Bootstrap 5 | SPA 前台、RWD 排版、Modal、Carousel、表單互動 |
| 後端 | Node.js、Express 5 | REST API、靜態網站提供、會員與訂單流程 |
| 串接 | Fetch API、JSON、JWT Bearer Token | 前後端資料交換、登入驗證、權限傳遞 |
| 資料庫 | MySQL／MariaDB、mysql2 | 會員、訂單、餐點 JSON、銷售資料與報表查詢 |
| 身分安全 | bcrypt、jsonwebtoken、dotenv | 密碼雜湊、JWT 登入狀態、環境變數管理 |
| 視覺化 | Chart.js、Bootstrap Modal／Carousel | KPI 圖表、輪播與互動視窗 |
| 雲端平台 | 目前採本機部署 | 可延伸部署至 Render、Railway、Azure、AWS 或 GCP，並改用受管理 MySQL |
| 開發工具 | VS Code、PowerShell、npm、Git | 開發、執行、套件管理與版本控制 |
| AI 助手 | Codex | 協助程式整合、前後端功能實作、資料庫遷移與文件撰寫 | GEMINI | 網頁設計排版 |

### API 概覽

| 類型 | 路徑 | 權限 | 說明 |
| --- | --- | --- | --- |
| POST | `/api/register` | 公開 | 註冊會員並回傳登入 Token |
| POST | `/api/login` | 公開 | 會員／管理員登入 |
| GET | `/api/orders/mine` | 會員 | 查詢自己的訂單 |
| POST | `/api/orders` | 會員 | 建立訂單 |
| GET | `/api/orders` | 管理員 | 取得全部訂單 |
| PATCH | `/api/orders/:id` | 管理員 | 更新訂單狀態 |
| GET | `/api/dashboard` | 管理員 | KPI、銷售與餐點用量統計 |
| GET | `/api/dashboard/report.csv` | 管理員 | 匯出 CSV 報表 |

## 3. 專案畫面展示

| 畫面 | 入口 | 可操作內容 |
| --- | --- | --- |
| 前台 SPA | [首頁／點餐系統](frontend/index.html) | Hero 輪播、會員登入註冊、實驗菜單、購物車、外送地址、我的訂單 |
| 管理後台 | [訂單管理後台](frontend/pages/marsburger_orderList.html) | 管理員登入、手動更新訂單、訂單狀態、KPI、CSV 報表 |
| 品牌介紹 SPA | [品牌展示頁](frontend/pages/SPA.html) | 品牌介紹、地圖、招募與隱私權政策 Modal |

### 前台視覺素材

| 首頁輪播 | 實驗菜單 |
| --- | --- |
| ![Olympus 經典牛肉堡](frontend/images/beef_olympus.jpg) | ![松露牛肉堡](frontend/images/beef_truffle.jpg) |

## 專案結構

```text
marsburger_project/
├─ frontend/
│  ├─ index.html                 # 前台點餐 SPA
│  ├─ js/app.js                  # 前台互動、會員、購物車與訂單 API
│  ├─ images/                    # 餐點與網站素材
│  └─ pages/
│     ├─ marsburger_orderList.html # 管理後台
│     └─ SPA.html                # 品牌展示頁
└─ backend/
   ├─ server.js                  # Express 入口
   ├─ schema.sql                 # MySQL 資料表定義
   ├─ init-db.js                 # 資料庫初始化與遷移
   ├─ controllers/               # Auth、訂單、會員、Dashboard 邏輯
   └─ routes/                    # API 路由
```

## 分支總覽與細節

本專案採用功能分支逐步整合前台、訂單與文件內容；目前分支關係如下。

```text
main
 └─ js4 / SPAtoINDEX / registerlaw
     └─ orderinfo
         └─ readme（目前分支）
```

| 分支 | 基準／目前狀態 | 主要內容 | 說明 |
| --- | --- | --- | --- |
| `main` | 專案基準分支 | 初始專案結構 | 作為原始穩定基礎。 |
| `js4` | 與 `SPAtoINDEX`、`registerlaw` 指向同一提交 | 前端 SPA、會員與 API 整合基礎 | 三個分支目前為同一版本節點，可視為不同功能命名的共用快照。 |
| `SPAtoINDEX` | 同 `js4` | SPA 視覺與首頁整合 | 將品牌展示／SPA 版面延伸至首頁整合方向。 |
| `registerlaw` | 同 `js4` | 會員註冊與協議流程基礎 | 為會員條款與註冊流程相關工作節點。 |
| `orderinfo` | 建立於 `js4` 後 | 訂單資訊與配送資料 | 新增／調整訂單控制器、資料庫初始化、首頁購物車與地址／電話資料流程。 |
| `readme` | 建立於 `orderinfo` 後，目前工作分支 | 文件與後台入口整理 | 擴充 README，並補強後台回首頁導覽與專案使用說明。 |

### 分支使用建議

- 日常展示與交付：使用 `readme` 分支。
- 若要檢視最初專案：切換至 `main`。
- 若要追蹤訂單資料欄位與前台購物車調整：比較 `js4` 與 `orderinfo`。
- 若要保留功能命名紀錄：`SPAtoINDEX`、`registerlaw` 可作為 `js4` 的標記分支；它們目前沒有額外差異。

```powershell
# 查看分支
git branch -a

# 切換至文件整合版本
git switch readme

# 比較訂單功能差異
git diff js4..orderinfo
```
