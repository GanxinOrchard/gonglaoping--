// Google Apps Script 後端代碼
// 部署為 Web App 使用

// 試算表 ID（請替換為您的試算表 ID）
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
const SHEET_NAME = '訂單資料';

// Email 設定
const ADMIN_EMAIL = 'your-email@example.com'; // 管理員 Email

// 處理 POST 請求（接收訂單）
function doPost(e) {
  try {
    // 解析請求資料
    const data = JSON.parse(e.postData.contents);
    
    // 寫入試算表
    const result = writeToSheet(data);
    
    // 發送 Email 通知
    sendOrderEmail(data);
    
    // 返回成功訊息
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        orderId: data.orderId,
        message: '訂單已成功建立'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// 處理 GET 請求（測試用）
function doGet(e) {
  return ContentService
    .createTextOutput('柑心果園訂單系統 API 運作中')
    .setMimeType(ContentService.MimeType.TEXT);
}

// 寫入試算表
function writeToSheet(orderData) {
  try {
    // 開啟試算表
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    
    // 如果工作表不存在，建立新的
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      
      // 建立標題列
      const headers = [
        '訂單編號', '訂單日期', '訂購人姓名', '訂購人電話', '訂購人Email',
        '收件人姓名', '收件人電話', '收件地址', '備註',
        '商品明細', '小計', '運費', '總金額', '付款方式', '訂單狀態'
      ];
      sheet.appendRow(headers);
      
      // 設定標題列格式
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#ff8c42');
      headerRange.setFontColor('#ffffff');
      headerRange.setFontWeight('bold');
      headerRange.setHorizontalAlignment('center');
    }
    
    // 準備商品明細
    let itemsDetail = '';
    orderData.items.forEach(function(item, index) {
      if (index > 0) itemsDetail += '\n';
      itemsDetail += item.name;
      if (item.spec) itemsDetail += ' (' + item.spec + ')';
      itemsDetail += ' x ' + item.quantity + ' = NT$ ' + item.subtotal;
    });
    
    // 準備資料列
    const row = [
      orderData.orderId,
      orderData.orderDate,
      orderData.buyer.name,
      orderData.buyer.phone,
      orderData.buyer.email,
      orderData.receiver.name,
      orderData.receiver.phone,
      orderData.receiver.address,
      orderData.note || '',
      itemsDetail,
      orderData.subtotal,
      orderData.shipping,
      orderData.total,
      orderData.paymentMethod,
      orderData.status
    ];
    
    // 寫入資料
    sheet.appendRow(row);
    
    // 自動調整欄寬
    sheet.autoResizeColumns(1, row.length);
    
    return { success: true };
    
  } catch (error) {
    Logger.log('寫入試算表錯誤: ' + error.toString());
    throw error;
  }
}

// 發送訂單確認 Email
function sendOrderEmail(orderData) {
  try {
    // Email 給客戶
    const customerSubject = '【柑心果園】訂單確認 - ' + orderData.orderId;
    const customerBody = createCustomerEmailBody(orderData);
    
    GmailApp.sendEmail(
      orderData.buyer.email,
      customerSubject,
      customerBody,
      {
        htmlBody: customerBody,
        name: '柑心果園'
      }
    );
    
    // Email 給管理員
    const adminSubject = '【新訂單】' + orderData.orderId + ' - ' + orderData.buyer.name;
    const adminBody = createAdminEmailBody(orderData);
    
    GmailApp.sendEmail(
      ADMIN_EMAIL,
      adminSubject,
      adminBody,
      {
        htmlBody: adminBody,
        name: '柑心果園訂單系統'
      }
    );
    
    return { success: true };
    
  } catch (error) {
    Logger.log('發送Email錯誤: ' + error.toString());
    // Email 失敗不影響訂單建立
    return { success: false, error: error.toString() };
  }
}

// 建立客戶 Email 內容
function createCustomerEmailBody(orderData) {
  let html = '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">';
  html += '<div style="background: #ff8c42; color: white; padding: 20px; text-align: center;">';
  html += '<h1 style="margin: 0;">柑心果園</h1>';
  html += '<p style="margin: 10px 0 0 0;">訂單確認通知</p>';
  html += '</div>';
  
  html += '<div style="padding: 20px; background: #f9fafb;">';
  html += '<h2 style="color: #ff8c42;">訂單資訊</h2>';
  html += '<p><strong>訂單編號：</strong>' + orderData.orderId + '</p>';
  html += '<p><strong>訂單日期：</strong>' + orderData.orderDate + '</p>';
  html += '<p><strong>訂單狀態：</strong>' + orderData.status + '</p>';
  html += '</div>';
  
  html += '<div style="padding: 20px;">';
  html += '<h3>訂購人資訊</h3>';
  html += '<p><strong>姓名：</strong>' + orderData.buyer.name + '</p>';
  html += '<p><strong>電話：</strong>' + orderData.buyer.phone + '</p>';
  html += '<p><strong>Email：</strong>' + orderData.buyer.email + '</p>';
  html += '</div>';
  
  html += '<div style="padding: 20px; background: #f9fafb;">';
  html += '<h3>收件人資訊</h3>';
  html += '<p><strong>姓名：</strong>' + orderData.receiver.name + '</p>';
  html += '<p><strong>電話：</strong>' + orderData.receiver.phone + '</p>';
  html += '<p><strong>地址：</strong>' + orderData.receiver.address + '</p>';
  if (orderData.note) {
    html += '<p><strong>備註：</strong>' + orderData.note + '</p>';
  }
  html += '</div>';
  
  html += '<div style="padding: 20px;">';
  html += '<h3>訂單明細</h3>';
  html += '<table style="width: 100%; border-collapse: collapse;">';
  html += '<tr style="background: #f3f4f6;">';
  html += '<th style="padding: 10px; text-align: left; border-bottom: 2px solid #e5e7eb;">商品</th>';
  html += '<th style="padding: 10px; text-align: center; border-bottom: 2px solid #e5e7eb;">數量</th>';
  html += '<th style="padding: 10px; text-align: right; border-bottom: 2px solid #e5e7eb;">小計</th>';
  html += '</tr>';
  
  orderData.items.forEach(function(item) {
    html += '<tr>';
    html += '<td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">';
    html += item.name;
    if (item.spec) html += ' (' + item.spec + ')';
    html += '</td>';
    html += '<td style="padding: 10px; text-align: center; border-bottom: 1px solid #e5e7eb;">' + item.quantity + '</td>';
    html += '<td style="padding: 10px; text-align: right; border-bottom: 1px solid #e5e7eb;">NT$ ' + item.subtotal + '</td>';
    html += '</tr>';
  });
  
  html += '<tr><td colspan="2" style="padding: 10px; text-align: right;"><strong>小計：</strong></td>';
  html += '<td style="padding: 10px; text-align: right;"><strong>NT$ ' + orderData.subtotal + '</strong></td></tr>';
  html += '<tr><td colspan="2" style="padding: 10px; text-align: right;"><strong>運費：</strong></td>';
  html += '<td style="padding: 10px; text-align: right;"><strong>NT$ ' + orderData.shipping + '</strong></td></tr>';
  html += '<tr style="background: #fff7ed;"><td colspan="2" style="padding: 10px; text-align: right;"><strong>總金額：</strong></td>';
  html += '<td style="padding: 10px; text-align: right; color: #ff8c42; font-size: 18px;"><strong>NT$ ' + orderData.total + '</strong></td></tr>';
  html += '</table>';
  html += '</div>';
  
  if (orderData.paymentMethod === '銀行匯款') {
    html += '<div style="padding: 20px; background: #fffbeb; border-left: 4px solid #f59e0b;">';
    html += '<h3 style="color: #f59e0b;">匯款資訊</h3>';
    html += '<p><strong>銀行：</strong>台灣銀行 豐原分行</p>';
    html += '<p><strong>戶名：</strong>柑心果園</p>';
    html += '<p><strong>帳號：</strong>123-456-789012</p>';
    html += '<p style="color: #ef4444; margin-top: 15px;"><strong>※ 請於3天內完成匯款，並提供後5碼以便核對</strong></p>';
    html += '</div>';
  }
  
  html += '<div style="padding: 20px; text-align: center; background: #f9fafb; color: #666;">';
  html += '<p>如有任何問題，歡迎聯繫我們</p>';
  html += '<p><strong>電話：</strong>0933-721-978</p>';
  html += '<p><strong>營業時間：</strong>週一至週五 09:00-18:00</p>';
  html += '</div>';
  
  html += '</div>';
  
  return html;
}

// 建立管理員 Email 內容
function createAdminEmailBody(orderData) {
  let html = '<div style="font-family: Arial, sans-serif;">';
  html += '<h2 style="color: #ff8c42;">新訂單通知</h2>';
  html += '<p><strong>訂單編號：</strong>' + orderData.orderId + '</p>';
  html += '<p><strong>訂單日期：</strong>' + orderData.orderDate + '</p>';
  html += '<p><strong>付款方式：</strong>' + orderData.paymentMethod + '</p>';
  html += '<p><strong>訂單金額：</strong>NT$ ' + orderData.total + '</p>';
  html += '<hr>';
  html += '<h3>訂購人</h3>';
  html += '<p>' + orderData.buyer.name + ' / ' + orderData.buyer.phone + ' / ' + orderData.buyer.email + '</p>';
  html += '<h3>收件人</h3>';
  html += '<p>' + orderData.receiver.name + ' / ' + orderData.receiver.phone + '</p>';
  html += '<p>' + orderData.receiver.address + '</p>';
  if (orderData.note) {
    html += '<p><strong>備註：</strong>' + orderData.note + '</p>';
  }
  html += '<hr>';
  html += '<h3>訂單明細</h3>';
  html += '<ul>';
  orderData.items.forEach(function(item) {
    html += '<li>' + item.name;
    if (item.spec) html += ' (' + item.spec + ')';
    html += ' x ' + item.quantity + ' = NT$ ' + item.subtotal + '</li>';
  });
  html += '</ul>';
  html += '<p><strong>請盡快處理此訂單</strong></p>';
  html += '</div>';
  
  return html;
}
