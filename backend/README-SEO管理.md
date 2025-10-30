# SEO Dashboard 使用說明

## 🔐 訪問方式

### 本地開發環境
```
http://localhost:8000/backend/seo-dashboard.html
```

### 正式上線後
```
https://你的網域.com/backend/seo-dashboard.html
```

---

## 📱 管理頁面

### 1. SEO Dashboard (`seo-dashboard.html`)
**功能：**
- 檢查所有頁面的 SEO 標籤
- 查看 meta description、keywords
- 檢查圖片 alt 標籤
- Open Graph 和 Twitter Card 檢查

**使用方式：**
1. 在瀏覽器開啟上述網址
2. 系統會自動掃描所有 HTML 頁面
3. 顯示 SEO 評分和建議

### 2. Admin Dashboard (`admin.html`)
**功能：**
- 分頁內容管理
- 圖片上傳管理
- 商品新增/編輯
- 內容發布控制

**使用方式：**
```
http://localhost:8000/backend/admin.html
```

---

## 🔒 安全設定

### robots.txt 設定
確保 backend 資料夾不被搜索引擎索引：

```txt
# 在根目錄 robots.txt 中添加：
User-agent: *
Disallow: /backend/
```

### .htaccess 保護（Apache）
在 `backend/` 資料夾中添加 `.htaccess`：

```apache
# 限制訪問（可選）
AuthType Basic
AuthName "管理後台"
AuthUserFile /path/to/.htpasswd
Require valid-user

# 或簡單地禁止外部訪問
Order Deny,Allow
Deny from all
Allow from 127.0.0.1
Allow from localhost
```

### nginx 設定
```nginx
location /backend/ {
    # 限制 IP 訪問
    allow 127.0.0.1;
    allow 你的IP;
    deny all;
}
```

---

## 🎯 GAS 整合

### Google Apps Script 配置
在 `GAS-分頁管理-GitHub版.gs` 中已設定：

```javascript
// 圖片路徑配置
imagePaths: {
  base: 'images',
  shared: {
    logo: 'images/shared/logo',
    icons: 'images/shared/icons',
    hero: 'images/shared/hero'
  },
  pages: {
    home: 'images/pages/home',
    about: 'images/pages/about',
    news: 'images/pages/news',
    // ... 其他頁面
  },
  products: {
    ponkan: 'images/products/ponkan',
    murcott: 'images/products/murcott',
    taro: 'images/products/taro',
    waterChestnut: 'images/products/water-chestnut'
  }
}
```

### 使用 GAS 管理圖片
1. 在 Google Sheets 中編輯內容
2. 使用 GAS 自動生成圖片路徑
3. 匯出 JSON 資料
4. 推送到 GitHub（可選）

---

## 📊 SEO Dashboard 功能清單

### ✅ 頁面檢查
- [ ] Title 標籤（50-60字元）
- [ ] Meta Description（150-160字元）
- [ ] Meta Keywords
- [ ] H1 標籤（每頁一個）
- [ ] 圖片 Alt 標籤
- [ ] 內部連結
- [ ] 外部連結

### ✅ 社交媒體標籤
- [ ] Open Graph (Facebook)
- [ ] Twitter Card
- [ ] 分享圖片尺寸檢查

### ✅ 技術檢查
- [ ] 頁面載入速度
- [ ] 手機版適配
- [ ] 結構化資料（Schema.org）
- [ ] Sitemap 更新

---

## 🚀 快速開始

### 步驟1：啟動本地伺服器
```powershell
# 使用現有的批次檔
.\啟動本地伺服器.bat

# 或使用 Python
python -m http.server 8000
```

### 步驟2：訪問 SEO Dashboard
```
http://localhost:8000/backend/seo-dashboard.html
```

### 步驟3：查看報告
- 系統會自動掃描所有頁面
- 顯示 SEO 評分
- 提供優化建議

---

## 🔧 維護

### 定期檢查
- [ ] 每週檢查一次 SEO 評分
- [ ] 更新 meta 標籤
- [ ] 檢查圖片 alt 標籤
- [ ] 驗證內部連結

### 更新內容
1. 在 Google Sheets 中編輯
2. 使用 GAS 匯出資料
3. 推送到 GitHub
4. 驗證更新是否成功

---

## 💡 常見問題

### Q: 如何設定密碼保護？
A: 使用 .htaccess 或 nginx 配置限制訪問。

### Q: SEO Dashboard 資料從哪來？
A: 自動掃描網站所有 HTML 檔案。

### Q: 可以自動更新嗎？
A: 可以！使用 GAS 的自動推送功能。

### Q: 圖片路徑怎麼管理？
A: 使用新的分類結構，在 GAS 中配置路徑。

---

## 📞 支援

如有問題，請檢查：
1. Console 錯誤訊息（F12）
2. GAS 執行日誌
3. GitHub Actions 狀態

祝使用順利！🎉
