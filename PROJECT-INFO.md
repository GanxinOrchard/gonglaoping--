# 柑心果園電商網站專案

## 📋 專案資訊

- **專案名稱**：柑心果園
- **專案路徑**：`C:\Users\張-1\CascadeProjects\ganxin-orchard`
- **網站類型**：電商網站（水果蔬菜銷售）
- **網站連結**：https://ganxinorchard.github.io/gonglaoping--/

---

## 🛒 商品資訊

### 1. 公老坪椪柑
- 規格：23A/25A/27A/30A（4種）
- 價格：NT$ 680-980
- 運費：常溫 150元
- 圖片：`images/商品一(椪柑果實).jpg`

### 2. 東勢茂谷柑
- 規格：23A/25A/27A/30A（4種）
- 價格：NT$ 850-1150
- 運費：常溫 150元
- 圖片：`images/商品二(茂谷柑).png`

### 3. 菱角仁（整件）
- 規格：3公斤 x 4包
- 價格：NT$ 3,500
- 運費：冷凍 200元
- 圖片：`images/新鮮蔬果菱角仁.jpg`

### 4. 菱角仁（單品項）
- 規格：3公斤
- 價格：NT$ 990
- 運費：冷凍 200元
- 圖片：`images/新鮮蔬果菱角仁.jpg`

### 5. 菱角仁(斤)（單品項）
- 規格：600g
- 價格：NT$ 240
- 運費：冷凍 200元
- 圖片：`images/新鮮蔬果菱角仁.jpg`

---

## 💻 技術棧

- HTML5
- CSS3
- JavaScript (Vanilla)
- GitHub Pages 部署
- 無使用框架

---

## ✨ 主要功能

### 購物車系統
- 顯示商品規格（23A、25A等）
- 顯示配送方式（常溫/冷藏/冷凍）
- 運費計算（150/180/200）
- 滿 NT$1,800 免運
- 懸浮式購物車按鈕（右下角橘色圓形）
- 點擊外部關閉購物車

### 結帳流程（三步驟）
1. **步驟1**：訂購人資訊（姓名、電話、Email）
2. **步驟2**：收件人資訊（姓名、電話、地址、備註）
   - 可勾選「同訂購人資訊」
3. **步驟3**：確認訂單（訂單摘要、付款方式）

### 商品功能
- 商品規格選擇
- 加入購物車按鈕
- 推薦商品區塊
- 商品評論系統（100則）
- 銷售數量顯示

### 其他功能
- 清除快取功能（自動版本檢測）
- SEO優化（meta標籤、關鍵字）
- Facebook 連結整合
- 手機版優化（輸入不放大）
- 完整頁尾資訊

---

## 📁 重要檔案結構

```
ganxin-orchard/
├── index.html              # 首頁
├── product-detail.html     # 商品詳細頁
├── about.html              # 關於我們
├── news.html               # 最新消息
├── knowledge.html          # 蔬果知識+
├── css/
│   └── style.css          # 主要樣式
├── js/
│   ├── products.js        # 商品資料（需替換）
│   ├── products-new.js    # 新商品資料
│   ├── cart.js            # 購物車功能
│   ├── checkout.js        # 結帳功能
│   ├── cache-clear.js     # 清除快取
│   ├── reviews.js         # 評論系統
│   └── main.js            # 主要功能
├── images/                # 圖片資源
└── FIX-ALL.bat           # 上傳腳本
```

---

## 🚀 部署方式

### 上傳到 GitHub Pages
執行 `FIX-ALL.bat`，會自動：
1. 複製 `products-new.js` → `products.js`
2. 檢查檔案
3. Git add .
4. Git commit
5. Git push origin main

### 手動上傳
```cmd
cd C:\Users\張-1\CascadeProjects\ganxin-orchard
copy /Y "js\products-new.js" "js\products.js"
git add .
git commit -m "Update"
git push origin main
```

---

## 📞 聯絡資訊

- **電話**：0933-721-978
- **Facebook**：https://www.facebook.com/profile.php?id=61581488901343
- **地址**：台灣豐原公老坪
- **營業時間**：週一至週五 09:00-18:00

---

## 🎨 品牌資訊

- **品牌名稱**：柑心果園 Ganxin Orchard
- **品牌理念**：柑心手摘 × 產地直送
- **品牌故事**：把最自然的好味道，從山頂帶到你心裡。用心種柑，與你柑心相伴。

---

## 📝 運費規則

- **常溫配送**：NT$ 150（椪柑、茂谷柑）
- **冷藏配送**：NT$ 180
- **冷凍配送**：NT$ 200（菱角仁）
- **免運門檻**：滿 NT$ 1,800 免運（所有配送方式）

---

## 🔧 維護注意事項

1. **修改商品資料**：編輯 `js/products-new.js`，然後執行 `FIX-ALL.bat`
2. **清除快取**：修改 `js/cache-clear.js` 中的 `CURRENT_VERSION`
3. **圖片路徑**：確保圖片檔名正確（含副檔名）
4. **手機測試**：確認輸入框字體大小為 16px（防止放大）

---

## 📊 專案狀態

**完成度：100%**

✅ 所有核心功能已完成
✅ 手機版優化完成
✅ SEO優化完成
✅ 圖片路徑已修正
✅ 購物車功能完善
✅ 結帳流程完整

---

---

## 🆕 最新更新（2025-10-02 03:00）

### 已修復的問題：
1. ✅ 購物車功能完全正常
2. ✅ 結帳流程串接 Google Apps Script
3. ✅ 手機輸入不放大（字體 16px）
4. ✅ 三步驟結帳流程
5. ✅ 訂單自動儲存到 Google Sheets
6. ✅ 自動發送確認 Email

### 需要設定：
1. ⚠️ Google Apps Script 後端（參考 GAS-SETUP-GUIDE.txt）
2. ⚠️ 更新 js/checkout.js 中的 GAS_URL

### 執行修復：
```cmd
COMPLETE-FIX.bat
```

---

**最後更新：2025-10-02 03:00**
