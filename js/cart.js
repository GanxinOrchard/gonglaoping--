// 購物車資料
let cart = JSON.parse(localStorage.getItem('cart')) || [];

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

// 加入購物車
function addToCart(productId, specId = null, quantity = 1) {
    // 如果第一個參數是物件（舊版相容）
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
        // 新版：使用 productId 和 specId
        const product = products.find(p => p.id === productId);
        if (!product) {
            console.error('Product not found:', productId);
            return;
        }
        
        let selectedSpec = null;
        let price = product.price;
        let specName = '';
        
        // 如果有規格
        if (specId && product.specs) {
            selectedSpec = product.specs.find(s => s.id === specId);
            if (selectedSpec) {
                price = selectedSpec.price;
                // 優先顯示 weight，其次顯示 diameter
                const specDetail = selectedSpec.weight || selectedSpec.diameter || '';
                specName = selectedSpec.name + (specDetail ? ' (' + specDetail + ')' : '');
            }
        }
        
        // 檢查是否已存在（同商品同規格）
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
        return;
    }
    
    saveCart();
    updateCartUI();
}

// 移除商品
function removeFromCart(productId, specId = null) {
    cart = cart.filter(item => !(item.id === productId && item.selectedSpecId === specId));
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
    const floatingCartCount = document.getElementById('floatingCartCount');
    
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
    
    if (floatingCartCount) {
        floatingCartCount.textContent = totalItems;
        floatingCartCount.style.display = totalItems > 0 ? 'block' : 'none';
    }
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
                <img src="${item.image || 'images/placeholder.png'}" alt="${item.name || '商品'}">
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name || '未知商品'}</div>
                ${item.selectedSpec ? `<div class="cart-item-spec">規格：${item.selectedSpec}</div>` : ''}
                <div class="cart-item-price">NT$ ${item.price || 0}</div>
                <div class="cart-item-controls">
                    <div class="quantity-control">
                        <button onclick="updateQuantity(${item.id}, -1, ${item.selectedSpecId ? "'" + item.selectedSpecId + "'" : 'null'})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span>${item.quantity || 1}</span>
                        <button onclick="updateQuantity(${item.id}, 1, ${item.selectedSpecId ? "'" + item.selectedSpecId + "'" : 'null'})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <button class="btn-remove" onclick="removeFromCart(${item.id}, ${item.selectedSpecId ? "'" + item.selectedSpecId + "'" : 'null'})">
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
    const shippingEl = document.getElementById('shippingFee');
    const totalEl = document.getElementById('total');
    const discountAmountEl = document.getElementById('discountAmount');
    const discountValueEl = document.getElementById('discountValue');
    
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount(subtotal);
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const total = Math.max(0, subtotal - discount + shipping);
    
    if (subtotalEl) subtotalEl.textContent = `NT$ ${subtotal}`;
    if (shippingEl) {
        if (shipping === 0) {
            shippingEl.innerHTML = '<span style="color: #27ae60;">免運費</span>';
        } else {
            shippingEl.textContent = `NT$ ${shipping}`;
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
    
    // 創建遮罩層（如果不存在）
    let cartOverlay = document.getElementById('cartOverlay');
    if (!cartOverlay) {
        cartOverlay = document.createElement('div');
        cartOverlay.id = 'cartOverlay';
        cartOverlay.className = 'cart-overlay';
        document.body.appendChild(cartOverlay);
    }
    
    // 購物車圖示點擊
    const cartIcon = document.getElementById('cartIcon');
    const floatingCartBtn = document.getElementById('floatingCartBtn');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.getElementById('closeCart');
    
    // 打開購物車函數
    function openCart() {
        if (cartSidebar) {
            cartSidebar.classList.add('active');
            cartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    // 關閉購物車函數
    function closeCartSidebar() {
        if (cartSidebar) {
            cartSidebar.classList.remove('active');
            cartOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    if (cartIcon && cartSidebar) {
        cartIcon.addEventListener('click', (e) => {
            e.preventDefault();
            openCart();
        });
    }
    
    // 懸浮購物車按鈕點擊
    if (floatingCartBtn && cartSidebar) {
        floatingCartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openCart();
        });
    }
    
    if (closeCart && cartSidebar) {
        closeCart.addEventListener('click', () => {
            closeCartSidebar();
        });
    }
    
    // 點擊遮罩層關閉
    if (cartOverlay) {
        cartOverlay.addEventListener('click', () => {
            closeCartSidebar();
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
            
            // 跳轉到結帳頁面或開啟結帳模態框
            const checkoutModal = document.getElementById('checkoutModal');
            if (checkoutModal) {
                // 關閉購物車側邊欄
                closeCartSidebar();
                
                // 開啟結帳模態框
                checkoutModal.style.display = 'block';
                document.body.style.overflow = 'hidden';
                
                // 更新結帳摘要
                updateCheckoutSummary();
            } else {
                // 如果沒有模態框，可以跳轉到結帳頁面
                showNotification('準備前往結帳...');
                // window.location.href = 'checkout.html';
            }
        });
    }
    
    // 關閉結帳模態框
    const closeCheckoutModal = document.getElementById('closeCheckoutModal');
    const checkoutModal = document.getElementById('checkoutModal');
    
    if (closeCheckoutModal && checkoutModal) {
        closeCheckoutModal.addEventListener('click', () => {
            checkoutModal.style.display = 'none';
            document.body.style.overflow = '';
        });
        
        // 點擊模態框外部關閉
        checkoutModal.addEventListener('click', (e) => {
            if (e.target === checkoutModal) {
                checkoutModal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }
    
    // 結帳表單提交
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleCheckout();
        });
    }
});

// 更新結帳摘要
function updateCheckoutSummary() {
    const checkoutSummary = document.getElementById('checkoutSummary');
    const checkoutTotal = document.getElementById('checkoutTotal');
    
    if (!checkoutSummary || !checkoutTotal) return;
    
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount(subtotal);
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const total = Math.max(0, subtotal - discount + shipping);
    
    checkoutSummary.innerHTML = cart.map(item => `
        <div class="checkout-item">
            <span>${item.name} ${item.selectedSpec ? '(' + item.selectedSpec + ')' : ''} x ${item.quantity}</span>
            <span>NT$ ${item.price * item.quantity}</span>
        </div>
    `).join('') + `
        <div class="checkout-item">
            <span>運費</span>
            <span>${shipping === 0 ? '免運費' : 'NT$ ' + shipping}</span>
        </div>
        ${discount > 0 ? `<div class="checkout-item discount"><span>折扣</span><span>-NT$ ${discount}</span></div>` : ''}
    `;
    
    checkoutTotal.textContent = `NT$ ${total}`;
}

// 處理結帳
function handleCheckout() {
    const name = document.getElementById('customerName').value;
    const phone = document.getElementById('customerPhone').value;
    const email = document.getElementById('customerEmail').value;
    const address = document.getElementById('customerAddress').value;
    const note = document.getElementById('customerNote').value;
    const payment = document.querySelector('input[name="payment"]:checked').value;
    
    // 建立訂單資料
    const orderData = {
        orderId: 'ORD' + Date.now(),
        customer: { name, phone, email, address, note },
        items: cart,
        payment: payment,
        subtotal: calculateSubtotal(),
        discount: calculateDiscount(calculateSubtotal()),
        shipping: calculateSubtotal() >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE,
        total: calculateSubtotal() - calculateDiscount(calculateSubtotal()) + (calculateSubtotal() >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE),
        date: new Date().toISOString()
    };
    
    // 這裡可以串接後端 API 或 Google Sheets
    console.log('訂單資料：', orderData);
    
    // 顯示成功訊息
    showNotification('訂單已送出！訂單編號：' + orderData.orderId);
    
    // 清空購物車
    clearCart();
    
    // 關閉模態框
    const checkoutModal = document.getElementById('checkoutModal');
    if (checkoutModal) {
        checkoutModal.style.display = 'none';
        document.body.style.overflow = '';
    }
    
    // 重置表單
    document.getElementById('checkoutForm').reset();
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
