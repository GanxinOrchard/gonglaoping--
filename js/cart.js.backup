// 購物車資料
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// 折扣碼設定
const discountCodes = {
    'WELCOME10': { type: 'percentage', value: 10, description: '新客戶優惠 10% 折扣' },
    'SAVE100': { type: 'fixed', value: 100, description: '滿額折抵 NT$100' },
    'FRUIT20': { type: 'percentage', value: 20, description: '水果專區 20% 折扣' },
    'VIP15': { type: 'percentage', value: 15, description: 'VIP會員 15% 折扣' }
};

let appliedDiscount = null;

// 加入購物車
function addToCart(productId, specId = null, quantity = 1) {
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    let spec = null;
    let price = product.price;
    let specName = null;
    
    if (specId && product.hasSpecs && product.specs) {
        spec = product.specs.find(s => s.id === specId);
        if (spec) {
            price = spec.price;
            specName = spec.name;
        }
    }
    
    const cartKey = specId ? `${productId}-${specId}` : `${productId}`;
    const existingItem = cart.find(item => item.cartKey === cartKey);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            cartKey: cartKey,
            id: productId,
            name: product.name,
            price: price,
            image: product.image,
            spec: specName,
            specId: specId,
            shippingType: product.shippingType,
            quantity: quantity
        });
    }
    
    saveCart();
    updateCartUI();
    showNotification('已加入購物車！');
}

// 更新商品數量
function updateQuantity(cartKey, change) {
    const item = cart.find(item => item.cartKey === cartKey);
    
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(cartKey);
        return;
    }
    
    saveCart();
    updateCartUI();
}

// 移除商品
function removeFromCart(cartKey) {
    cart = cart.filter(item => item.cartKey !== cartKey);
    saveCart();
    updateCartUI();
    showNotification('已移除商品');
}

// 計算小計
function calculateSubtotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// 計算折扣金額
function calculateDiscount(subtotal) {
    if (!appliedDiscount) return 0;
    
    if (appliedDiscount.type === 'percentage') {
        return Math.floor(subtotal * appliedDiscount.value / 100);
    } else if (appliedDiscount.type === 'fixed') {
        return appliedDiscount.value;
    }
    
    return 0;
}

// 計算總計
function calculateTotal() {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount(subtotal);
    return Math.max(0, subtotal - discount);
}

// 套用折扣碼
function applyDiscountCode(code) {
    const discount = discountCodes[code.toUpperCase()];
    
    if (!discount) {
        showDiscountMessage('折扣碼無效', 'error');
        return false;
    }
    
    appliedDiscount = discount;
    showDiscountMessage(`已套用：${discount.description}`, 'success');
    updateCartUI();
    return true;
}

// 顯示折扣訊息
function showDiscountMessage(message, type) {
    const discountInfo = document.getElementById('discountInfo');
    
    if (!discountInfo) return;
    
    discountInfo.textContent = message;
    discountInfo.className = `discount-info ${type}`;
    discountInfo.style.display = 'block';
    
    setTimeout(() => {
        discountInfo.style.display = 'none';
    }, 3000);
}

// 更新購物車 UI
function updateCartUI() {
    updateCartCount();
    renderCartItems();
    updateCartTotal();
}

