# Logo 路徑設定指南

## ✅ 已完成的修改

我已經將以下三個模板檔案中的 logo 圖片路徑改為 Google Drive 連結格式：

### 1. `templates/header.html`
- ✅ 桌面版 logo（第 7 行）
- ✅ 手機版 logo（第 99 行）

### 2. `templates/footer.html`
- ✅ 頁尾 logo（第 18 行）

### 3. `templates/mobile-menu.html`
- ✅ 手機選單 logo（第 9 行）

---

## 🔧 下一步：取得正確的 Logo 檔案 ID

### 方法 1：從 Google Drive 取得檔案 ID（推薦）

1. **開啟您的 Google Drive**
   - 前往 logo 資料夾（ID: `1cRQPgc1XuwFMXzpepfrSGsNJG3TOF3oT`）

2. **找到您的 logo 圖片**
   - 例如：`柑心商標.png`

3. **右鍵點選該圖片 → 選擇「取得連結」**

4. **設定共用權限**
   - 選擇「知道連結的任何人」
   - 權限設為「檢視者」
   - 點選「複製連結」

5. **從連結中取得檔案 ID**
   
   連結格式：
   ```
   https://drive.google.com/file/d/1ABC123xyz456/view?usp=sharing
   ```
   
   檔案 ID 就是：`1ABC123xyz456`（中間那一段）

---

## 📝 替換檔案 ID

### 需要替換的檔案：

1. **templates/header.html**（2 處）
2. **templates/footer.html**（1 處）
3. **templates/mobile-menu.html**（1 處）

### 搜尋並替換：

在每個檔案中，搜尋：
```
YOUR_LOGO_FILE_ID
```

替換為您的實際檔案 ID，例如：
```
1ABC123xyz456
```

### 完整連結範例：

**修改前：**
```html
<img src="https://drive.google.com/uc?export=view&id=YOUR_LOGO_FILE_ID" alt="柑心果園">
```

**修改後：**
```html
<img src="https://drive.google.com/uc?export=view&id=1ABC123xyz456" alt="柑心果園">
```

---

## 🚀 快速替換方法

### 使用 VS Code 全域搜尋替換：

1. **按 Ctrl + Shift + H**（開啟全域搜尋替換）

2. **搜尋：**
   ```
   YOUR_LOGO_FILE_ID
   ```

3. **替換為：**
   ```
   您的實際檔案ID
   ```

4. **限制搜尋範圍：**
   ```
   templates/
   ```

5. **點選「全部替換」**

---

## ✅ 檢查清單

替換完成後，確認：

- [ ] `templates/header.html` 中的 2 個 logo 路徑已更新
- [ ] `templates/footer.html` 中的 1 個 logo 路徑已更新
- [ ] `templates/mobile-menu.html` 中的 1 個 logo 路徑已更新
- [ ] 圖片在 Google Drive 中的共用權限設為「知道連結的任何人」
- [ ] 測試頁面，確認 logo 圖片正常顯示

---

## 🧪 測試步驟

1. **儲存所有修改的模板檔案**

2. **清除瀏覽器快取**
   - 按 `Ctrl + Shift + R`

3. **檢查頁面**
   - 桌面版 header 的 logo
   - 手機版 header 的 logo
   - 頁尾的 logo
   - 手機選單的 logo

4. **確認圖片載入**
   - 開啟開發者工具（F12）
   - 查看 Network 標籤
   - 確認圖片請求成功（狀態碼 200）

---

## 💡 替代方案：使用 GitHub Pages

如果您想要使用 GitHub Pages 託管圖片：

1. **將 logo 圖片放在 `images/` 資料夾**

2. **使用相對路徑：**
   ```html
   <img src="./images/柑心商標.png" alt="柑心果園">
   ```

3. **或使用絕對路徑：**
   ```html
   <img src="https://ganxinorchard.github.io/gonglaoping--/images/柑心商標.png" alt="柑心果園">
   ```

---

## 🔍 常見問題

### Q: 為什麼要用 Google Drive？
**A:** 集中管理圖片，不用每次都更新 GitHub 倉庫。

### Q: 圖片不顯示怎麼辦？
**A:** 檢查：
1. 檔案 ID 是否正確
2. 共用權限是否設定為「知道連結的任何人」
3. 檔案是否存在

### Q: 可以用其他圖床嗎？
**A:** 可以！只要是公開可存取的圖片連結都可以。

### Q: 需要更新所有頁面嗎？
**A:** 不需要！因為使用統一模板，只需修改模板檔案，所有頁面會自動更新。

---

## 📋 目前狀態

- ✅ 模板檔案已更新為 Google Drive 連結格式
- ⏳ 等待您提供實際的 logo 檔案 ID
- ⏳ 替換 `YOUR_LOGO_FILE_ID` 為實際 ID
- ⏳ 測試確認圖片正常顯示

---

**請告訴我您的 logo 檔案 ID，我可以幫您直接替換！** 🎯
