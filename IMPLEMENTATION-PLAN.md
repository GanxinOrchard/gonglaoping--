# 柑心果園系統實作計劃

## 已完成項目 ✅

### 1. 購物車折扣碼驗證修復
- **問題**：折扣碼顯示「無效或已過期」但實際有效
- **解決**：
  - 添加日期有效性檢查（validFrom/validTo）
  - 添加最低消費金額驗證（minAmount）
  - 提供清晰的錯誤訊息

### 2. 結帳頁面同購買人複製功能
- **狀態**：已在之前的更新中修復
- **功能**：勾選後正確複製所有欄位並添加視覺反饋

## 待實作項目 📋

### 3. 表單記憶功能
**需求**：填寫過的資料下次自動帶入
**實作方式**：
```javascript
// 儲存表單資料到 localStorage
function saveFormData() {
    const formData = {
        buyerName: document.getElementById('buyerName').value,
        buyerEmail: document.getElementById('buyerEmail').value,
        buyerPhone: document.getElementById('buyerPhone').value,
        buyerAddress: document.getElementById('buyerAddress').value
    };
    localStorage.setItem('savedFormData', JSON.stringify(formData));
}

// 載入表單資料
function loadSavedFormData() {
    const saved = localStorage.getItem('savedFormData');
    if (saved) {
        const data = JSON.parse(saved);
        // 填入表單欄位
    }
}
```

### 4. Google Apps Script 後台程式
**檔案位置**：需要在 Google Sheets 中創建
**功能**：
- 接收前端訂單資料
- 寫入試算表（訂單表、明細表）
- 自動寄送確認信
- 支援 LINE Pay 付款

**部署步驟**：
1. 開啟 Google Sheets
2. 工具 → 指令碼編輯器
3. 貼上您提供的程式碼
4. 部署為網路應用程式
5. 複製部署 URL

### 5. 前端訂單串接
**需要修改的檔案**：`js/checkout.js`

**實作重點**：
```javascript
// 提交訂單到 Google Sheets
async function submitOrderToBackend(orderData) {
    const GAS_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL';
    
    const response = await fetch(GAS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
    });
    
    return response;
}
```

### 6. LINE Pay 支付功能
**前端實作**：
1. 在付款方式中添加 LINE Pay 選項
2. 選擇 LINE Pay 時，訂單資料標記 `payMethod: 'linepay'`
3. 後端返回付款網址後，導向 LINE Pay

**後端配置**（已在您的 GAS 程式碼中）：
- Channel ID: `1657163831`
- Channel Secret: `492cf50453a0a694dd5b70d1a8a33aa4`
- Sandbox 模式：測試用

## 實作優先順序

1. ✅ **折扣碼驗證** - 已完成
2. ⏳ **表單記憶功能** - 簡單，建議先做
3. ⏳ **Google Apps Script 部署** - 需要手動操作
4. ⏳ **前端訂單串接** - 等 GAS 部署完成後
5. ⏳ **LINE Pay 整合** - 最後實作

## 注意事項

### 表單記憶功能
- 使用 localStorage 儲存
- 頁面載入時自動填入
- 提供「清除記憶」按鈕

### Google Apps Script
- 需要 Google 帳號授權
- 部署後會得到一個 URL
- 測試時先用 `ping=1` 參數確認連線

### LINE Pay
- 測試階段使用 Sandbox
- 正式上線需改為 Production
- 需要 LINE Pay 商戶帳號

## 下一步行動

1. **立即推送**：折扣碼驗證修復
2. **準備實作**：表單記憶功能（需要您確認是否需要）
3. **等待確認**：Google Apps Script 部署位置
4. **協調測試**：LINE Pay 功能測試環境

## 測試清單

### 折扣碼測試
- [ ] PONKAN100（需滿 NT$ 1,000）
- [ ] PONKAN15（需滿 NT$ 800）
- [ ] EARLYBIRD（2025/10-2025/12）
- [ ] 金額不足時的錯誤提示
- [ ] 日期過期的錯誤提示

### 表單記憶測試（待實作）
- [ ] 填寫資料後重新載入頁面
- [ ] 資料是否自動帶入
- [ ] 清除記憶功能

### 訂單串接測試（待實作）
- [ ] 訂單成功提交到 Google Sheets
- [ ] 收到確認信
- [ ] 訂單編號格式正確

### LINE Pay 測試（待實作）
- [ ] 選擇 LINE Pay 付款
- [ ] 導向 LINE Pay 頁面
- [ ] 付款成功後回調
- [ ] 訂單狀態更新