// 更新購物車數量顯示
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    
    if (!cartCount) return;
    
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// 渲染購物車項目
function renderCartItems() {
    const cartItems = document.getElementById('cartItems');
    
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>購物車是空的</p>
            </div>
        `;
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">
                    ${item.name}
                    ${item.spec ? `<span style="color: var(--primary-color); font-size: 14px; margin-left: 8px;">(${item.spec})</span>` : ''}
                </div>
                <div class="cart-item-price">NT$ ${item.price}</div>
                <div class="cart-item-shipping" style="font-size: 12px; color: #666; margin-top: 4px;">
                    ${item.shippingType === 'normal' ? '常溫配送' : item.shippingType === 'cold' ? '冷藏配送' : '冷凍配送'}
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-control">
                        <button onclick="updateQuantity('${item.cartKey}', -1)">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity('${item.cartKey}', 1)">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <button class="btn-remove" onclick="removeFromCart('${item.cartKey}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// 計算運費（依商品類型）
function calculateShippingFee(cartItems) {
    const subtotal = calculateSubtotal();
    
    // 滿1800免運
    if (subtotal >= 1800) return 0;
    
    let maxShippingFee = 0;
    
    cartItems.forEach(item => {
        let fee = 0;
        
        switch (item.shippingType) {
            case 'normal':
                fee = 150; // 常溫
                break;
            case 'cold':
                fee = 180; // 冷藏
                break;
            case 'frozen':
                fee = 200; // 冷凍
                break;
        }
        
        // 取最高運費
        if (fee > maxShippingFee) {
            maxShippingFee = fee;
        }
    });
    
    return maxShippingFee;
}

// 更新購物車總計
function updateCartTotal() {
{{ ... }}
    const totalEl = document.getElementById('total');
    const discountAmountEl = document.getElementById('discountAmount');
    const discountValueEl = document.getElementById('discountValue');
    
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount(subtotal);
    const shipping = calculateShippingFee(cart);
    const total = calculateTotal() + shipping;
    
    if (subtotalEl) subtotalEl.textContent = `NT$ ${subtotal}`;
    
    // 顯示運費資訊（先移除舊的）
    const cartSummary = document.querySelector('.cart-summary');
    if (cartSummary) {
        // 移除所有舊的運費提示
        const oldShippingInfos = cartSummary.querySelectorAll('.shipping-info');
        oldShippingInfos.forEach(el => el.remove());
        
        // 建立新的運費提示
        let shippingHTML = '';
        if (shipping === 0) {
            shippingHTML = '<div class="shipping-info" style="color: #10b981; font-size: 14px; margin: 10px 0; padding: 8px; background: #f0fdf4; border-radius: 6px;">✓ 已達免運門檻（滿1800免運）</div>';
        } else {
            const remaining = 1800 - subtotal;
            let shippingType = '常溫150';
            if (shipping === 180) shippingType = '冷藏180';
            if (shipping === 200) shippingType = '冷凍200';
            shippingHTML = `<div class="shipping-info" style="color: #f59e0b; font-size: 14px; margin: 10px 0; padding: 8px; background: #fffbeb; border-radius: 6px;">運費 NT$ ${shipping} (${shippingType}) | 再消費 NT$ ${remaining} 即可免運</div>`;
        }
        
        // 在小計後面插入
        if (subtotalEl && subtotalEl.parentElement) {
            subtotalEl.parentElement.insertAdjacentHTML('afterend', shippingHTML);
        }
    }
    
    if (totalEl) totalEl.textContent = `NT$ ${total}`;
    
    if (discount > 0 && discountAmountEl && discountValueEl) {
        discountAmountEl.style.display = 'flex';
        discountValueEl.textContent = `-NT$ ${discount}`;
    } else if (discountAmountEl) {
        discountAmountEl.style.display = 'none';
    }
}

// 儲存購物車到 localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// 清空購物車
function clearCart() {
    cart = [];
    appliedDiscount = null;
    saveCart();
    updateCartUI();
}

// 顯示通知
function showNotification(message) {
    // 創建通知元素
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--success-color);
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
}

// 初始化購物車
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    
    // 購物車圖示點擊
    const cartIcon = document.getElementById('cartIcon');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.getElementById('closeCart');
    
    if (cartIcon && cartSidebar) {
        cartIcon.addEventListener('click', (e) => {
            e.preventDefault();
            cartSidebar.classList.add('active');
        });
    }
    
    if (closeCart && cartSidebar) {
        closeCart.addEventListener('click', (e) => {
            e.stopPropagation();
            cartSidebar.classList.remove('active');
        });
    }
    
    // 點擊外部關閉購物車
    document.addEventListener('click', (e) => {
        if (cartSidebar && cartSidebar.classList.contains('active')) {
            if (!cartSidebar.contains(e.target) && !e.target.closest('#cartIcon') && !e.target.closest('#floatingCart')) {
                cartSidebar.classList.remove('active');
            }
        }
    });
    
    // 點擊側邊欄外部關閉
    if (cartSidebar) {
        cartSidebar.addEventListener('click', (e) => {
            if (e.target === cartSidebar) {
                cartSidebar.classList.remove('active');
            }
        });
    }
    
    // 折扣碼套用
    const applyDiscountBtn = document.getElementById('applyDiscount');
    const discountCodeInput = document.getElementById('discountCode');
    
    if (applyDiscountBtn && discountCodeInput) {
        applyDiscountBtn.addEventListener('click', () => {
            const code = discountCodeInput.value.trim();
            if (code) {
                applyDiscountCode(code);
            }
        });
        
        discountCodeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const code = discountCodeInput.value.trim();
                if (code) {
                    applyDiscountCode(code);
                }
            }
        });
    }
    
    // 前往結帳按鈕
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showNotification('購物車是空的！');
                return;
            }
            
            openCheckoutModal();
        });
    }
});

// 添加動畫樣式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
