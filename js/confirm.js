// ========================================
// 確認訂單頁面 JS (confirm.html)
// ========================================

const GAS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwaZRzFlrt1O5dOSpgkmp-g3YrsdEVpjdw9UyAt7S2jmr4ZStflXJBllt-TjxpidDrt/exec';

// localStorage keys
const STORAGE_KEYS = {
    CART: 'ganxin_cart',
    COUPON: 'ganxin_coupon',
    SHIP_MODE: 'ganxin_ship_mode',
    PAY_METHOD: 'ganxin_pay_method',
    BUYER: 'ganxin_buyer',
    RECV: 'ganxin_recv',
    NOTE: 'ganxin_note',
    ORDER_DRAFT: 'ganxin_order_draft'
};

// 折扣碼設定（與 cart.js 同步）
const DISCOUNT_CODES = {
    'PONKAN100': { type: 'fixed', value: 100, minAmount: 1000, validFrom: '2025-10', validTo: '2026-02' },
    'PONKAN15': { type: 'percentage', value: 15, minAmount: 800, validFrom: '2025-10', validTo: '2026-02' },
    'MURCOTT200': { type: 'fixed', value: 200, minAmount: 1500, validFrom: '2025-12', validTo: '2026-03' },
    'MURCOTT20': { type: 'percentage', value: 20, minAmount: 1000, validFrom: '2025-12', validTo: '2026-03' },
    'FRUIT150': { type: 'fixed', value: 150, minAmount: 1200, validFrom: '2025-10', validTo: '2026-03' },
    'EARLYBIRD': { type: 'percentage', value: 10, minAmount: 500, validFrom: '2025-10', validTo: '2025-12' }
};

const PRICING = {
    HOME_SHIPPING: 180,
    FREE_SHIPPING_THRESHOLD: 1800,
    PICKUP_SHIPPING: 0,
    MIN_ORDER: 500
};

// ========================================
// 計價邏輯
// ========================================
function calculatePrice() {
    const cart = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || '[]');
    const couponCode = localStorage.getItem(STORAGE_KEYS.COUPON) || '';
    const shipMode = localStorage.getItem(STORAGE_KEYS.SHIP_MODE) || 'home';
    
    let subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let discount = 0;
    let shipping = 0;
    
    // 折扣計算
    if (couponCode && DISCOUNT_CODES[couponCode]) {
        const code = DISCOUNT_CODES[couponCode];
        const now = new Date();
        const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        
        if ((!code.validFrom || yearMonth >= code.validFrom) && 
            (!code.validTo || yearMonth <= code.validTo) &&
            subtotal >= code.minAmount) {
            if (code.type === 'percentage') {
                discount = Math.round(subtotal * code.value / 100);
            } else {
                discount = code.value;
            }
        }
    }
    
    // 運費計算
    if (shipMode === 'pickup') {
        shipping = PRICING.PICKUP_SHIPPING;
    } else {
        shipping = (subtotal - discount) >= PRICING.FREE_SHIPPING_THRESHOLD ? 0 : PRICING.HOME_SHIPPING;
    }
    
    const total = subtotal - discount + shipping;
    
    return { subtotal, discount, shipping, total };
}

