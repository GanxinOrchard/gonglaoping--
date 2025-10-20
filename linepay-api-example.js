/**
 * LINE Pay API 後端範例
 * 需要安裝: npm install express axios crypto
 * 
 * 這個文件展示如何在後端處理 LINE Pay API 調用
 * 因為 LINE Pay 需要使用 Channel Secret 進行簽名，所以必須在後端處理
 */

const express = require('express');
const axios = require('axios');
const crypto = require('crypto');

const app = express();
app.use(express.json());

// LINE Pay 設定
const LINE_PAY_CONFIG = {
    channelId: '1657163831',
    channelSecret: '492cf50453a0a694dd5b70d1a8a33aa4',
    apiUrl: 'https://sandbox-api-pay.line.me', // 測試環境
    // apiUrl: 'https://api-pay.line.me', // 正式環境
    confirmUrl: 'https://your-domain.com/linepay-confirm.html',
    cancelUrl: 'https://your-domain.com/cart.html'
};

/**
 * 生成 HMAC-SHA256 簽名
 */
function generateSignature(uri, body, nonce) {
    const message = LINE_PAY_CONFIG.channelSecret + uri + JSON.stringify(body) + nonce;
    return crypto
        .createHmac('sha256', LINE_PAY_CONFIG.channelSecret)
        .update(message)
        .digest('base64');
}

/**
 * 生成隨機 nonce
 */
function generateNonce() {
    return crypto.randomBytes(16).toString('hex');
}

/**
 * API 1: 發起付款請求
 * POST /api/linepay/request
 */
app.post('/api/linepay/request', async (req, res) => {
    try {
        const { amount, currency, orderId, packages } = req.body;
        
        // 準備請求數據
        const requestBody = {
            amount: amount,
            currency: currency || 'TWD',
            orderId: orderId,
            packages: packages,
            redirectUrls: {
                confirmUrl: `${LINE_PAY_CONFIG.confirmUrl}?orderId=${orderId}`,
                cancelUrl: LINE_PAY_CONFIG.cancelUrl
            }
        };
        
        // 生成簽名
        const uri = '/v3/payments/request';
        const nonce = generateNonce();
        const signature = generateSignature(uri, requestBody, nonce);
        
        // 發送請求到 LINE Pay
        const response = await axios.post(
            `${LINE_PAY_CONFIG.apiUrl}${uri}`,
            requestBody,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-LINE-ChannelId': LINE_PAY_CONFIG.channelId,
                    'X-LINE-Authorization-Nonce': nonce,
                    'X-LINE-Authorization': signature
                }
            }
        );
        
        // 返回結果
        res.json(response.data);
        
    } catch (error) {
        console.error('LINE Pay Request Error:', error.response?.data || error.message);
        res.status(500).json({
            returnCode: '9999',
            returnMessage: error.response?.data?.returnMessage || '付款請求失敗'
        });
    }
});

/**
 * API 2: 確認付款
 * POST /api/linepay/confirm
 */
app.post('/api/linepay/confirm', async (req, res) => {
    try {
        const { transactionId, orderId } = req.body;
        
        // 這裡應該從資料庫獲取原始訂單金額
        // 暫時使用固定值
        const amount = 1000;
        const currency = 'TWD';
        
        // 準備確認請求數據
        const confirmBody = {
            amount: amount,
            currency: currency
        };
        
        // 生成簽名
        const uri = `/v3/payments/${transactionId}/confirm`;
        const nonce = generateNonce();
        const signature = generateSignature(uri, confirmBody, nonce);
        
        // 發送確認請求到 LINE Pay
        const response = await axios.post(
            `${LINE_PAY_CONFIG.apiUrl}${uri}`,
            confirmBody,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-LINE-ChannelId': LINE_PAY_CONFIG.channelId,
                    'X-LINE-Authorization-Nonce': nonce,
                    'X-LINE-Authorization': signature
                }
            }
        );
        
        // 付款成功，更新資料庫訂單狀態
        if (response.data.returnCode === '0000') {
            // TODO: 更新資料庫
            console.log('Payment confirmed for order:', orderId);
            
            // 返回訂單資訊
            res.json({
                returnCode: '0000',
                returnMessage: 'Success',
                info: {
                    orderId: orderId,
                    transactionId: transactionId,
                    amount: amount,
                    paymentDate: new Date().toISOString()
                }
            });
        } else {
            res.json(response.data);
        }
        
    } catch (error) {
        console.error('LINE Pay Confirm Error:', error.response?.data || error.message);
        res.status(500).json({
            returnCode: '9999',
            returnMessage: error.response?.data?.returnMessage || '付款確認失敗'
        });
    }
});

