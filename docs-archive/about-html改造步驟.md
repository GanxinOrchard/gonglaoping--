# about.html 改造步驟

## ✅ 已完成
1. 備份 about.html → about.html.backup
2. 更新 CSS 引用 → 改用 main.css

## 📝 需要手動修改的部分

### 1. 替換頁頭（第 1701-1815 行）

**刪除**：
```html
<!-- 主要導覽列 -->
<header class="main-header">
    ... （整個 header 區塊，約 114 行）
</header>
```

**替換為**：
```html
<!-- 統一頁頭 -->
<div id="header-container"></div>
```

---

### 2. 替換手機選單（第 1817-1952 行）

**刪除**：
```html
<!-- 手機選單 - 現代化設計 -->
<div class="menu-overlay" id="menuOverlay"></div>
<div class="main-menu" id="mainMenu">
    ... （整個手機選單區塊，約 136 行）
</div>
```

**替換為**：
```html
<!-- 手機選單 -->
<div id="mobile-menu-container"></div>
```

---

### 3. 找到頁尾區塊並替換

**找到這個區塊**（約在第 2090-2340 行）：
```html
<footer class="footer footer-modern">
    ... （整個 footer 區塊）
</footer>
```

**替換為**：
```html
<!-- 統一頁尾 -->
<div id="footer-container"></div>
```

---

### 4. 更新 JavaScript（在 </body> 之前）

**刪除舊的 JS**：
```html
<script src="js/mobile-menu-simple.js?v=20250115K" defer></script>
<script src="js/dropdown-menu.js?v=20250115K" defer></script>
<script src="js/cart.js?v=20250115K" defer></script>
<script src="js/main.js?v=20250115K" defer></script>
```

**替換為統一模板 JS**：
```html
<!-- JavaScript -->
<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
<script>
    AOS.init({
        duration: 1000,
        once: true
    });
</script>
<script src="./js/template-loader.js"></script>
<script src="./js/mobile-menu-simple.js" defer></script>
<script src="./js/dropdown-menu.js" defer></script>
<script src="./js/cart.js" defer></script>
<script src="./js/main.js" defer></script>
</body>
</html>
```

---

## 🎯 最終結構

```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <!-- SEO Meta Tags -->
    <!-- ... -->
    
    <!-- 統一 CSS 架構 -->
    <link rel="stylesheet" href="./css/main.css?v=20251023">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="https://unpkg.com/aos@2.3.1/dist/aos.css">
    
    <style>
        /* about 頁面專用樣式 */
        .about-hero { ... }
        /* ... */
    </style>
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
            <!-- 保留所有原始內容 -->
        </section>
        
        <!-- 其他內容區塊 -->
        <!-- 保留所有原始內容 -->
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

## 💡 手動修改的原因

由於 about.html 檔案較大（2348 行），且需要替換的區塊跨度很大：
- 頁頭：114 行（1702-1815）
- 手機選單：136 行（1817-1952）
- 頁尾：約 250 行

直接使用 edit 工具會因為字符數太多而困難。

**建議使用 VS Code 手動修改**：
1. 開啟 about.html
2. 找到第 1701 行
3. 選取到第 1815 行，刪除，替換為 `<div id="header-container"></div>`
4. 找到第 1817 行（手機選單開始）
5. 選取到第 1952 行，刪除，替換為 `<div id="mobile-menu-container"></div>`
6. 在檔案末尾找到 `<footer>` 區塊
7. 刪除整個 footer，替換為 `<div id="footer-container"></div>`
8. 更新 JavaScript 區塊

---

## 🚀 快速替換指令（VS Code）

1. **替換頁頭**
   - 搜尋：`<!-- 主要導覽列 -->`（按 Ctrl+F）
   - 向下選取到 `</header>`（包含）
   - 刪除並貼上：`<!-- 統一頁頭 -->\n<div id="header-container"></div>`

2. **替換手機選單**
   - 搜尋：`<!-- 手機選單 - 現代化設計 -->`
   - 向下選取到第二個 `</div>`（手機選單結束）
   - 刪除並貼上：`<!-- 手機選單 -->\n<div id="mobile-menu-container"></div>`

3. **替換頁尾**
   - 搜尋：`<footer class="footer`
   - 向下選取到 `</footer>`（包含）
   - 刪除並貼上：`<!-- 統一頁尾 -->\n<div id="footer-container"></div>`

---

## ✅ 檢查清單

完成後確認：
- [ ] CSS 引用改為 `main.css`
- [ ] 頁頭替換為 `<div id="header-container"></div>`
- [ ] 手機選單替換為 `<div id="mobile-menu-container"></div>`
- [ ] 頁尾替換為 `<div id="footer-container"></div>`
- [ ] JavaScript 更新為統一模板版本
- [ ] `<main id="main-content">` 區塊保持完整
- [ ] about 專用樣式（.about-hero 等）保留在 `<style>` 中

---

**完成後請告訴我，我會協助測試！**
