/**
 * 柑心果園 - 結帳流程系統
 * 三步驟結帳流程管理
 */

// ========== 全局變數 ==========

// 確保 cart 變數存在（從 localStorage 載入）
// cart.js 應該已經定義了 cart，但為了安全起見，這裡再次確認
if (typeof cart === 'undefined' || !cart) {
    var cart = [];
    try {
        cart = JSON.parse(localStorage.getItem('cart')) || [];
    } catch (e) {
        cart = [];
    }
}

let currentStep = 1;
let orderData = {
    delivery: 'home', // home: 宅配, pickup: 自取
    payment: 'bank', // 預設為匯款
    discountCode: null,
    discountAmount: 0
};

// 折扣碼配置
{{ ... }}
const discountCodes = {
    'WELCOME10': { type: 'percentage', value: 10, description: '新客戶優惠 10% 折扣' },
    'SAVE100': { type: 'fixed', value: 100, description: '滿額折抵 NT$100' },
    'FRUIT20': { type: 'percentage', value: 20, description: '水果專區 20% 折扣' }
};

// ========== 步驟控制 ==========

/**
 * 切換到指定步驟
 */
function goToStep(step) {
    // 隱藏所有步驟
    document.querySelectorAll('.step-content').forEach(el => {
        el.classList.remove('active');
    });
    
    // 顯示目標步驟
    document.getElementById(`step${step}`).classList.add('active');
    
    // 更新步驟指示器
    updateStepIndicator(step);
    
    // 更新當前步驟
    currentStep = step;
    
    // 滾動到頂部
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // 如果是第2步，顯示確認資訊
    if (step === 2) {
        showOrderConfirmation();
    }
    
    // 儲存表單資料
    if (step > 1) {
        saveFormData();
    }
}

/**
 * 更新步驟指示器
 */
function updateStepIndicator(activeStep) {
    // 步驟1（購物車）永遠是已完成
    const step1 = document.getElementById('step1-indicator');
    step1.classList.remove('active');
    step1.classList.add('completed');
    
    // 步驟2（寄送付款方式）
    const step2 = document.getElementById('step2-indicator');
    step2.classList.remove('active', 'completed');
    if (activeStep === 1) {
        step2.classList.add('active');
    } else if (activeStep > 1) {
        step2.classList.add('completed');
    }
    
    // 步驟3（完成訂單）
    const step3 = document.getElementById('step3-indicator');
    step3.classList.remove('active', 'completed');
    if (activeStep === 2) {
        step3.classList.add('active');
    } else if (activeStep > 2) {
        step3.classList.add('completed');
    }
}

// ========== 第1步：訂單摘要 ==========

/**
 * 渲染購物車商品
 */
