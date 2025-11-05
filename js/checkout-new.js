// ========================================
// 結帳頁面 JS (checkout.html)
// ========================================

const GAS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxnAaMzz10UpbJ0WFJwhH_1b93GC1VA3JFw464vi122koHCoHjrSD_Ou4FHUjo266CB/exec';

// localStorage keys
const STORAGE_KEYS = {
    CART: 'ganxin_cart',
    COUPON: 'ganxin_coupon',
    SHIP_MODE: 'ganxin_ship_mode',
    PAY_METHOD: 'ganxin_pay_method',
    BUYER: 'ganxin_buyer',
    RECV: 'ganxin_recv',
    NOTE: 'ganxin_note'
};

// ========================================
// 清除記憶功能
// ========================================
function clearSavedFormData() {
    if (confirm('確定要清除所有已儲存的表單資料嗎？')) {
        localStorage.removeItem(STORAGE_KEYS.BUYER);
        localStorage.removeItem(STORAGE_KEYS.RECV);
        localStorage.removeItem(STORAGE_KEYS.NOTE);
        
        // 清空表單欄位
        document.querySelector('[name="buyer_name"]').value = '';
        document.querySelector('[name="buyer_phone"]').value = '';
        document.querySelector('[name="buyer_email"]').value = '';
        document.querySelector('[name="buyer_addr"]').value = '';
        document.querySelector('[name="recv_name"]').value = '';
        document.querySelector('[name="recv_phone"]').value = '';
        document.querySelector('[name="recv_email"]').value = '';
        document.querySelector('[name="recv_addr"]').value = '';
        document.querySelector('[data-note]').value = '';
        
        alert('已清除所有記憶資料');
    }
}

// 折扣碼設定
const DISCOUNT_CODES = {
    'PONKAN100': { type: 'fixed', value: 100, minAmount: 1000, validFrom: '2025-10', validTo: '2026-02' },
    'PONKAN15': { type: 'percentage', value: 15, minAmount: 800, validFrom: '2025-10', validTo: '2026-02' },
    'MURCOTT200': { type: 'fixed', value: 200, minAmount: 1500, validFrom: '2025-12', validTo: '2026-03' },
    'MURCOTT20': { type: 'percentage', value: 20, minAmount: 1000, validFrom: '2025-12', validTo: '2026-03' },
    'FRUIT150': { type: 'fixed', value: 150, minAmount: 1200, validFrom: '2025-10', validTo: '2026-03' },
    'EARLYBIRD': { type: 'percentage', value: 10, minAmount: 500, validFrom: '2025-10', validTo: '2025-12' }
};

// 計算價格
function calculateOrderTotal() {
    const cart = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || '[]');
    const couponCode = localStorage.getItem(STORAGE_KEYS.COUPON) || '';
    const shipMode = document.querySelector('input[name="shipping"]:checked')?.value || 'home';
    
    let subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let discount = 0;
    let shipping = 0;
    
    // 計算運費
    if (shipMode === 'home') {
        shipping = subtotal >= 1800 ? 0 : 180;
    }
    
    // 折扣計算
    if (couponCode && DISCOUNT_CODES[couponCode]) {
        const code = DISCOUNT_CODES[couponCode];
        const now = new Date();
        const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        
        if (yearMonth >= code.validFrom && yearMonth <= code.validTo && subtotal >= code.minAmount) {
            if (code.type === 'fixed') {
                discount = code.value;
            } else if (code.type === 'percentage') {
                discount = Math.floor(subtotal * code.value / 100);
            }
        }
    }
    
    const total = subtotal + shipping - discount;
    
    return { subtotal, shipping, discount, total, couponCode };
}

// 更新訂單摘要
function updateOrderSummary() {
    const { subtotal, shipping, discount, total, couponCode } = calculateOrderTotal();
    
    document.getElementById('summarySubtotal').textContent = `NT$ ${subtotal.toLocaleString()}`;
    document.getElementById('summaryShipping').textContent = `NT$ ${shipping.toLocaleString()}`;
    document.getElementById('finalTotal').textContent = `NT$ ${total.toLocaleString()}`;
    
    const discountRow = document.getElementById('summaryDiscountRow');
    if (discount > 0) {
        discountRow.style.display = 'flex';
        document.getElementById('summaryDiscountCode').textContent = couponCode;
        document.getElementById('summaryDiscount').textContent = `-NT$ ${discount.toLocaleString()}`;
    } else {
        discountRow.style.display = 'none';
    }
}

