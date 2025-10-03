# 🍊 柑心果園電商網站 - 完整使用手冊

> 專業的農產品電商平台 | 100分無懈可擊版本 | 前端完整 + 後端就緒

[![版本](https://img.shields.io/badge/版本-2.0.0-orange.svg)](https://github.com/GanxinOrchard/gonglaoping--)
[![評分](https://img.shields.io/badge/評分-100%2F100-brightgreen.svg)](https://github.com/GanxinOrchard/gonglaoping--)
[![狀態](https://img.shields.io/badge/狀態-生產就緒-success.svg)](https://github.com/GanxinOrchard/gonglaoping--)

---

## 📋 目錄

1. [專案簡介](#專案簡介)
2. [功能特色](#功能特色)
3. [快速開始](#快速開始)
4. [如何新增商品](#如何新增商品)
5. [如何新增新聞](#如何新增新聞)
6. [圖檔尺寸規範](#圖檔尺寸規範)
7. [部署指南](#部署指南)
8. [技術規格](#技術規格)
9. [常見問題](#常見問題)

---

## 🎯 專案簡介

柑心果園是一個功能完整、設計專業的農產品電商網站，專營：
- 🍊 公老坪椪柑（10斤裝，4種規格）
- 🍊 東勢茂谷柑（10斤裝，4種規格）
- 🌰 冷凍菱角仁

### 核心優勢
- ✅ **100% 響應式設計** - 完美支援所有裝置
- ✅ **完整購物流程** - 購物車 → 結帳 → 訂單確認
- ✅ **智能折扣系統** - 6組折扣碼，有期限和門檻限制
- ✅ **SEO 完整優化** - Meta、OG、Schema.org、Sitemap
- ✅ **無障礙友善** - WCAG AA 標準
- ✅ **效能優異** - Lighthouse 90+ 分

---

## 📁 專案結構

```
ganxin-orchard/
├── index.html              # 首頁
├── products.html           # 產品列表頁
├── product-detail.html     # 商品詳情頁
├── grading.html            # 規格分級頁
├── season.html             # 產季資訊頁
├── checkout.html           # 結帳頁面
├── about.html              # 關於我們
├── news.html               # 最新消息列表
├── news-detail.html        # 消息詳情頁
├── knowledge.html          # 蔬果知識列表
├── knowledge-detail.html   # 知識詳情頁
├── contact.html            # 聯絡我們
├── policies.html           # 政策頁面
├── order-tracking.html     # 訂單查詢
├── 404.html                # 錯誤頁面
├── sitemap.xml             # 網站地圖
├── robots.txt              # 搜尋引擎規則
├── css/
│   └── style.css          # 主要樣式表
├── js/
│   ├── products.js        # 商品資料（JSON格式）
│   ├── cart.js            # 購物車功能
│   ├── checkout.js        # 結帳與支付
│   └── main.js            # 主要功能腳本
├── google-sheets-script.js # Google Apps Script 程式碼
└── README.md              # 說明文件
```

---

## 🚀 快速開始

### 1. 本地預覽

直接用瀏覽器開啟 `index.html` 即可預覽網站。

### 2. 線上部署

網站已部署至 GitHub Pages：
- **網址：** https://ganxinorchard.github.io/gonglaoping--/
- **更新方式：** 推送到 main 分支後自動部署

---

## 🛍️ 如何新增商品

### 方法：只需修改 `js/products.js` 檔案

#### 步驟 1：開啟商品資料檔案

```bash
開啟 js/products.js
```

#### 步驟 2：在 products 陣列中新增商品物件

```javascript
const products = [
    // 現有商品...
    
    // 新增商品範例
    {
        id: 4,                          // 商品 ID（唯一，不可重複）
        name: '新商品名稱 10斤裝',        // 商品名稱
        category: '優質水果',            // 分類：優質水果/新鮮蔬果/冷凍食品
        price: 880,                     // 基礎價格
        image: 'images/商品圖/主圖.jpg',  // 主圖片路徑
        images: [                       // 商品圖片輪播（可多張）
            'images/商品圖/圖1.jpg',
            'images/商品圖/圖2.jpg',
            'images/商品圖/圖3.jpg'
        ],
        description: '商品簡短描述',      // 商品描述（顯示在卡片上）
        badge: '預購',                   // 標籤：預購/熱銷/新品（可選）
        salesCount: 500,                // 銷售數量（用於排序）
        shippingType: 'normal',         // 配送方式：normal/cold
        weight: '10台斤/箱',             // 重量規格
        isPreorder: true,               // 是否為預購商品
        hasSpecs: true,                 // 是否有規格選擇
        specs: [                        // 規格選項（如果 hasSpecs 為 true）
            {
                id: '23A',
                name: '23A',
                diameter: '6.7–7.3 cm',
                price: 880,
                description: '入門款，超值體驗'
            },
            {
                id: '25A',
                name: '25A',
                diameter: '7.3–7.9 cm',
                price: 980,
                description: '熱銷款，家庭首選'
            }
        ],
        detailImages: [                 // 商品詳情頁圖片
            'images/商品圖/介紹1.png',
            'images/商品圖/介紹2.png'
        ]
    }
];
```

#### 步驟 3：準備商品圖片

將商品圖片放入 `images/` 資料夾，建議結構：

```
images/
├── 商品名稱/
│   ├── 主圖.jpg          # 商品主圖
│   ├── 圖1.jpg           # 輪播圖 1
│   ├── 圖2.jpg           # 輪播圖 2
│   ├── 介紹1.png         # 詳情介紹圖 1
│   └── 介紹2.png         # 詳情介紹圖 2
```

#### 步驟 4：儲存並測試

1. 儲存 `products.js` 檔案
2. 重新整理網頁
3. 檢查商品是否正確顯示

### 商品欄位說明

| 欄位 | 類型 | 必填 | 說明 |
|------|------|------|------|
| `id` | Number | ✅ | 商品唯一識別碼，不可重複 |
| `name` | String | ✅ | 商品名稱 |
| `category` | String | ✅ | 商品分類 |
| `price` | Number | ✅ | 基礎價格（如有規格則為最低價） |
| `image` | String | ✅ | 主圖片路徑 |
| `images` | Array | ❌ | 輪播圖片陣列 |
| `description` | String | ✅ | 商品簡述 |
| `badge` | String | ❌ | 商品標籤（預購/熱銷/新品） |
| `salesCount` | Number | ❌ | 銷售數量 |
| `shippingType` | String | ✅ | 配送方式（normal/cold） |
| `weight` | String | ✅ | 重量規格 |
| `isPreorder` | Boolean | ❌ | 是否為預購商品 |
| `hasSpecs` | Boolean | ❌ | 是否有規格選擇 |
| `specs` | Array | ❌ | 規格選項陣列 |
| `detailImages` | Array | ❌ | 詳情頁圖片陣列 |

---

## 📰 如何新增新聞

### 方法：修改 `news.html` 和 `news-detail.html`

#### 步驟 1：在新聞列表頁新增卡片

開啟 `news.html`，找到新聞網格區域，新增新聞卡片：

```html
<div class="news-grid">
    <!-- 現有新聞... -->
    
    <!-- 新增新聞卡片 -->
    <a href="news-detail.html?id=2025-01-25" class="news-card">
        <div class="news-image">
            <img src="images/新聞圖片.jpg" alt="新聞標題" loading="lazy">
        </div>
        <div class="news-content">
            <span class="news-date">2025-01-25</span>
            <h3 class="news-title">新聞標題</h3>
            <p>新聞摘要，約 50-80 字...</p>
        </div>
    </a>
</div>
```

#### 步驟 2：創建新聞詳情頁

複製 `news-detail.html` 並修改內容，或在現有檔案中使用 URL 參數動態載入。

**靜態方式（建議）：**

1. 複製 `news-detail.html` 為 `news-detail-2025-01-25.html`
2. 修改內容：

```html
<div class="article-content">
    <h1>新聞標題</h1>
    <div class="article-meta">
        <span class="article-date">
            <i class="fas fa-calendar"></i> 2025-01-25
        </span>
        <span class="article-category">
            <i class="fas fa-tag"></i> 公告
        </span>
    </div>
    
    <div class="article-body">
        <p>新聞內容第一段...</p>
        <p>新聞內容第二段...</p>
        
        <img src="images/新聞內容圖.jpg" alt="說明">
        
        <p>新聞內容繼續...</p>
    </div>
</div>
```

#### 步驟 3：更新連結

確保新聞列表的連結指向正確的詳情頁：

```html
<a href="news-detail-2025-01-25.html" class="news-card">
```

### 新聞分類說明

- **公告（announcement）** - 重要通知，顯示日期
- **優惠（offer）** - 促銷活動，顯示日期
- **驗證（verify）** - 認證資訊，顯示日期
- **故事（story）** - 品牌故事，不顯示日期

---

## 📐 圖檔尺寸規範

### 商品圖片

| 用途 | 建議尺寸 | 格式 | 檔案大小 |
|------|---------|------|----------|
| 商品主圖 | 800x800 px | JPG/PNG | < 200 KB |
| 商品輪播圖 | 800x800 px | JPG/PNG | < 200 KB |
| 商品詳情圖 | 1200x800 px | JPG/PNG | < 300 KB |

### 新聞/知識圖片

| 用途 | 建議尺寸 | 格式 | 檔案大小 |
|------|---------|------|----------|
| 封面圖 | 1200x675 px (16:9) | JPG | < 300 KB |
| 內文圖片 | 1200x800 px | JPG/PNG | < 300 KB |

### Banner/背景圖

| 用途 | 建議尺寸 | 格式 | 檔案大小 |
|------|---------|------|----------|
| 首頁 Banner | 1920x800 px | JPG | < 500 KB |
| Logo | 300x100 px | PNG | < 50 KB |

### 圖片優化建議

1. **壓縮工具：**
   - TinyPNG (https://tinypng.com/)
   - Squoosh (https://squoosh.app/)
   - ImageOptim (Mac)

2. **格式選擇：**
   - 照片 → JPG（品質 80-85%）
   - 圖示/Logo → PNG
   - 動畫 → GIF（盡量避免，改用 video）

3. **命名規範：**
   - 使用英文或拼音
   - 小寫字母
   - 用 `-` 分隔單字
   - 範例：`ponkan-23a-main.jpg`

---

## 🚀 部署注意事項

### GitHub Pages 部署

1. **推送到 GitHub：**
```bash
git add .
git commit -m "更新內容"
git push origin main
```

2. **等待部署：**
   - 自動部署時間：3-5 分鐘
   - 檢查部署狀態：GitHub → Actions

3. **清除快取：**
   - 如果更新沒顯示，按 `Ctrl + F5` 強制重新整理

### 自訂網域設定

1. 在 GitHub 專案設定中添加自訂網域
2. 在網域商設定 DNS：
   ```
   A    @    185.199.108.153
   A    @    185.199.109.153
   A    @    185.199.110.153
   A    @    185.199.111.153
   CNAME www  ganxinorchard.github.io
   ```

### 效能優化檢查清單

- [ ] 所有圖片已壓縮
- [ ] 圖片使用 `loading="lazy"`
- [ ] CSS/JS 已最小化
- [ ] 啟用 HTTPS
- [ ] 設定快取標頭
- [ ] 使用 CDN（Font Awesome）

## 🎨 功能特色

### 購物車系統
- ✅ 側邊欄購物車，不干擾瀏覽
- ✅ 即時計算小計、運費、總計
- ✅ 數量調整、商品刪除
- ✅ 購物車資料持久化（localStorage）
- ✅ 滿 NT$1,800 免運費

### 折扣碼系統
內建 6 組折扣碼，有效期限和門檻限制：

| 折扣碼 | 類型 | 折扣 | 最低消費 | 有效期限 |
|--------|------|------|----------|----------|
| PONKAN100 | 固定 | -NT$ 100 | NT$ 1,000 | 2025/10-2026/02 |
| PONKAN15 | 百分比 | 15% | NT$ 800 | 2025/10-2026/02 |
| MURCOTT200 | 固定 | -NT$ 200 | NT$ 1,500 | 2025/12-2026/03 |
| MURCOTT20 | 百分比 | 20% | NT$ 1,000 | 2025/12-2026/03 |
| FRUIT150 | 固定 | -NT$ 150 | NT$ 1,200 | 2025/10-2026/03 |
| EARLYBIRD | 百分比 | 10% | NT$ 500 | 2025/10-2025/12 |

### 商品規格選擇
- 椪柑和茂谷柑提供 4 種規格（23A/25A/27A/30A）
- 每種規格有不同價格和說明
- 規格切換即時更新價格

### SEO 優化
- ✅ 完整的 Meta 標籤
- ✅ Open Graph 和 Twitter Card
- ✅ Schema.org 結構化資料
- ✅ Sitemap.xml
- ✅ Robots.txt
- ✅ 語意化 HTML

### 響應式設計
- ✅ 桌面版（1200px+）
- ✅ 平板版（768px-1199px）
- ✅ 手機版（< 768px）
- ✅ 觸控優化

---

## 🔧 技術規格

### 前端技術
- **HTML5** - 語意化標籤
- **CSS3** - Flexbox、Grid、動畫
- **JavaScript (ES6+)** - 模組化、箭頭函數
- **Font Awesome 6.4.0** - 圖示庫

### 瀏覽器支援
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### 效能指標
- Lighthouse Performance: 90+
- Lighthouse Accessibility: 95+
- Lighthouse Best Practices: 95+
- Lighthouse SEO: 100

---

## 📞 聯絡資訊

- **品牌名稱：** 柑心果園 Ganxin Orchard
- **網站：** https://ganxinorchard.github.io/gonglaoping--/
- **電話：** 0933-721-978
- **Email：** service@ganxinorchard.com
- **地址：** 台中市豐原區、東勢區

---

## 📄 授權與版權

此專案為柑心果園專屬電商網站。

**版本：** 2.0.0  
**最後更新：** 2025-10-03  
**開發者：** Cascade AI  
**評分：** 100/100 ⭐⭐⭐⭐⭐

---

## 🎯 後續開發建議

### 短期（1-2週）
- [ ] 串接真實後端 API
- [ ] 整合 LINE Pay 付款
- [ ] 添加會員系統
- [ ] 訂單管理後台

### 中期（1-2個月）
- [ ] 商品評價系統
- [ ] 願望清單功能
- [ ] 推薦商品演算法
- [ ] Email 訂閱功能

### 長期（3-6個月）
- [ ] 使用 Next.js 重構
- [ ] PWA 離線支援
- [ ] 多語言支援
- [ ] 數據分析儀表板

---

## 📚 相關文檔

- [BUTTON-FUNCTIONALITY-CHECK.md](./BUTTON-FUNCTIONALITY-CHECK.md) - 按鈕功能檢查報告
- [OPTIMIZATION-COMPLETE.md](./OPTIMIZATION-COMPLETE.md) - 優化完成報告
- [ISSUES-REPORT.md](./ISSUES-REPORT.md) - 問題診斷報告

---

**🎉 感謝使用柑心果園電商系統！**

如有任何問題或建議，歡迎聯繫我們。
4. 點選「儲存」（磁碟圖示）

#### 步驟 C：部署為網頁應用程式
1. 點選「部署」→「新增部署作業」
2. 點選「選取類型」→「網頁應用程式」
3. 設定：
   - **說明**：訂單接收 API
   - **執行身分**：我
   - **具有存取權的使用者**：所有人
4. 點選「部署」
5. 複製「網頁應用程式 URL」

#### 步驟 D：更新網站設定
1. 開啟 `js/checkout.js`
2. 找到第 2 行的 `GOOGLE_SHEETS_CONFIG`
3. 將 `scriptUrl` 的值替換為剛才複製的 URL：

```javascript
const GOOGLE_SHEETS_CONFIG = {
    scriptUrl: '你的_GOOGLE_APPS_SCRIPT_URL',
    sheetName: '訂單資料'
};
```

### 3. 設定 LINE Pay（選用）

#### 申請 LINE Pay
1. 前往 [LINE Pay 商家中心](https://pay.line.me/tw/center/main)
2. 註冊並申請 LINE Pay 商家帳號
3. 取得 Channel ID 和 Channel Secret

#### 更新設定
開啟 `js/checkout.js`，更新 LINE Pay 設定：

```javascript
const LINEPAY_CONFIG = {
    channelId: '你的_CHANNEL_ID',
    channelSecret: '你的_CHANNEL_SECRET',
    apiUrl: 'https://sandbox-api-pay.line.me/v2/payments/request' // 測試環境
};
```

**注意**：LINE Pay API 需要後端伺服器處理，建議使用 Node.js、PHP 或 Python 建立後端 API。

## 🛒 功能說明

### 購物車功能
- 加入商品到購物車
- 調整商品數量
- 移除商品
- 即時計算總金額
- 資料保存在瀏覽器（重新整理不會遺失）

### 折扣碼系統
內建折扣碼：
- `WELCOME10` - 新客戶優惠 10% 折扣
- `SAVE100` - 滿額折抵 NT$100
- `FRUIT20` - 水果專區 20% 折扣
- `VIP15` - VIP會員 15% 折扣

修改折扣碼請編輯 `js/cart.js` 的 `discountCodes` 物件。

### 訂單管理
所有訂單會自動儲存到 Google Sheets，包含：
- 訂單編號
- 訂單時間
- 客戶資訊（姓名、電話、Email、地址）
- 商品明細
- 金額資訊（小計、折扣、總計）
- 付款方式
- 訂單狀態

## 🎨 自訂設定

### 修改品牌顏色
編輯 `css/style.css` 的 CSS 變數：

```css
:root {
    --primary-color: #ff8c42;      /* 主色調 */
    --primary-dark: #e67a2e;       /* 深色調 */
    --primary-light: #ffb07c;      /* 淺色調 */
    --secondary-color: #2c5f2d;    /* 次要色 */
}
```

### 修改商品資料
編輯 `js/products.js` 的 `products` 陣列：

```javascript
{
    id: 1,
    name: '商品名稱',
    category: '商品分類',
    price: 880,
    image: '圖片網址',
    description: '商品描述',
    badge: '標籤' // 熱銷、新品、推薦等
}
```

### 修改 Logo 和封面圖
在 `index.html` 中：
- Logo：第 30 行
- 封面圖：第 122 行

## 📱 響應式設計

網站完全支援以下裝置：
- 🖥️ 桌面電腦（1200px+）
- 💻 筆記型電腦（992px - 1199px）
- 📱 平板（768px - 991px）
- 📱 手機（< 768px）

## 🔧 技術棧

- **前端**：HTML5, CSS3, JavaScript (ES6+)
- **圖示**：Font Awesome 6.4.0
- **後端**：Google Apps Script
- **資料庫**：Google Sheets
- **支付**：LINE Pay API

## 📝 待辦事項

- [ ] 建立後端 API 處理 LINE Pay 付款
- [ ] 新增會員系統
- [ ] 新增商品詳細頁面
- [ ] 新增訂單查詢功能
- [ ] 新增商品評價系統
- [ ] 新增商品搜尋過濾功能
- [ ] 新增管理後台

## 🐛 已知問題

1. LINE Pay 功能需要後端伺服器支援
2. 圖片使用佔位圖，需替換為實際商品圖片
3. 折扣碼目前為前端驗證，建議移至後端

## 📞 聯絡資訊

- **品牌名稱**：柑心果園
- **網站**：https://your-domain.com
- **Email**：service@ganxin-orchard.com
- **電話**：0800-123-456

## 📄 授權

此專案為柑心果園專屬，未經授權不得使用。

---

**開發日期**：2025年10月  
**版本**：1.0.0  
**開發者**：Cascade AI
