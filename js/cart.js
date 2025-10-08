// ========================================
// 購物車頁面 JS (cart.html)
// 三頁式流程：cart.html → checkout.html → confirm.html
// ========================================

const GAS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwaZRzFlrt1O5dOSpgkmp-g3YrsdEVpjdw9UyAt7S2jmr4ZStflXJBllt-TjxpidDrt/exec';

// localStorage keys
const STORAGE_KEYS = {
    CART: 'ganxin_cart',
    COUPON: 'ganxin_coupon',
    SHIP_MODE: 'ganxin_ship_mode',
    PAY_METHOD: 'ganxin_pay_method'
};

// 折扣碼設定
const DISCOUNT_CODES = {
    'PONKAN100': { type: 'fixed', value: 100, minAmount: 1000, validFrom: '2025-10', validTo: '2026-02' },
    'PONKAN15': { type: 'percentage', value: 15, minAmount: 800, validFrom: '2025-10', validTo: '2026-02' },
    'MURCOTT200': { type: 'fixed', value: 200, minAmount: 1500, validFrom: '2025-12', validTo: '2026-03' },
    'MURCOTT20': { type: 'percentage', value: 20, minAmount: 1000, validFrom: '2025-12', validTo: '2026-03' },
    'FRUIT150': { type: 'fixed', value: 150, minAmount: 1200, validFrom: '2025-10', validTo: '2026-03' },
    'EARLYBIRD': { type: 'percentage', value: 10, minAmount: 500, validFrom: '2025-10', validTo: '2025-12' }
};

// 計價規則
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
    const cart = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || localStorage.getItem('cart') || '[]');
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
    // 遷移舊的 cart 到新的 key
    const oldCart = localStorage.getItem('cart');
    if (oldCart && !localStorage.getItem(STORAGE_KEYS.CART)) {
        localStorage.setItem(STORAGE_KEYS.CART, oldCart);
    }
    
    const cart = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || localStorage.getItem('cart') || '[]');
    
    // 更新金額顯示
    function updateAmounts() {
        const { subtotal, discount, shipping, total } = calculatePrice();
        
        const subtotalEl = document.querySelector('[data-subtotal]');
        const shippingEl = document.querySelector('[data-shipping]');
        const discountEl = document.querySelector('[data-discount]');
        const totalEl = document.querySelector('[data-total]');
        
        if (subtotalEl) subtotalEl.textContent = `NT$ ${subtotal.toLocaleString()}`;
        if (shippingEl) shippingEl.textContent = shipping === 0 ? '免運費' : `NT$ ${shipping.toLocaleString()}`;
        if (discountEl) discountEl.textContent = discount > 0 ? `-NT$ ${discount.toLocaleString()}` : 'NT$ 0';
        if (totalEl) totalEl.textContent = `NT$ ${total.toLocaleString()}`;
    }
    
    // 折扣碼套用
    const applyBtn = document.querySelector('[data-action="apply-coupon"]');
    if (applyBtn) {
        applyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const input = document.querySelector('[data-coupon-input]');
            const msg = document.querySelector('[data-coupon-msg]');
            const code = input.value.trim().toUpperCase();
            
            if (!code) {
                msg.textContent = '請輸入折扣碼';
                msg.style.display = 'block';
                msg.style.background = '#fee';
                msg.style.color = '#c33';
                return;
            }
            
            const discount = DISCOUNT_CODES[code];
            if (!discount) {
                msg.textContent = '折扣碼無效';
                msg.style.display = 'block';
                msg.style.background = '#fee';
                msg.style.color = '#c33';
                return;
            }
            
            const now = new Date();
            const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
            
            if (discount.validFrom && yearMonth < discount.validFrom) {
                msg.textContent = '折扣碼尚未生效';
                msg.style.display = 'block';
                msg.style.background = '#fee';
                msg.style.color = '#c33';
                return;
            }
            
            if (discount.validTo && yearMonth > discount.validTo) {
                msg.textContent = '折扣碼已過期';
                msg.style.display = 'block';
                msg.style.background = '#fee';
                msg.style.color = '#c33';
                return;
            }
            
            const cart = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || '[]');
            const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            
            if (discount.minAmount && subtotal < discount.minAmount) {
                msg.textContent = `此折扣碼需消費滿 NT$ ${discount.minAmount.toLocaleString()}`;
                msg.style.display = 'block';
                msg.style.background = '#fee';
                msg.style.color = '#c33';
                return;
            }
            
            localStorage.setItem(STORAGE_KEYS.COUPON, code);
            msg.textContent = `✓ 已套用折扣碼：${code}`;
            msg.style.display = 'block';
            msg.style.background = '#efe';
            msg.style.color = '#3c3';
            updateAmounts();
        });
    }
    
    // 配送方式切換
    document.querySelectorAll('[data-ship]').forEach(radio => {
        radio.addEventListener('change', () => {
            localStorage.setItem(STORAGE_KEYS.SHIP_MODE, radio.dataset.ship);
            updateAmounts();
        });
    });
    
    // 付款方式
    document.querySelectorAll('[name="pay_method"]').forEach(radio => {
        radio.addEventListener('change', () => {
            localStorage.setItem(STORAGE_KEYS.PAY_METHOD, radio.value);
        });
    });
    
    // 前往第 2 頁
    const goCheckoutBtn = document.querySelector('[data-action="go-checkout"]');
    if (goCheckoutBtn) {
        goCheckoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const cart = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || '[]');
            if (cart.length === 0) {
                alert('購物車是空的');
                return;
            }
            const { total } = calculatePrice();
            if (total < PRICING.MIN_ORDER) {
                alert(`最低消費 NT$ ${PRICING.MIN_ORDER}`);
                return;
            }
            window.location.href = 'checkout.html';
        });
    }
    
    // 初始化金額
    updateAmounts();
    
    // 載入已儲存的配送/付款方式
    const savedShip = localStorage.getItem(STORAGE_KEYS.SHIP_MODE) || 'home';
    const savedPay = localStorage.getItem(STORAGE_KEYS.PAY_METHOD) || '匯款';
    
    const shipRadio = document.querySelector(`[data-ship="${savedShip}"]`);
    if (shipRadio) shipRadio.checked = true;
    
    const payRadio = document.querySelector(`[name="pay_method"][value="${savedPay}"]`);
    if (payRadio) payRadio.checked = true;
});
