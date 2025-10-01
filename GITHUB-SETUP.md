# GitHub 上傳教學

## 🚀 方法一：使用自動化腳本（推薦）

### 步驟 1：建立 GitHub Repository

1. 前往 https://github.com/new
2. 填寫資訊：
   - **Repository name**: `ganxin-orchard`
   - **Description**: 柑心果園農產品電商平台
   - **Public** 或 **Private**（依需求選擇）
   - ⚠️ **不要勾選** "Add a README file"
3. 點選「Create repository」

### 步驟 2：執行上傳腳本

在專案資料夾中，右鍵點選空白處，選擇「在終端機中開啟」，然後執行：

```powershell
.\upload-to-github.ps1
```

或直接雙擊 `upload-to-github.ps1` 檔案。

### 步驟 3：輸入資訊

腳本會詢問你的 GitHub Repository URL，格式如下：
```
https://github.com/你的使用者名稱/ganxin-orchard.git
```

例如：
```
https://github.com/GanxinOrchard/ganxin-orchard.git
```

---

## 🔧 方法二：手動上傳

### 前置作業

確保已安裝 Git：
- 下載：https://git-scm.com/download/win
- 安裝後重新開啟終端機

### 步驟 1：建立 GitHub Repository

同方法一的步驟 1。

### 步驟 2：初始化 Git

在專案資料夾中開啟終端機（PowerShell 或 CMD），執行：

```bash
git init
```

### 步驟 3：加入檔案

```bash
git add .
```

### 步驟 4：提交變更

```bash
git commit -m "Initial commit: 柑心果園電商平台"
```

### 步驟 5：連結遠端 Repository

將 `YOUR_USERNAME` 替換為你的 GitHub 使用者名稱：

```bash
git remote add origin https://github.com/YOUR_USERNAME/ganxin-orchard.git
```

### 步驟 6：推送到 GitHub

```bash
git branch -M main
git push -u origin main
```

---

## 🌐 啟用 GitHub Pages（免費託管網站）

上傳完成後，可以啟用 GitHub Pages 來免費託管你的網站：

### 步驟 1：進入 Repository 設定

1. 前往你的 GitHub Repository
2. 點選「Settings」（設定）

### 步驟 2：啟用 Pages

1. 在左側選單找到「Pages」
2. 在「Source」下拉選單選擇「main」分支
3. 點選「Save」

### 步驟 3：等待部署

幾分鐘後，你的網站就會上線！網址格式：
```
https://你的使用者名稱.github.io/ganxin-orchard/
```

---

## 📝 常見問題

### Q1: 執行腳本時出現「無法執行」錯誤

**解決方法**：開啟 PowerShell（以系統管理員身分），執行：
```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Q2: 推送時要求輸入帳號密碼

**解決方法**：
1. GitHub 已不支援密碼登入，需使用 Personal Access Token
2. 前往 https://github.com/settings/tokens
3. 點選「Generate new token (classic)」
4. 勾選 `repo` 權限
5. 複製產生的 token
6. 推送時，使用者名稱輸入你的 GitHub 使用者名稱，密碼輸入剛才的 token

### Q3: 如何更新已上傳的檔案？

修改檔案後，執行：
```bash
git add .
git commit -m "更新說明"
git push
```

### Q4: 想要更改 Repository 名稱

1. 前往 GitHub Repository 的「Settings」
2. 在「Repository name」欄位修改名稱
3. 在本地專案執行：
```bash
git remote set-url origin https://github.com/你的使用者名稱/新的名稱.git
```

---

## 🎯 上傳後的檢查清單

- [ ] 確認所有檔案都已上傳
- [ ] 檢查 README.md 是否正確顯示
- [ ] 測試 GitHub Pages 網站是否正常運作
- [ ] 設定 Google Sheets API
- [ ] 更新 `js/checkout.js` 中的 API URL
- [ ] 測試購物車功能
- [ ] 測試折扣碼功能

---

## 📞 需要協助？

如果遇到任何問題，可以：
1. 查看 Git 官方文件：https://git-scm.com/doc
2. 查看 GitHub 說明：https://docs.github.com/
3. 檢查錯誤訊息並搜尋解決方案

---

**祝你上傳順利！** 🎉
