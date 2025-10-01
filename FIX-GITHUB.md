# 🔧 GitHub Pages 商品顯示修正指南

## 問題說明

你的網站 https://ganxinorchard.github.io/gonglaoping--/ 已成功上線，但**商品區沒有顯示**。

這是因為 JavaScript 檔案路徑問題導致無法載入。

## ✅ 快速修正方法

### 方法一：替換 index.html（推薦）

1. 將 `index-github.html` 改名為 `index.html`（覆蓋原檔案）
2. 重新上傳到 GitHub

```powershell
# 在專案資料夾執行
cd C:\Users\張-1\CascadeProjects\ganxin-orchard
copy index-github.html index.html
git add .
git commit -m "修正 JavaScript 路徑問題"
git push
```

### 方法二：手動修改 index.html

開啟 `index.html`，找到最底部的這幾行：

**修改前：**
```html
<script src="js/products.js"></script>
<script src="js/cart.js"></script>
<script src="js/checkout.js"></script>
<script src="js/main.js"></script>
```

**修改後：**
```html
<script src="./js/products.js"></script>
<script src="./js/cart.js"></script>
<script src="./js/checkout.js"></script>
<script src="./js/main.js"></script>
```

同時修改 CSS 路徑（第 7 行）：

**修改前：**
```html
<link rel="stylesheet" href="css/style.css">
```

**修改後：**
```html
<link rel="stylesheet" href="./css/style.css">
```

然後重新上傳：
```powershell
git add index.html
git commit -m "修正資源路徑"
git push
```

## 🔍 檢查方法

修正後，等待 1-2 分鐘讓 GitHub Pages 更新，然後：

1. 開啟網站：https://ganxinorchard.github.io/gonglaoping--/
2. 按 F12 開啟開發者工具
3. 切換到「Console」標籤
4. 重新整理頁面（Ctrl+F5）
5. 確認沒有紅色錯誤訊息
6. 商品應該會正常顯示

## 📁 確認檔案結構

你的 GitHub Repository 應該有這樣的結構：

```
gonglaoping--/
├── index.html
├── README.md
├── css/
│   └── style.css
├── js/
│   ├── products.js
│   ├── cart.js
│   ├── checkout.js
│   └── main.js
└── images/
    └── logo-placeholder.png
```

## ⚠️ 常見問題

### Q1: 修改後還是沒有商品？

**解決方法：**
1. 清除瀏覽器快取（Ctrl+Shift+Delete）
2. 使用無痕模式開啟網站
3. 等待 5-10 分鐘讓 GitHub Pages 完全更新

### Q2: 出現 404 錯誤？

**解決方法：**
確認 `js/` 資料夾和所有 JavaScript 檔案都有上傳到 GitHub。

檢查方法：
1. 前往 https://github.com/GanxinOrchard/gonglaoping--
2. 確認有 `js/` 資料夾
3. 點進去確認有 4 個 .js 檔案

### Q3: CSS 樣式跑掉？

**解決方法：**
同樣修改 CSS 路徑為 `./css/style.css`

## 🎯 完整上傳指令

如果你想重新上傳所有檔案：

```powershell
cd C:\Users\張-1\CascadeProjects\ganxin-orchard

# 使用修正版的 index.html
copy index-github.html index.html

# 加入所有變更
git add .

# 提交
git commit -m "修正 GitHub Pages 路徑問題"

# 推送
git push origin main
```

## ✨ 預期結果

修正後，你的網站應該會顯示：
- ✅ 16 個商品（有機文旦禮盒、椪柑禮盒等）
- ✅ 購物車功能正常
- ✅ 可以加入商品到購物車
- ✅ 折扣碼功能正常
- ✅ 所有樣式正確顯示

## 📞 還是有問題？

請提供：
1. 瀏覽器 Console 的錯誤訊息（F12 → Console）
2. 你的 GitHub Repository 連結
3. 檔案結構截圖

我會幫你進一步診斷！
