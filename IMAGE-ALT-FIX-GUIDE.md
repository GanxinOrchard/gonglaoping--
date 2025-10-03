# 🖼️ 圖片 Alt 屬性修復指南

## 📋 概述

為所有圖片添加有意義的 alt 屬性，提升無障礙性和 SEO。

---

## ✅ 需要檢查的檔案

### 高優先級（主要頁面）
1. ✅ index.html（8 個圖片）
2. ✅ products.html（2 個圖片）
3. ✅ product-detail.html（5 個圖片）
4. ✅ about.html（2 個圖片）
5. ✅ contact.html（1 個圖片）

### 中優先級（功能頁面）
6. ✅ grading.html（1 個圖片）
7. ✅ farming.html（1 個圖片）
8. ✅ guide.html（1 個圖片）
9. ✅ season.html（1 個圖片）

### 低優先級（其他頁面）
10. ✅ news.html（1 個圖片）
11. ✅ news-detail.html（1 個圖片）
12. ✅ knowledge.html（4 個圖片）
13. ✅ knowledge-detail.html（2 個圖片）

---

## 📝 Alt 屬性撰寫原則

### 1. 商品圖片
```html
<!-- 不好 -->
<img src="product.jpg" alt="圖片">

<!-- 好 -->
<img src="ponkan1.jpg" alt="公老坪椪柑 23A，果皮橙黃，果實飽滿">
```

### 2. LOGO
```html
<img src="logo.png" alt="柑心果園" width="180" height="60">
```

### 3. 裝飾性圖片
```html
<!-- 純裝飾，使用空 alt -->
<img src="decoration.png" alt="">
```

### 4. 資訊圖片
```html
<img src="grading-chart.jpg" alt="椪柑規格分級對照表，23A 至 30A 尺寸說明">
```

---

## 🔍 當前狀態檢查

### index.html
```html
<!-- 需要檢查的圖片 -->
1. LOGO - ✅ 已有 alt
2. Hero 背景圖 - ✅ 已有 alt
3. 商品卡片圖片 - ⚠️ 動態生成，需在 JS 中添加
```

### products.html
```html
1. LOGO - ✅ 已有 alt
2. 商品卡片圖片 - ⚠️ 動態生成，需在 JS 中添加
```

### product-detail.html
```html
1. LOGO - ✅ 已有 alt
2. 商品主圖 - ⚠️ 動態生成，需在 JS 中添加
3. 商品詳情圖 - ⚠️ 動態生成，需在 JS 中添加
4. 料理方式圖 - ⚠️ 動態生成，需在 JS 中添加
5. 相關商品圖 - ⚠️ 動態生成，需在 JS 中添加
```

---

## 🛠️ 修復步驟

### 步驟 1：檢查靜態 HTML 圖片

使用瀏覽器開發者工具：
1. 開啟頁面
2. 按 F12 打開 DevTools
3. 在 Console 輸入：
```javascript
document.querySelectorAll('img:not([alt])').forEach(img => {
    console.log('缺少 alt:', img.src);
});
```

### 步驟 2：修復 JavaScript 動態生成的圖片

#### 修復 products.js
```javascript
// 在商品資料中添加 alt 屬性
const products = [
    {
        id: 1,
        name: "公老坪椪柑 23A",
        image: "images/椪柑產品圖/椪柑1.jpg",
        alt: "公老坪椪柑 23A，果皮橙黃，果實飽滿，直徑 6.7-7.3cm", // 添加這行
        // ...
    }
];

// 在渲染函數中使用
function renderProductCard(product) {
    return `
        <img 
            src="${product.image}" 
            alt="${product.alt || product.name}"
            loading="lazy"
            width="400"
            height="400">
    `;
}
```

### 步驟 3：為所有靜態圖片添加 alt

#### LOGO（所有頁面）
```html
<img src="logo.png" alt="柑心果園" width="180" height="60">
```

#### Hero 背景圖
```html
<img src="hero-bg.jpg" alt="柑心果園販賣所，新鮮椪柑產地直送">
```

#### 關於我們頁面
```html
<img src="關於我們的封面首頁.png" alt="柑心果園果園景觀，山坡上的椪柑樹">
```

---

## 📊 優先級建議

### 立即修復（高優先級）
1. **所有 LOGO** - 5 分鐘
2. **首頁 Hero 圖** - 2 分鐘
3. **products.js 商品資料** - 15 分鐘

### 今天完成（中優先級）
4. **product-detail.html 動態圖片** - 10 分鐘
5. **about.html 靜態圖片** - 5 分鐘

### 本週完成（低優先級）
6. **其他頁面圖片** - 30 分鐘

---

## ✅ 檢查清單

### 主要頁面
- [ ] index.html - 所有圖片有 alt
- [ ] products.html - 所有圖片有 alt
- [ ] product-detail.html - 所有圖片有 alt
- [ ] about.html - 所有圖片有 alt
- [ ] contact.html - 所有圖片有 alt

### 功能頁面
- [ ] grading.html - 所有圖片有 alt
- [ ] farming.html - 所有圖片有 alt
- [ ] guide.html - 所有圖片有 alt
- [ ] season.html - 所有圖片有 alt

### JavaScript 檔案
- [ ] products.js - 商品資料有 alt
- [ ] main.js - 動態圖片有 alt

---

## 🧪 測試方法

### 方法 1：使用 WAVE 工具
1. 前往 https://wave.webaim.org/
2. 輸入網址
3. 檢查「Missing alternative text」錯誤

### 方法 2：使用 Lighthouse
1. 開啟 Chrome DevTools（F12）
2. 切換到 Lighthouse 標籤
3. 選擇 Accessibility
4. 檢查「Image elements do not have [alt] attributes」

### 方法 3：使用瀏覽器 Console
```javascript
// 檢查缺少 alt 的圖片
const missingAlt = document.querySelectorAll('img:not([alt])');
console.log(`缺少 alt 的圖片數量: ${missingAlt.length}`);
missingAlt.forEach(img => console.log(img.src));

// 檢查空 alt 的圖片（可能需要補充）
const emptyAlt = document.querySelectorAll('img[alt=""]');
console.log(`空 alt 的圖片數量: ${emptyAlt.length}`);
```

---

## 📈 預期改善

完成後：
- ✅ Lighthouse Accessibility: +5-10 分
- ✅ WAVE 錯誤: 0 個
- ✅ 螢幕閱讀器友善
- ✅ SEO 圖片搜尋優化

---

## 💡 快速修復範例

### 範例 1：修復 index.html
```html
<!-- 修復前 -->
<img src="images/logo.png">

<!-- 修復後 -->
<img src="images/logo.png" alt="柑心果園" width="180" height="60">
```

### 範例 2：修復 products.js
```javascript
// 修復前
{
    id: 1,
    name: "公老坪椪柑 23A",
    image: "images/椪柑產品圖/椪柑1.jpg"
}

// 修復後
{
    id: 1,
    name: "公老坪椪柑 23A",
    image: "images/椪柑產品圖/椪柑1.jpg",
    alt: "公老坪椪柑 23A，果皮橙黃，果實飽滿，單顆約 150-180g"
}
```

---

## 🎯 完成目標

- **所有圖片** 都有有意義的 alt 屬性
- **Lighthouse Accessibility** 達到 95+ 分
- **WAVE 測試** 無錯誤
- **螢幕閱讀器** 完全支援

---

**預估完成時間**：1-2 小時  
**影響**：Accessibility +5-10 分  
**優先級**：高

---

**最後更新**：2025-10-03
