// 購物車頁面 - 獨立JavaScript

let cart = [];
let discountAmount = 0;

// 頁面載入時初始化
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    renderCart();
    renderRecommendProducts();
    updateCartSummary();
});

// 載入購物車
function loadCart() {
    cart = JSON.parse(localStorage.getItem('cart') || '[]');
}

// 儲存購物車
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// 渲染購物車
function renderCart() {
    const cartItemsList = document.getElementById('cartItemsList');
    const emptyCart = document.getElementById('emptyCart');
    const itemCount = document.getElementById('cartItemCount');
    
    // 計算總商品數量
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    itemCount.textContent = `(${totalItems})`;
    
    if (cart.length === 0) {
        cartItemsList.style.display = 'none';
        emptyCart.style.display = 'flex';
        return;
    }
    
    cartItemsList.style.display = 'block';
    emptyCart.style.display = 'none';
    
    cartItemsList.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <div class="item-image">
                <img src="${item.image}" alt="${item.productName}">
            </div>
            <div class="item-details">
                <h3 class="item-name">${item.productName}</h3>
                ${item.specName ? `
                    <div class="item-spec">
                        <span class="spec-label">規格：</span>
                        <span class="spec-value">${item.specName} ${item.specInfo ? `- ${item.specInfo}` : ''}</span>
                    </div>
                ` : ''}
                <div class="item-price">NT$ ${item.price.toLocaleString()}</div>
            </div>
            <div class="item-actions">
                <div class="quantity-control">
                    <button class="qty-btn" onclick="updateQuantity(${index}, -1)">
                        <i class="fas fa-minus"></i>
                    </button>
                    <input type="number" class="qty-value" value="${item.quantity}" readonly>
                    <button class="qty-btn" onclick="updateQuantity(${index}, 1)">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <div class="item-subtotal">
                    <span class="subtotal-label">小計</span>
                    <span class="subtotal-value">NT$ ${(item.price * item.quantity).toLocaleString()}</span>
                </div>
                <button class="btn-remove" onclick="removeItem(${index})">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// 更新數量
function updateQuantity(index, delta) {
    cart[index].quantity = Math.max(1, cart[index].quantity + delta);
    saveCart();
    renderCart();
    updateCartSummary();
}

// 移除商品
function removeItem(index) {
    if (confirm('確定要移除此商品嗎？')) {
        cart.splice(index, 1);
        saveCart();
        renderCart();
        updateCartSummary();
    }
}

// 清空購物車
function clearCart() {
    if (confirm('確定要清空購物車嗎？')) {
        cart = [];
        saveCart();
        renderCart();
        updateCartSummary();
    }
}

// 更新訂單摘要
function updateCartSummary() {
    // 商品小計
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('subtotal').textContent = `NT$ ${subtotal.toLocaleString()}`;
    
    // 運費（滿1000免運）
    const shipping = subtotal >= 1000 ? 0 : 100;
    const shippingEl = document.getElementById('shipping');
    shippingEl.textContent = shipping === 0 ? '免運費' : `NT$ ${shipping}`;
    shippingEl.style.color = shipping === 0 ? '#4CAF50' : '';
    
    // 優惠折扣
    if (discountAmount > 0) {
        document.getElementById('discountRow').style.display = 'flex';
        document.getElementById('discount').textContent = `-NT$ ${discountAmount.toLocaleString()}`;
    } else {
        document.getElementById('discountRow').style.display = 'none';
    }
    
    // 總計
    const total = subtotal + shipping - discountAmount;
    document.getElementById('totalAmount').textContent = `NT$ ${total.toLocaleString()}`;
}

// 套用優惠碼
function applyPromo() {
    const promoCode = document.getElementById('promoCode').value.trim().toUpperCase();
    
    if (!promoCode) {
        alert('請輸入優惠碼');
        return;
    }
    
    // 簡單的優惠碼示範
    const promoCodes = {
        'WELCOME100': 100,
        'SAVE200': 200,
        'VIP300': 300
    };
    
    if (promoCodes[promoCode]) {
        discountAmount = promoCodes[promoCode];
        alert(`✓ 優惠碼套用成功！折扣 NT$ ${discountAmount}`);
        updateCartSummary();
    } else {
        alert('無效的優惠碼');
    }
}

// 前往結帳
function checkout() {
    if (cart.length === 0) {
        alert('購物車是空的');
        return;
    }
    
    // 儲存訂單資訊到localStorage
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= 1000 ? 0 : 100;
    const total = subtotal + shipping - discountAmount;
    
    const orderInfo = {
        items: cart,
        subtotal: subtotal,
        shipping: shipping,
        discount: discountAmount,
        total: total,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('pendingOrder', JSON.stringify(orderInfo));
    
    // 前往結帳頁
    window.location.href = 'checkout.html';
}

// 渲染推薦商品
function renderRecommendProducts() {
    const recommendGrid = document.getElementById('recommendProducts');
    
    if (typeof products === 'undefined' || products.length === 0) {
        recommendGrid.innerHTML = '<p>暫無推薦商品</p>';
        return;
    }
    
    // 取得前4個商品
    const recommendProducts = products.slice(0, 4);
    
    recommendGrid.innerHTML = recommendProducts.map(product => `
        <div class="recommend-card" onclick="location.href='product-detail.html?id=${product.id}'">
            <div class="recommend-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="recommend-info">
                <h4>${product.name}</h4>
                <div class="recommend-price">NT$ ${product.price.toLocaleString()}</div>
            </div>
        </div>
    `).join('');
}

// 更新購物車數量顯示
function updateCartCount() {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = totalCount;
        el.style.display = totalCount > 0 ? 'flex' : 'none';
    });
}

// 初始化購物車數量
updateCartCount();
