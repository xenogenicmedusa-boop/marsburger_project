# MARS Burger 點餐系統整合專案

MARS Burger 是一套整合會員、線上點餐、訂單追蹤與管理後台的電子商務網站。前台提供商品瀏覽、購物車與會員訂單查詢；管理端可檢視訂單、調整訂單狀態、統計銷售 KPI 與匯出報表。

## 1. 功能簡介與測試帳號

### 前台功能

- Hero Carousel、固定背景與火星實驗菜單
- 商品卡片、購物車、電話欄位、外送地址與線上建立訂單
- 會員註冊、登入、忘記密碼 Email 聯絡入口
- 會員通訊協議、隱私權政策與履歷投遞 Email 入口
- 會員個人訂單查詢與品牌影片展示

### 管理後台功能

- 管理員登入與全部訂單查詢
- 訂單狀態更新：待處理、製作中、已完成、已取消
- 日／週／月／全部期間 KPI：訂單數、營收、完成數與完成率
- 餐點用量統計、銷售資料與 CSV 報表下載

### 測試帳號

| 身分 | 帳號 | 密碼 | 用途 |
| --- | --- | --- | --- |
| 管理員 | `admin@example.com` | `admin123456` | 後台訂單、KPI 與報表管理 |
| 一般會員 | 請自行註冊 | 自訂 | 測試登入、點餐與我的訂單 |

> 正式部署時，請在 `backend/.env` 修改 `ADMIN_PASSWORD` 與 `JWT_SECRET`。

### 本機啟動

```powershell
cd backend
npm.cmd run init-db
npm.cmd start
```

開啟 `http://localhost:3000`。資料庫連線資訊設定於 `backend/.env`。

## 2. 技術與說明

| 類別 | 使用技術 | 專案用途 |
| --- | --- | --- |
| 前端 | HTML5、CSS3、JavaScript ES6、Bootstrap 5 | SPA、RWD、Modal、Carousel、表單互動 |
| 後端 | Node.js、Express 5 | REST API、會員與訂單流程 |
| 串接 | Fetch API、JSON、JWT Bearer Token | 前後端資料交換與權限驗證 |
| 資料庫 | MySQL／MariaDB、mysql2 | 會員、訂單、餐點 JSON、電話與外送地址資料 |
| 身分安全 | bcrypt、jsonwebtoken、dotenv | 密碼雜湊、Token 與環境變數管理 |
| 視覺化 | Chart.js、Bootstrap Modal／Carousel | KPI 圖表、輪播與互動視窗 |
| 雲端平台 | 目前採本機部署 | 可延伸至 Render、Railway、Azure、AWS 或 GCP |
| 開發工具 | VS Code、PowerShell、npm、Git | 開發、測試、套件與版本控制 |
| AI 助手 | Codex | 程式整合、功能實作、資料庫遷移與文件撰寫 |

### API 概覽

| 類型 | 路徑 | 權限 | 說明 |
| --- | --- | --- | --- |
| POST | `/api/register` | 公開 | 註冊會員並回傳 Token |
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
| 前台 SPA | [首頁／點餐系統](frontend/index.html) | 會員、實驗菜單、購物車、外送地址、影片與我的訂單 |
| 管理後台 | [訂單管理後台](frontend/pages/marsburger_orderList.html) | 訂單狀態、KPI、CSV 報表 |
| 品牌展示頁 | [品牌展示頁](frontend/pages/SPA.html) | 品牌介紹、地圖、招募與隱私權政策 |
| 影片展示頁 | [Cinematic Reel](frontend/pages/video.html) | 火星漢堡沉浸式輪播影片 |

## 專案結構

```text
marsburger_project/
├─ frontend/
│  ├─ index.html
│  ├─ js/app.js
│  ├─ images/
│  └─ pages/
│     ├─ marsburger_orderList.html
│     ├─ SPA.html
│     └─ video.html
└─ backend/
   ├─ server.js
   ├─ schema.sql
   ├─ init-db.js
   ├─ controllers/
   └─ routes/
```

## 4. 分支總覽與細節

### 目前分支關係

```text
main
└─ js4 / SPAtoINDEX / registerlaw
   └─ orderinfo
      └─ readme
         └─ readme_branch / video
            └─ logo（目前分支）
```

### 分支用途

| 分支 | 最新提交 | 上游分支 | 主要內容與用途 |
| --- | --- | --- | --- |
| `main` | `f621ed0` | — | 原始專案基準與遠端預設分支。 |
| `js4` | `10d1f01` | `main` | 前後端 API、會員、SPA 與訂單功能的整合基礎。 |
| `SPAtoINDEX` | `10d1f01` | `main` | 與 `js4` 同一提交；保留 SPA 整合至首頁的功能標記。 |
| `registerlaw` | `10d1f01` | `main` | 與 `js4` 同一提交；保留會員註冊／條款流程的功能標記。 |
| `orderinfo` | `6422253` | `js4` | 訂單資訊、電話、外送地址、購物車與後端資料欄位調整。 |
| `readme` | `520abdb` | `orderinfo` | 專案功能、技術棧、啟動方式與操作文件整理。 |
| `readme_branch` | `a3ba56d` | `readme` | 文件分支延伸，作為影片與視覺功能的共同基礎。 |
| `video` | `a3ba56d` | `readme_branch` | 與 `readme_branch` 同一提交；保留影片展示功能標記。 |
| `logo` | `d9a7b14` | `readme_branch` | 目前工作分支；包含品牌 Logo／影片視覺相關提交。 |

### 分支差異重點

| 比較範圍 | 差異焦點 |
| --- | --- |
| `main..js4` | 建立會員、登入、訂單 API、資料庫結構、SPA 與後台基礎。 |
| `js4..orderinfo` | 訂單欄位、首頁購物車、配送／地址與訂單資訊流程。 |
| `orderinfo..readme` | README 文件與後台首頁導覽補強。 |
| `readme..logo` | 品牌視覺、影片展示、首頁樣式與文件後續整合。 |

### 建議使用方式

- 展示最新視覺與功能：使用目前的 `logo` 分支。
- 檢視最初版本：切換至 `main`。
- 檢視訂單資料流程演進：比較 `js4` 與 `orderinfo`。
- `SPAtoINDEX`、`registerlaw` 與 `video` 是功能命名分支；目前分別與其對應基礎提交相同。

```powershell
# 檢視所有分支
git branch -a

# 切換最新展示分支
git switch logo

# 比較訂單資訊功能差異
git diff js4..orderinfo

# 檢視分支提交圖
git log --oneline --decorate --graph --all
```
