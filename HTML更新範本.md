# HTML 更新範本與步驟

## 📋 標準 HTML 結構（更新後）

```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
    
    <!-- SEO Meta Tags -->
    <title>頁面標題 - 柑心果園</title>
    <meta name="description" content="頁面描述">
    <meta name="keywords" content="關鍵字">
    <meta name="author" content="柑心果園 Ganxin Orchard">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="https://ganxinorchard.github.io/gonglaoping--/頁面.html">
    <link rel="icon" type="image/png" href="images/logo.png">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://ganxinorchard.github.io/gonglaoping--/頁面.html">
    <meta property="og:title" content="頁面標題 - 柑心果園">
    <meta property="og:description" content="頁面描述">
    <meta property="og:image" content="https://ganxinorchard.github.io/gonglaoping--/images/柑心果園販賣所-2.png">
    <meta property="og:locale" content="zh_TW">
    <meta property="og:site_name" content="柑心果園">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="https://ganxinorchard.github.io/gonglaoping--/頁面.html">
    <meta name="twitter:title" content="頁面標題 - 柑心果園">
    <meta name="twitter:description" content="頁面描述">
    <meta name="twitter:image" content="https://ganxinorchard.github.io/gonglaoping--/images/柑心果園販賣所-2.png">
    
    <!-- ⭐ 統一 CSS 架構 - 只需要這一行！ -->
    <link rel="stylesheet" href="./css/main.css?v=20251023">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- 如果頁面有特殊樣式，在這裡加入 -->
    <!-- <link rel="stylesheet" href="./css/page-specific.css"> -->
</head>

<body>
    <!-- 頁面內容 -->
    
    <!-- JavaScript -->
    <script src="./js/mobile-menu-simple.js" defer></script>
    <script src="./js/main.js" defer></script>
    <!-- 其他必要的 JS -->
</body>
</html>
```

---

## 🔄 更新步驟詳解

### 步驟 1：開啟 HTML 檔案

使用文字編輯器（VS Code / Notepad++ / Sublime）開啟要更新的HTML檔案。

### 步驟 2：找到 `<head>` 區塊

定位到檔案開頭的 `<head>` 標籤。

### 步驟 3：移除舊的 CSS 引用

**找到並刪除這些行**（可能有多個）：

```html
<link rel="stylesheet" href="./css/style.css?v=20250120">
<link rel="stylesheet" href="./css/navigation-clean.css?v=20250120">
<link rel="stylesheet" href="./news-season-styles.css">
<link rel="stylesheet" href="./season-styles.css">
<link rel="stylesheet" href="./unified-styles.css">
<link rel="stylesheet" href="./unified-mobile-menu.css">
```

