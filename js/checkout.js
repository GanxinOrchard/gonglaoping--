/**
 * 柑心果園 - 結帳流程系統
 * 三步驟結帳流程管理
 * 
 * 注意：此檔案依賴 cart.js 中定義的全局變數 cart 和 discountCodes
 * 請確保 cart.js 在此檔案之前載入
 */

// ========== 全局變數 ==========

// 確保 cart 變數存在（cart.js 應該已經定義）
// 如果沒有，從 localStorage 載入
if (typeof window.cart === 'undefined') {
    console.warn('cart 變數未定義，嘗試從 localStorage 載入');
    window.cart = [];
    try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            window.cart = JSON.parse(savedCart);
        }
    } catch (e) {
        console.error('載入購物車失敗:', e);
        window.cart = [];
    }
}
// 使用全局 cart 變數
var cart = window.cart;

let currentStep = 1;
let orderData = {
    delivery: 'home', // home: 宅配, pickup: 自取
    payment: 'bank', // 預設為匯款
    discountCode: null,
    discountAmount: 0
};

// 折扣碼配置（使用 cart.js 中已定義的 discountCodes）
// 如果 cart.js 還沒載入，先定義一個
if (typeof discountCodes === 'undefined') {
    var discountCodes = {
        'WELCOME10': { type: 'percentage', value: 10, description: '新客戶優惠 10% 折扣' },
        'SAVE100': { type: 'fixed', value: 100, description: '滿額折抵 NT$100' },
        'FRUIT20': { type: 'percentage', value: 20, description: '水果專區 20% 折扣' }
    };
}

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
        showDiscountMessage('折扣碼無效', 'error');
        return;
    }
    
    // 檢查日期有效性
    const now = new Date();
    const currentYearMonth = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
    
    if (discount.validFrom && currentYearMonth < discount.validFrom) {
        showDiscountMessage('折扣碼尚未生效', 'error');
        return;
    }
    
    if (discount.validTo && currentYearMonth > discount.validTo) {
        showDiscountMessage('折扣碼已過期', 'error');
        return;
    }
    
    // 檢查最低消費金額
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (discount.minAmount && subtotal < discount.minAmount) {
        showDiscountMessage(`此折扣碼需消費滿 NT$ ${discount.minAmount.toLocaleString()}`, 'error');
        return;
    }
    
    // 計算折扣金額
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

// 儲存事件監聽器引用，以便移除
let buyerInputListeners = {
    name: null,
    email: null,
    phone: null,
    address: null
};

/**
 * 同購買人資料
 */
