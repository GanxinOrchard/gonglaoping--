# 📊 Google Analytics 4 (GA4) 設定指南

## 🎯 目標

為柑心果園網站設定 GA4 追蹤，監控以下關鍵指標：
- 頁面瀏覽量
- 商品瀏覽（view_item）
- 商品列表瀏覽（view_item_list）
- 商品點擊（select_item）
- 加入購物車（add_to_cart）
- 表單提交（generate_lead）

---

## 📝 步驟 1：建立 GA4 帳戶

1. 前往 [Google Analytics](https://analytics.google.com/)
2. 點擊「開始測量」
3. 輸入帳戶名稱：`柑心果園`
4. 選擇資料共用設定
5. 點擊「下一步」

---

## 🏢 步驟 2：建立資源

1. 資源名稱：`柑心果園官網`
2. 報表時區：`台灣 (GMT+8)`
3. 貨幣：`新台幣 (TWD)`
4. 點擊「下一步」

---

## 🌐 步驟 3：設定資料串流

1. 選擇平台：`網站`
2. 網站網址：`https://ganxinorchard.github.io`
3. 串流名稱：`柑心果園主網站`
4. 點擊「建立串流」
5. **複製「評估 ID」（格式：G-XXXXXXXXXX）**

---

## 💻 步驟 4：安裝 GA4 追蹤碼

### 方法 1：全站安裝（推薦）

在所有 HTML 頁面的 `<head>` 標籤中加入以下程式碼：

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**請將 `G-XXXXXXXXXX` 替換為您的實際評估 ID。**

### 需要加入的頁面清單：
- ✅ index.html
- ✅ products.html
- ✅ product-detail.html
- ✅ grading.html
- ✅ season.html
- ✅ farming.html
- ✅ guide.html
- ✅ about.html
- ✅ news.html
- ✅ news-detail.html
- ✅ contact.html
- ✅ policies.html
- ✅ checkout.html

---

## 📈 步驟 5：設定電子商務事件追蹤

### 5.1 商品列表瀏覽（view_item_list）

在 `products.html` 和 `index.html` 的商品列表載入後觸發：

```javascript
// 在 products.js 或相關檔案中
function trackViewItemList(products, listName) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'view_item_list', {
            item_list_id: listName.toLowerCase().replace(/\s+/g, '_'),
            item_list_name: listName,
            items: products.map((product, index) => ({
                item_id: product.id.toString(),
                item_name: product.name,
                item_category: product.category,
                price: product.price,
                index: index
            }))
        });
    }
}

// 使用範例
trackViewItemList(products, '全部商品');
```

### 5.2 商品點擊（select_item）

當使用者點擊商品卡片時觸發：

```javascript
function trackSelectItem(product, listName) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'select_item', {
            item_list_id: listName.toLowerCase().replace(/\s+/g, '_'),
            item_list_name: listName,
            items: [{
                item_id: product.id.toString(),
                item_name: product.name,
                item_category: product.category,
                price: product.price
            }]
        });
    }
}

// 在商品卡片點擊時呼叫
// 範例：<a href="product-detail.html?id=1" onclick="trackSelectItem(product, '全部商品')">
```

### 5.3 商品瀏覽（view_item）

在 `product-detail.html` 頁面載入時觸發：

```javascript
function trackViewItem(product) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'view_item', {
            currency: 'TWD',
            value: product.price,
            items: [{
                item_id: product.id.toString(),
                item_name: product.name,
                item_category: product.category,
                price: product.price
            }]
        });
    }
}

// 在商品詳情頁載入完成後呼叫
trackViewItem(currentProduct);
```

### 5.4 加入購物車（add_to_cart）

在 `cart.js` 的 `addToCart` 函數中加入：

```javascript
function addToCart(productId, specId = null, quantity = 1) {
    const product = products.find(p => p.id === productId);
    
    // 原有的加入購物車邏輯...
    
    // GA4 追蹤
    if (typeof gtag !== 'undefined' && product) {
        gtag('event', 'add_to_cart', {
            currency: 'TWD',
            value: product.price * quantity,
            items: [{
                item_id: product.id.toString(),
                item_name: product.name,
                item_category: product.category,
                price: product.price,
                quantity: quantity
            }]
        });
    }
}
```

### 5.5 表單提交（generate_lead）

在 `contact.html` 的表單提交時觸發：

```javascript
function handleContactSubmit(event) {
    event.preventDefault();
    
    // GA4 追蹤
    if (typeof gtag !== 'undefined') {
        gtag('event', 'generate_lead', {
            currency: 'TWD',
            value: 0
        });
    }
    
    // 原有的表單處理邏輯...
}
```

---

## 🔍 步驟 6：驗證追蹤是否正常

### 方法 1：即時報表
1. 前往 GA4 控制台
2. 點擊左側選單「報表」→「即時」
3. 開啟網站並瀏覽幾個頁面
4. 確認即時報表中有顯示活躍使用者

### 方法 2：DebugView
1. 安裝 [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna) Chrome 擴充功能
2. 啟用擴充功能
3. 在 GA4 控制台點擊「設定」→「DebugView」
4. 瀏覽網站，確認事件有正確觸發

---

## 📊 步驟 7：設定轉換事件

1. 前往 GA4 控制台
2. 點擊「設定」→「事件」
3. 將以下事件標記為轉換：
   - ✅ `add_to_cart`（加入購物車）
   - ✅ `generate_lead`（表單提交）
   - ✅ `purchase`（完成購買，如果有）

---

## 🎯 步驟 8：建立自訂報表

### 8.1 商品效能報表
1. 點擊「探索」
2. 選擇「空白」範本
3. 維度：`項目名稱`、`項目類別`
4. 指標：`項目瀏覽次數`、`加入購物車次數`
5. 儲存報表

### 8.2 使用者行為流程
1. 點擊「探索」
2. 選擇「路徑探索」範本
3. 設定起點：`page_view`
4. 分析使用者瀏覽路徑

---

## 🔗 步驟 9：連結 Google Search Console

1. 前往 GA4 控制台
2. 點擊「管理」→「產品連結」
3. 選擇「Search Console 連結」
4. 點擊「連結」
5. 選擇您的 Search Console 資源
6. 完成連結

---

## 📱 步驟 10：設定目標對象

建議設定以下目標對象：

1. **高價值訪客**
   - 條件：瀏覽超過 3 個商品頁面
   
2. **購物車放棄者**
   - 條件：加入購物車但未完成購買
   
3. **回訪客戶**
   - 條件：7 天內回訪 2 次以上

---

## ⚠️ 注意事項

1. **隱私權政策**：確保網站有明確的隱私權政策，說明使用 GA4 追蹤
2. **Cookie 同意**：考慮加入 Cookie 同意橫幅（GDPR 合規）
3. **IP 匿名化**：GA4 預設已啟用 IP 匿名化
4. **資料保留期限**：建議設定為 14 個月

---

## 📚 進階功能

### 自訂維度
可以設定以下自訂維度：
- 商品規格（23A、25A、27A、30A）
- 預購狀態（預購、現貨）
- 使用者類型（新客、回購客）

### 自訂指標
可以設定以下自訂指標：
- 平均訂單金額
- 購物車放棄率
- 商品瀏覽深度

---

## 🆘 常見問題

### Q1: 為什麼即時報表沒有顯示資料？
A: 請確認：
- 追蹤碼是否正確安裝
- 評估 ID 是否正確
- 瀏覽器是否有安裝廣告攔截器

### Q2: 事件沒有觸發怎麼辦？
A: 使用瀏覽器開發者工具（F12）→ Network 標籤，搜尋 `collect`，確認請求有正常發送。

### Q3: 如何排除內部流量？
A: 前往「管理」→「資料串流」→「標記設定」→「顯示進階設定」→「定義內部流量」

---

## ✅ 檢查清單

- [ ] 建立 GA4 帳戶和資源
- [ ] 取得評估 ID
- [ ] 在所有頁面安裝追蹤碼
- [ ] 設定電子商務事件追蹤
- [ ] 驗證追蹤是否正常
- [ ] 設定轉換事件
- [ ] 建立自訂報表
- [ ] 連結 Google Search Console
- [ ] 更新隱私權政策
- [ ] 測試所有追蹤功能

---

## 📞 需要協助？

如有任何問題，請參考：
- [GA4 官方文件](https://support.google.com/analytics/answer/9304153)
- [GA4 電子商務追蹤指南](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce)

---

**最後更新：2025-10-03**
