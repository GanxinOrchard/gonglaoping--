# LINE Pay 整合說明文件

## 📋 已創建的文件

### 1. 前端頁面
- **linepay-new.html** - LINE Pay 付款頁面
- **linepay-confirm-new.html** - 付款確認頁面

### 2. 後端 API
- **linepay-api-example.js** - Node.js 後端 API 範例

---

## 🔧 LINE Pay 設定資訊

```javascript
ChannelId: 1657163831
ChannelSecret: 492cf50453a0a694dd5b70d1a8a33aa4
```

⚠️ **重要提醒**：Channel Secret 必須保密，只能在後端使用！

---

## 🎨 前端頁面功能

### linepay-new.html（付款頁面）

#### 功能特點：
1. **響應式設計**
   - 桌面版：顯示 QR Code 供掃描
   - 手機版：自動跳轉到 LINE App

2. **訂單資訊顯示**
   - 訂單編號
   - 商品名稱
   - 支付金額

3. **付款流程**
   - 點擊「前往 LINE Pay 付款」按鈕
   - 桌面版：生成 QR Code
   - 手機版：直接跳轉

4. **狀態輪詢**
   - 每 3 秒檢查付款狀態
   - 20 分鐘超時保護

### linepay-confirm-new.html（確認頁面）

#### 功能特點：
1. **付款狀態顯示**
   - ✅ 成功：綠色圖示 + 訂單詳情
   - ❌ 失敗：紅色圖示 + 錯誤訊息
   - 🔄 處理中：藍色圖示 + 等待提示

2. **訂單詳情**
   - 訂單編號
   - 交易編號
   - 付款時間
   - 付款方式
   - 總金額

3. **操作按鈕**
   - 查看訂單
   - 返回首頁
   - 聯繫客服（失敗時）

---

## 🔌 後端 API 說明

### API 端點

#### 1. 發起付款請求
```
POST /api/linepay/request
```

**請求參數：**
```json
{
  "amount": 1000,
  "currency": "TWD",
  "orderId": "GX1234567890",
  "packages": [{
    "id": "package-1",
    "amount": 1000,
    "products": [{
      "name": "柑心果園新鮮水果",
      "quantity": 1,
      "price": 1000
    }]
  }]
}
```

**回應：**
```json
{
  "returnCode": "0000",
  "returnMessage": "Success",
  "info": {
    "paymentUrl": {
      "web": "https://...",
      "app": "line://..."
    },
    "transactionId": "2021123112345678",
    "paymentAccessToken": "..."
  }
}
```

#### 2. 確認付款
```
POST /api/linepay/confirm
```

**請求參數：**
```json
{
  "transactionId": "2021123112345678",
  "orderId": "GX1234567890"
}
```

#### 3. 檢查付款狀態
```
GET /api/linepay/check?orderId=GX1234567890
```

#### 4. 退款（可選）
```
POST /api/linepay/refund
```

---

## 🚀 部署步驟

### 步驟 1：安裝後端依賴

```bash
npm install express axios crypto
```

### 步驟 2：啟動後端服務器

```bash
node linepay-api-example.js
```

服務器將在 `http://localhost:3000` 啟動

### 步驟 3：更新前端 API 端點

在 `linepay-new.html` 中，將 API 端點改為您的服務器地址：

```javascript
// 開發環境
const response = await fetch('http://localhost:3000/api/linepay/request', {
    // ...
});

// 正式環境
const response = await fetch('https://your-domain.com/api/linepay/request', {
    // ...
});
```

### 步驟 4：替換舊文件

```bash
# 備份舊文件
mv linepay.html linepay-old.html
mv linepay-confirm.html linepay-confirm-old.html

# 使用新文件
mv linepay-new.html linepay.html
mv linepay-confirm-new.html linepay-confirm.html
```

---

## 🧪 測試流程

### 測試環境設定

1. **使用 Sandbox 環境**
   ```javascript
   apiUrl: 'https://sandbox-api-pay.line.me'
   ```

2. **測試付款**
   - 訪問：`http://localhost/linepay.html?amount=1000&product=測試商品`
   - 點擊付款按鈕
   - 使用 LINE Pay 測試帳號完成付款

3. **驗證流程**
   - ✅ QR Code 正確顯示（桌面版）
   - ✅ 自動跳轉（手機版）
   - ✅ 付款狀態輪詢正常
   - ✅ 確認頁面顯示正確

---

## 📱 手機版 vs 桌面版

### 桌面版流程
1. 用戶點擊「前往 LINE Pay 付款」
2. 系統生成 QR Code
3. 用戶使用手機 LINE App 掃描
4. 在手機上完成付款
5. 桌面頁面自動檢測付款完成
6. 跳轉到確認頁面

### 手機版流程
1. 用戶點擊「前往 LINE Pay 付款」
2. 系統顯示「正在跳轉...」
3. 自動打開 LINE App
4. 用戶在 LINE App 中完成付款
5. 返回瀏覽器
6. 顯示確認頁面

---

## 🔒 安全注意事項

### ⚠️ 必須遵守

1. **Channel Secret 保密**
   - ❌ 絕對不能寫在前端 JavaScript
   - ✅ 只能在後端使用
   - ✅ 使用環境變數存儲

2. **HTTPS 必須**
   - 正式環境必須使用 HTTPS
   - LINE Pay 不接受 HTTP 回調

3. **訂單驗證**
   - 確認付款前驗證訂單金額
   - 防止金額被竄改

4. **簽名驗證**
   - 所有 API 請求都需要正確的簽名
   - 使用 HMAC-SHA256

---

## 🎯 整合檢查清單

- [ ] 後端 API 已部署並運行
- [ ] Channel ID 和 Secret 已正確設定
- [ ] 前端頁面已更新 API 端點
- [ ] 測試環境付款流程正常
- [ ] 桌面版 QR Code 顯示正常
- [ ] 手機版跳轉功能正常
- [ ] 付款確認頁面顯示正確
- [ ] 訂單狀態更新正常
- [ ] 錯誤處理機制完善
- [ ] 已切換到正式環境（上線前）

---

## 📞 技術支援

### LINE Pay 官方資源
- 官方文件：https://pay.line.me/tw/developers/apis/onlineApis
- 測試環境：https://sandbox-api-pay.line.me
- 正式環境：https://api-pay.line.me

### 常見問題

**Q: 為什麼需要後端 API？**
A: LINE Pay 需要使用 Channel Secret 進行簽名，這個密鑰不能暴露在前端，所以必須通過後端處理。

**Q: 如何測試付款？**
A: 使用 LINE Pay 提供的 Sandbox 環境和測試帳號進行測試。

**Q: 手機版如何跳轉到 LINE App？**
A: 使用 LINE Pay 返回的 `paymentUrl.app` 連結，格式為 `line://pay/...`

**Q: 如何處理付款超時？**
A: 設定 20 分鐘超時，超時後停止輪詢並提示用戶重新付款。

---

## 📝 更新日誌

### 2025-01-20
- ✅ 創建 LINE Pay 付款頁面
- ✅ 創建付款確認頁面
- ✅ 整合 LINE Pay API
- ✅ 實作桌面版 QR Code
- ✅ 實作手機版自動跳轉
- ✅ 統一選單樣式（黑色 header）
- ✅ 添加後端 API 範例

---

## 🎉 完成！

您的 LINE Pay 整合已經準備就緒！

請按照上述步驟進行測試和部署。如有問題，請參考 LINE Pay 官方文件或聯繫技術支援。
