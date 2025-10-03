# 🔧 全站瑕疵修復清單

## 📋 概述

本文件列出柑心果園網站需要修復的所有瑕疵，按優先級和類別分類。

---

## 🚨 高優先級（影響功能）

### 1. SEO 優化

#### 1.1 缺少 sitemap.xml
- **問題**：網站缺少 sitemap.xml，影響搜尋引擎索引
- **修復方式**：創建 sitemap.xml 並提交到 Google Search Console
- **狀態**：❌ 待修復

#### 1.2 缺少 robots.txt
- **問題**：網站缺少 robots.txt，無法控制爬蟲行為
- **修復方式**：創建 robots.txt
- **狀態**：❌ 待修復

#### 1.3 部分頁面缺少 meta description
- **問題**：checkout.html 等頁面缺少 meta description
- **修復方式**：為所有頁面添加完整的 meta 標籤
- **狀態**：❌ 待修復

#### 1.4 缺少 canonical 標籤
- **問題**：部分頁面缺少 canonical 標籤
- **修復方式**：為所有頁面添加 canonical 標籤
- **狀態**：❌ 待修復

### 2. 無障礙性（Accessibility）

#### 2.1 圖片缺少 alt 屬性
- **問題**：部分圖片缺少 alt 屬性
- **影響**：螢幕閱讀器無法識別
- **修復方式**：為所有圖片添加有意義的 alt 文字
- **狀態**：❌ 待修復

#### 2.2 表單缺少 label
- **問題**：contact.html 和 checkout.html 的部分表單元素缺少 label
- **影響**：無障礙性不佳
- **修復方式**：為所有表單元素添加 label
- **狀態**：❌ 待修復

#### 2.3 顏色對比度不足
- **問題**：部分文字顏色對比度 < 4.5:1
- **影響**：視力不佳者難以閱讀
- **修復方式**：調整顏色以符合 WCAG AA 標準
- **狀態**：❌ 待修復

#### 2.4 缺少 Skip to main content 連結
- **問題**：鍵盤使用者需要按多次 Tab 才能到達主內容
- **修復方式**：添加跳過導航的連結
- **狀態**：❌ 待修復

### 3. 效能優化

#### 3.1 圖片未優化
- **問題**：圖片檔案過大，載入速度慢
- **影響**：Lighthouse Performance 分數低
- **修復方式**：壓縮圖片並轉換為 WebP 格式
- **狀態**：❌ 待修復（已有指南）

#### 3.2 未使用 lazy loading
- **問題**：所有圖片同時載入
- **影響**：首次載入時間過長
- **修復方式**：為非首屏圖片添加 loading="lazy"
- **狀態**：❌ 待修復

#### 3.3 CSS/JS 未壓縮
- **問題**：CSS 和 JS 檔案未壓縮
- **影響**：檔案大小過大
- **修復方式**：使用壓縮工具
- **狀態**：❌ 待修復

---

## ⚠️ 中優先級（影響體驗）

### 4. 響應式設計

#### 4.1 手機版選單問題
- **問題**：手機版選單在某些裝置上顯示異常
- **修復方式**：調整 CSS media queries
- **狀態**：❌ 待修復

#### 4.2 表格在手機版溢出
- **問題**：grading.html 的表格在小螢幕上溢出
- **修復方式**：使用橫向滾動或卡片式佈局
- **狀態**：❌ 待修復

#### 4.3 字體大小在手機版過小
- **問題**：部分文字在手機版 < 16px
- **修復方式**：調整 font-size
- **狀態**：❌ 待修復

### 5. 使用者體驗

#### 5.1 購物車數量更新延遲
- **問題**：加入購物車後，數量顯示有延遲
- **修復方式**：優化 JavaScript 邏輯
- **狀態**：❌ 待修復

#### 5.2 缺少載入動畫
- **問題**：頁面切換時沒有載入提示
- **修復方式**：添加 loading spinner
- **狀態**：❌ 待修復

#### 5.3 錯誤訊息不明確
- **問題**：表單驗證錯誤訊息不夠清楚
- **修復方式**：改善錯誤訊息文案
- **狀態**：❌ 待修復

### 6. 內容完整性

#### 6.1 部分商品缺少詳細資訊
- **問題**：products.js 中部分商品資料不完整
- **修復方式**：補充商品描述、特色等資訊
- **狀態**：❌ 待修復

#### 6.2 新聞頁面缺少內容
- **問題**：news.html 和 news-detail.html 缺少實際內容
- **修復方式**：添加真實新聞內容
- **狀態**：❌ 待修復

#### 6.3 關於我們頁面資訊不足
- **問題**：about.html 內容較少
- **修復方式**：補充品牌故事、團隊介紹等
- **狀態**：❌ 待修復

---

## 📝 低優先級（優化項目）

### 7. 程式碼品質

#### 7.1 JavaScript 未模組化
- **問題**：所有 JS 寫在同一個檔案
- **修復方式**：拆分為多個模組
- **狀態**：❌ 待修復

#### 7.2 CSS 重複樣式
- **問題**：多處重複的 CSS 樣式
- **修復方式**：整理並使用 CSS 變數
- **狀態**：❌ 待修復

#### 7.3 缺少註解
- **問題**：部分程式碼缺少註解
- **修復方式**：添加清楚的註解
- **狀態**：❌ 待修復

### 8. 安全性

#### 8.1 表單缺少 CSRF 保護
- **問題**：contact.html 表單缺少 CSRF token
- **修復方式**：添加 CSRF 保護機制
- **狀態**：❌ 待修復

