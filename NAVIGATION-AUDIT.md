# 🔍 導覽列檢查報告

## 📋 標準導覽列結構

### 應包含的連結
1. ✅ 首頁 (index.html)
2. ✅ 全部商品 (products.html)
3. ✅ 規格分級 (grading.html)
4. ✅ 友善栽培 (farming.html)
5. ✅ 挑選指南 (guide.html)
6. ✅ 產季資訊 (season.html)
7. ✅ 關於我們 (about.html)
8. ✅ 最新消息 (news.html)
9. ✅ 蔬果知識 (knowledge.html)
10. ✅ 聯絡我們 (contact.html)
11. ✅ 訂單查詢 (order-tracking.html)

---

## 🔍 各頁面導覽列檢查

### ✅ index.html
**狀態**：完整  
**連結**：
- 首頁、全部商品、規格分級、產季資訊
- 關於我們、最新消息、蔬果知識、聯絡我們

---

### ⚠️ 需要統一的頁面

#### 1. products.html
**當前問題**：導覽列不完整
**需要添加**：
- 友善栽培 (farming.html)
- 挑選指南 (guide.html)
- 訂單查詢 (order-tracking.html)

#### 2. product-detail.html
**當前問題**：簡化版導覽列
**建議**：保持簡化版（商品詳情頁）

#### 3. grading.html, farming.html, guide.html
**當前問題**：導覽列不完整
**需要統一**：使用標準導覽列

#### 4. about.html, contact.html
**當前問題**：導覽列不完整
**需要統一**：使用標準導覽列

#### 5. news.html, knowledge.html
**當前問題**：導覽列不完整
**需要統一**：使用標準導覽列

---

## 📝 標準導覽列 HTML

```html
<div class="main-menu" id="mainMenu">
    <ul>
        <li><a href="index.html">首頁</a></li>
        <li class="dropdown">
            <a href="products.html">全部商品 <i class="fas fa-chevron-down"></i></a>
            <ul class="dropdown-menu">
                <li><a href="products.html">所有商品</a></li>
                <li><a href="products.html?category=優質水果">優質水果</a></li>
                <li><a href="products.html?category=新鮮蔬果">新鮮蔬果</a></li>
            </ul>
        </li>
        <li class="dropdown">
            <a href="#">產品資訊 <i class="fas fa-chevron-down"></i></a>
            <ul class="dropdown-menu">
                <li><a href="grading.html">規格分級</a></li>
                <li><a href="farming.html">友善栽培</a></li>
                <li><a href="guide.html">挑選指南</a></li>
                <li><a href="season.html">產季資訊</a></li>
            </ul>
        </li>
        <li><a href="about.html">關於我們</a></li>
        <li><a href="news.html">最新消息</a></li>
        <li><a href="knowledge.html">蔬果知識</a></li>
        <li><a href="contact.html">聯絡我們</a></li>
        <li><a href="order-tracking.html">訂單查詢</a></li>
    </ul>
</div>
```

---

## 🛠️ 修復計劃

### 階段 1：統一主要頁面導覽列
- [ ] products.html
- [ ] grading.html
- [ ] farming.html
- [ ] guide.html
- [ ] season.html

### 階段 2：統一內容頁面導覽列
- [ ] about.html
- [ ] contact.html
- [ ] news.html
- [ ] knowledge.html

### 階段 3：檢查所有連結
- [ ] 測試所有導覽連結
- [ ] 確認沒有 404 錯誤
- [ ] 確認 active 狀態正確

---

## 📱 手機版導覽列

### 當前狀態
- ✅ 有漢堡選單按鈕
- ✅ 有購物車圖示
- ⚠️ 需要統一樣式

### 建議改進
1. 統一漢堡選單動畫
2. 統一選單展開方式
3. 添加關閉按鈕

---

## 🎯 優先級

### 高優先級
1. ⭐⭐⭐ 統一所有主要頁面導覽列
2. ⭐⭐⭐ 修復斷掉的連結
3. ⭐⭐ 添加下拉選單

### 中優先級
4. ⭐⭐ 優化手機版導覽
5. ⭐ 添加麵包屑導航

---

**建立時間**：2025-10-03 19:13  
**狀態**：待修復
