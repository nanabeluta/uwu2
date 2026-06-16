# 飲食靈感卡（簡易示範）

這是一個簡化的期末專題範例，包含：

- 前端：`index.html`、`style.css`、`script.js`（使用本地 JSON API `recipes.json` 自動載入中文示範食譜），並支援使用者新增菜色。 
- GAS 範例：`gas/Code.gs`（接收 POST 並將購物清單寫入 Google Spreadsheet）。

快速預覽：

1. 在本機開啟 `index.html`（或將此資料夾推到 GitHub 並啟用 GitHub Pages）。
2. 按下「產生靈感」取得隨機食譜；按「載入食材」展開食材清單，勾選後按「儲存購物清單」。

設定 GAS：

1. 建立一個 Google Spreadsheet，複製其 ID（網址中 /d/<id>/）。
2. 到 Google Apps Script（https://script.google.com/）建立新專案，貼上 `gas/Code.gs` 的內容，並將 `SHEET_ID` 替換成你的 Spreadsheet ID。
3. 部署 -> 新增部署 -> 選擇「網路應用程式」，權限設為「任何人（包含匿名者）」以便前端直接呼叫，取得部署後的 Web App URL。
4. 把取得的 Web App URL 貼到 `script.js` 的 `GAS_URL` 變數。

部署到 GitHub Pages：

1. 把此資料夾推到 GitHub（例如倉庫 `uwu2`）。
2. 在倉庫設定啟用 GitHub Pages（選擇 `main` 分支和 `/` 根目錄）。
3. 幾分鐘後即可透過 GitHub Pages 網址預覽，並把該網址交付。

注意事項：
- 本專案使用本地 JSON API `recipes.json`，可直接在 GitHub Pages 上載入中文示範食譜。
- 若不想使用公開 GAS 權限，可改成 OAuth 或透過後端代理；此範例為簡化教學用途。