function copySameAsBuyer() {
    const checked = document.getElementById('sameAsBuyer').checked;
    
    const buyerName = document.getElementById('buyerName');
    const buyerEmail = document.getElementById('buyerEmail');
    const buyerPhone = document.getElementById('buyerPhone');
    const buyerAddress = document.getElementById('buyerAddress');
    
    const receiverName = document.getElementById('receiverName');
    const receiverEmail = document.getElementById('receiverEmail');
    const receiverPhone = document.getElementById('receiverPhone');
    const receiverAddress = document.getElementById('receiverAddress');
    
    if (checked) {
        // 複製購買人資料到收件人
        receiverName.value = buyerName.value || '';
        receiverEmail.value = buyerEmail.value || '';
        receiverPhone.value = buyerPhone.value || '';
        receiverAddress.value = buyerAddress.value || '';
        
        // 設置收件人欄位為唯讀並添加視覺提示
        receiverName.readOnly = true;
        receiverEmail.readOnly = true;
        receiverPhone.readOnly = true;
        receiverAddress.readOnly = true;
        
        receiverName.style.backgroundColor = '#f0f0f0';
        receiverEmail.style.backgroundColor = '#f0f0f0';
        receiverPhone.style.backgroundColor = '#f0f0f0';
        receiverAddress.style.backgroundColor = '#f0f0f0';
        
        // 移除舊的事件監聽器（如果存在）
        if (buyerInputListeners.name) {
            buyerName.removeEventListener('input', buyerInputListeners.name);
        }
        if (buyerInputListeners.email) {
            buyerEmail.removeEventListener('input', buyerInputListeners.email);
        }
        if (buyerInputListeners.phone) {
            buyerPhone.removeEventListener('input', buyerInputListeners.phone);
        }
        if (buyerInputListeners.address) {
            buyerAddress.removeEventListener('input', buyerInputListeners.address);
        }
        
        // 創建新的事件監聽器並儲存引用
        buyerInputListeners.name = function() { receiverName.value = this.value; };
        buyerInputListeners.email = function() { receiverEmail.value = this.value; };
        buyerInputListeners.phone = function() { receiverPhone.value = this.value; };
        buyerInputListeners.address = function() { receiverAddress.value = this.value; };
        
        // 監聽購買人資料變化，自動同步到收件人
        buyerName.addEventListener('input', buyerInputListeners.name);
        buyerEmail.addEventListener('input', buyerInputListeners.email);
        buyerPhone.addEventListener('input', buyerInputListeners.phone);
        buyerAddress.addEventListener('input', buyerInputListeners.address);
    } else {
        // 移除事件監聽器
        if (buyerInputListeners.name) {
            buyerName.removeEventListener('input', buyerInputListeners.name);
            buyerInputListeners.name = null;
        }
        if (buyerInputListeners.email) {
            buyerEmail.removeEventListener('input', buyerInputListeners.email);
            buyerInputListeners.email = null;
        }
        if (buyerInputListeners.phone) {
            buyerPhone.removeEventListener('input', buyerInputListeners.phone);
            buyerInputListeners.phone = null;
        }
        if (buyerInputListeners.address) {
            buyerAddress.removeEventListener('input', buyerInputListeners.address);
            buyerInputListeners.address = null;
        }
        
        // 取消唯讀狀態並恢復原始樣式
        receiverName.readOnly = false;
        receiverEmail.readOnly = false;
        receiverPhone.readOnly = false;
        receiverAddress.readOnly = false;
        
        receiverName.style.backgroundColor = '';
        receiverEmail.style.backgroundColor = '';
        receiverPhone.style.backgroundColor = '';
        receiverAddress.style.backgroundColor = '';
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

/**
 * 清除儲存的表單資料
 */
function clearSavedFormData() {
    if (confirm('確定要清除所有儲存的表單資料嗎？\n下次填寫時將不會自動帶入資料。')) {
        // 清除 localStorage
        localStorage.removeItem('checkoutFormData');
        
        // 清空所有表單欄位
        document.getElementById('buyerName').value = '';
        document.getElementById('buyerEmail').value = '';
        document.getElementById('buyerPhone').value = '';
        document.getElementById('buyerAddress').value = '';
        document.getElementById('receiverName').value = '';
        if (document.getElementById('receiverEmail')) {
            document.getElementById('receiverEmail').value = '';
        }
        document.getElementById('receiverPhone').value = '';
        document.getElementById('receiverAddress').value = '';
        if (document.getElementById('orderNote')) {
            document.getElementById('orderNote').value = '';
        }
        
        // 取消勾選「同購買人資料」
        const sameAsBuyer = document.getElementById('sameAsBuyer');
        if (sameAsBuyer && sameAsBuyer.checked) {
            sameAsBuyer.checked = false;
            copySameAsBuyer(); // 觸發一次以恢復收件人欄位狀態
        }
        
        alert('✓ 已清除所有儲存的表單資料');
        console.log('表單記憶已清除');
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
    const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxnAaMzz10UpbJ0WFJwhH_1b93GC1VA3JFw464vi122koHCoHjrSD_Ou4FHUjo266CB/exec';

/**
 * 提交訂單到 Google Sheets
 */
async function submitOrderToGAS(orderInfo) {
    try {
        // 準備符合 GAS 後端期望的資料格式
        const orderData = {
            buyerName: orderInfo.buyer.name,
            buyerEmail: orderInfo.buyer.email,
            buyerPhone: orderInfo.buyer.phone,
            buyerAddress: orderInfo.buyer.address,
            receiverName: orderInfo.receiver.name,
            receiverEmail: orderInfo.receiver.email,
            receiverPhone: orderInfo.receiver.phone,
            receiverAddress: orderInfo.receiver.address,
            delivery: orderInfo.delivery,
            payment: orderInfo.payment,
            items: orderInfo.items.map(item => ({
                name: item.name,
                spec: item.selectedSpec || '',
                quantity: item.quantity,
                price: item.price,
                weight: '', // 如果需要可以從商品資料中取得
                size: item.selectedSpec || ''
            })),
            summary: {
                subtotal: orderInfo.subtotal,
                shipping: orderInfo.shipping,
                discount: orderInfo.discount || 0,
                total: orderInfo.total
            },
            remark: orderInfo.note || ''
        };

        const response = await fetch(GAS_WEB_APP_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('訂單提交結果:', result);
        
        if (result.ok) {
            console.log('訂單已成功提交到 Google Sheets，訂單編號:', result.order_no);
            return { success: true, orderNumber: result.order_no };
        } else {
            throw new Error(result.msg || '訂單提交失敗');
        }
    } catch (error) {
        console.error('提交訂單到 GAS 失敗:', error);
        return { success: false, error: error.message };
    }
}

/**
 * 處理 LINE Pay 付款
 */
async function processLinePay(orderInfo) {
    try {
        // 準備 LINE Pay 付款請求資料
        const linePayData = {
            amount: orderInfo.total,
            currency: 'TWD',
            packages: [{
                id: 'package1',
                amount: orderInfo.total,
                name: '柑心果園訂單',
                products: orderInfo.items.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price
                }))
            }],
            redirectUrls: {
                confirmUrl: window.location.origin + '/linepay-confirm.html',
                cancelUrl: window.location.origin + '/linepay.html'
            },
            orderData: {
                buyerName: orderInfo.buyer.name,
                buyerEmail: orderInfo.buyer.email,
                buyerPhone: orderInfo.buyer.phone,
                buyerAddress: orderInfo.buyer.address,
                receiverName: orderInfo.receiver.name,
                receiverEmail: orderInfo.receiver.email,
                receiverPhone: orderInfo.receiver.phone,
                receiverAddress: orderInfo.receiver.address,
                delivery: orderInfo.delivery,
                items: orderInfo.items,
                summary: {
                    subtotal: orderInfo.subtotal,
                    shipping: orderInfo.shipping,
                    discount: orderInfo.discount || 0,
                    total: orderInfo.total
                },
                remark: orderInfo.note || ''
            }
        };

        // 發送到後端處理 LINE Pay 請求
        const response = await fetch(GAS_WEB_APP_URL + '?action=createLinePayPayment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(linePayData)
        });
        
        const result = await response.json();
        
        if (result.success && result.paymentUrl) {
            // 跳轉到 LINE Pay 付款頁面
            window.location.href = result.paymentUrl;
        } else {
            throw new Error(result.error || '建立 LINE Pay 付款失敗');
        }
        
    } catch (error) {
        console.error('LINE Pay 付款處理錯誤:', error);
        alert('LINE Pay 付款處理失敗：' + error.message);
        
        // 重新啟用提交按鈕
        const submitBtn = document.querySelector('.btn-submit');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = '送出訂單';
            submitBtn.style.opacity = '1';
        }
    }
}

