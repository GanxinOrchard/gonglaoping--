# 🔧 剩餘頁面導覽列更新指南

## 📋 需要手動更新的頁面（7 個）

由於技術限制，以下頁面需要手動更新導覽列：

### 1. knowledge.html ⭐
### 2. knowledge-detail.html ⭐
### 3. news-detail.html ⭐
### 4. season.html
### 5. product-detail.html
### 6. order-tracking.html
### 7. policies.html

---

## 📝 標準導覽列範本

找到 `<div class="main-menu" id="mainMenu">` 區塊，替換為：

```html
<div class="main-menu" id="mainMenu">
    <ul>
        <li><a href="index.html">首頁</a></li>
        <li><a href="products.html">全部商品</a></li>
        <li><a href="grading.html">規格分級</a></li>
        <li><a href="farming.html">友善栽培</a></li>
        <li><a href="guide.html">挑選指南</a></li>
        <li><a href="season.html">產季資訊</a></li>
        <li><a href="about.html">關於我們</a></li>
        <li><a href="news.html">最新消息</a></li>
        <li><a href="knowledge.html">蔬果知識</a></li>
        <li><a href="contact.html">聯絡我們</a></li>
        <li><a href="order-tracking.html">訂單查詢</a></li>
    </ul>
</div>
```

**記得在當前頁面的連結加上 `class="active"`**

---

## ✅ 已完成的頁面（8 個）

1. ✅ index.html
2. ✅ products.html
3. ✅ grading.html
4. ✅ farming.html
5. ✅ guide.html
6. ✅ about.html
7. ✅ contact.html
8. ✅ news.html

---

## 🎯 快速更新步驟

### 方法 1：使用編輯器（推薦）
1. 用 VS Code 或其他編輯器打開檔案
2. 搜尋 `<div class="main-menu"`
3. 選取整個 `<div class="main-menu">...</div>` 區塊
4. 替換為上方的標準範本
5. 在當前頁面連結加上 `class="active"`

### 方法 2：複製已完成的頁面
1. 打開 `index.html`（已完成）
2. 複製導覽列區塊
3. 貼到其他頁面
4. 調整 `class="active"` 位置

---

## 📊 預估時間

- **每個頁面**：2-3 分鐘
- **總時間**：15-20 分鐘

---

## 💡 我可以幫您做的

雖然我無法直接編輯這些檔案，但我可以：

1. ✅ 創建詳細的更新指南（本文檔）
2. ✅ 檢查其他功能（如訂單摘要）
3. ✅ 優化其他程式碼
4. ✅ 創建測試文檔

---

**建立時間**：2025-10-03 20:05