function renderCartItems() {
    const container = document.getElementById('cartItemsList');
    if (!cart || cart.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">購物車是空的</p>';
        return;
    }
    
    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                ${item.selectedSpec ? `<div class="cart-item-spec">${item.selectedSpec}</div>` : ''}
                <div class="cart-item-quantity">數量：${item.quantity}</div>
            </div>
            <div class="cart-item-price">NT$ ${(item.price * item.quantity).toLocaleString()}</div>
        </div>
    `).join('');
    
    updateOrderSummary();
}

/**
 * 更新訂單摘要
 */
function updateOrderSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = orderData.discountAmount || 0;
    const subtotalAfterDiscount = subtotal - discount;
    
    // 運費計算：自取為0，宅配未滿1800元收180元
    let shipping = 0;
    if (orderData.delivery === 'pickup') {
        shipping = 0;
    } else {
        shipping = subtotalAfterDiscount >= 1800 ? 0 : 180;
    }
    
    const total = subtotalAfterDiscount + shipping;
    
    document.getElementById('subtotal').textContent = `NT$ ${subtotal.toLocaleString()}`;
    document.getElementById('shippingFee').textContent = shipping === 0 ? '免運費' : `NT$ ${shipping}`;
    document.getElementById('totalAmount').textContent = `NT$ ${total.toLocaleString()}`;
    
    if (discount > 0) {
        document.getElementById('discountRow').style.display = 'flex';
        document.getElementById('discountAmount').textContent = `-NT$ ${discount}`;
    } else {
        document.getElementById('discountRow').style.display = 'none';
    }
}

/**
 * 套用折扣碼
 */
function applyDiscount() {
    const code = document.getElementById('discountCode').value.trim().toUpperCase();
    const messageEl = document.getElementById('discountMessage');
    
    if (!code) {
        showDiscountMessage('請輸入折扣碼', 'error');
        return;
    }
    
    const discount = discountCodes[code];
    if (!discount) {
        showDiscountMessage('折扣碼無效或已過期', 'error');
        return;
    }
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (discount.type === 'percentage') {
        orderData.discountAmount = Math.round(subtotal * (discount.value / 100));
    } else {
        orderData.discountAmount = discount.value;
    }
    
    orderData.discountCode = code;
    updateOrderSummary();
    showDiscountMessage(`✓ 已套用：${discount.description}`, 'success');
}

/**
 * 顯示折扣訊息
 */
function showDiscountMessage(message, type) {
    const messageEl = document.getElementById('discountMessage');
    messageEl.textContent = message;
    messageEl.className = `discount-message ${type}`;
    messageEl.style.display = 'block';
    
    if (type === 'success') {
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 3000);
    }
}

/**
 * 選擇配送方式
 */
function selectDelivery(type) {
    orderData.delivery = type;
    
    // 更新UI
    document.querySelectorAll('.delivery-option').forEach(el => {
        el.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
    
    // 更新地址欄位的必填狀態
    const buyerAddressGroup = document.getElementById('buyerAddressGroup');
    const receiverAddressGroup = document.getElementById('receiverAddressGroup');
    const buyerAddress = document.getElementById('buyerAddress');
    const receiverAddress = document.getElementById('receiverAddress');
    
    if (type === 'home') {
        buyerAddress.required = true;
        receiverAddress.required = true;
        buyerAddressGroup.style.display = 'block';
        receiverAddressGroup.style.display = 'block';
    } else {
        buyerAddress.required = false;
        receiverAddress.required = false;
        buyerAddressGroup.style.display = 'none';
        receiverAddressGroup.style.display = 'none';
    }
    
    updateOrderSummary();
}

// ========== 第2步：表單處理 ==========

/**
 * 同購買人資料
 */
function copySameAsBuyer() {
    const checked = document.getElementById('sameAsBuyer').checked;
    
    if (checked) {
        document.getElementById('receiverName').value = document.getElementById('buyerName').value;
        document.getElementById('receiverEmail').value = document.getElementById('buyerEmail').value;
        document.getElementById('receiverPhone').value = document.getElementById('buyerPhone').value;
        document.getElementById('receiverAddress').value = document.getElementById('buyerAddress').value;
    }
}

/**
 * 選擇付款方式
 */
function selectPayment(type) {
    orderData.payment = type;
    
    // 更新UI
    document.querySelectorAll('.payment-option').forEach(el => {
        el.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
}

/**
 * 驗證並前往第2步（完成訂單）
 */
function validateAndGoToStep2() {
    // 驗證必填欄位
    const buyerName = document.getElementById('buyerName').value.trim();
    const buyerEmail = document.getElementById('buyerEmail').value.trim();
    const buyerPhone = document.getElementById('buyerPhone').value.trim();
    const receiverName = document.getElementById('receiverName').value.trim();
    const receiverPhone = document.getElementById('receiverPhone').value.trim();
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    if (!buyerName) {
        alert('請輸入購買人姓名');
        document.getElementById('buyerName').focus();
        return;
    }
    
    if (!buyerEmail || !isValidEmail(buyerEmail)) {
        alert('請輸入有效的 Email');
        document.getElementById('buyerEmail').focus();
        return;
    }
    
    if (!buyerPhone || !isValidPhone(buyerPhone)) {
        alert('請輸入正確的手機號碼（09開頭，共10碼）');
        document.getElementById('buyerPhone').focus();
        return;
    }
    
    if (orderData.delivery === 'home') {
        const buyerAddress = document.getElementById('buyerAddress').value.trim();
        const receiverAddress = document.getElementById('receiverAddress').value.trim();
        
        if (!buyerAddress) {
            alert('宅配到府需填寫購買人地址');
            document.getElementById('buyerAddress').focus();
            return;
        }
        
        if (!receiverAddress) {
            alert('宅配到府需填寫收件人地址');
            document.getElementById('receiverAddress').focus();
            return;
        }
    }
    
    if (!receiverName) {
        alert('請輸入收件人姓名');
        document.getElementById('receiverName').focus();
        return;
    }
    
    if (!receiverPhone || !isValidPhone(receiverPhone)) {
        alert('請輸入正確的收件人手機號碼（09開頭，共10碼）');
        document.getElementById('receiverPhone').focus();
        return;
    }
    
    if (!agreeTerms) {
        alert('請閱讀並同意退貨退款須知');
        document.getElementById('agreeTerms').focus();
        return;
    }
    
    // 儲存表單資料
    saveFormData();
    
    // 前往第2步（完成訂單）
    goToStep(2);
}

/**
 * 驗證Email
 */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * 驗證手機號碼
 */
function isValidPhone(phone) {
    return /^09\d{8}$/.test(phone);
}

/**
 * 儲存表單資料到 localStorage
 */
function saveFormData() {
    const formData = {
        buyerName: document.getElementById('buyerName').value,
        buyerEmail: document.getElementById('buyerEmail').value,
        buyerPhone: document.getElementById('buyerPhone').value,
        buyerAddress: document.getElementById('buyerAddress').value,
        receiverName: document.getElementById('receiverName').value,
        receiverEmail: document.getElementById('receiverEmail') ? document.getElementById('receiverEmail').value : '',
        receiverPhone: document.getElementById('receiverPhone').value,
        receiverAddress: document.getElementById('receiverAddress').value,
        orderNote: document.getElementById('orderNote').value
    };
    
    localStorage.setItem('checkoutFormData', JSON.stringify(formData));
}

/**
 * 載入儲存的表單資料
 */
function loadFormData() {
    const saved = localStorage.getItem('checkoutFormData');
    if (!saved) return;
    
    try {
        const formData = JSON.parse(saved);
        
        if (formData.buyerName) document.getElementById('buyerName').value = formData.buyerName;
        if (formData.buyerEmail) document.getElementById('buyerEmail').value = formData.buyerEmail;
        if (formData.buyerPhone) document.getElementById('buyerPhone').value = formData.buyerPhone;
        if (formData.buyerAddress) document.getElementById('buyerAddress').value = formData.buyerAddress;
        if (formData.receiverName) document.getElementById('receiverName').value = formData.receiverName;
        if (formData.receiverEmail && document.getElementById('receiverEmail')) {
            document.getElementById('receiverEmail').value = formData.receiverEmail;
        }
        if (formData.receiverPhone) document.getElementById('receiverPhone').value = formData.receiverPhone;
        if (formData.receiverAddress) document.getElementById('receiverAddress').value = formData.receiverAddress;
        if (formData.orderNote) document.getElementById('orderNote').value = formData.orderNote;
    } catch (e) {
        console.error('載入表單資料失敗', e);
    }
}

// ========== 第3步：訂單確認 ==========

/**
 * 顯示訂單確認資訊
 */
function showOrderConfirmation() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = orderData.discountAmount || 0;
    const subtotalAfterDiscount = subtotal - discount;
    
    // 運費計算：自取為0，宅配未滿1800元收180元
    let shipping = 0;
    if (orderData.delivery === 'pickup') {
        shipping = 0;
    } else {
        shipping = subtotalAfterDiscount >= 1800 ? 0 : 180;
    }
    
    const total = subtotalAfterDiscount + shipping;
    
    const deliveryText = orderData.delivery === 'home' ? '宅配到府' : '門市自取';
    const paymentText = {
        'linepay': 'LINE Pay',
        'bank': '銀行轉帳',
        'cash': '自取現金'
    }[orderData.payment];
    
    const confirmHTML = `
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin-bottom: 15px; color: var(--primary-color);">購買人資訊</h3>
            <p><strong>姓名：</strong>${document.getElementById('buyerName').value}</p>
            <p><strong>Email：</strong>${document.getElementById('buyerEmail').value}</p>
            <p><strong>手機：</strong>${document.getElementById('buyerPhone').value}</p>
            ${orderData.delivery === 'home' ? `<p><strong>地址：</strong>${document.getElementById('buyerAddress').value}</p>` : ''}
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin-bottom: 15px; color: var(--primary-color);">收件人資訊</h3>
            <p><strong>姓名：</strong>${document.getElementById('receiverName').value}</p>
            <p><strong>手機：</strong>${document.getElementById('receiverPhone').value}</p>
            ${orderData.delivery === 'home' ? `<p><strong>地址：</strong>${document.getElementById('receiverAddress').value}</p>` : ''}
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin-bottom: 15px; color: var(--primary-color);">配送與付款</h3>
            <p><strong>配送方式：</strong>${deliveryText}</p>
            <p><strong>付款方式：</strong>${paymentText}</p>
            ${document.getElementById('orderNote').value ? `<p><strong>訂單備註：</strong>${document.getElementById('orderNote').value}</p>` : ''}
        </div>
        
        <div style="background: #fff5f5; padding: 20px; border-radius: 8px; border: 2px solid var(--primary-color);">
            <h3 style="margin-bottom: 15px; color: var(--primary-color);">訂單金額</h3>
            <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                <span>商品總金額</span>
                <span>NT$ ${subtotal.toLocaleString()}</span>
            </div>
            ${discount > 0 ? `
            <div style="display: flex; justify-content: space-between; padding: 8px 0; color: #27ae60;">
                <span>折扣優惠</span>
                <span>-NT$ ${discount.toLocaleString()}</span>
            </div>` : ''}
            <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                <span>運費</span>
                <span>${shipping === 0 ? '免運費' : 'NT$ ' + shipping}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 15px 0; border-top: 2px solid #ddd; margin-top: 10px; font-size: 24px; font-weight: 700; color: var(--primary-color);">
                <span>訂單總計</span>
                <span>NT$ ${total.toLocaleString()}</span>
            </div>
        </div>
    `;
    
    document.getElementById('orderConfirmation').innerHTML = confirmHTML;
}

// Google Apps Script Web App URL（請替換為您的 GAS 部署 URL）
const GAS_WEB_APP_URL = 'YOUR_GAS_WEB_APP_URL_HERE';

/**
 * 提交訂單到 Google Sheets
 */
async function submitOrderToGAS(orderInfo) {
    try {
        const response = await fetch(GAS_WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                orderId: orderInfo.orderNumber,
                orderDate: new Date(orderInfo.orderTime).toLocaleString('zh-TW'),
                status: '待處理',
                buyer: orderInfo.buyer,
                receiver: orderInfo.receiver,
                items: orderInfo.items.map(item => ({
                    name: item.name,
                    spec: item.selectedSpec || '',
                    quantity: item.quantity,
                    price: item.price,
                    subtotal: item.price * item.quantity
                })),
                subtotal: orderInfo.subtotal,
                shipping: orderInfo.shipping,
                total: orderInfo.total,
                paymentMethod: {
                    'linepay': 'LINE Pay',
                    'bank': '銀行轉帳',
                    'cash': '自取現金'
                }[orderInfo.payment],
                note: orderInfo.note
            })
        });
        
        return { success: true };
    } catch (error) {
        console.error('提交訂單到 GAS 失敗:', error);
        return { success: false, error: error.message };
    }
}

/**
 * 處理 LINE Pay 付款
 */
function processLinePay(orderInfo) {
    // 儲存訂單資訊到 localStorage
    localStorage.setItem('pendingLinePayOrder', JSON.stringify(orderInfo));
    
    // 跳轉到 LINE Pay 頁面
    window.location.href = 'linepay.html';
}

/**
 * 提交訂單
 */
function submitOrder() {
    if (!confirm('確定要送出訂單嗎？')) {
        return;
    }
    
    // 收集訂單資料
    const orderInfo = {
        // 購物車商品
        items: cart,
        
        // 購買人資訊
        buyer: {
            name: document.getElementById('buyerName').value,
            email: document.getElementById('buyerEmail').value,
            phone: document.getElementById('buyerPhone').value,
            address: document.getElementById('buyerAddress').value
        },
        
        // 收件人資訊
        receiver: {
            name: document.getElementById('receiverName').value,
            phone: document.getElementById('receiverPhone').value,
            address: document.getElementById('receiverAddress').value
        },
        
        // 配送與付款
        delivery: orderData.delivery,
        payment: orderData.payment,
        
        // 折扣
        discountCode: orderData.discountCode,
        discountAmount: orderData.discountAmount,
        
        // 備註
        note: document.getElementById('orderNote').value,
        
        // 訂單金額
        subtotal: (() => {
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const discount = orderData.discountAmount || 0;
            const subtotalAfterDiscount = subtotal - discount;
            let shipping = 0;
            if (orderData.delivery === 'pickup') {
                shipping = 0;
            } else {
                shipping = subtotalAfterDiscount >= 1800 ? 0 : 180;
            }
            return subtotal;
        })(),
        shipping: (() => {
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const discount = orderData.discountAmount || 0;
            const subtotalAfterDiscount = subtotal - discount;
            if (orderData.delivery === 'pickup') {
                return 0;
            } else {
                return subtotalAfterDiscount >= 1800 ? 0 : 180;
            }
        })(),
        total: (() => {
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const discount = orderData.discountAmount || 0;
            const subtotalAfterDiscount = subtotal - discount;
            let shipping = 0;
            if (orderData.delivery === 'pickup') {
                shipping = 0;
            } else {
                shipping = subtotalAfterDiscount >= 1800 ? 0 : 180;
            }
            return subtotalAfterDiscount + shipping;
        })(),
        
        // 訂單時間
        orderTime: new Date().toISOString(),
        
        // 訂單編號
        orderNumber: 'GX' + Date.now()
    };
    
    // 儲存訂單到 localStorage
    localStorage.setItem('currentOrder', JSON.stringify(orderInfo));
    localStorage.setItem('lastOrder', JSON.stringify(orderInfo));
    
    // 提交訂單到 Google Sheets（如果有設定 GAS URL）
    if (GAS_WEB_APP_URL && GAS_WEB_APP_URL !== 'YOUR_GAS_WEB_APP_URL_HERE') {
        submitOrderToGAS(orderInfo).then(result => {
            if (result.success) {
                console.log('訂單已成功提交到 Google Sheets');
            } else {
                console.error('提交到 Google Sheets 失敗:', result.error);
            }
        });
    }
    
    // 如果選擇 LINE Pay，跳轉到 LINE Pay 頁面
    if (orderInfo.payment === 'linepay') {
        processLinePay(orderInfo);
        // 清空購物車
        clearCart();
        // 清空表單資料
        localStorage.removeItem('checkoutFormData');
        return;
    }
    
    // 清空購物車
    clearCart();
    
    // 清空表單資料
    localStorage.removeItem('checkoutFormData');
    
    // 跳轉到訂單完成頁面
    window.location.href = 'order-complete.html';
}

// ========== 初始化 ==========

// ========== 推薦商品功能 ==========

/**
 * 渲染推薦商品
 */
function renderRecommendedProducts() {
    const container = document.getElementById('recommendedProducts');
    if (!container || typeof products === 'undefined') return;
    
    // 隨機選擇3-4個商品
    const shuffled = products.sort(() => 0.5 - Math.random());
    const recommended = shuffled.slice(0, 4);
    
    container.innerHTML = recommended.map(product => `
        <div style="background: white; border-radius: 12px; padding: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.3s;" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
            <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px; margin-bottom: 10px;">
            <h4 style="font-size: 16px; margin-bottom: 8px; color: #333;">${product.name}</h4>
            <p style="color: var(--primary-color); font-weight: bold; font-size: 18px; margin-bottom: 10px;">NT$ ${product.price.toLocaleString()}</p>
            <button onclick="addToCart(${product.id}); showNotification('已加入購物車！'); renderCartItems(); updateOrderSummary();" style="width: 100%; padding: 10px; background: var(--primary-color); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.3s;" onmouseover="this.style.background='var(--secondary-color)'" onmouseout="this.style.background='var(--primary-color)'">
                <i class="fas fa-cart-plus"></i> 加入購物車
            </button>
        </div>
    `).join('');
}

/**
 * 顯示通知
 */
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #27ae60; color: white; padding: 15px 25px; border-radius: 8px; z-index: 99999; box-shadow: 0 4px 12px rgba(0,0,0,0.2);';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// ========== 初始化 ==========

document.addEventListener('DOMContentLoaded', function() {
    console.log('Checkout page loaded');
    console.log('Cart:', cart);
    
    // 檢查購物車
    if (!cart || cart.length === 0) {
        alert('購物車是空的，請先添加商品');
        window.location.href = 'index.html';
        return;
    }
    
    // 渲染購物車
    renderCartItems();
    
    // 強制更新訂單摘要
    setTimeout(() => {
        updateOrderSummary();
    }, 100);
    
    // 載入表單資料
    loadFormData();
    
    // 初始化配送方式
    selectDelivery('home');
    
    // 初始化付款方式
    orderData.payment = 'bank';
    const paymentOptions = document.querySelectorAll('.payment-option');
    if (paymentOptions.length > 0) {
        paymentOptions.forEach(el => el.classList.remove('selected'));
        const bankOption = document.querySelector('.payment-option input[value="bank"]');
        if (bankOption) {
            bankOption.parentElement.classList.add('selected');
        }
    }
    
    // 字數計數功能
    const orderNote = document.getElementById('orderNote');
    const noteCharCount = document.getElementById('noteCharCount');
    if (orderNote && noteCharCount) {
        orderNote.addEventListener('input', function() {
            noteCharCount.textContent = this.value.length;
        });
    }
});
