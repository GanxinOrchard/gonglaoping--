// 商品頁面 - 獨立JavaScript

let allProducts = [];
let filteredProducts = [];
let currentCategory = '全部';
let currentSort = 'default';

// 頁面載入時初始化
document.addEventListener('DOMContentLoaded', function() {
    if (typeof products !== 'undefined') {
        allProducts = [...products];
        filteredProducts = [...products];
        renderProducts();
        updateProductCount();
    } else {
        showError();
    }
});

// 渲染商品
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>找不到商品</h3>
                <p>請嘗試其他搜尋條件</p>
            </div>
        `;
        return;
    }
    
    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" onclick="viewProduct(${product.id})">
            ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            
            <div class="product-image-wrapper">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <button class="quick-add-btn" onclick="quickAdd(${product.id}, event)">
                    <i class="fas fa-shopping-cart"></i> 快速購買
                </button>
            </div>
            
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-desc">${product.description}</p>
                
                ${product.hasSpecs && product.specs ? `
                    <div class="specs-preview">
                        ${product.specs.slice(0, 3).map(spec => `
                            <span class="spec-tag">${spec.name}</span>
                        `).join('')}
                        ${product.specs.length > 3 ? '<span class="spec-tag">...</span>' : ''}
                    </div>
                ` : ''}
                
                <div class="product-footer">
                    <div class="product-price">
                        <span class="price-currency">NT$</span>
                        <span class="price-amount">${product.price.toLocaleString()}</span>
                    </div>
                    <div class="product-meta">
                        ${product.salesCount ? `
                            <div class="sales-count">
                                <i class="fas fa-fire"></i>
                                <span>${product.salesCount}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// 查看商品詳情
function viewProduct(productId) {
    window.location.href = `product-detail.html?id=${productId}`;
}

// 快速加入購物車
function quickAdd(productId, event) {
    event.stopPropagation();
    
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    // 如果有規格，直接跳轉到商品詳情頁
    if (product.hasSpecs && product.specs && product.specs.length > 1) {
        window.location.href = `product-detail.html?id=${productId}`;
        return;
    }
    
    // 沒有規格或只有一個規格，直接加入購物車
    const cartItem = {
        productId: product.id,
        productName: product.name,
        specName: product.specs && product.specs.length === 1 ? product.specs[0].name : '',
        specInfo: product.specs && product.specs.length === 1 ? (product.specs[0].diameter || product.specs[0].weight) : '',
        price: product.specs && product.specs.length === 1 ? product.specs[0].price : product.price,
        quantity: 1,
        image: product.image
    };
    
    // 取得購物車
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // 檢查是否已存在
    const existingIndex = cart.findIndex(item => 
        item.productId === cartItem.productId && 
        item.specName === cartItem.specName
    );
    
    if (existingIndex >= 0) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push(cartItem);
    }
    
    // 儲存購物車
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // 更新購物車數量
    updateCartCount();
    
    // 顯示提示
    showToast('✓ 已加入購物車');
}

// 篩選商品 - 搜尋
function filterProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    filteredProducts = allProducts.filter(product => {
        const matchSearch = !searchTerm || 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm);
        
        const matchCategory = currentCategory === '全部' || 
            product.category === currentCategory ||
            (currentCategory === '預購' && product.isPreorder);
        
        return matchSearch && matchCategory;
    });
    
    applySorting();
    renderProducts();
    updateProductCount();
}

// 篩選商品 - 分類
function filterCategory(category) {
    currentCategory = category;
    
    // 更新按鈕狀態
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    filterProducts();
}

// 排序商品
function sortProducts() {
    currentSort = document.getElementById('sortSelect').value;
    applySorting();
    renderProducts();
}

// 應用排序
function applySorting() {
    switch (currentSort) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'popular':
            filteredProducts.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
            break;
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name, 'zh-TW'));
            break;
        default:
            // 預設排序（依ID）
            filteredProducts.sort((a, b) => a.id - b.id);
    }
}

// 更新商品數量顯示
function updateProductCount() {
    document.getElementById('productCount').textContent = filteredProducts.length;
}

// 更新購物車數量
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = totalCount;
        el.style.display = totalCount > 0 ? 'flex' : 'none';
    });
}

// 顯示提示訊息
function showToast(message) {
    // 創建toast元素
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 10000;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease;
    `;
    toast.textContent = message;
    
    // 添加動畫
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(toast);
    
    // 3秒後移除
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// 顯示錯誤
function showError() {
    document.getElementById('productsGrid').innerHTML = `
        <div class="empty-state">
            <i class="fas fa-exclamation-circle"></i>
            <h3>載入商品失敗</h3>
            <p>請重新整理頁面</p>
        </div>
    `;
}

// 初始化購物車數量
updateCartCount();
