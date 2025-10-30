# 立即修正 about.html 大跑版問題

## 問題原因
您在添加統一模板容器後，沒有刪除舊的 header 和選單內容，導致頁面有兩份 header！

## 快速修正步驟

### 方法 1：使用 VS Code（推薦）

1. **開啟 about.html**

2. **按 `Ctrl + G` 跳到第 1711 行**

3. **選取並刪除**：
   - 從第 1711 行開始
   - 到 1960 行的 `<!-- 主要內容 -->` 之前
   - 刪除所有內容

4. **確認結果**：
   ```html
   <body>
       <!-- 統一頁頭 -->
       <div id="header-container"></div>
       
       <!-- 手機選單 -->
       <div id="mobile-menu-container"></div>

       <!-- 主要內容 -->
       <main id="main-content">
   ```

5. **儲存**：`Ctrl + S`

---

### 方法 2：手動搜尋替換

1. **開啟 about.html**

2. **搜尋**（`Ctrl + F`）：
   ```
   <!-- 統一頁頭 -->
   <div id="header-container"></div>
   ```

3. **往下看**，您會看到後面緊跟著一堆舊的 header 內容

4. **選取並刪除**從 `<div class="header-content desktop-header">` 開始，到下一個 `<!-- 主要內容 -->` 之前的所有內容

5. **添加手機選單容器**：
   在 `<div id="header-container"></div>` 後面添加：
   ```html
   
   <!-- 手機選單 -->
   <div id="mobile-menu-container"></div>
   ```

---

### 方法 3：從備份重新開始（最安全）

1. **還原備份**：
   ```powershell
   Copy-Item about.html.backup about.html -Force
   ```

2. **開啟 about.html**

3. **找到 `<body>` 標籤**（約在第 1700 行）

4. **刪除從 `<body>` 後到 `<!-- 主要內容 -->` 之間的所有內容**

5. **在 `<body>` 後添加**：
   ```html
   <body>
       <!-- 統一頁頭 -->
       <div id="header-container"></div>
       
       <!-- 手機選單 -->
       <div id="mobile-menu-container"></div>

       <!-- 主要內容 -->
       <main id="main-content">
   ```

---

## 正確的結構應該是

```html
</head>

<body>
    <!-- 統一頁頭 -->
    <div id="header-container"></div>
    
    <!-- 手機選單 -->
    <div id="mobile-menu-container"></div>

    <!-- 主要內容 -->
    <main id="main-content">
        <!-- 關於我們英雄區域 -->
        <section class="about-hero">
            <div class="container">
                <div class="hero-content">
                    <h1>關於我們</h1>
                    <p class="subtitle">百年傳承・友善栽培・產地直送</p>
                </div>
            </div>
        </section>
        
        <!-- ... 其他內容保持不變 ... -->
    </main>

    <!-- 統一頁尾 -->
    <div id="footer-container"></div>

    <!-- JavaScript -->
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <script>AOS.init({ duration: 1000, once: true });</script>
    <script src="./js/template-loader.js"></script>
    <script src="./js/mobile-menu-simple.js" defer></script>
    <script src="./js/dropdown-menu.js" defer></script>
    <script src="./js/cart.js" defer></script>
    <script src="./js/main.js" defer></script>
</body>
</html>
```

---

## 需要刪除的內容

這些都是舊的，應該刪除：

```html
❌ <header class="main-header"> ... </header>
❌ <div class="menu-overlay" id="menuOverlay"></div>
❌ <div class="main-menu" id="mainMenu"> ... </div>
❌ 所有桌面版 header 內容
❌ 所有手機版 header 內容
❌ 所有舊的選單 HTML
```

---

## 檢查清單

修正後確認：
- [ ] `<body>` 後只有 3 個 div 容器
- [ ] 沒有舊的 `<header>` 標籤
- [ ] 沒有舊的 `<nav>` 標籤（在容器外）
- [ ] 第一個是 `<div id="header-container"></div>`
- [ ] 第二個是 `<div id="mobile-menu-container"></div>`
- [ ] 第三個直接是 `<main id="main-content">`

---

## 修正後測試

1. **儲存檔案** `Ctrl + S`

2. **清除快取** `Ctrl + Shift + R`

3. **檢查項目**：
   - [ ] 頁頭只出現一次
   - [ ] 頁頭是透明的（頂部）
   - [ ] 滾動後頁頭變黑
   - [ ] 封面圖片正常顯示
   - [ ] 選單可以點擊
   - [ ] 手機版漢堡選單正常
   - [ ] 頁尾只出現一次

---

## 如果還是有問題

**完全重置**：
```powershell
Copy-Item about.html.backup about.html -Force
```

然後告訴我，我會提供更詳細的步驟。

---

**立即動手修正！** 🔧

問題很簡單：只是多了一份舊的 header，刪除它就好了！
