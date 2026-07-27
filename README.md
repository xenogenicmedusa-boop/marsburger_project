# MARS Burger 點餐系統整合專案

MARS Burger 是整合會員、線上點餐、訂單追蹤與管理後台的電子商務網站。

## 功能簡介與測試帳號

- 前台：會員註冊／登入、實驗菜單、購物車、電話、外送地址、影片展示與我的訂單。
- 後台：訂單狀態管理、日週月 KPI、餐點用量統計與 CSV 報表下載。

| 身分 | 帳號 | 密碼 | 用途 |
| --- | --- | --- | --- |
| 管理員 | `admin@example.com` | `admin123456` | 管理訂單、KPI 與 CSV 報表 |
| 一般會員 | 請自行註冊 | 自訂 | 點餐與查詢個人訂單 |

```powershell
cd backend
npm.cmd run init-db
npm.cmd start
```

開啟 `http://localhost:3000`。正式環境請修改 `backend/.env` 的 `ADMIN_PASSWORD` 與 `JWT_SECRET`。

## 技術總覽

| 類別 | 使用技術 | 用途 |
| --- | --- | --- |
| 前端 | HTML5、CSS3、JavaScript ES6、Bootstrap 5 | SPA、RWD、Modal、Carousel、表單互動 |
| 後端 | Node.js、Express 5 | REST API、會員與訂單流程 |
| 串接 | Fetch API、JSON、JWT Bearer Token | 資料交換與登入權限驗證 |
| 資料庫 | MySQL／MariaDB、mysql2 | 會員、訂單、電話、外送地址與報表資料 |
| 安全 | bcrypt、jsonwebtoken、dotenv | 密碼雜湊、Token 與環境變數 |
| 視覺化 | Chart.js、Bootstrap Modal／Carousel | KPI、輪播與互動視窗 |
| 雲端平台 | 目前為本機部署 | 可延伸至 Render、Railway、Azure、AWS 或 GCP |
| 開發工具 | VS Code、PowerShell、npm、Git | 開發、測試、版本管理 |
| AI 助手 | Codex | 功能整合、資料庫遷移與文件撰寫 |

## 專案畫面展示

| 畫面 | 入口 | 功能 |
| --- | --- | --- |
| 前台 SPA | [frontend/index.html](frontend/index.html) | 點餐、會員、影片與我的訂單 |
| 管理後台 | [訂單管理](frontend/pages/marsburger_orderList.html) | 訂單、KPI、CSV 報表 |
| 品牌頁 | [SPA.html](frontend/pages/SPA.html) | 品牌、地圖、招募、隱私權政策 |
| 影片頁 | [video.html](frontend/pages/video.html) | Cinematic Reel 輪播影片 |

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

## 分支總覽與細節

### 最新分支關係

```text
main
└─ js4 / SPAtoINDEX / registerlaw
   └─ orderinfo
      └─ readme
         └─ readme_branch / video
            └─ logo（目前分支）
               ├─ logo
               ├─ video
               ├─ readme_v1
               ├─ @media
               └─ lazyloading（最新提交）
```

### 分支與提交明細

| 分支 | 最新提交 | 上游 | 狀態與用途 |
| --- | --- | --- | --- |
| `main` | `f621ed0` | — | 原始專案基準與遠端預設分支。 |
| `js4` | `10d1f01` | `main` | 會員、API、SPA、訂單與後台整合基礎。 |
| `SPAtoINDEX` | `10d1f01` | `main` | 與 `js4` 同一提交，保留 SPA 整合至首頁的功能標記。 |
| `registerlaw` | `10d1f01` | `main` | 與 `js4` 同一提交，保留會員條款流程的功能標記。 |
| `orderinfo` | `6422253` | `js4` | 訂單資訊、購物車、電話與外送地址資料流程。 |
| `readme` | `520abdb` | `orderinfo` | 專案功能、技術與操作文件整理。 |
| `readme_branch` | `a3ba56d` | `readme` | 文件延伸與影片／視覺功能的共同基礎。 |
| `video` | `a3ba56d` | `readme_branch` | 與 `readme_branch` 同一提交，保留影片展示功能標記。 |
| `logo` | `99b0e19` | `readme_branch` | 目前工作與遠端追蹤分支，整合品牌視覺與效能優化。 |

### `logo` 分支最新提交序列

| 提交 | 說明 |
| --- | --- |
| `993d688` | 品牌 Logo 與首頁品牌視覺。 |
| `d9a7b14` | 影片展示功能。 |
| `b2d8d21` | README 第一版更新。 |
| `97c4758` | RWD／媒體查詢調整。 |
| `99b0e19` | 菜單圖片 Lazy Loading 效能優化。 |

### 常用 Git 指令

```powershell
# 查看分支與遠端追蹤狀態
git branch -a --verbose

# 切換最新展示分支
git switch logo

# 檢視完整提交圖
git log --oneline --decorate --graph --all

# 比較訂單資料功能變化
git diff js4..orderinfo

# 比較文件／視覺功能演進
git log --oneline readme..logo
```
