# 柑心果園 - 農產品電商平台

一個功能完整的農產品電商網站，具備購物車、折扣碼、Google Sheets 後端整合及 LINE Pay 支付功能。

## 🎨 專案特色

- ✅ **響應式設計** - 完美支援桌面、平板、手機
- ✅ **橘色品牌主題** - 符合柑心果園品牌形象
- ✅ **購物車功能** - 完整的加入購物車、數量調整、移除商品
- ✅ **折扣碼系統** - 支援百分比折扣和固定金額折扣
- ✅ **Google Sheets 後端** - 訂單資料自動儲存到試算表
- ✅ **LINE Pay 整合** - 支援 LINE Pay 線上付款
- ✅ **本地儲存** - 購物車資料保存在瀏覽器

## 📁 專案結構

```
ganxin-orchard/
├── index.html              # 主頁面
├── css/
│   └── style.css          # 樣式表
├── js/
│   ├── products.js        # 商品資料與渲染
│   ├── cart.js            # 購物車功能
│   ├── checkout.js        # 結帳與支付
│   └── main.js            # 主要功能腳本
├── google-sheets-script.js # Google Apps Script 程式碼
└── README.md              # 說明文件
```

## 🚀 快速開始

### 1. 開啟網站

直接用瀏覽器開啟 `index.html` 即可預覽網站。

### 2. 設定 Google Sheets 後端

#### 步驟 A：建立 Google Sheets
1. 前往 [Google Sheets](https://sheets.google.com)
2. 建立新的試算表，命名為「柑心果園訂單管理」

#### 步驟 B：設定 Apps Script
1. 在試算表中，點選「擴充功能」→「Apps Script」
2. 刪除預設程式碼
3. 將 `google-sheets-script.js` 的內容複製貼上
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