/**
 * 提交訂單
 */
async function submitOrder() {
    console.log('submitOrder 函數被調用');
    
    // 防止重複提交
    const submitBtn = document.querySelector('.btn-submit');
    if (submitBtn && submitBtn.disabled) {
        console.log('訂單正在處理中，請勿重複提交');
        return;
    }
    
    // 收集訂單資料用於確認
    const orderInfo = {
        items: cart,
        buyer: {
            name: document.getElementById('buyerName').value,
            email: document.getElementById('buyerEmail').value,
            phone: document.getElementById('buyerPhone').value,
            address: document.getElementById('buyerAddress').value
        },
        receiver: {
            name: document.getElementById('receiverName').value,
            phone: document.getElementById('receiverPhone').value,
            address: document.getElementById('receiverAddress').value
        },
        delivery: orderData.delivery,
        payment: orderData.payment,
        discountCode: orderData.discountCode,
        discountAmount: orderData.discountAmount,
        remark: document.getElementById('orderRemark').value
    };
    
    // 生成確認訊息
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = orderData.delivery === 'home' ? 100 : 0;
    const total = subtotal + shipping - (orderData.discountAmount || 0);
    
    let confirmMessage = `📋 訂單確認\n\n`;
    confirmMessage += `👤 購買人：${orderInfo.buyer.name}\n`;
    confirmMessage += `📞 聯絡電話：${orderInfo.buyer.phone}\n`;
    confirmMessage += `📧 電子郵件：${orderInfo.buyer.email}\n\n`;
    
    confirmMessage += `📦 收件人：${orderInfo.receiver.name}\n`;
    confirmMessage += `📞 收件電話：${orderInfo.receiver.phone}\n`;
    confirmMessage += `🏠 收件地址：${orderInfo.receiver.address}\n\n`;
    
    confirmMessage += `🚚 配送方式：${orderData.delivery === 'home' ? '宅配到府' : '門市自取'}\n`;
    confirmMessage += `💳 付款方式：${orderData.payment === 'linepay' ? 'LINE Pay' : '貨到付款'}\n\n`;
    
    confirmMessage += `🛒 商品明細：\n`;
    orderInfo.items.forEach(item => {
        confirmMessage += `• ${item.name} (${item.spec}) x${item.quantity} = NT$ ${(item.price * item.quantity).toLocaleString()}\n`;
    });
    
    confirmMessage += `\n💰 費用明細：\n`;
    confirmMessage += `商品小計：NT$ ${subtotal.toLocaleString()}\n`;
    if (shipping > 0) {
        confirmMessage += `運費：NT$ ${shipping.toLocaleString()}\n`;
    }
    if (orderData.discountAmount > 0) {
        confirmMessage += `折扣：-NT$ ${orderData.discountAmount.toLocaleString()}\n`;
    }
    confirmMessage += `總計：NT$ ${total.toLocaleString()}\n\n`;
    
    confirmMessage += `⚠️ 請確認以上資訊無誤後送出訂單`;
    
    if (!confirm(confirmMessage)) {
        return;
    }
    
    // 禁用提交按鈕，防止重複提交
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = '處理中...';
        submitBtn.style.opacity = '0.6';
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
        
        // 訂單編號（由後端生成，前端不生成）
        orderNumber: ''
    };
    
    try {
        // 儲存訂單到 localStorage
        localStorage.setItem('currentOrder', JSON.stringify(orderInfo));
        localStorage.setItem('lastOrder', JSON.stringify(orderInfo));
        
        console.log('訂單資料已儲存:', orderInfo);
        
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
            await processLinePay(orderInfo);
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
        
        console.log('準備跳轉到訂單完成頁面');
        
        // 跳轉到訂單完成頁面
        window.location.href = 'order-complete.html';
    } catch (error) {
        console.error('提交訂單時發生錯誤:', error);
        alert('提交訂單時發生錯誤，請稍後再試');
        
        // 重新啟用提交按鈕
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-check"></i> 確認送出訂單';
            submitBtn.style.opacity = '1';
        }
    }
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
    
    // 確保提交按鈕事件正確綁定
    const submitBtn = document.querySelector('.btn-submit');
    if (submitBtn) {
        console.log('找到提交按鈕，綁定點擊事件');
        // 移除可能存在的舊事件監聽器
        submitBtn.onclick = null;
        // 添加新的事件監聽器
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('提交按鈕被點擊');
            submitOrder();
        });
    } else {
        console.warn('未找到提交按鈕');
    }
});
