// ========================================
// 購物車頁面 JS (cart.html)
// 三頁式流程：cart.html → checkout.html → confirm.html
// ========================================

    const GAS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxnAaMzz10UpbJ0WFJwhH_1b93GC1VA3JFw464vi122koHCoHjrSD_Ou4FHUjo266CB/exec';

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
// 購物車商品列表渲染
// ========================================// 渲染購物車商品列表
function renderCartItems() {
    console.log('🎨 renderCartItems 被調用');
    let cart = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || localStorage.getItem('cart') || '[]');
    console.log('📦 從 localStorage 讀取的購物車:', cart);
    console.log('📊 購物車商品數量:', cart.length);
    
    // 🔧 修復錯誤的數據結構（id 欄位是物件的情況）
    let needsRepair = false;
    cart = cart.map(item => {
        if (item.id && typeof item.id === 'object') {
            console.warn('⚠️ 偵測到錯誤的購物車數據結構，正在修復...', item);
            needsRepair = true;
            // 將嵌套的物件展平
            return {
                id: item.id.id || item.id,
                name: item.id.name || item.name,
                price: item.id.price || item.price,
                image: item.id.image || item.image,
                selectedSpec: item.id.selectedSpec || item.selectedSpec,
                selectedSpecId: item.id.selectedSpecId || item.selectedSpecId,
                shippingType: item.id.shippingType || item.shippingType || 'normal',
                quantity: item.quantity || 1
            };
        }
        return item;
    });
    
    // 如果修復了數據，保存回 localStorage
    if (needsRepair) {
        console.log('✅ 購物車數據已修復並保存:', cart);
        localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    const cartItemsList = document.getElementById('cartItemsList');
    const cartSummary = document.getElementById('cartSummary');
    const checkoutButton = document.getElementById('checkoutButton');
    const discountSection = document.getElementById('discountSection');
    const deliverySection = document.getElementById('deliverySection');
    const paymentSection = document.getElementById('paymentSection');
    
    if (!cartItemsList) {
        console.warn('⚠️ cartItemsList 元素未找到');
        return;
    }
    
    console.log('✅ cartItemsList 元素已找到');
    
    if (cart.length === 0) {
        cartItemsList.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-cart"></i>
                <h2>購物車是空的</h2>
                <p>還沒有添加任何商品，快去選購優質水果吧！</p>
                <a href="products.html" class="btn-shop-now">
                    <i class="fas fa-arrow-right" style="margin-left: 8px;"></i>
                    開始選購
                </a>
            </div>
        `;
        if (cartSummary) cartSummary.style.display = 'none';
        if (checkoutButton) checkoutButton.disabled = true;
        if (discountSection) discountSection.style.display = 'none';
        if (deliverySection) deliverySection.style.display = 'none';
        if (paymentSection) paymentSection.style.display = 'none';
        return;
    }
    
    // 渲染商品列表
    cartItemsList.innerHTML = cart.map(item => {
        // 解析規格資訊
        let specButtons = '';
        if (item.selectedSpec) {
            const specs = item.selectedSpec.split(' ');
            specButtons = specs.map(spec => `<button class="spec-button">${spec}</button>`).join('');
        }
        
        return `
        <div class="cart-item">
            <div class="cart-item-image" onclick="window.location.href='product-detail.html?id=${item.id}'">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                ${specButtons ? `<div class="cart-item-spec">${specButtons}</div>` : ''}
                <div class="cart-item-price">NT$ ${item.price.toLocaleString()}</div>
            </div>
            <div class="cart-item-controls">
                <div class="qty-controls">
                    <button class="qty-btn" onclick="updateCartQuantity(${item.id}, -1, ${item.selectedSpecId ? `'${item.selectedSpecId}'` : 'null'})">-</button>
                    <span class="qty-display">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateCartQuantity(${item.id}, 1, ${item.selectedSpecId ? `'${item.selectedSpecId}'` : 'null'})">+</button>
                </div>
                <button class="remove-btn" onclick="removeCartItem(${item.id}, ${item.selectedSpecId ? `'${item.selectedSpecId}'` : 'null'})">
                    刪除
                </button>
            </div>
        </div>
        `;
    }).join('');
    
    if (cartSummary) cartSummary.style.display = 'block';
    if (checkoutButton) checkoutButton.disabled = false;
    if (discountSection) discountSection.style.display = 'block';
    if (deliverySection) deliverySection.style.display = 'block';
    if (paymentSection) paymentSection.style.display = 'block';
    
    // 更新金額顯示
    updateCartCount();
    updateAmounts();
}

// 更新購物車金額統計（合併所有ID查詢邏輯）
function updateAmounts() {
    const { subtotal, discount, shipping, total } = calculatePrice();
    
    // cart.html主要使用的ID
    const subtotalEl = document.getElementById('subtotalAmount');
    const discountEl = document.getElementById('discountAmount');
    const shippingEl = document.getElementById('shippingAmount');
    const totalEl = document.getElementById('totalAmount');
    
    // 其他頁面ID(向後相容)
    const subtotalEl2 = document.getElementById('subtotal');
    const shippingEl2 = document.getElementById('shippingFee');
    const discountEl2 = document.getElementById('discountValue');
    const totalEl2 = document.getElementById('total');
    
    // data屬性選擇器
    const subtotalEl3 = document.querySelector('[data-subtotal]');
    const shippingEl3 = document.querySelector('[data-shipping]');
    const discountEl3 = document.querySelector('[data-discount]');
    const totalEl3 = document.querySelector('[data-total]');
    
    // 更新所有找到的元素
    if (subtotalEl) subtotalEl.textContent = `NT$ ${subtotal.toLocaleString()}`;
    if (subtotalEl2) subtotalEl2.textContent = `NT$ ${subtotal.toLocaleString()}`;
    if (subtotalEl3) subtotalEl3.textContent = `NT$ ${subtotal.toLocaleString()}`;
    
    if (discountEl) discountEl.textContent = discount > 0 ? `-NT$ ${discount.toLocaleString()}` : 'NT$ 0';
    if (discountEl2) discountEl2.textContent = discount > 0 ? `-NT$ ${discount.toLocaleString()}` : 'NT$ 0';
    if (discountEl3) discountEl3.textContent = discount > 0 ? `-NT$ ${discount.toLocaleString()}` : 'NT$ 0';
    
    if (shippingEl) shippingEl.textContent = shipping > 0 ? `NT$ ${shipping.toLocaleString()}` : '免運費';
    if (shippingEl2) shippingEl2.textContent = shipping > 0 ? `NT$ ${shipping.toLocaleString()}` : '免運費';
    if (shippingEl3) shippingEl3.textContent = shipping > 0 ? `NT$ ${shipping.toLocaleString()}` : '免運費';
    
    if (totalEl) totalEl.textContent = `NT$ ${total.toLocaleString()}`;
    if (totalEl2) totalEl2.textContent = `NT$ ${total.toLocaleString()}`;
    if (totalEl3) totalEl3.textContent = `NT$ ${total.toLocaleString()}`;
}

// 更新購物車數量
function updateCartQuantity(productId, change, specId = null) {
    const cart = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || localStorage.getItem('cart') || '[]');
    const itemIndex = cart.findIndex(item => item.id === productId && item.selectedSpecId === specId);
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity += change;
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
        localStorage.setItem('cart', JSON.stringify(cart)); // 同步舊 key
        renderCartItems();
        updateAmounts();
    }
}

// 移除購物車商品
function removeCartItem(productId, specId = null) {
    const cart = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || localStorage.getItem('cart') || '[]');
    const filtered = cart.filter(item => !(item.id === productId && item.selectedSpecId === specId));
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(filtered));
    localStorage.setItem('cart', JSON.stringify(filtered)); // 同步舊 key
    renderCartItems();
    updateAmounts();
}

// ========================================
// 全域購物車函數（供其他頁面使用）
// ========================================

// 加入購物車
function addToCart(productId, specId = null, quantity = 1) {
    if (typeof productId === 'object') {
        let product = productId;
        
        // 🔧 驗證並修復物件結構
        if (product.id && typeof product.id === 'object') {
            console.warn('⚠️ addToCart 收到錯誤的物件結構，正在修復...', product);
            product = {
                id: product.id.id || product.id,
                name: product.id.name || product.name,
                price: product.id.price || product.price,
                image: product.id.image || product.image,
                selectedSpec: product.id.selectedSpec || product.selectedSpec,
                selectedSpecId: product.id.selectedSpecId || product.selectedSpecId,
                shippingType: product.id.shippingType || product.shippingType || 'normal',
                quantity: product.quantity || 1
            };
        }
        
        // 確保必要欄位存在
        if (!product.id || !product.name || !product.price) {
            console.error('❌ addToCart 收到不完整的商品資料:', product);
            return;
        }
        
        const cart = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || localStorage.getItem('cart') || '[]');
        const existingItem = cart.find(item => item.id === product.id && item.selectedSpecId === product.selectedSpecId);
        
        if (existingItem) {
            existingItem.quantity += (product.quantity || 1);
        } else {
            cart.push(product);
        }
        
        localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
        localStorage.setItem('cart', JSON.stringify(cart)); // 同步舊 key
    } else {
        if (typeof products === 'undefined') {
            console.error('products 未定義');
            return;
        }
        const product = products.find(p => p.id === productId);
        if (!product) {
            console.error('找不到商品:', productId);
            return;
        }
        
        let selectedSpec = null;
        let price = product.price;
        let specName = '';
        
        if (specId && product.specs) {
            selectedSpec = product.specs.find(s => s.id === specId);
            if (selectedSpec) {
                price = selectedSpec.price;
                const specDetail = selectedSpec.weight || selectedSpec.diameter || '';
                specName = selectedSpec.name + (specDetail ? ' (' + specDetail + ')' : '');
            }
        }
        
        const cart = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || localStorage.getItem('cart') || '[]');
        const existingItem = cart.find(item => 
            item.id === productId && item.selectedSpecId === specId
        );
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: price,
                image: product.image,
                selectedSpec: specName,
                selectedSpecId: specId,
                shippingType: product.shippingType || 'normal',
                quantity: quantity
            });
        }
        
        localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
        localStorage.setItem('cart', JSON.stringify(cart)); // 同步舊 key
    }
    
    updateCartCount();
    showNotification('✅ 已加入購物車！');
}

// 更新購物車數量顯示
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || localStorage.getItem('cart') || '[]');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    console.log('🔢 updateCartCount: 總商品數量 =', totalItems);
    
    const cartCounts = document.querySelectorAll('#cartCount, .cart-count, #floatingCartCount, .cart-badge');
    console.log('🎯 找到', cartCounts.length, '個購物車數量顯示元素');
    cartCounts.forEach(el => {
        if (el) {
            el.textContent = totalItems;
            el.style.display = totalItems > 0 ? 'block' : 'none';
        }
    });
}

// 更新購物車 UI（相容舊系統）
function updateCartUI() {
    updateCartCount();
    if (typeof renderCartItems === 'function') {
        renderCartItems();
    }
}

// 清空購物車
function clearCart() {
    localStorage.removeItem(STORAGE_KEYS.CART);
    localStorage.removeItem('cart');
    updateCartUI();
}

// 顯示通知
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%) translateY(-20px);
        background: linear-gradient(135deg, #27ae60, #2ecc71);
        color: white;
        padding: 16px 28px;
        border-radius: 50px;
        z-index: 99999;
        box-shadow: 0 8px 24px rgba(39, 174, 96, 0.4);
        font-size: 16px;
        font-weight: 600;
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: none;
    `;
    document.body.appendChild(notification);
    
    // 顯示動畫
    requestAnimationFrame(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(-50%) translateY(0)';
    });
    
    // 隱藏動畫
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(-50%) translateY(-20px)';
        setTimeout(() => notification.remove(), 300);
    }, 2500);
}

