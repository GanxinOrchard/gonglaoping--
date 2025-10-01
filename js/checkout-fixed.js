// Google Apps Script Web App URL
// 請替換為您的 GAS 部署 URL
const GAS_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

// 開啟結帳彈窗
function openCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    const cartSidebar = document.getElementById('cartSidebar');
    
    if (modal) {
        modal.classList.add('active');
        updateCheckoutSummary();
        goToStep(1); // 重置到第一步
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

// 更新結帳摘要
function updateCheckoutSummary() {
    const checkoutSummary = document.getElementById('checkoutSummary');
    const checkoutTotal = document.getElementById('checkoutTotal');
    
    if (!checkoutSummary || !checkoutTotal) return;
    
    const subtotal = calculateSubtotal();
    const shipping = calculateShippingFee(cart);
    const total = subtotal + shipping;
    
    // 渲染訂單項目
    let html = '';
    cart.forEach(function(item) {
        html += '<div class="checkout-summary-item" style="display: flex; justify-content: space-between; margin-bottom: 10px;">';
        html += '<span>' + item.name;
        if (item.spec) html += ' (' + item.spec + ')';
        html += ' x ' + item.quantity + '</span>';
        html += '<span>NT$ ' + (item.price * item.quantity) + '</span>';
        html += '</div>';
    });
    
    // 小計
    html += '<div class="checkout-summary-item" style="display: flex; justify-content: space-between; margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb;">';
    html += '<span>小計</span>';
    html += '<span>NT$ ' + subtotal + '</span>';
    html += '</div>';
    
    // 運費
    html += '<div class="checkout-summary-item" style="display: flex; justify-content: space-between; margin-top: 10px;">';
    html += '<span>運費';
    if (shipping === 0) {
        html += ' <span style="color: #10b981; font-size: 12px;">(滿1800免運)</span>';
    } else {
        let shippingType = '常溫';
        if (shipping === 180) shippingType = '冷藏';
        if (shipping === 200) shippingType = '冷凍';
        html += ' <span style="color: #666; font-size: 12px;">(' + shippingType + ')</span>';
    }
    html += '</span>';
    html += '<span style="' + (shipping === 0 ? 'color: #10b981;' : '') + '">' + (shipping === 0 ? '免運' : 'NT$ ' + shipping) + '</span>';
    html += '</div>';
    
    // 總計
    html += '<div class="checkout-summary-item" style="display: flex; justify-content: space-between; margin-top: 10px; padding-top: 10px; border-top: 2px solid #ff8c42; font-size: 18px; font-weight: bold; color: #ff8c42;">';
    html += '<span>總計</span>';
    html += '<span>NT$ ' + total + '</span>';
    html += '</div>';
    
    checkoutSummary.innerHTML = html;
    checkoutTotal.textContent = 'NT$ ' + total;
}

// 生成訂單編號
function generateOrderId() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000);
    return 'GX' + year + month + day + random;
}

// 提交訂單到 Google Sheets
async function submitOrderToGAS(orderData) {
    try {
        const response = await fetch(GAS_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });
        
        // no-cors 模式下無法讀取 response，但請求會送出
        return { success: true };
    } catch (error) {
        console.error('提交訂單失敗:', error);
        return { success: false, error: error.message };
    }
}

// 處理訂單提交
async function handleOrderSubmit() {
    // 取得表單資料（三步驟）
    const buyerName = document.getElementById('buyerName').value.trim();
    const buyerPhone = document.getElementById('buyerPhone').value.trim();
    const buyerEmail = document.getElementById('buyerEmail').value.trim();
    const receiverName = document.getElementById('receiverName').value.trim();
    const receiverPhone = document.getElementById('receiverPhone').value.trim();
    const receiverAddress = document.getElementById('receiverAddress').value.trim();
    const note = document.getElementById('customerNote').value.trim();
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    
    // 驗證必填欄位
    if (!buyerName || !buyerPhone || !buyerEmail) {
        showNotification('請填寫訂購人資訊！');
        goToStep(1);
        return false;
    }
    
    if (!receiverName || !receiverPhone || !receiverAddress) {
        showNotification('請填寫收件人資訊！');
        goToStep(2);
        return false;
    }
    
    // 準備訂單資料
    const orderId = generateOrderId();
    const subtotal = calculateSubtotal();
    const shipping = calculateShippingFee(cart);
    const total = subtotal + shipping;
    
    const orderData = {
        orderId: orderId,
        orderDate: new Date().toLocaleString('zh-TW'),
        buyer: {
            name: buyerName,
            phone: buyerPhone,
            email: buyerEmail
        },
        receiver: {
            name: receiverName,
            phone: receiverPhone,
            address: receiverAddress
        },
        note: note,
        items: cart.map(function(item) {
            return {
                id: item.id,
                name: item.name,
                spec: item.spec || '',
                price: item.price,
                quantity: item.quantity,
                subtotal: item.price * item.quantity,
                shippingType: item.shippingType
            };
        }),
        subtotal: subtotal,
        shipping: shipping,
        total: total,
        paymentMethod: paymentMethod === 'bank' ? '銀行匯款' : 'LINE Pay',
        status: '待處理'
    };
    
    // 顯示載入中
    const submitBtn = document.querySelector('.btn-submit-order');
    if (submitBtn) {
        submitBtn.textContent = '處理中...';
        submitBtn.disabled = true;
    }
    
    try {
        // 提交到 Google Sheets
        const result = await submitOrderToGAS(orderData);
        
        if (result.success) {
            // 顯示成功訊息
            showOrderSuccess(orderId, paymentMethod);
            
            // 清空購物車
            cart = [];
            saveCart();
            updateCartUI();
            
            return true;
        } else {
            throw new Error('訂單提交失敗');
        }
    } catch (error) {
        console.error('訂單處理錯誤:', error);
        showNotification('訂單提交失敗，請稍後再試或聯繫客服');
        
        if (submitBtn) {
            submitBtn.textContent = '確認訂單並付款';
            submitBtn.disabled = false;
        }
        
        return false;
    }
}

