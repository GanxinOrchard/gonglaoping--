/**
 * Google Apps Script 後端整合程式碼
 * 用於處理訂單提交、聯絡表單等功能
 */

// ===== 設定區 =====
const GAS_CONFIG = {
    // 請在 Google Apps Script 部署後，將 Web App URL 填入此處
    webAppUrl: 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE',
    
    // API 端點
    endpoints: {
        submitOrder: '/submitOrder',
        submitContact: '/submitContact',
        getOrders: '/getOrders',
        trackOrder: '/trackOrder'
    }
};

// ===== 訂單提交 =====
/**
 * 提交訂單到 Google Sheets
 * @param {Object} orderData - 訂單資料
 * @returns {Promise<Object>} - 提交結果
 */
async function submitOrderToGAS(orderData) {
    try {
        const response = await fetch(GAS_CONFIG.webAppUrl + GAS_CONFIG.endpoints.submitOrder, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                orderId: orderData.orderId,
                customerName: orderData.customerName,
                customerPhone: orderData.customerPhone,
                customerEmail: orderData.customerEmail,
                customerAddress: orderData.customerAddress,
                items: orderData.items,
                subtotal: orderData.subtotal,
                discount: orderData.discount,
                total: orderData.total,
                paymentMethod: orderData.paymentMethod,
                orderNote: orderData.orderNote,
                orderDate: new Date().toISOString(),
                status: '待處理'
            })
        });
        
        return { 
            success: true, 
            message: '訂單已成功提交！',
            orderId: orderData.orderId 
        };
    } catch (error) {
        console.error('提交訂單失敗:', error);
        return { 
            success: false, 
            message: '訂單提交失敗，請稍後再試或聯絡客服',
            error: error.message 
        };
    }
}

// ===== 聯絡表單提交 =====
/**
 * 提交聯絡表單到 Google Sheets
 * @param {Object} contactData - 聯絡表單資料
 * @returns {Promise<Object>} - 提交結果
 */
async function submitContactToGAS(contactData) {
    try {
        const response = await fetch(GAS_CONFIG.webAppUrl + GAS_CONFIG.endpoints.submitContact, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: contactData.name,
                email: contactData.email,
                phone: contactData.phone,
                message: contactData.message,
                submitDate: new Date().toISOString(),
                status: '未讀'
            })
        });
        
        return { 
            success: true, 
            message: '您的訊息已成功送出！我們會盡快回覆您。' 
        };
    } catch (error) {
        console.error('提交聯絡表單失敗:', error);
        return { 
            success: false, 
            message: '訊息提交失敗，請稍後再試或直接撥打客服電話',
            error: error.message 
        };
    }
}

// ===== 訂單查詢 =====
/**
 * 查詢訂單狀態
 * @param {string} orderId - 訂單編號
 * @returns {Promise<Object>} - 訂單資料
 */
async function trackOrderFromGAS(orderId) {
    try {
        const response = await fetch(
            `${GAS_CONFIG.webAppUrl}${GAS_CONFIG.endpoints.trackOrder}?orderId=${orderId}`,
            {
                method: 'GET',
                mode: 'cors'
            }
        );
        
        const data = await response.json();
        
        if (data.success) {
            return {
                success: true,
                order: data.order
            };
        } else {
            return {
                success: false,
                message: '找不到此訂單編號'
            };
        }
    } catch (error) {
        console.error('查詢訂單失敗:', error);
        return {
            success: false,
            message: '查詢失敗，請稍後再試',
            error: error.message
        };
    }
}

// ===== 使用範例 =====

// 範例 1: 提交訂單
/*
const orderData = {
    orderId: 'ORD20250102001',
    customerName: '王小明',
    customerPhone: '0912345678',
    customerEmail: 'example@email.com',
    customerAddress: '台北市信義區信義路五段7號',
    items: [
        { name: '有機文旦禮盒', price: 880, quantity: 2 },
        { name: '金鑽鳳梨', price: 450, quantity: 1 }
    ],
    subtotal: 2210,
    discount: 221,
    total: 1989,
    paymentMethod: 'linepay',
    orderNote: '請在下午送達'
};

submitOrderToGAS(orderData).then(result => {
    if (result.success) {
        console.log('訂單提交成功:', result.orderId);
    } else {
        console.error('訂單提交失敗:', result.message);
    }
});
*/

// 範例 2: 提交聯絡表單
/*
const contactData = {
    name: '王小明',
    email: 'example@email.com',
    phone: '0912345678',
    message: '請問有提供宅配服務嗎？'
};

submitContactToGAS(contactData).then(result => {
    if (result.success) {
        console.log('訊息已送出');
    } else {
        console.error('訊息送出失敗:', result.message);
    }
});
*/

// 範例 3: 查詢訂單
/*
trackOrderFromGAS('ORD20250102001').then(result => {
    if (result.success) {
        console.log('訂單資料:', result.order);
    } else {
        console.error('查詢失敗:', result.message);
    }
});
*/

// ===== 匯出函數供其他檔案使用 =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        submitOrderToGAS,
        submitContactToGAS,
        trackOrderFromGAS,
        GAS_CONFIG
    };
}
