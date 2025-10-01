// Google Sheets API 設定
const GOOGLE_SHEETS_CONFIG = {
    // 請替換為您的 Google Apps Script Web App URL
    scriptUrl: 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE',
    sheetName: '訂單資料'
};

// LINE Pay 設定
const LINEPAY_CONFIG = {
    // 請替換為您的 LINE Pay Channel ID 和 Secret
    channelId: 'YOUR_LINEPAY_CHANNEL_ID',
    channelSecret: 'YOUR_LINEPAY_CHANNEL_SECRET',
    // 測試環境或正式環境
    apiUrl: 'https://sandbox-api-pay.line.me/v2/payments/request' // 測試環境
    // apiUrl: 'https://api-pay.line.me/v2/payments/request' // 正式環境
};

// 開啟結帳彈窗
function openCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    const cartSidebar = document.getElementById('cartSidebar');
    
    if (modal) {
        modal.classList.add('active');
        updateCheckoutSummary();
    }
    
    if (cartSidebar) {
        cartSidebar.classList.remove('active');
    }
}

// 關閉結帳彈窗
function closeCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    
    if (modal) {
        modal.classList.remove('active');
    }
}

// 計算運費（依商品類型）
function calculateShipping(subtotal, cartItems) {
    // 滿1800免運
    if (subtotal >= 1800) return 0;
    
    // 檢查購物車中的商品類型，取最高運費
    let maxShippingFee = 0;
    
    if (typeof cart !== 'undefined' && cart.length > 0) {
        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (!product) return;
            
            let fee = 150; // 預設常溫
            if (product.shippingType === 'cold') {
                fee = 180; // 冷藏
            } else if (product.shippingType === 'frozen') {
                fee = 200; // 冷凍
            }
            
            if (fee > maxShippingFee) {
                maxShippingFee = fee;
            }
        });
    }
    
    return maxShippingFee || 150;
}

// 更新結帳摘要
function updateCheckoutSummary() {
    const checkoutSummary = document.getElementById('checkoutSummary');
    const checkoutTotal = document.getElementById('checkoutTotal');
    
    if (!checkoutSummary || !checkoutTotal) return;
    
    const subtotal = calculateSubtotal();
    const shipping = calculateShipping(subtotal, cart);
    
    // 渲染訂單項目
    checkoutSummary.innerHTML = cart.map(item => `
        <div class="checkout-summary-item">
            <span>${item.name} x ${item.quantity}</span>
            <span>NT$ ${item.price * item.quantity}</span>
        </div>
    `).join('');
    
    // 顯示小計
    checkoutSummary.innerHTML += `
        <div class="checkout-summary-item">
            <span>小計</span>
            <span>NT$ ${subtotal}</span>
        </div>
    `;
    
    // 顯示運費
    checkoutSummary.innerHTML += `
        <div class="checkout-summary-item">
            <span>運費 ${shipping === 0 ? '(滿1800免運)' : ''}</span>
            <span>${shipping === 0 ? '免運' : 'NT$ ' + shipping}</span>
        </div>
    `;
    
    // 顯示折扣
    if (appliedDiscount) {
        const discount = calculateDiscount(subtotal);
        
        checkoutSummary.innerHTML += `
            <div class="checkout-summary-item" style="color: var(--success-color);">
                <span>折扣 (${appliedDiscount.description})</span>
                <span>-NT$ ${discount}</span>
            </div>
        `;
    }
    
    // 更新總計
    const total = calculateTotal() + shipping;
    checkoutTotal.textContent = `NT$ ${total}`;
}

// 生成訂單編號
function generateOrderId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `ORD${timestamp}${random}`;
}

// 提交訂單到 Google Sheets
async function submitOrderToGoogleSheets(orderData) {
    try {
        const response = await fetch(GOOGLE_SHEETS_CONFIG.scriptUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });
        
        return { success: true };
    } catch (error) {
        console.error('提交訂單到 Google Sheets 失敗:', error);
        return { success: false, error: error.message };
    }
}