/**
 * API 3: 檢查付款狀態（用於輪詢）
 * GET /api/linepay/check?orderId=xxx
 */
app.get('/api/linepay/check', async (req, res) => {
    try {
        const { orderId } = req.query;
        
        // 這裡應該從資料庫查詢訂單狀態
        // 暫時返回示例數據
        
        // TODO: 從資料庫查詢
        const orderStatus = 'pending'; // pending, completed, failed
        
        res.json({
            status: orderStatus,
            orderId: orderId
        });
        
    } catch (error) {
        console.error('Check Status Error:', error);
        res.status(500).json({
            status: 'error',
            message: '查詢失敗'
        });
    }
});

/**
 * API 4: 退款（可選）
 * POST /api/linepay/refund
 */
app.post('/api/linepay/refund', async (req, res) => {
    try {
        const { transactionId, refundAmount } = req.body;
        
        // 準備退款請求
        const refundBody = {
            refundAmount: refundAmount
        };
        
        // 生成簽名
        const uri = `/v3/payments/${transactionId}/refund`;
        const nonce = generateNonce();
        const signature = generateSignature(uri, refundBody, nonce);
        
        // 發送退款請求
        const response = await axios.post(
            `${LINE_PAY_CONFIG.apiUrl}${uri}`,
            refundBody,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-LINE-ChannelId': LINE_PAY_CONFIG.channelId,
                    'X-LINE-Authorization-Nonce': nonce,
                    'X-LINE-Authorization': signature
                }
            }
        );
        
        res.json(response.data);
        
    } catch (error) {
        console.error('LINE Pay Refund Error:', error.response?.data || error.message);
        res.status(500).json({
            returnCode: '9999',
            returnMessage: '退款失敗'
        });
    }
});

// 啟動服務器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`LINE Pay API Server running on port ${PORT}`);
    console.log(`Channel ID: ${LINE_PAY_CONFIG.channelId}`);
    console.log(`Environment: ${LINE_PAY_CONFIG.apiUrl.includes('sandbox') ? 'Sandbox' : 'Production'}`);
});

/**
 * 使用說明：
 * 
 * 1. 安裝依賴：
 *    npm install express axios crypto
 * 
 * 2. 啟動服務器：
 *    node linepay-api-example.js
 * 
 * 3. 前端調用範例：
 *    
 *    // 發起付款
 *    fetch('http://localhost:3000/api/linepay/request', {
 *        method: 'POST',
 *        headers: { 'Content-Type': 'application/json' },
 *        body: JSON.stringify({
 *            amount: 1000,
 *            currency: 'TWD',
 *            orderId: 'ORDER123',
 *            packages: [{
 *                id: 'package-1',
 *                amount: 1000,
 *                products: [{
 *                    name: '柑心果園新鮮水果',
 *                    quantity: 1,
 *                    price: 1000
 *                }]
 *            }]
 *        })
 *    });
 * 
 * 4. 測試環境說明：
 *    - 使用 sandbox-api-pay.line.me 進行測試
 *    - 測試用的信用卡號碼請參考 LINE Pay 官方文件
 *    - 測試完成後記得切換到正式環境 api-pay.line.me
 * 
 * 5. 安全注意事項：
 *    - Channel Secret 絕對不能暴露在前端
 *    - 建議使用環境變數存儲敏感資訊
 *    - 正式環境必須使用 HTTPS
 *    - 實作訂單驗證和金額檢查
 */