// 更新數量（舊系統相容）
function updateQuantity(productId, change, specId = null) {
    updateCartQuantity(productId, change, specId);
}

// 移除商品（舊系統相容）
function removeFromCart(productId, specId = null) {
    removeCartItem(productId, specId);
}

// 生成訂單編號
function generateOrderNumber() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${year}${month}${day}${random}`;
}

// ========================================
// 頁面初始化
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 cart.js DOMContentLoaded 事件觸發');
    
    // 遷移舊的 cart 到新的 key
    const oldCart = localStorage.getItem('cart');
    if (oldCart && !localStorage.getItem(STORAGE_KEYS.CART)) {
        console.log('🔄 遷移舊購物車數據到新 key');
        localStorage.setItem(STORAGE_KEYS.CART, oldCart);
    }
    
    // 檢查 localStorage 中的數據
    console.log('📦 localStorage ganxin_cart:', localStorage.getItem('ganxin_cart'));
    console.log('📦 localStorage cart:', localStorage.getItem('cart'));
    
    // 渲染購物車商品
    renderCartItems();
    
    // 初始更新金額
    updateAmounts();
    
    // 結帳表單提交處理
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // 收集表單資料
            const cart = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || '[]');
            if (cart.length === 0) {
                alert('購物車是空的');
                return;
            }
            
            const { subtotal, discount, shipping, total } = calculatePrice();
            const payment = document.querySelector('input[name="payment"]:checked')?.value || 'linepay';
            
            const formData = {
                orderNumber: generateOrderNumber(),
                name: document.getElementById('customerName')?.value || '',
                phone: document.getElementById('customerPhone')?.value || '',
                email: document.getElementById('customerEmail')?.value || '',
                address: document.getElementById('customerAddress')?.value || '',
                note: document.getElementById('customerNote')?.value || '',
                payment: payment,
                cart: cart,
                subtotal: subtotal,
                discount: discount,
                shipping: shipping,
                total: total,
                timestamp: new Date().toISOString()
            };
            
            // 儲存訂單資訊到 localStorage
            localStorage.setItem('lastOrder', JSON.stringify(formData));
            
            // 關閉結帳彈窗
            const checkoutModal = document.getElementById('checkoutModal');
            if (checkoutModal) {
                checkoutModal.style.display = 'none';
            }
            
            // 顯示載入中
            showLoading();
            
            // TODO: 發送到 Google Apps Script
            // const GAS_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL';
            // try {
            //     const response = await fetch(GAS_URL, {
            //         method: 'POST',
            //         mode: 'no-cors',
            //         headers: { 'Content-Type': 'application/json' },
            //         body: JSON.stringify(formData)
            //     });
            // } catch (error) {
            //     console.error('訂單提交失敗:', error);
            // }
            
            // 模擬延遲
            setTimeout(() => {
                hideLoading();
                // 跳轉到完成頁面
                window.location.href = 'order-complete.html';
            }, 1000);
        });
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
            
            // 更新視覺樣式
            document.querySelectorAll('.delivery-option-cart').forEach(opt => {
                opt.style.borderColor = '#e0e0e0';
                opt.style.background = 'white';
            });
            const selectedLabel = radio.closest('.delivery-option-cart');
            if (selectedLabel) {
                selectedLabel.style.borderColor = 'var(--primary-color)';
                selectedLabel.style.background = '#fff5f5';
            }
            
            updateAmounts();
        });
    });
    
    // 付款方式點擊事件
    document.querySelectorAll('.payment-option-cart').forEach(label => {
        label.addEventListener('click', (e) => {
            e.preventDefault();
            
            // 移除所有選中狀態
            document.querySelectorAll('.payment-option-cart').forEach(opt => {
                opt.classList.remove('selected');
                opt.style.borderColor = '#e0e0e0';
                opt.style.background = 'white';
                const div = opt.querySelector('div');
                if (div) div.style.color = '#333';
                const radio = opt.querySelector('input[type="radio"]');
                if (radio) radio.checked = false;
            });
            
            // 設置當前選中狀態
            label.classList.add('selected');
            label.style.borderColor = 'var(--primary-color)';
            label.style.background = '#fff5f5';
            const div = label.querySelector('div');
            if (div) div.style.color = 'var(--primary-color)';
            
            const radio = label.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
                localStorage.setItem(STORAGE_KEYS.PAY_METHOD, radio.value);
            }
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
    
    // 更新購物車數量顯示（所有頁面都需要）
    updateCartCount();
    
    // 載入已儲存的配送/付款方式
    const savedShip = localStorage.getItem(STORAGE_KEYS.SHIP_MODE) || 'home';
    const savedPay = localStorage.getItem(STORAGE_KEYS.PAY_METHOD) || '匯款';
    
    // 確保預設值被保存
    if (!localStorage.getItem(STORAGE_KEYS.PAY_METHOD)) {
        localStorage.setItem(STORAGE_KEYS.PAY_METHOD, '匯款');
    }
    
    const shipRadio = document.querySelector(`[data-ship="${savedShip}"]`);
    if (shipRadio) shipRadio.checked = true;
    
    const payRadio = document.querySelector(`[name="pay_method"][value="${savedPay}"]`);
    if (payRadio) {
        payRadio.checked = true;
        // 觸發 change 事件確保保存
        payRadio.dispatchEvent(new Event('change', { bubbles: true }));
    }
});

// 頁面載入時立即更新購物車數量（不等待 DOMContentLoaded）
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateCartCount);
} else {
    updateCartCount();
}

// 監聽 template 載入完成事件，再次更新購物車數量
document.addEventListener('templatesLoaded', () => {
    console.log('🔄 Template 載入完成，更新購物車數量');
    updateCartCount();
});