// LINE Pay 付款請求
async function requestLinePayPayment(orderData) {
    try {
        const paymentData = {
            amount: orderData.total,
            currency: 'TWD',
            orderId: orderData.orderId,
            packages: [
                {
                    id: orderData.orderId,
                    amount: orderData.total,
                    products: orderData.items.map(item => ({
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            ],
            redirectUrls: {
                confirmUrl: `${window.location.origin}/payment-confirm.html`,
                cancelUrl: `${window.location.origin}/payment-cancel.html`
            }
        };
        
        // 注意：實際的 LINE Pay API 呼叫需要在後端進行
        // 這裡僅作為示範，實際應用需要建立後端 API
        console.log('LINE Pay 付款資料:', paymentData);
        
        // 模擬付款成功（實際應用中應該呼叫後端 API）
        return {
            success: true,
            paymentUrl: '#', // 實際應該是 LINE Pay 返回的付款 URL
            transactionId: 'DEMO_' + Date.now()
        };
        
    } catch (error) {
        console.error('LINE Pay 付款請求失敗:', error);
        return { success: false, error: error.message };
    }
}

// 處理訂單提交
async function handleOrderSubmit(formData) {
    // 準備訂單資料
    const orderData = {
        orderId: generateOrderId(),
        timestamp: new Date().toISOString(),
        customer: {
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            address: formData.address,
            note: formData.note
        },
        items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            subtotal: item.price * item.quantity
        })),
        subtotal: calculateSubtotal(),
        discount: appliedDiscount ? {
            code: document.getElementById('discountCode')?.value || '',
            description: appliedDiscount.description,
            amount: calculateDiscount(calculateSubtotal())
        } : null,
        total: calculateTotal(),
        paymentMethod: formData.paymentMethod,
        status: '待付款'
    };
    
    // 提交到 Google Sheets
    const sheetsResult = await submitOrderToGoogleSheets(orderData);
    
    if (!sheetsResult.success) {
        throw new Error('訂單提交失敗，請稍後再試');
    }
    
    // 如果選擇銀行匯款
    if (formData.paymentMethod === 'bank') {
        return {
            success: true,
            message: '訂單已建立！請於 3 天內完成匯款，並提供匯款後5碼以便核對。',
            orderId: orderData.orderId
        };
    }
    
    // 如果選擇 LINE Pay，發起付款請求
    if (formData.paymentMethod === 'linepay') {
        const paymentResult = await requestLinePayPayment(orderData);
        
        if (paymentResult.success) {
            // 實際應用中應該導向 LINE Pay 付款頁面
            // window.location.href = paymentResult.paymentUrl;
            
            // 示範用：顯示成功訊息
            return {
                success: true,
                message: '訂單已建立！',
                orderId: orderData.orderId,
                paymentUrl: paymentResult.paymentUrl
            };
        } else {
            throw new Error('LINE Pay 付款請求失敗');
        }
    } else {
        // 貨到付款
        return {
            success: true,
            message: '訂單已建立！我們會盡快為您處理。',
            orderId: orderData.orderId
        };
    }
}

// 顯示訂單成功訊息
function showOrderSuccess(orderId) {
    const modal = document.getElementById('checkoutModal');
    
    if (modal) {
        modal.querySelector('.modal-body').innerHTML = `
            <div style="text-align: center; padding: 40px 20px;">
                <i class="fas fa-check-circle" style="font-size: 64px; color: var(--success-color); margin-bottom: 20px;"></i>
                <h3 style="margin-bottom: 15px;">訂單已成功建立！</h3>
                <p style="color: var(--text-light); margin-bottom: 10px;">訂單編號：${orderId}</p>
                <p style="color: var(--text-light); margin-bottom: 30px;">我們已收到您的訂單，將盡快為您處理。</p>
                <button class="btn-primary" onclick="closeCheckoutModalAndClearCart()">返回首頁</button>
            </div>
        `;
    }
}

// 關閉彈窗並清空購物車
function closeCheckoutModalAndClearCart() {
    closeCheckoutModal();
    clearCart();
    
    // 重置表單
    const form = document.getElementById('checkoutForm');
    if (form) {
        form.reset();
    }
}

// 初始化結帳功能
document.addEventListener('DOMContentLoaded', () => {
    // 關閉結帳彈窗按鈕
    const closeCheckoutModalBtn = document.getElementById('closeCheckoutModal');
    
    if (closeCheckoutModalBtn) {
        closeCheckoutModalBtn.addEventListener('click', closeCheckoutModal);
    }
    
    // 點擊彈窗外部關閉
    const checkoutModal = document.getElementById('checkoutModal');
    
    if (checkoutModal) {
        checkoutModal.addEventListener('click', (e) => {
            if (e.target === checkoutModal) {
                closeCheckoutModal();
            }
        });
    }
    
    // 結帳表單提交
    const checkoutForm = document.getElementById('checkoutForm');
    
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // 取得表單資料
            const formData = {
                name: document.getElementById('customerName').value,
                phone: document.getElementById('customerPhone').value,
                email: document.getElementById('customerEmail').value,
                address: document.getElementById('customerAddress').value,
                note: document.getElementById('customerNote').value,
                paymentMethod: document.querySelector('input[name="payment"]:checked').value
            };
            
            // 驗證表單
            if (!formData.name || !formData.phone || !formData.email || !formData.address) {
                showNotification('請填寫所有必填欄位！');
                return;
            }
            
            // 顯示載入中
            const submitBtn = checkoutForm.querySelector('.btn-submit-order');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = '處理中...';
            submitBtn.disabled = true;
            
            try {
                // 提交訂單
                const result = await handleOrderSubmit(formData);
                
                if (result.success) {
                    showOrderSuccess(result.orderId);
                } else {
                    throw new Error(result.message || '訂單提交失敗');
                }
            } catch (error) {
                console.error('訂單處理錯誤:', error);
                showNotification(error.message || '訂單提交失敗，請稍後再試');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});