**保留這些**（不要刪除）：
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
```

### 步驟 4：移除內嵌 CSS

**找到並刪除整個 `<style>` 區塊**：

```html
<!-- 刪除從這裡 -->
<style>
    /* 最新消息廣播器重新設計 */
    .broadcast-section {
        background: linear-gradient(135deg, #ff6b35, #f7931e);
        ...
    }
    
    /* 手機選單設計 - 簡潔版本 */
    .main-menu {
        display: none !important;
        ...
    }
    
    /* ... 可能有 500-1800 行的 CSS ... */
</style>
<!-- 刪除到這裡 -->
```

**如何快速找到**：
1. 搜尋 `<style>`
2. 選取從 `<style>` 到 `</style>` 的所有內容
3. 刪除

### 步驟 5：加入新的 CSS 引用

在 `</head>` 之前加入：

```html
<!-- 統一 CSS 架構 -->
<link rel="stylesheet" href="./css/main.css?v=20251023">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
```

### 步驟 6：儲存並測試

1. **儲存檔案**（Ctrl + S）
2. **開啟瀏覽器**
3. **按 Ctrl + F5** 強制重新載入
4. **檢查頁面顯示是否正常**

---

## 🎯 實際範例

### 範例 1：products.html 更新前

```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>全部商品 - 柑心果園</title>
    
    <link rel="stylesheet" href="./css/style.css?v=20250120">
    <link rel="stylesheet" href="./css/navigation-clean.css?v=20250120">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <style>
        /* 最新消息廣播器重新設計 */
        .broadcast-section {
            background: linear-gradient(135deg, #ff6b35, #f7931e);
            ...
        }
        /* ... 1800 行 CSS ... */
    </style>
</head>
```

### 範例 1：products.html 更新後

```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>全部商品 - 柑心果園</title>
    
    <!-- 統一 CSS 架構 -->
    <link rel="stylesheet" href="./css/main.css?v=20251023">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
```

---

## ⚠️ 注意事項

### 1. **特殊頁面的處理**

某些頁面可能有獨特的樣式，例如：
- 產季頁面的時間軸
- 商品詳情頁的相簿
- 結帳頁面的表單樣式

**處理方式**：
```html
<!-- 統一 CSS -->
<link rel="stylesheet" href="./css/main.css?v=20251023">

<!-- 頁面專用 CSS -->
<style>
    /* 只保留此頁面獨有的樣式 */
    .timeline-special { ... }
</style>
```

### 2. **CSS 載入順序很重要**

確保按照這個順序載入：
1. main.css（統一樣式）
2. Font Awesome（圖示）
3. 頁面專用 CSS（如果有）

### 3. **版本號的更新**

```html
<!-- 版本號用於清除瀏覽器快取 -->
<link rel="stylesheet" href="./css/main.css?v=20251023">
                                                   ^^^^^^^^
                                                   更新這個日期
```

每次修改 CSS 後，更新版本號以確保用戶看到最新樣式。

---

## 📝 更新檢查清單

每個檔案更新後，請勾選：

```
□ 已移除所有舊的 CSS 引用
□ 已刪除所有 <style> 內嵌 CSS
□ 已加入新的 main.css 引用
□ 已保留 Font Awesome CDN
□ 已儲存檔案
□ 已在瀏覽器測試
□ 手機選單正常運作
□ 桌面選單正常運作
□ 封面圖片正常顯示
□ 頁尾資訊完整
□ 響應式設計正常
```

---

## 🛠️ 常見錯誤與解決

### 錯誤 1：樣式完全消失

**原因**：CSS 路徑錯誤  
**解決**：
```html
<!-- 錯誤 -->
<link rel="stylesheet" href="css/main.css">

<!-- 正確 -->
<link rel="stylesheet" href="./css/main.css">
```

### 錯誤 2：手機選單不顯示

**原因**：JavaScript 未載入  
**解決**：
```html
<script src="./js/mobile-menu-simple.js" defer></script>
```

### 錯誤 3：樣式部分正確，部分錯誤

**原因**：瀏覽器快取  
**解決**：按 `Ctrl + Shift + Delete` 清除快取，或按 `Ctrl + F5`

---

## 💡 進階技巧

### 批量查找替換（VS Code）

1. 開啟專案資料夾
2. 按 `Ctrl + Shift + H`
3. **查找**：`<link rel="stylesheet" href="./css/style.css.*?>`
4. **替換為**：``（空白）
5. 點選「全部替換」

**注意**：使用前請先備份！

---

## 📞 遇到問題？

### 檢查步驟：

1. **檢查檔案路徑**
   - main.css 是否在 `css/` 資料夾
   - 路徑是否正確（`./css/main.css`）

2. **檢查瀏覽器控制台**
   - 按 `F12` 開啟開發者工具
   - 查看 Console 是否有錯誤訊息
   - 查看 Network 標籤，CSS 是否成功載入

3. **清除快取**
   - `Ctrl + F5` 強制重新整理
   - 或使用無痕模式測試

4. **比對範本**
   - 參考本文件的範例
   - 確認更新步驟都完成了

---

## ✅ 完成標準

更新成功的標準：

✓ HTML 檔案體積減少 60-80%  
✓ 只有一行 main.css 引用  
✓ 沒有內嵌 `<style>` 標籤  
✓ 所有頁面顯示正常  
✓ 手機版和桌面版都正常  
✓ 瀏覽器控制台無錯誤  

---

**祝更新順利！** 🎉

如有任何疑問，請參考 `CSS-重構指南.md` 或檢查現有的 CSS 模組檔案。