#### 8.2 缺少 Content Security Policy
- **問題**：未設定 CSP header
- **修復方式**：在 meta 標籤中添加 CSP
- **狀態**：❌ 待修復

### 9. 瀏覽器相容性

#### 9.1 IE11 不支援
- **問題**：網站在 IE11 無法正常運作
- **修復方式**：添加 polyfills 或顯示升級提示
- **狀態**：❌ 待修復（低優先級）

#### 9.2 Safari 樣式問題
- **問題**：部分 CSS 在 Safari 顯示異常
- **修復方式**：添加 -webkit- 前綴
- **狀態**：❌ 待修復

---

## 🔍 詳細修復步驟

### 修復 1：創建 sitemap.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://ganxinorchard.github.io/gonglaoping--/</loc>
        <lastmod>2025-10-03</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://ganxinorchard.github.io/gonglaoping--/products.html</loc>
        <lastmod>2025-10-03</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
    </url>
    <!-- 其他頁面... -->
</urlset>
```

### 修復 2：創建 robots.txt

```txt
User-agent: *
Allow: /

Sitemap: https://ganxinorchard.github.io/gonglaoping--/sitemap.xml
```

### 修復 3：添加 Skip to main content

在每個頁面的 `<body>` 開頭添加：

```html
<a href="#main-content" class="skip-link">跳到主要內容</a>

<style>
.skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    background: var(--primary-color);
    color: white;
    padding: 8px;
    text-decoration: none;
    z-index: 100;
}

.skip-link:focus {
    top: 0;
}
</style>
```

### 修復 4：為所有圖片添加 alt

```html
<!-- 錯誤 -->
<img src="image.jpg">

<!-- 正確 -->
<img src="image.jpg" alt="公老坪椪柑，果皮橙黃，果實飽滿">
```

### 修復 5：為表單添加 label

```html
<!-- 錯誤 -->
<input type="text" placeholder="姓名">

<!-- 正確 -->
<label for="name">姓名</label>
<input type="text" id="name" name="name" placeholder="請輸入您的姓名">
```

### 修復 6：添加 canonical 標籤

在每個頁面的 `<head>` 中添加：

```html
<link rel="canonical" href="https://ganxinorchard.github.io/gonglaoping--/products.html">
```

### 修復 7：添加 loading="lazy"

```html
<!-- 首屏圖片 -->
<img src="hero.jpg" alt="首頁背景" loading="eager">

<!-- 非首屏圖片 -->
<img src="product.jpg" alt="商品圖片" loading="lazy">
```

### 修復 8：顏色對比度檢查

使用 [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) 檢查：

```css
/* 不佳 */
.text {
    color: #999;
    background: #fff;
}

/* 良好 */
.text {
    color: #666;
    background: #fff;
}
```

---

## 📊 修復進度追蹤

| 類別 | 總數 | 已完成 | 進度 |
|-----|------|--------|------|
| SEO 優化 | 4 | 0 | 0% |
| 無障礙性 | 4 | 0 | 0% |
| 效能優化 | 3 | 0 | 0% |
| 響應式設計 | 3 | 0 | 0% |
| 使用者體驗 | 3 | 0 | 0% |
| 內容完整性 | 3 | 0 | 0% |
| 程式碼品質 | 3 | 0 | 0% |
| 安全性 | 2 | 0 | 0% |
| 瀏覽器相容性 | 2 | 0 | 0% |
| **總計** | **27** | **0** | **0%** |

---

## ✅ 驗證清單

修復完成後，使用以下工具驗證：

### SEO
- [ ] [Google Search Console](https://search.google.com/search-console)
- [ ] [Google Rich Results Test](https://search.google.com/test/rich-results)

### 無障礙性
- [ ] [WAVE](https://wave.webaim.org/)
- [ ] [axe DevTools](https://www.deque.com/axe/devtools/)
- [ ] Chrome Lighthouse Accessibility

### 效能
- [ ] Chrome Lighthouse Performance
- [ ] [PageSpeed Insights](https://pagespeed.web.dev/)
- [ ] [GTmetrix](https://gtmetrix.com/)

### 響應式
- [ ] Chrome DevTools Device Mode
- [ ] 實機測試（iOS、Android）

### 瀏覽器相容性
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

---

## 🎯 目標分數

修復完成後應達到：

- **Lighthouse Performance**: 95+
- **Lighthouse Accessibility**: 95+
- **Lighthouse Best Practices**: 95+
- **Lighthouse SEO**: 100
- **PageSpeed Insights (Mobile)**: 90+
- **PageSpeed Insights (Desktop)**: 95+

---

## 📅 修復時程

### 第一階段（1-2 天）
- ✅ 商品頁 JSON-LD
- ✅ 風味指標
- ✅ FAQ
- ✅ 相關商品推薦
- ✅ news.xml
- ✅ farming.html
- ✅ guide.html

### 第二階段（1 天）
- [ ] sitemap.xml
- [ ] robots.txt
- [ ] 所有頁面 meta 標籤
- [ ] canonical 標籤
- [ ] Skip to main content

### 第三階段（1-2 天）
- [ ] 圖片優化（WebP 轉換）
- [ ] lazy loading
- [ ] 圖片 alt 屬性
- [ ] 表單 label

### 第四階段（1 天）
- [ ] 響應式問題修復
- [ ] 顏色對比度調整
- [ ] 使用者體驗優化

### 第五階段（1 天）
- [ ] 最終測試
- [ ] Lighthouse 檢測
- [ ] 跨瀏覽器測試
- [ ] 提交 Search Console

---

**最後更新：2025-10-03**