// ========================================
// 頁面初始化
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // 檢查購物車
    const cart = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || '[]');
    if (cart.length === 0) {
        alert('購物車是空的');
        window.location.href = 'cart.html';
        return;
    }
    
    // 初始化訂單摘要
    updateOrderSummary();
    
    // 監聽配送方式變更
    document.querySelectorAll('input[name="shipping"]').forEach(radio => {
        radio.addEventListener('change', updateOrderSummary);
    });
    
    // 折扣碼套用
    const applyCouponBtn = document.getElementById('applyCoupon');
    const couponInput = document.getElementById('couponInput');
    const couponMessage = document.getElementById('couponMessage');
    
    if (applyCouponBtn && couponInput) {
        applyCouponBtn.addEventListener('click', () => {
            const code = couponInput.value.trim().toUpperCase();
            
            if (!code) {
                couponMessage.innerHTML = '<span style="color: #e74c3c;">請輸入折扣碼</span>';
                return;
            }
            
            if (!DISCOUNT_CODES[code]) {
                couponMessage.innerHTML = '<span style="color: #e74c3c;">無效的折扣碼</span>';
                return;
            }
            
            const { subtotal } = calculateOrderTotal();
            const discountInfo = DISCOUNT_CODES[code];
            const now = new Date();
            const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
            
            if (yearMonth < discountInfo.validFrom || yearMonth > discountInfo.validTo) {
                couponMessage.innerHTML = '<span style="color: #e74c3c;">折扣碼已過期或尚未生效</span>';
                return;
            }
            
            if (subtotal < discountInfo.minAmount) {
                couponMessage.innerHTML = `<span style="color: #e74c3c;">需滿 NT$ ${discountInfo.minAmount} 才可使用此折扣碼</span>`;
                return;
            }
            
            // 套用折扣碼
            localStorage.setItem(STORAGE_KEYS.COUPON, code);
            updateOrderSummary();
            
            const discountValue = discountInfo.type === 'fixed' 
                ? `NT$ ${discountInfo.value}` 
                : `${discountInfo.value}%`;
            couponMessage.innerHTML = `<span style="color: #27ae60;">✓ 折扣碼已套用！折扣 ${discountValue}</span>`;
        });
    }
    
    // 同購買人資料
    const copyCheckbox = document.querySelector('[data-action="copy-buyer"]');
    if (copyCheckbox) {
        copyCheckbox.addEventListener('change', () => {
            const buyerName = document.querySelector('[name="buyer_name"]');
            const buyerPhone = document.querySelector('[name="buyer_phone"]');
            const buyerEmail = document.querySelector('[name="buyer_email"]');
            const buyerAddr = document.querySelector('[name="buyer_addr"]');
            
            const recvName = document.querySelector('[name="recv_name"]');
            const recvPhone = document.querySelector('[name="recv_phone"]');
            const recvEmail = document.querySelector('[name="recv_email"]');
            const recvAddr = document.querySelector('[name="recv_addr"]');
            
            if (copyCheckbox.checked) {
                // 複製並鎖定
                recvName.value = buyerName.value;
                recvPhone.value = buyerPhone.value;
                recvEmail.value = buyerEmail.value;
                recvAddr.value = buyerAddr.value;
                
                recvName.readOnly = true;
                recvPhone.readOnly = true;
                recvEmail.readOnly = true;
                recvAddr.readOnly = true;
                
                recvName.style.backgroundColor = '#f0f0f0';
                recvPhone.style.backgroundColor = '#f0f0f0';
                recvEmail.style.backgroundColor = '#f0f0f0';
                recvAddr.style.backgroundColor = '#f0f0f0';
                
                // 監聽購買人欄位變動
                const syncFields = () => {
                    recvName.value = buyerName.value;
                    recvPhone.value = buyerPhone.value;
                    recvEmail.value = buyerEmail.value;
                    recvAddr.value = buyerAddr.value;
                };
                
                buyerName.addEventListener('input', syncFields);
                buyerPhone.addEventListener('input', syncFields);
                buyerEmail.addEventListener('input', syncFields);
                buyerAddr.addEventListener('input', syncFields);
                
                // 儲存監聽器以便移除
                copyCheckbox._syncFields = syncFields;
            } else {
                // 解鎖
                recvName.readOnly = false;
                recvPhone.readOnly = false;
                recvEmail.readOnly = false;
                recvAddr.readOnly = false;
                
                recvName.style.backgroundColor = '';
                recvPhone.style.backgroundColor = '';
                recvEmail.style.backgroundColor = '';
                recvAddr.style.backgroundColor = '';
                
                // 移除監聽器
                if (copyCheckbox._syncFields) {
                    buyerName.removeEventListener('input', copyCheckbox._syncFields);
                    buyerPhone.removeEventListener('input', copyCheckbox._syncFields);
                    buyerEmail.removeEventListener('input', copyCheckbox._syncFields);
                    buyerAddr.removeEventListener('input', copyCheckbox._syncFields);
                }
            }
        });
    }
    
    // 前往第 3 頁
    const toConfirmBtn = document.querySelector('[data-action="to-confirm"]');
    if (toConfirmBtn) {
        toConfirmBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // 驗證必填欄位
            const buyerName = document.querySelector('[name="buyer_name"]').value.trim();
            const buyerPhone = document.querySelector('[name="buyer_phone"]').value.trim();
            const buyerEmail = document.querySelector('[name="buyer_email"]').value.trim();
            const recvName = document.querySelector('[name="recv_name"]').value.trim();
            const recvPhone = document.querySelector('[name="recv_phone"]').value.trim();
            
            if (!buyerName) {
                alert('請輸入購買人姓名');
                return;
            }
            if (!buyerPhone || !/^09\d{8}$/.test(buyerPhone)) {
                alert('請輸入正確的購買人手機號碼（09開頭，共10碼）');
                return;
            }
            if (!buyerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyerEmail)) {
                alert('請輸入正確的購買人 Email');
                return;
            }
            if (!recvName) {
                alert('請輸入收件人姓名');
                return;
            }
            if (!recvPhone || !/^09\d{8}$/.test(recvPhone)) {
                alert('請輸入正確的收件人手機號碼（09開頭，共10碼）');
                return;
            }
            
            // 宅配需檢查地址
            const shipMode = localStorage.getItem(STORAGE_KEYS.SHIP_MODE) || 'home';
            if (shipMode === 'home') {
                const buyerAddr = document.querySelector('[name="buyer_addr"]').value.trim();
                const recvAddr = document.querySelector('[name="recv_addr"]').value.trim();
                if (!buyerAddr) {
                    alert('宅配到府需填寫購買人地址');
                    return;
                }
                if (!recvAddr) {
                    alert('宅配到府需填寫收件人地址');
                    return;
                }
            }
            
            // 檢查同意條款
            const agreeTerms = document.getElementById('agreeTerms');
            if (!agreeTerms || !agreeTerms.checked) {
                alert('請先閱讀並同意網站退貨退款須知');
                if (agreeTerms) {
                    agreeTerms.focus();
                }
                return;
            }
            
            // 儲存資料
            const buyer = {
                name: buyerName,
                phone: buyerPhone,
                email: buyerEmail,
                addr: document.querySelector('[name="buyer_addr"]').value.trim()
            };
            
            const recv = {
                name: recvName,
                phone: recvPhone,
                email: document.querySelector('[name="recv_email"]').value.trim(),
                addr: document.querySelector('[name="recv_addr"]').value.trim()
            };
            
            const note = document.querySelector('[data-note]').value.trim();
            
            localStorage.setItem(STORAGE_KEYS.BUYER, JSON.stringify(buyer));
            localStorage.setItem(STORAGE_KEYS.RECV, JSON.stringify(recv));
            localStorage.setItem(STORAGE_KEYS.NOTE, note);
            
            // 前往確認頁
            window.location.href = 'confirm.html';
        });
    }
    
    // 載入已儲存的資料
    const savedBuyer = JSON.parse(localStorage.getItem(STORAGE_KEYS.BUYER) || '{}');
    const savedRecv = JSON.parse(localStorage.getItem(STORAGE_KEYS.RECV) || '{}');
    const savedNote = localStorage.getItem(STORAGE_KEYS.NOTE) || '';
    
    if (savedBuyer.name) document.querySelector('[name="buyer_name"]').value = savedBuyer.name;
    if (savedBuyer.phone) document.querySelector('[name="buyer_phone"]').value = savedBuyer.phone;
    if (savedBuyer.email) document.querySelector('[name="buyer_email"]').value = savedBuyer.email;
    if (savedBuyer.addr) document.querySelector('[name="buyer_addr"]').value = savedBuyer.addr;
    
    if (savedRecv.name) document.querySelector('[name="recv_name"]').value = savedRecv.name;
    if (savedRecv.phone) document.querySelector('[name="recv_phone"]').value = savedRecv.phone;
    if (savedRecv.email) document.querySelector('[name="recv_email"]').value = savedRecv.email;
    if (savedRecv.addr) document.querySelector('[name="recv_addr"]').value = savedRecv.addr;
    
    if (savedNote) document.querySelector('[data-note]').value = savedNote;
    
    // 字數計數
    const noteEl = document.querySelector('[data-note]');
    const charCount = document.getElementById('noteCharCount');
    if (noteEl && charCount) {
        noteEl.addEventListener('input', () => {
            charCount.textContent = noteEl.value.length;
        });
        charCount.textContent = noteEl.value.length;
    }
});