// 顯示訂單成功訊息
function showOrderSuccess(orderId, paymentMethod) {
    const modal = document.getElementById('checkoutModal');
    
    if (!modal) return;
    
    let message = '';
    if (paymentMethod === 'bank') {
        message = '<div style="background: #fffbeb; padding: 15px; border-radius: 8px; margin: 20px 0;">' +
            '<h4 style="color: #f59e0b; margin-bottom: 10px;">銀行匯款資訊</h4>' +
            '<p style="margin: 5px 0;"><strong>銀行：</strong>台灣銀行 豐原分行</p>' +
            '<p style="margin: 5px 0;"><strong>戶名：</strong>柑心果園</p>' +
            '<p style="margin: 5px 0;"><strong>帳號：</strong>123-456-789012</p>' +
            '<p style="margin: 10px 0 0 0; color: #ef4444; font-size: 14px;">※ 請於3天內完成匯款，並提供後5碼以便核對</p>' +
            '</div>';
    }
    
    modal.querySelector('.modal-body').innerHTML = 
        '<div style="text-align: center; padding: 40px 20px;">' +
            '<i class="fas fa-check-circle" style="font-size: 64px; color: #10b981; margin-bottom: 20px;"></i>' +
            '<h3 style="margin-bottom: 15px;">訂單已成功建立！</h3>' +
            '<p style="color: #666; margin-bottom: 10px; font-size: 18px; font-weight: 600;">訂單編號：' + orderId + '</p>' +
            '<p style="color: #666; margin-bottom: 20px;">我們已收到您的訂單，將盡快為您處理。</p>' +
            message +
            '<p style="color: #666; margin: 20px 0;">訂單確認信已發送至您的Email</p>' +
            '<button class="btn-primary" onclick="closeCheckoutModalAndReset()" style="background: #ff8c42; color: white; border: none; padding: 12px 30px; border-radius: 8px; cursor: pointer; font-size: 16px;">返回首頁</button>' +
        '</div>';
}

// 關閉彈窗並重置
function closeCheckoutModalAndReset() {
    closeCheckoutModal();
    
    // 重置表單
    const form = document.getElementById('checkoutForm');
    if (form) {
        form.reset();
    }
    
    // 重置步驟
    goToStep(1);
}

// 初始化結帳功能
document.addEventListener('DOMContentLoaded', function() {
    // 關閉結帳彈窗按鈕
    const closeCheckoutModalBtn = document.getElementById('closeCheckoutModal');
    
    if (closeCheckoutModalBtn) {
        closeCheckoutModalBtn.addEventListener('click', closeCheckoutModal);
    }
    
    // 點擊彈窗外部關閉
    const checkoutModal = document.getElementById('checkoutModal');
    
    if (checkoutModal) {
        checkoutModal.addEventListener('click', function(e) {
            if (e.target === checkoutModal) {
                closeCheckoutModal();
            }
        });
    }
    
    // 結帳表單提交
    const checkoutForm = document.getElementById('checkoutForm');
    
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleOrderSubmit();
        });
    }
    
    // 付款方式切換
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    const bankInfo = document.getElementById('bankInfo');
    
    if (paymentRadios && bankInfo) {
        paymentRadios.forEach(function(radio) {
            radio.addEventListener('change', function() {
                if (this.value === 'bank') {
                    bankInfo.style.display = 'block';
                } else {
                    bankInfo.style.display = 'none';
                }
            });
        });
    }
});

// 確保函數在全域可用
window.openCheckoutModal = openCheckoutModal;
window.closeCheckoutModal = closeCheckoutModal;
window.handleOrderSubmit = handleOrderSubmit;
window.closeCheckoutModalAndReset = closeCheckoutModalAndReset;

console.log('Checkout system loaded successfully');
