/**
 * Google Apps Script - 訂單管理系統
 * 
 * 設定步驟：
 * 1. 開啟 Google Sheets，建立新試算表
 * 2. 點選「擴充功能」>「Apps Script」
 * 3. 將此程式碼貼上並儲存
 * 4. 點選「部署」>「新增部署作業」
 * 5. 選擇類型：「網頁應用程式」
 * 6. 執行身分：選擇「我」
 * 7. 具有存取權的使用者：選擇「所有人」
 * 8. 點選「部署」並複製網頁應用程式 URL
 * 9. 將 URL 貼到 checkout.js 的 GOOGLE_SHEETS_CONFIG.scriptUrl
 */

const SHEET_NAME = '訂單資料';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    writeOrderToSheet(data);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        orderId: data.orderId,
        message: '訂單已成功儲存'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function writeOrderToSheet(orderData) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    const headers = ['訂單編號', '訂單時間', '客戶姓名', '客戶電話', 'Email', '配送地址', '備註', '商品明細', '小計', '折扣碼', '折扣金額', '總金額', '付款方式', '訂單狀態'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setBackground('#ff8c42').setFontColor('#ffffff').setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  
  const items = orderData.items.map(item => `${item.name} x ${item.quantity} (NT$${item.price})`).join('\n');
  const discountCode = orderData.discount ? orderData.discount.code : '';
  const discountAmount = orderData.discount ? orderData.discount.amount : 0;
  
  const rowData = [
    orderData.orderId,
    new Date(orderData.timestamp),
    orderData.customer.name,
    orderData.customer.phone,
    orderData.customer.email,
    orderData.customer.address,
    orderData.customer.note || '',
    items,
    orderData.subtotal,
    discountCode,
    discountAmount,
    orderData.total,
    orderData.paymentMethod === 'linepay' ? 'LINE Pay' : '貨到付款',
    orderData.status
  ];
  
  sheet.appendRow(rowData);
  const lastRow = sheet.getLastRow();
  sheet.getRange(lastRow, 2).setNumberFormat('yyyy-MM-dd HH:mm:ss');
  sheet.getRange(lastRow, 9).setNumberFormat('#,##0');
  sheet.getRange(lastRow, 11).setNumberFormat('#,##0');
  sheet.getRange(lastRow, 12).setNumberFormat('#,##0');
  sheet.getRange(lastRow, 8).setWrap(true);
  
  return true;
}