// ========================================
// 頁面初始化
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // 檢查資料完整性
    const cart = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || '[]');
    const buyer = JSON.parse(localStorage.getItem(STORAGE_KEYS.BUYER) || '{}');
    const recv = JSON.parse(localStorage.getItem(STORAGE_KEYS.RECV) || '{}');
    
    if (cart.length === 0 || !buyer.name || !recv.name) {
        alert('訂單資料不完整，請重新填寫');
        window.location.href = 'cart.html';
        return;
    }
    
    const shipMode = localStorage.getItem(STORAGE_KEYS.SHIP_MODE) || 'home';
    const payMethod = localStorage.getItem(STORAGE_KEYS.PAY_METHOD) || '匯款';
    const note = localStorage.getItem(STORAGE_KEYS.NOTE) || '';
    const couponCode = localStorage.getItem(STORAGE_KEYS.COUPON) || '';
    
    // 顯示商品清單
    const itemsContainer = document.querySelector('[data-order-items]');
    if (itemsContainer) {
        itemsContainer.innerHTML = cart.map(item => `
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
    }
    
    // 顯示訂單資訊
    const metaContainer = document.querySelector('[data-order-meta]');
    if (metaContainer) {
        const shipText = shipMode === 'home' ? '宅配到府' : '門市自取';
        metaContainer.innerHTML = `
            <div class="info-row">
                <div class="info-label">購買人姓名</div>
                <div class="info-value">${buyer.name}</div>
            </div>
            <div class="info-row">
                <div class="info-label">購買人電話</div>
                <div class="info-value">${buyer.phone}</div>
            </div>
            <div class="info-row">
                <div class="info-label">購買人 Email</div>
                <div class="info-value">${buyer.email}</div>
            </div>
            ${shipMode === 'home' ? `
            <div class="info-row">
                <div class="info-label">購買人地址</div>
                <div class="info-value">${buyer.addr}</div>
            </div>` : ''}
            <div class="info-row">
                <div class="info-label">收件人姓名</div>
                <div class="info-value">${recv.name}</div>
            </div>
            <div class="info-row">
                <div class="info-label">收件人電話</div>
                <div class="info-value">${recv.phone}</div>
            </div>
            ${recv.email ? `
            <div class="info-row">
                <div class="info-label">收件人 Email</div>
                <div class="info-value">${recv.email}</div>
            </div>` : ''}
            ${shipMode === 'home' ? `
            <div class="info-row">
                <div class="info-label">收件人地址</div>
                <div class="info-value">${recv.addr}</div>
            </div>` : ''}
            <div class="info-row">
                <div class="info-label">配送方式</div>
                <div class="info-value">${shipText}</div>
            </div>
            <div class="info-row">
                <div class="info-label">付款方式</div>
                <div class="info-value">${payMethod}</div>
            </div>
            ${couponCode ? `
            <div class="info-row">
                <div class="info-label">折扣碼</div>
                <div class="info-value">${couponCode}</div>
            </div>` : ''}
            ${note ? `
            <div class="info-row">
                <div class="info-label">訂單備註</div>
                <div class="info-value">${note}</div>
            </div>` : ''}
        `;
    }
    
    // 顯示金額
    const { subtotal, discount, shipping, total } = calculatePrice();
    
    const subtotalEl = document.querySelector('[data-order-subtotal]');
    const shippingEl = document.querySelector('[data-order-shipping]');
    const discountEl = document.querySelector('[data-order-discount]');
    const totalEl = document.querySelector('[data-order-total]');
    
    if (subtotalEl) subtotalEl.textContent = `NT$ ${subtotal.toLocaleString()}`;
    if (shippingEl) shippingEl.textContent = shipping === 0 ? '免運費' : `NT$ ${shipping.toLocaleString()}`;
    if (discountEl) discountEl.textContent = discount > 0 ? `-NT$ ${discount.toLocaleString()}` : 'NT$ 0';
    if (totalEl) totalEl.textContent = `NT$ ${total.toLocaleString()}`;
    
    // 送出訂單
    const submitBtn = document.querySelector('[data-action="submit-order"]');
    if (submitBtn) {
        submitBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            
            if (!confirm('確定要送出訂單嗎？')) {
                return;
            }
            
            // 禁用按鈕防止重複提交
            submitBtn.disabled = true;
            submitBtn.textContent = '處理中...';
            
            // 組裝訂單資料
            const orderData = {
                orderNumber: 'GX' + Date.now(),
                orderTime: new Date().toISOString(),
                items: cart,
                buyer,
                recv,
                shipMode,
                payMethod,
                couponCode,
                note,
                subtotal,
                discount,
                shipping,
                total
            };
            
            // 儲存訂單草稿
            localStorage.setItem(STORAGE_KEYS.ORDER_DRAFT, JSON.stringify(orderData));
            
            // 若有 GAS_ENDPOINT，POST 訂單
            if (GAS_ENDPOINT) {
                try {
                    const response = await fetch(GAS_ENDPOINT, {
                        method: 'POST',
                        mode: 'no-cors',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(orderData)
                    });
                    
                    console.log('訂單已送出至 GAS');
                } catch (error) {
                    console.error('送出訂單失敗:', error);
                    alert('送出訂單時發生錯誤，但訂單已儲存在本地');
                }
            }
            
            // 檢查是否為 LINE Pay
            if (payMethod === 'LINE Pay') {
                // 跳轉到 LINE Pay 頁面
                window.location.href = 'linepay.html';
            } else {
                // 清空購物車與折扣碼
                localStorage.removeItem(STORAGE_KEYS.CART);
                localStorage.removeItem(STORAGE_KEYS.COUPON);
                
                // 跳轉到訂單完成頁
                window.location.href = 'order-complete.html';
            }
        });
    }
});
