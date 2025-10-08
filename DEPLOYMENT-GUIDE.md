# 柑心果園系統部署指南

## 📋 部署步驟總覽

### 第一階段：Google Apps Script 後台部署
### 第二階段：前端功能實作
### 第三階段：測試與上線

---

## 🔧 第一階段：Google Apps Script 後台部署

### 步驟 1：創建 Google Sheets

1. 前往 [Google Sheets](https://sheets.google.com)
2. 創建新試算表，命名為「柑心果園訂單管理系統」
3. 創建以下工作表（分頁）：
   - `訂單` - 主要訂單資料
   - `明細` - 訂單明細
   - `出貨統計` - 統計報表
   - `週出貨統計` - 週統計
   - `規格統計` - 規格統計
   - `規格統計(已出貨)` - 已出貨規格統計

### 步驟 2：部署 Apps Script

1. 在 Google Sheets 中，點擊「擴充功能」→「Apps Script」
2. 刪除預設的 `Code.gs` 內容
3. 複製您提供的完整後台程式碼（包含所有函數）
4. 貼上到編輯器中
5. 點擊「儲存」（磁碟圖示）

### 步驟 3：授權與設定

1. 點擊「執行」→ 選擇 `onOpen` 函數
2. 授權應用程式存取您的 Google 帳戶
3. 點擊「進階」→「前往柑心果園（不安全）」→「允許」
4. 執行 `authorizeGmail_` 函數以授權 Gmail 寄信功能
5. 執行 `setupTriggers` 安裝觸發器

### 步驟 4：部署為網頁應用程式

1. 點擊「部署」→「新增部署作業」
2. 選擇類型：「網頁應用程式」
3. 設定：
   - **說明**：柑心果園訂單API v1.0
   - **執行身分**：我
   - **存取權**：所有人
4. 點擊「部署」
5. **重要**：複製「網頁應用程式網址」

範例網址：
```
https://script.google.com/macros/s/AKfycbxxx.../exec
```

### 步驟 5：測試後台連線

在瀏覽器中測試：
```
https://your-gas-url/exec?ping=1
```

應該返回：
```json
{"ok":true,"pong":true}
```

---

## 💻 第二階段：前端功能實作

### A. 表單記憶功能

已實作功能：
- ✅ 自動儲存購買人資料
- ✅ 自動儲存收件人資料
- ✅ 頁面重新載入時自動填入
- ✅ 提供「清除記憶」按鈕

使用方式：
1. 填寫表單後，資料會自動儲存到 localStorage
2. 下次開啟頁面時自動填入
3. 點擊「清除記憶」按鈕可清除所有儲存的資料

### B. 訂單後台串接

**需要修改的檔案**：`js/checkout.js`

找到 `submitOrder()` 函數中的這一行：
```javascript
const GAS_WEB_APP_URL = 'YOUR_GAS_WEB_APP_URL_HERE';
```

替換為您的 Google Apps Script 網址：
```javascript
const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxxx.../exec';
```

### C. LINE Pay 支付功能

**前端修改**：

1. 在付款方式選項中，LINE Pay 已經存在
2. 當用戶選擇 LINE Pay 時，訂單資料會包含 `payMethod: 'linepay'`
3. 後端會返回 LINE Pay 付款網址
4. 前端自動導向 LINE Pay 付款頁面

**後端配置**（已在 GAS 中設定）：
- Channel ID: `1657163831`
- Channel Secret: `492cf50453a0a694dd5b70d1a8a33aa4`
- Sandbox 模式：`true`（測試用）

---

## 🧪 第三階段：測試

### 測試清單

#### 1. 表單記憶功能測試
- [ ] 填寫購買人資料
- [ ] 填寫收件人資料
- [ ] 重新整理頁面
- [ ] 確認資料自動填入
- [ ] 點擊「清除記憶」
- [ ] 確認資料已清除

#### 2. 折扣碼測試
- [ ] PONKAN100（需滿 NT$ 1,000）
- [ ] PONKAN15（需滿 NT$ 800）
- [ ] EARLYBIRD（2025/10-2025/12）
- [ ] 測試金額不足的錯誤提示
- [ ] 測試日期過期的錯誤提示

#### 3. 訂單提交測試
- [ ] 填寫完整資料
- [ ] 選擇配送方式
- [ ] 選擇付款方式（銀行轉帳）
- [ ] 提交訂單
- [ ] 確認訂單寫入 Google Sheets
- [ ] 確認收到確認信（客戶）
- [ ] 確認收到通知信（老闆）

#### 4. LINE Pay 測試（Sandbox）
- [ ] 選擇 LINE Pay 付款
- [ ] 確認導向 LINE Pay 頁面
- [ ] 使用測試帳號付款
- [ ] 確認付款成功回調
- [ ] 確認訂單狀態更新為「已匯款」

#### 5. 同購買人複製功能測試
- [ ] 勾選「同購買人資料」
- [ ] 確認收件人資料自動填入
- [ ] 修改購買人資料
- [ ] 確認收件人資料同步更新
- [ ] 取消勾選
- [ ] 確認收件人欄位可編輯

---

## 📝 設定檢查清單

### Google Apps Script 設定
- [ ] 程式碼已部署
- [ ] Gmail 已授權
- [ ] 觸發器已安裝
- [ ] 網頁應用程式已部署
- [ ] 測試連線成功（ping=1）

### 前端設定
- [ ] GAS_WEB_APP_URL 已更新
- [ ] 折扣碼配置正確
- [ ] 表單記憶功能已啟用
- [ ] LINE Pay 選項已顯示

### Email 設定
- [ ] 老闆信箱：s9000721@gmail.com
- [ ] 匯款資訊正確
- [ ] 公司資訊正確
- [ ] Logo 圖片可正常顯示

---

## 🚀 上線前準備

### 1. LINE Pay 正式環境

當測試完成後，修改 GAS 程式碼：
```javascript
const LINEPAY = {
  enabled: true,
  sandbox: false,  // 改為 false
  channelId: '正式環境的 Channel ID',
  channelSecret: '正式環境的 Channel Secret',
  title: '柑心果園Line pay支付',
  currency: 'TWD'
};
```

### 2. 信件測試

修改 GAS 程式碼：
```javascript
const SEND_MAIL = true;  // 確保為 true
```

### 3. 備份與監控

- 定期備份 Google Sheets
- 設定 Google Sheets 通知
- 監控訂單狀態

---

## ❓ 常見問題

### Q1: 訂單沒有寫入 Google Sheets？
**A**: 檢查：
1. GAS_WEB_APP_URL 是否正確
2. Apps Script 是否已授權
3. 瀏覽器 Console 是否有錯誤訊息

### Q2: 沒有收到確認信？
**A**: 檢查：
1. Gmail 是否已授權
2. SEND_MAIL 是否為 true
3. Email 地址是否正確
4. 檢查垃圾郵件匣

### Q3: LINE Pay 付款失敗？
**A**: 檢查：
1. Channel ID 和 Secret 是否正確
2. 是否在 Sandbox 模式
3. 測試帳號是否有效
4. 查看 Apps Script 執行記錄

### Q4: 表單記憶功能不work？
**A**: 檢查：
1. 瀏覽器是否允許 localStorage
2. 是否在無痕模式（無痕模式不支援）
3. 瀏覽器 Console 是否有錯誤

---

## 📞 技術支援

如遇到問題，請提供：
1. 錯誤訊息截圖
2. 瀏覽器 Console 截圖
3. Google Apps Script 執行記錄
4. 具體操作步驟

---

## 🎉 部署完成！

完成所有步驟後，您的系統將具備：
- ✅ 完整的訂單管理系統
- ✅ 自動寄送確認信
- ✅ LINE Pay 支付功能
- ✅ 表單記憶功能
- ✅ 折扣碼驗證
- ✅ 統計報表功能
- ✅ 出貨管理功能

祝您生意興隆！🍊
