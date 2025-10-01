# 🔧 問題排查指南

## 問題：購物車打不開、無法加入購物車

### 🚀 快速解決方案

#### 方法 1：執行快速修復（推薦）
```cmd
QUICK-FIX.bat
```

#### 方法 2：手動清除快取
1. 開啟 `CLEAR-CACHE-AND-TEST.html`
2. 點擊「清除所有快取」
3. 按 `Ctrl + F5` 強制重新整理
4. 測試功能

#### 方法 3：瀏覽器清除快取
1. 按 `Ctrl + Shift + Delete`
2. 選擇「快取的圖片和檔案」
3. 時間範圍選「所有時間」
4. 點擊「清除資料」
5. 按 `Ctrl + F5` 重新整理

---

## 📋 詳細排查步驟

### 步驟 1：確認檔案已上傳
```cmd
cd C:\Users\張-1\CascadeProjects\ganxin-orchard
git status
```

如果有未提交的檔案，執行：
```cmd
git add .
git commit -m "Fix"
git push origin main
```

### 步驟 2：等待 GitHub Pages 更新
- GitHub Pages 需要 1-2 分鐘更新
- 前往：https://github.com/你的帳號/gonglaoping--/actions
- 確認部署狀態為綠色勾勾

### 步驟 3：強制重新載入
- 按 `Ctrl + Shift + R` (Chrome/Edge)
- 或 `Ctrl + F5` (所有瀏覽器)

### 步驟 4：檢查控制台錯誤
1. 按 `F12` 開啟開發者工具
2. 切換到「Console」標籤
3. 重新整理頁面
4. 查看是否有紅色錯誤訊息

---

## 🔍 常見錯誤及解決方法

### 錯誤 1：`products is not defined`
**原因**：products.js 未載入或未替換

**解決**：
```cmd
copy /Y "js\products-new.js" "js\products.js"
git add .
git commit -m "Update products"
git push
```

### 錯誤 2：`addToCart is not a function`
**原因**：cart.js 未載入

**解決**：
1. 檢查 index.html 是否有 `<script src="./js/cart.js"></script>`
2. 確認 cart.js 檔案存在
3. 清除瀏覽器快取

### 錯誤 3：購物車圖示點擊沒反應
**原因**：事件監聽器未綁定

**解決**：
1. 確認 cartIcon 元素存在
2. 檢查 cart.js 是否在 products.js 之後載入
3. 清除快取並重新整理

### 錯誤 4：購物車無法關閉
**原因**：關閉按鈕事件未綁定

**解決**：
1. 確認 closeCart 按鈕存在
2. 檢查 cart.js 中的事件監聽器
3. 點擊購物車外部區域關閉

---

## 🧪 測試清單

使用 `CLEAR-CACHE-AND-TEST.html` 進行測試：

- [ ] products 陣列存在
- [ ] addToCart 函數存在
- [ ] cart 變數存在
- [ ] updateCartUI 函數存在
- [ ] 購物車圖示可點擊
- [ ] 購物車可開啟
- [ ] 購物車可關閉
- [ ] 商品可加入購物車
- [ ] 購物車顯示商品
- [ ] 運費計算正確

---

## 📞 仍然無法解決？

### 檢查清單：
1. ✅ 已執行 QUICK-FIX.bat
2. ✅ 已清除瀏覽器快取
3. ✅ 已等待 GitHub Pages 更新（1-2分鐘）
4. ✅ 已按 Ctrl+F5 強制重新整理
5. ✅ 已檢查控制台錯誤訊息

### 提供以下資訊：
1. 瀏覽器類型和版本
2. 控制台錯誤訊息（F12 → Console）
3. 網路請求狀態（F12 → Network）
4. 是否在本地測試還是線上網站

---

## 🎯 預防措施

### 每次修改後：
1. 執行 QUICK-FIX.bat 或 FIX-ALL.bat
2. 等待 1-2 分鐘
3. 清除快取
4. 測試功能

### 版本控制：
- 每次重大更新修改 `cache-clear.js` 中的 `CURRENT_VERSION`
- 這會強制所有用戶清除快取

---

**最後更新：2025-10-02**
