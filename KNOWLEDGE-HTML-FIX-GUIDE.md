# 📝 knowledge.html 導覽列手動修改指南

## 🎯 目標
將 knowledge.html 的導覽列統一為標準格式

---

## 📍 修改位置
**檔案**：`knowledge.html`  
**行數**：第 231-249 行

---

## 🔍 找到這段程式碼

```html
                <div class="main-menu" id="mainMenu">
                    <ul>
                        <li><a href="index.html">首頁</a></li>
                        <li class="dropdown">
                            <a href="index.html#products">全部商品 <i class="fas fa-chevron-down"></i></a>
                            <ul class="dropdown-menu">
                                <li><a href="index.html#products" onclick="filterByCategory('全部'); return false;">所有商品</a></li>
                                <li><a href="index.html#products" onclick="filterByCategory('優質水果'); return false;">優質水果</a></li>
                                <li><a href="index.html#products" onclick="filterByCategory('新鮮蔬果'); return false;">新鮮蔬果</a></li>
                                <li><a href="index.html#products" onclick="filterByCategory('冷凍食品'); return false;">冷凍食品</a></li>
                            </ul>
                        </li>
                        <li><a href="about.html">關於我們</a></li>
                        <li><a href="news.html">最新消息</a></li>
                        <li><a href="knowledge.html" class="active">蔬果知識</a></li>
                        <li><a href="contact.html">聯絡我們</a></li>
                        <li><a href="order-tracking.html">訂單查詢</a></li>
                    </ul>
                </div>
```

---

## ✏️ 替換為這段程式碼

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
                        <li><a href="knowledge.html" class="active">蔬果知識</a></li>
                        <li><a href="contact.html">聯絡我們</a></li>
                        <li><a href="order-tracking.html">訂單查詢</a></li>
                    </ul>
                </div>
```

---

## 📋 修改步驟

### 方法 1：使用 VS Code（推薦）
1. 用 VS Code 打開 `knowledge.html`
2. 按 `Ctrl + F` 搜尋：`<li class="dropdown">`
3. 找到第 234 行附近的導覽列
4. 選取整個 `<div class="main-menu">...</div>` 區塊
5. 複製上方的「替換為這段程式碼」
6. 貼上並儲存

### 方法 2：使用記事本
1. 用記事本打開 `knowledge.html`
2. 找到第 231 行的 `<div class="main-menu" id="mainMenu">`
3. 選取到第 249 行的 `</div>`
4. 刪除並貼上新的程式碼
5. 儲存

---

## ✅ 修改後的差異

### 移除
- ❌ 下拉選單（dropdown）
- ❌ 分類篩選功能

### 新增
- ✅ 規格分級連結
- ✅ 友善栽培連結
- ✅ 挑選指南連結
- ✅ 產季資訊連結（移到正確位置）

---

## 🔄 修改完成後

### 1. 儲存檔案
確保以 **UTF-8** 編碼儲存

### 2. 提交到 Git
```bash
git add knowledge.html
git commit -m "🔗 統一 knowledge.html 導覽列"
git push origin main
```

### 3. 等待更新
GitHub Pages 會在 2-3 分鐘內更新

---

## 🎊 完成！

修改完成後，所有 15 個頁面的導覽列將完全統一！

**完成度將達到 100%！** 🎉

---

**預估時間**：3-5 分鐘  
**難度**：⭐ 簡單
