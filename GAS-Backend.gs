// Google Apps Script 後端代碼
// 部署為 Web App 使用

// 試算表 ID（請替換為您的試算表 ID）
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
const SHEET_NAME = '訂單資料';
const DETAIL_SHEET_NAME = '訂單明細';

// Email 設定
const ADMIN_EMAIL = 'your-email@example.com'; // 管理員 Email

// LINE Pay 設定
const LINE_PAY_CONFIG = {
  channelId: '1657163831',
  channelSecret: '492cf50453a0a694dd5b70d1a8a33aa4',
  sandbox: true, // 測試環境，正式上線時改為 false
  apiUrl: 'https://sandbox-api-pay.line.me' // 測試環境，正式環境為 'https://api-pay.line.me'
};

// 處理 POST 請求（接收訂單）
function doPost(e) {
  try {
    // 解析請求資料
    const data = JSON.parse(e.postData.contents);
    
    // 檢查請求類型
    const action = e.parameter.action;
    
    if (action === 'createLinePayPayment') {
      // 處理 LINE Pay 付款請求
      return handleLinePayPayment(data);
    } else if (action === 'confirmLinePayPayment') {
      // 處理 LINE Pay 付款確認
      return handleLinePayConfirm(data);
    } else {
      // 一般訂單處理
      return handleRegularOrder(data);
    }
      
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

// 處理一般訂單
function handleRegularOrder(data) {
  try {
    // 生成統一訂單編號
    const orderId = generateOrderId();
    
    // 準備訂單資料
    const orderData = {
      orderId: orderId,
      orderDate: new Date().toLocaleString('zh-TW'),
      status: '待付款',
      buyer: {
        name: data.buyerName || data.buyer?.name,
        email: data.buyerEmail || data.buyer?.email,
        phone: data.buyerPhone || data.buyer?.phone,
        address: data.buyerAddress || data.buyer?.addr
      },
      receiver: {
        name: data.receiverName || data.receiver?.name,
        email: data.receiverEmail || data.receiver?.email,
        phone: data.receiverPhone || data.receiver?.phone,
        address: data.receiverAddress || data.receiver?.addr
      },
      items: data.items || [],
      subtotal: data.summary?.subtotal || 0,
      shipping: data.summary?.shipping || 0,
      discount: data.summary?.discount || 0,
      total: data.summary?.total || 0,
      paymentMethod: data.payment || data.paymentMethod || '銀行匯款',
      delivery: data.delivery === 'home' ? '宅配到府' : '門市自取',
      note: data.remark || data.note || ''
    };
    
    // 寫入試算表
    const result = writeToSheet(orderData);
    
    // 寫入訂單明細
    writeOrderDetails(orderData);
    
    // 發送 Email 通知
    sendOrderEmail(orderData);
    
    // 返回成功訊息
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        orderId: orderId,
        message: '訂單已成功建立'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log('處理一般訂單錯誤: ' + error.toString());
    throw error;
  }
}

// 處理 GET 請求（訂單查詢）
function doGet(e) {
  try {
    const action = e.parameter.action;
    
    if (action === 'getOrder') {
      const orderId = e.parameter.orderId;
      const email = e.parameter.email;
      
      if (!orderId || !email) {
        return ContentService
          .createTextOutput(JSON.stringify({
            success: false,
            error: '缺少訂單編號或Email'
          }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      
      const order = getOrderByIdAndEmail(orderId, email);
      
      if (order) {
        return ContentService
          .createTextOutput(JSON.stringify({
            success: true,
            order: order
          }))
          .setMimeType(ContentService.MimeType.JSON);
      } else {
        return ContentService
          .createTextOutput(JSON.stringify({
            success: false,
            error: '找不到訂單'
          }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    return ContentService
      .createTextOutput('柑心果園訂單系統 API 運作中')
      .setMimeType(ContentService.MimeType.TEXT);
      
  } catch (error) {
    Logger.log('GET Error: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// 生成統一訂單編號
function generateOrderId() {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const time = now.getTime().toString().slice(-6);
  return `GX${year}${month}${day}${time}`;
}

// 處理 LINE Pay 付款請求
function handleLinePayPayment(data) {
  try {
    // 生成訂單編號
    const orderId = data.orderId || generateOrderId();
    
    // 準備 LINE Pay 請求
    const linePayRequest = {
      amount: data.amount,
      currency: data.currency,
      orderId: orderId,
      packages: data.packages,
      redirectUrls: data.redirectUrls
    };
    
    // 建立 LINE Pay 付款請求
    const paymentUrl = createLinePayRequest(linePayRequest);
    
    if (paymentUrl) {
      // 儲存訂單資料（待付款狀態）
      const orderData = {
        orderId: orderId,
        orderDate: new Date().toLocaleString('zh-TW'),
        status: '待付款 (LINE Pay)',
        buyer: {
          name: data.orderData.buyerName,
          email: data.orderData.buyerEmail,
          phone: data.orderData.buyerPhone,
          address: data.orderData.buyerAddress
        },
        receiver: {
          name: data.orderData.receiverName,
          email: data.orderData.receiverEmail,
          phone: data.orderData.receiverPhone,
          address: data.orderData.receiverAddress
        },
        items: data.orderData.items || [],
        subtotal: data.orderData.summary?.subtotal || 0,
        shipping: data.orderData.summary?.shipping || 0,
        discount: data.orderData.summary?.discount || 0,
        total: data.orderData.summary?.total || 0,
        paymentMethod: 'LINE Pay',
        delivery: data.orderData.delivery === 'home' ? '宅配到府' : '門市自取',
        note: data.orderData.remark || ''
      };
      
      // 寫入試算表（待付款狀態）
      writeToSheet(orderData);
      writeOrderDetails(orderData);
      
      return ContentService
        .createTextOutput(JSON.stringify({
          success: true,
          paymentUrl: paymentUrl,
          orderId: orderId
        }))
        .setMimeType(ContentService.MimeType.JSON);
    } else {
      throw new Error('建立 LINE Pay 付款失敗');
    }
    
  } catch (error) {
    Logger.log('LINE Pay 付款請求錯誤: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// 建立 LINE Pay 請求
function createLinePayRequest(requestData) {
  try {
    const url = LINE_PAY_CONFIG.apiUrl + '/v2/payments/request';
    
    const payload = {
      amount: requestData.amount,
      currency: requestData.currency,
      orderId: requestData.orderId,
      packages: requestData.packages,
      redirectUrls: requestData.redirectUrls
    };
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-LINE-ChannelId': LINE_PAY_CONFIG.channelId,
        'X-LINE-ChannelSecret': LINE_PAY_CONFIG.channelSecret
      },
      payload: JSON.stringify(payload)
    };
    
    const response = UrlFetchApp.fetch(url, options);
    const result = JSON.parse(response.getContentText());
    
    if (result.returnCode === '0000') {
      return result.info.paymentUrl.web;
    } else {
      Logger.log('LINE Pay API 錯誤: ' + result.returnMessage);
      return null;
    }
    
  } catch (error) {
    Logger.log('建立 LINE Pay 請求錯誤: ' + error.toString());
    return null;
  }
}

// 處理 LINE Pay 付款確認
function handleLinePayConfirm(data) {
  try {
    const orderId = data.orderId;
    const transactionId = data.transactionId;
    
    // 確認 LINE Pay 付款
    const confirmResult = confirmLinePayPayment(transactionId, data.amount);
    
    if (confirmResult.success) {
      // 更新訂單狀態為已付款
      updateOrderStatus(orderId, '已付款 (LINE Pay)');
      
      // 發送確認 Email
      const orderData = getOrderById(orderId);
      if (orderData) {
        sendOrderEmail(orderData);
      }
      
      return ContentService
        .createTextOutput(JSON.stringify({
          success: true,
          message: '付款確認成功'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    } else {
      throw new Error('付款確認失敗');
    }
    
  } catch (error) {
    Logger.log('LINE Pay 付款確認錯誤: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// 確認 LINE Pay 付款
function confirmLinePayPayment(transactionId, amount) {
  try {
    const url = LINE_PAY_CONFIG.apiUrl + '/v2/payments/' + transactionId + '/confirm';
    
    const payload = {
      amount: amount,
      currency: 'TWD'
    };
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-LINE-ChannelId': LINE_PAY_CONFIG.channelId,
        'X-LINE-ChannelSecret': LINE_PAY_CONFIG.channelSecret
      },
      payload: JSON.stringify(payload)
    };
    
    const response = UrlFetchApp.fetch(url, options);
    const result = JSON.parse(response.getContentText());
    
    return {
      success: result.returnCode === '0000',
      message: result.returnMessage
    };
    
  } catch (error) {
    Logger.log('確認 LINE Pay 付款錯誤: ' + error.toString());
    return { success: false, message: error.toString() };
  }
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
      
      // 建立標題列（完整欄位）
      const headers = [
        '訂單編號', '姓名', 'Email', '手機', '寄信狀態', '寄信是否成功', 
        '款項狀態', '出貨狀態', '物流方式', '收件地址', '備註', 
        '建立時間', '應付金額', '物流單號', '出貨日期', '寄信結果'
      ];
      sheet.appendRow(headers);
      
      // 設定標題列格式
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#ff8c42');
      headerRange.setFontColor('#ffffff');
      headerRange.setFontWeight('bold');
      headerRange.setHorizontalAlignment('center');
    }
    
    // 準備資料列（完整欄位）
    const row = [
      orderData.orderId,                    // 訂單編號
      orderData.receiver.name,              // 姓名（收件人）
      orderData.buyer.email,                // Email
      orderData.receiver.phone,             // 手機
      '待寄送',                             // 寄信狀態
      '',                                   // 寄信是否成功
      orderData.status,                     // 款項狀態
      '待處理',                             // 出貨狀態
      orderData.paymentMethod,              // 物流方式
      orderData.receiver.address,           // 收件地址
      orderData.note || '',                 // 備註
      orderData.orderDate,                  // 建立時間
      orderData.total,                      // 應付金額
      '',                                   // 物流單號
      '',                                   // 出貨日期
      ''                                    // 寄信結果
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

// 寫入訂單明細
function writeOrderDetails(orderData) {
  try {
    // 開啟試算表
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let detailSheet = ss.getSheetByName(DETAIL_SHEET_NAME);
    
    // 如果明細工作表不存在，建立新的
    if (!detailSheet) {
      detailSheet = ss.insertSheet(DETAIL_SHEET_NAME);
      
      // 建立標題列
      const headers = [
        '訂單編號', '品名', '規格', '數量', '單價', '小計', '建立時間'
      ];
      detailSheet.appendRow(headers);
      
      // 設定標題列格式
      const headerRange = detailSheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#ff8c42');
      headerRange.setFontColor('#ffffff');
      headerRange.setFontWeight('bold');
      headerRange.setHorizontalAlignment('center');
    }
    
    // 寫入每個商品明細
    orderData.items.forEach(function(item) {
      const detailRow = [
        orderData.orderId,                  // 訂單編號
        item.name,                          // 品名
        item.spec || '',                    // 規格
        item.quantity,                      // 數量
        item.price,                         // 單價
        item.price * item.quantity,         // 小計
        orderData.orderDate                 // 建立時間
      ];
      
      detailSheet.appendRow(detailRow);
    });
    
    // 自動調整欄寬
    detailSheet.autoResizeColumns(1, 7);
    
    return { success: true };
    
  } catch (error) {
    Logger.log('寫入訂單明細錯誤: ' + error.toString());
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
    html += '<td style="padding: 10px; text-align: right; border-bottom: 1px solid #e5e7eb;">NT$ ' + (item.price * item.quantity).toLocaleString() + '</td>';
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
    html += ' x ' + item.quantity + ' = NT$ ' + (item.price * item.quantity).toLocaleString() + '</li>';
  });
  html += '</ul>';
  html += '<p><strong>請盡快處理此訂單</strong></p>';
  html += '</div>';
  
  return html;
}

// 更新訂單狀態
function updateOrderStatus(orderId, status) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      return false;
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const orderIdCol = headers.indexOf('訂單編號');
    const statusCol = headers.indexOf('款項狀態');
    
    // 搜尋並更新訂單狀態
    for (let i = 1; i < data.length; i++) {
      if (data[i][orderIdCol] === orderId) {
        sheet.getRange(i + 1, statusCol + 1).setValue(status);
        return true;
      }
    }
    
    return false;
    
  } catch (error) {
    Logger.log('更新訂單狀態錯誤: ' + error.toString());
    return false;
  }
}

// 根據訂單編號查詢訂單
function getOrderById(orderId) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      return null;
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const orderIdCol = headers.indexOf('訂單編號');
    
    // 搜尋訂單
    for (let i = 1; i < data.length; i++) {
      if (data[i][orderIdCol] === orderId) {
        // 找到訂單，返回資料
        const order = {};
        headers.forEach(function(header, index) {
          order[header] = data[i][index];
        });
        return order;
      }
    }
    
    return null;
    
  } catch (error) {
    Logger.log('查詢訂單錯誤: ' + error.toString());
    return null;
  }
}

// 查詢訂單（依訂單編號和Email）
function getOrderByIdAndEmail(orderId, email) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      return null;
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    // 找到對應的欄位索引
    const orderIdCol = headers.indexOf('訂單編號');
    const emailCol = headers.indexOf('Email');
    
    // 搜尋訂單
    for (let i = 1; i < data.length; i++) {
      if (data[i][orderIdCol] === orderId && data[i][emailCol] === email) {
        // 找到訂單，返回資料
        const order = {};
        headers.forEach(function(header, index) {
          order[header] = data[i][index];
        });
        return order;
      }
    }
    
    return null;
    
  } catch (error) {
    Logger.log('查詢訂單錯誤: ' + error.toString());
    return null;
  }
}
