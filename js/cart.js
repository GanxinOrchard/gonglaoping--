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
function addToCart(product) {
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartUI();
    showNotification('已加入購物車！');
}

// 更新商品數量
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    saveCart();
    updateCartUI();
}

// 移除商品
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
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
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">NT$ ${item.price}</div>
                <div class="cart-item-controls">
                    <div class="quantity-control">
                        <button onclick="updateQuantity(${item.id}, -1)">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <button class="btn-remove" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// 更新購物車總計
function updateCartTotal() {
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');
    const discountAmountEl = document.getElementById('discountAmount');
    const discountValueEl = document.getElementById('discountValue');
    
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount(subtotal);
    const total = calculateTotal();
    
    if (subtotalEl) subtotalEl.textContent = `NT$ ${subtotal}`;
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
        closeCart.addEventListener('click', () => {
            cartSidebar.classList.remove('active');
        });
    }
    
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
