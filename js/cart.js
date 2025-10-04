// ========================================
// 購物車系統 - 完全重寫版本
// 版本：2.0 - 2025-10-04
// ========================================

// 購物車資料
let cart = [];
try {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
} catch (e) {
    cart = [];
}

// 運費設定
const FREE_SHIPPING_THRESHOLD = 1800;
const SHIPPING_FEE = 150;

// 折扣碼設定
const discountCodes = {
    'WELCOME10': { type: 'percentage', value: 10, description: '新客戶優惠 10% 折扣' },
    'SAVE100': { type: 'fixed', value: 100, description: '滿額折抵 NT$100' },
    'FRUIT20': { type: 'percentage', value: 20, description: '水果專區 20% 折扣' },
    'VIP15': { type: 'percentage', value: 15, description: 'VIP會員 15% 折扣' }
};

let appliedDiscount = null;

// ========================================
// 核心功能：購物車操作
// ========================================

// 加入購物車
function addToCart(productId, specId = null, quantity = 1) {
    if (typeof productId === 'object') {
        const product = productId;
        const existingItem = cart.find(item => item.id === product.id && item.selectedSpecId === product.selectedSpecId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                ...product,
                quantity: quantity
            });
        }
    } else {
        if (typeof products === 'undefined') {
            return;
        }
        const product = products.find(p => p.id === productId);
        if (!product) {
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
    }
    
    saveCart();
    updateCartUI();
    showNotification('已加入購物車！');
}

// 更新商品數量
function updateQuantity(productId, change, specId = null) {
    const item = cart.find(item => item.id === productId && item.selectedSpecId === specId);
    
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId, specId);
    } else {
        saveCart();
        updateCartUI();
    }
}

// 從購物車移除商品
function removeFromCart(productId, specId = null) {
    cart = cart.filter(item => !(item.id === productId && item.selectedSpecId === specId));
    saveCart();
    updateCartUI();
}

// 清空購物車
function clearCart() {
    cart = [];
    saveCart();
    updateCartUI();
}

// 儲存購物車
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// 計算總計
function calculateTotal() {
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    
    let discount = 0;
    if (appliedDiscount) {
        if (appliedDiscount.type === 'percentage') {
            discount = subtotal * (appliedDiscount.value / 100);
        } else {
            discount = appliedDiscount.value;
        }
    }
    
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const total = subtotal - discount + shipping;
    
    return { subtotal, discount, shipping, total };
}

// ========================================
// UI 更新
// ========================================

// 更新購物車UI
function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartShipping = document.getElementById('cartShipping');
    const cartTotal = document.getElementById('cartTotal');
    
    // 更新購物車數量
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    
    // 更新購物車列表
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = '<div style="text-align: center; padding: 40px; color: #999;">購物車是空的</div>';
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        ${item.selectedSpec ? `<p class="item-spec">${item.selectedSpec}</p>` : ''}
                        <p class="item-price">NT$ ${item.price.toLocaleString()}</p>
                    </div>
                    <div class="cart-item-controls">
                        <button onclick="updateQuantity(${item.id}, -1, ${item.selectedSpecId || null})">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1, ${item.selectedSpecId || null})">+</button>
                    </div>
                    <button class="remove-item" onclick="removeFromCart(${item.id}, ${item.selectedSpecId || null})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `).join('');
        }
    }
    
    // 更新總計
    const totals = calculateTotal();
    if (cartSubtotal) cartSubtotal.textContent = `NT$ ${totals.subtotal.toLocaleString()}`;
    if (cartShipping) cartShipping.textContent = totals.shipping === 0 ? '免運費' : `NT$ ${totals.shipping}`;
    if (cartTotal) cartTotal.textContent = `NT$ ${totals.total.toLocaleString()}`;
}

// 顯示通知
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = 'position:fixed;top:20px;right:20px;background:#27ae60;color:white;padding:15px 25px;border-radius:8px;z-index:99999;box-shadow:0 4px 12px rgba(0,0,0,0.2);';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// ========================================
// 購物車側邊欄控制（簡化版）
// ========================================

function openCartSidebar() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    
    if (!sidebar || !overlay) return;
    
    sidebar.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCartSidebar() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    
    if (sidebar) sidebar.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
}

// ========================================
// 初始化
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // 重置頁面狀態
    document.body.style.overflow = '';
    document.body.style.position = '';
    
    // 更新UI
    updateCartUI();
    
    // 檢查是否有購物車側邊欄（只在需要的頁面設置）
    const cartSidebar = document.getElementById('cartSidebar');
    
    if (!cartSidebar) {
        // 沒有側邊欄的頁面（如結帳頁面），直接返回
        return;
    }
    
    // 確保遮罩層存在
    let cartOverlay = document.getElementById('cartOverlay');
    if (!cartOverlay) {
        cartOverlay = document.createElement('div');
        cartOverlay.id = 'cartOverlay';
        cartOverlay.className = 'cart-overlay';
        document.body.appendChild(cartOverlay);
    }
    
    // 購物車圖示點擊事件
    const cartIcon = document.getElementById('cartIcon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            openCartSidebar();
        });
    }
    
    // 懸浮購物車按鈕
    const floatingCartBtn = document.getElementById('floatingCartBtn');
    if (floatingCartBtn) {
        floatingCartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openCartSidebar();
        });
    }
    
    // 關閉按鈕
    const closeCart = document.getElementById('closeCart');
    if (closeCart) {
        closeCart.addEventListener('click', closeCartSidebar);
    }
    
    // 點擊遮罩關閉
    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCartSidebar);
    }
    
    // 結帳按鈕
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (cart.length === 0) {
                showNotification('購物車是空的！');
                return;
            }
            closeCartSidebar();
            setTimeout(() => {
                window.location.href = 'checkout.html';
            }, 300);
        });
    }
    
    // 折扣碼
    const applyDiscountBtn = document.getElementById('applyDiscount');
    const discountCodeInput = document.getElementById('discountCode');
    
    if (applyDiscountBtn && discountCodeInput) {
        applyDiscountBtn.addEventListener('click', function() {
            const code = discountCodeInput.value.trim().toUpperCase();
            const discount = discountCodes[code];
            
            if (discount) {
                appliedDiscount = discount;
                showNotification(`✅ ${discount.description}`);
                updateCartUI();
            } else {
                showNotification('❌ 無效的折扣碼');
            }
        });
    }
});
