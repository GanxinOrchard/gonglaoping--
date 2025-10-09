/**
 * 柑心果園 - 購物車完整功能
 * 包含：折扣碼、同購買人資料、訂單提交
 */

(function() {
    'use strict';
    
    // ==================== 可調參數 ====================
    const CONFIG = {
        DEBUG: true,
        SHIPPING_FEE: 180,
        FREE_SHIPPING_THRESHOLD: 1800,
        MIN_ORDER: 500,
        GAS_ENDPOINT: 'https://script.google.com/macros/s/AKfycbw1nW-SRQDCWtABT0uB5IBPb4pk2jBusZlbm3_bwCBdcwBUGwH1wjyRm3PB9Is0Ysej/exec',
        
        COUPONS: {
            'GANXIN100': { type: 'amount', value: 100, min: 1000, desc: '滿1000折100' },
            'TENOFF': { type: 'percent', value: 10, max: 500, desc: '九折，最高折500' },
            'FREESHIP': { type: 'freeship', desc: '免運券' }
        }
    };
    
    const log = CONFIG.DEBUG ? console.log.bind(console, '[Cart]') : () => {};
    
    // ==================== 狀態管理 ====================
    let state = {
        cart: [],
        coupon: null,
        shipMode: 'home',
        copyBuyer: false
    };
    
    // ==================== 初始化 ====================
    function init() {
        log('初始化購物車增強功能');
        loadState();
        bindEvents();
        
        // 延遲執行，等待原有的 cart.js 完成渲染
        setTimeout(() => {
            renderTotals();
            updateCopyBuyerState();
        }, 100);
    }
    
    function loadState() {
        try {
            const cartData = localStorage.getItem('ganxin_cart');
            state.cart = cartData ? JSON.parse(cartData) : [];
            
            const couponData = localStorage.getItem('ganxin_coupon');
            state.coupon = couponData ? JSON.parse(couponData) : null;
            
            log('載入狀態:', state);
        } catch (e) {
            log('載入狀態失敗:', e);
            state.cart = [];
            state.coupon = null;
        }
    }
    
    // ==================== 計算邏輯 ====================
    function calcSubtotal(items) {
        return items.reduce((sum, item) => {
            const qty = item.qty || item.quantity || 0;
            return sum + (item.price * qty);
        }, 0);
    }
    
    function calcShipping(subtotal, shipMode) {
        if (shipMode === 'pickup') return 0;
        return subtotal >= CONFIG.FREE_SHIPPING_THRESHOLD ? 0 : CONFIG.SHIPPING_FEE;
    }
    
    function calcDiscount(subtotal, shipping, activeCoupon) {
        if (!activeCoupon) return 0;
        
        const coupon = CONFIG.COUPONS[activeCoupon.toUpperCase()];
        if (!coupon) return 0;
        
        if (coupon.type === 'amount') {
            if (subtotal < coupon.min) return 0;
            return coupon.value;
        }
        
        if (coupon.type === 'percent') {
            const discount = Math.floor(subtotal * coupon.value / 100);
            return coupon.max ? Math.min(discount, coupon.max) : discount;
        }
        
        if (coupon.type === 'freeship') {
            return shipping;
        }
        
        return 0;
    }
    
    function renderTotals() {
        // 如果原有的 updateAmounts 函數存在，優先使用
        if (typeof window.updateAmounts === 'function') {
            window.updateAmounts();
            log('使用原有的 updateAmounts 函數');
            return;
        }
        
        // 否則使用自己的計算邏輯
        const subtotal = calcSubtotal(state.cart);
        const shipping = calcShipping(subtotal, state.shipMode);
        const discount = calcDiscount(subtotal, shipping, state.coupon);
        const total = subtotal + shipping - discount;
        
        // 更新顯示
        updateElement('[data-subtotal]', `NT$ ${subtotal.toLocaleString()}`);
        updateElement('[data-shipping]', shipping === 0 ? '免運費' : `NT$ ${shipping.toLocaleString()}`);
        updateElement('[data-discount]', discount > 0 ? `-NT$ ${discount.toLocaleString()}` : 'NT$ 0');
        updateElement('[data-total]', `NT$ ${total.toLocaleString()}`);
        
        // 控制按鈕狀態
        const isEmpty = state.cart.length === 0;
        const belowMin = total < CONFIG.MIN_ORDER;
        
        const confirmBtn = document.querySelector('[data-action="confirm-order"]');
        if (confirmBtn) {
            confirmBtn.disabled = isEmpty || belowMin;
        }
        
        log('金額計算:', { subtotal, shipping, discount, total });
    }
    
    function updateElement(selector, value) {
        const el = document.querySelector(selector);
        if (el) el.textContent = value;
    }
    
    // ==================== 折扣碼功能 ====================
    function applyCoupon() {
        const input = document.querySelector('[data-coupon-input]');
        const msgEl = document.querySelector('[data-coupon-msg]');
        
        if (!input) return;
        
        const code = input.value.trim().toUpperCase();
        
        if (!code) {
            showCouponMsg(msgEl, '請輸入折扣碼', 'error');
            return;
        }
        
        const coupon = CONFIG.COUPONS[code];
        if (!coupon) {
            showCouponMsg(msgEl, '折扣碼無效', 'error');
            return;
        }
        
        const subtotal = calcSubtotal(state.cart);
        
        // 檢查最低消費
        if (coupon.min && subtotal < coupon.min) {
            showCouponMsg(msgEl, `需滿 NT$ ${coupon.min.toLocaleString()} 才可使用`, 'error');
            return;
        }
        
        state.coupon = code;
        localStorage.setItem('ganxin_coupon', JSON.stringify(code));
        showCouponMsg(msgEl, `✓ 已套用：${coupon.desc}`, 'success');
        renderTotals();
        
        log('套用折扣碼:', code);
    }
    
    function showCouponMsg(el, msg, type) {
        if (!el) return;
        el.textContent = msg;
        el.className = `coupon-msg ${type}`;
        el.style.display = 'block';
    }
    
    // ==================== 配送方式切換 ====================
    function handleShipChange(e) {
        const target = e.target.closest('[data-ship]');
        if (!target) return;
        
        state.shipMode = target.dataset.ship || target.value;
        log('切換配送方式:', state.shipMode);
        renderTotals();
    }
    
    // ==================== 同購買人資料 ====================
    function toggleCopyBuyer(e) {
        const checkbox = e.target.closest('[data-action="copy-buyer"]');
        if (!checkbox) return;
        
        state.copyBuyer = checkbox.checked;
        log('同購買人資料:', state.copyBuyer);
        
        if (state.copyBuyer) {
            copyBuyerToReceiver();
            setReceiverReadonly(true);
        } else {
            setReceiverReadonly(false);
        }
    }
    
    function copyBuyerToReceiver() {
        const fields = ['name', 'phone', 'email', 'addr'];
        fields.forEach(field => {
            const buyerEl = document.querySelector(`[name="buyer_${field}"]`);
            const recvEl = document.querySelector(`[name="recv_${field}"]`);
            if (buyerEl && recvEl) {
                recvEl.value = buyerEl.value;
            }
        });
    }
    
    function setReceiverReadonly(readonly) {
        const fields = ['name', 'phone', 'email', 'addr'];
        fields.forEach(field => {
            const el = document.querySelector(`[name="recv_${field}"]`);
            if (el) {
                if (readonly) {
                    el.setAttribute('readonly', 'readonly');
                    el.style.backgroundColor = '#f5f5f5';
                } else {
                    el.removeAttribute('readonly');
                    el.style.backgroundColor = '';
                }
            }
        });
    }
    
    function handleBuyerInput() {
        if (state.copyBuyer) {
            copyBuyerToReceiver();
        }
    }
    
    function updateCopyBuyerState() {
        const checkbox = document.querySelector('[data-action="copy-buyer"]');
        if (checkbox && checkbox.checked) {
            state.copyBuyer = true;
            copyBuyerToReceiver();
            setReceiverReadonly(true);
        }
    }
    
    // ==================== 表單驗證 ====================
    function validateForm() {
        const errors = [];
        
        // 檢查購物車
        if (state.cart.length === 0) {
            errors.push('購物車是空的');
            return errors;
        }
        
        // 檢查最低消費
        const subtotal = calcSubtotal(state.cart);
        const shipping = calcShipping(subtotal, state.shipMode);
        const discount = calcDiscount(subtotal, shipping, state.coupon);
        const total = subtotal + shipping - discount;
        
        if (total < CONFIG.MIN_ORDER) {
            errors.push(`訂單金額未達最低消費 NT$ ${CONFIG.MIN_ORDER.toLocaleString()}`);
        }
        
        // 如果有表單欄位才驗證（結帳頁面）
        const hasBuyerForm = document.querySelector('[name="buyer_name"]');
        if (!hasBuyerForm) {
            // 購物車頁面，不需要驗證表單
            return errors;
        }
        
        // 購買人必填
        const buyerName = getFieldValue('buyer_name');
        const buyerPhone = getFieldValue('buyer_phone');
        const buyerEmail = getFieldValue('buyer_email');
        
        if (!buyerName) errors.push('請填寫購買人姓名');
        if (!buyerPhone) errors.push('請填寫購買人電話');
        if (!validatePhone(buyerPhone)) errors.push('購買人電話格式不正確');
        if (buyerEmail && !validateEmail(buyerEmail)) errors.push('購買人 Email 格式不正確');
        
        // 收件人必填
        const recvName = getFieldValue('recv_name');
        const recvPhone = getFieldValue('recv_phone');
        const recvEmail = getFieldValue('recv_email');
        const recvAddr = getFieldValue('recv_addr');
        
        if (!recvName) errors.push('請填寫收件人姓名');
        if (!recvPhone) errors.push('請填寫收件人電話');
        if (!validatePhone(recvPhone)) errors.push('收件人電話格式不正確');
        if (recvEmail && !validateEmail(recvEmail)) errors.push('收件人 Email 格式不正確');
        
        // 宅配必填地址
        if (state.shipMode === 'home') {
            const buyerAddr = getFieldValue('buyer_addr');
            if (!buyerAddr) errors.push('宅配模式請填寫購買人地址');
            if (!recvAddr) errors.push('宅配模式請填寫收件人地址');
        }
        
        return errors;
    }
    
    function getFieldValue(name) {
        const el = document.querySelector(`[name="${name}"]`);
        return el ? el.value.trim() : '';
    }
    
    function validatePhone(phone) {
        return /^[0-9+\-\s]{8,15}$/.test(phone);
    }
    
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    // ==================== 訂單提交 ====================
    async function confirmOrder(e) {
        e.preventDefault();
        
        log('開始處理訂單');
        
        // 驗證
        const errors = validateForm();
        if (errors.length > 0) {
            alert('請修正以下問題：\n\n' + errors.join('\n'));
            return;
        }
        
        // 檢查是否在購物車頁面（沒有表單欄位）
        const hasBuyerForm = document.querySelector('[name="buyer_name"]');
        if (!hasBuyerForm) {
            // 購物車頁面，導向結帳頁面
            log('導向結帳頁面');
            window.location.href = 'checkout.html';
            return;
        }
        
        // 結帳頁面，提交訂單
        log('提交訂單到後台');
        
        // 組成訂單資料
        const subtotal = calcSubtotal(state.cart);
        const shipping = calcShipping(subtotal, state.shipMode);
        const discount = calcDiscount(subtotal, shipping, state.coupon);
        const total = subtotal + shipping - discount;
        
        const orderData = {
            id: `GX${Date.now()}`,
            time: new Date().toISOString(),
            items: state.cart.map(item => ({
                name: item.name || item.title || item.productName,
                price: item.price,
                qty: item.quantity || item.qty || 1,
                weight: item.weight || '',
                size: item.size || item.spec || ''
            })),
            coupon: state.coupon || '',
            buyer: {
                name: getFieldValue('buyer_name'),
                phone: getFieldValue('buyer_phone'),
                email: getFieldValue('buyer_email'),
                addr: getFieldValue('buyer_addr')
            },
            recv: {
                name: getFieldValue('recv_name'),
                phone: getFieldValue('recv_phone'),
                email: getFieldValue('recv_email'),
                addr: getFieldValue('recv_addr')
            },
            shipMode: state.shipMode,
            pay: getPayMethod(),
            subtotal: subtotal,
            shipping: shipping,
            discount: discount,
            total: total
        };
        
        // 暫存訂單
        localStorage.setItem('ganxin_last_order', JSON.stringify(orderData));
        
        // 提交到後台
        try {
            const btn = e.target;
            btn.disabled = true;
            btn.textContent = '提交中...';
            
            const response = await fetch(CONFIG.GAS_ENDPOINT, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });
            
            // no-cors 模式無法讀取回應，假設成功
            log('訂單已提交');
            
            // 清除購物車和折扣碼
            localStorage.removeItem('ganxin_cart');
            localStorage.removeItem('ganxin_coupon');
            
            alert('✓ 訂單已送出！\n\n我們已收到您的訂單，稍後會寄送確認信至您的信箱。');
            
            // 導向首頁或訂單完成頁
            window.location.href = 'index.html';
            
        } catch (error) {
            log('提交失敗:', error);
            alert('❌ 訂單提交失敗，請稍後再試\n\n' + error.message);
            
            const btn = e.target;
            btn.disabled = false;
            btn.textContent = '確認訂單';
        }
    }
    
    function getPayMethod() {
        const radio = document.querySelector('[name="pay_method"]:checked');
        return radio ? radio.value : '匯款';
    }
    
    // ==================== 事件綁定 ====================
    function bindEvents() {
        // 事件委派
        document.addEventListener('click', (e) => {
            const action = e.target.closest('[data-action]');
            if (!action) return;
            
            const actionType = action.dataset.action;
            
            if (actionType === 'apply-coupon') {
                e.preventDefault();
                applyCoupon();
            } else if (actionType === 'confirm-order') {
                e.preventDefault();
                confirmOrder(e);
            } else if (actionType === 'copy-buyer') {
                toggleCopyBuyer(e);
            }
        });
        
        // 配送方式切換
        document.addEventListener('change', (e) => {
            if (e.target.matches('[data-ship]') || e.target.matches('[name="ship_mode"]')) {
                handleShipChange(e);
            }
        });
        
        // 購買人欄位輸入監聽
        ['buyer_name', 'buyer_phone', 'buyer_email', 'buyer_addr'].forEach(field => {
            const el = document.querySelector(`[name="${field}"]`);
            if (el) {
                el.addEventListener('input', handleBuyerInput);
            }
        });
        
        log('事件綁定完成');
    }
    
    // ==================== 啟動 ====================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // ==================== Console 測試 ====================
    window.GANXIN_CART_TEST = {
        setTestCart: () => {
            localStorage.setItem('ganxin_cart', JSON.stringify([
                {name:"椪柑10斤",price:1200,qty:1,weight:"10斤",size:"25A"}
            ]));
            location.reload();
        },
        clearCart: () => {
            localStorage.removeItem('ganxin_cart');
            localStorage.removeItem('ganxin_coupon');
            location.reload();
        },
        getState: () => state
    };
    
    log('購物車系統已載入。測試指令: GANXIN_CART_TEST.setTestCart()');
    
})();
