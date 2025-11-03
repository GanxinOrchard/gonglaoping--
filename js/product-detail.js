// 從 products.js 匯入商品資料
// 確保 products.js 先載入

// 獲取 URL 參數中的商品 ID
function getProductIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('id'));
}

// 根據 ID 查找商品
function getProductById(id) {
    return products.find(p => p.id === id);
}

// 渲染商品詳情
function renderProductDetail(product) {
    const container = document.getElementById('productDetailContainer');
    
    if (!product) {
        container.innerHTML = `
            <div class="product-not-found">
                <i class="fas fa-exclamation-triangle"></i>
                <h2>找不到商品</h2>
                <p>抱歉，您查看的商品不存在或已下架</p>
                <a href="products.html" class="btn-primary">返回商品列表</a>
            </div>
        `;
        return;
    }
    
    // 更新頁面標題和 meta
    document.title = `${product.name} - 柑心果園`;
    document.getElementById('pageTitle').textContent = `${product.name} - 柑心果園`;
    document.getElementById('pageDescription').content = product.description;
    
    // 更新麵包屑
    const breadcrumbProductName = document.getElementById('breadcrumbProductName');
    if (breadcrumbProductName) {
        breadcrumbProductName.textContent = product.name;
    }
    
    // 建立規格選項 HTML
    let specsHtml = '';
    if (product.hasSpecs && product.specs && product.specs.length > 0) {
        specsHtml = `
            <div class="product-specs">
                <h3>選擇規格</h3>
                <div class="specs-grid">
                    ${product.specs.map((spec, index) => `
                        <div class="spec-option ${index === 0 ? 'active' : ''}" data-spec-id="${spec.id}" data-price="${spec.price}">
                            <div class="spec-name">${spec.name}</div>
                            ${spec.diameter ? `<div class="spec-detail">直徑：${spec.diameter}</div>` : ''}
                            <div class="spec-weight">${spec.weight}</div>
                            <div class="spec-price">NT$ ${spec.price.toLocaleString()}</div>
                            ${spec.description ? `<div class="spec-description">${spec.description}</div>` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // 建立圖片輪播 HTML
    let imagesHtml = '';
    if (product.images && product.images.length > 0) {
        imagesHtml = `
            <div class="product-image-gallery">
                <div class="main-image">
                    <img src="${product.images[0]}" alt="${product.name}" id="mainImage">
                    ${product.badge ? `<span class="product-badge ${product.badge === '預購' ? 'preorder-badge' : product.badge === '熱銷' ? 'hot-badge' : 'new-badge'}">${product.badge}</span>` : ''}
                </div>
                <div class="thumbnail-images">
                    ${product.images.map((img, index) => `
                        <img src="${img}" alt="${product.name}" class="thumbnail ${index === 0 ? 'active' : ''}" data-index="${index}">
                    `).join('')}
                </div>
            </div>
        `;
    } else {
        imagesHtml = `
            <div class="product-image-gallery">
                <div class="main-image">
                    <img src="${product.image}" alt="${product.name}" id="mainImage">
                    ${product.badge ? `<span class="product-badge ${product.badge === '預購' ? 'preorder-badge' : product.badge === '熱銷' ? 'hot-badge' : 'new-badge'}">${product.badge}</span>` : ''}
                </div>
            </div>
        `;
    }
    
    // 建立商品詳細介紹圖片
    let detailImagesHtml = '';
    if (product.detailImages && product.detailImages.length > 0) {
        detailImagesHtml = `
            <div class="product-detail-images">
                <h3>商品詳細介紹</h3>
                ${product.detailImages.map(img => `
                    <img src="${img}" alt="${product.name} 詳細介紹" loading="lazy">
                `).join('')}
            </div>
        `;
    }
    
    // 建立料理示範圖片（菱角專用）
    let cookingImagesHtml = '';
    if (product.cookingImages && product.cookingImages.length > 0) {
        cookingImagesHtml = `
            <div class="cooking-images-section">
                <h3>料理示範</h3>
                <div class="cooking-grid">
                    ${product.cookingImages.map(item => `
                        <div class="cooking-card">
                            <img src="${item.image}" alt="${item.title}" loading="lazy">
                            <h4>${item.title}</h4>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // 初始價格（第一個規格或基礎價格）
    const initialPrice = product.hasSpecs && product.specs ? product.specs[0].price : product.price;
    
    // 渲染完整內容
    container.innerHTML = `
        <div class="product-detail-content">
            <div class="product-main">
                ${imagesHtml}
                
                <div class="product-info">
                    <div class="product-header">
                        <span class="product-category">${product.category}</span>
                        <h1 class="product-name">${product.name}</h1>
                        <p class="product-description">${product.description}</p>
                    </div>
                    
                    <div class="product-price-section">
                        <div class="current-price">
                            <span class="currency">NT$</span>
                            <span class="amount" id="currentPrice">${initialPrice.toLocaleString()}</span>
                            ${product.hasSpecs ? '<span class="price-suffix">起</span>' : ''}
                        </div>
                        ${product.salesCount ? `<div class="sales-count"><i class="fas fa-fire"></i> 已售出 ${product.salesCount} 件</div>` : ''}
                    </div>
                    
                    ${specsHtml}
                    
                    <div class="product-shipping-info">
                        <div class="shipping-item">
                            <i class="fas fa-shipping-fast"></i>
                            <span>配送方式：${product.shippingMethod || '常溫宅配'}</span>
                        </div>
                        ${product.weight ? `
                        <div class="shipping-item">
                            <i class="fas fa-weight"></i>
                            <span>重量：${product.weight}</span>
                        </div>
                        ` : ''}
                    </div>
                    
                    <div class="quantity-selector">
                        <label>數量：</label>
                        <div class="quantity-controls">
                            <button class="qty-btn minus" id="qtyMinus">-</button>
                            <input type="number" id="quantity" value="1" min="1" max="99">
                            <button class="qty-btn plus" id="qtyPlus">+</button>
                        </div>
                    </div>
                    
                    <div class="product-actions">
                        <button class="btn-add-to-cart" id="addToCartBtn">
                            <i class="fas fa-shopping-cart"></i>
                            加入購物車
                        </button>
                        <button class="btn-buy-now" id="buyNowBtn">
                            <i class="fas fa-bolt"></i>
                            立即購買
                        </button>
                    </div>
                </div>
            </div>
            
            ${detailImagesHtml}
            ${cookingImagesHtml}
        </div>
    `;
    
    // 初始化事件監聽器
    initEventListeners(product);
}

// 初始化事件監聽器
function initEventListeners(product) {
    // 圖片縮圖點擊
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('mainImage');
    
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            mainImage.src = product.images[index];
            
            // 更新活動狀態
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // 規格選擇
    const specOptions = document.querySelectorAll('.spec-option');
    const currentPriceEl = document.getElementById('currentPrice');
    let selectedSpec = product.hasSpecs && product.specs ? product.specs[0] : null;
    
    specOptions.forEach(option => {
        option.addEventListener('click', function() {
            // 更新選中狀態
            specOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            // 更新價格
            const price = parseInt(this.dataset.price);
            currentPriceEl.textContent = price.toLocaleString();
            
            // 記錄選中的規格
            const specId = this.dataset.specId;
            selectedSpec = product.specs.find(s => s.id === specId);
        });
    });
    
    // 數量控制
    const qtyInput = document.getElementById('quantity');
    const qtyMinus = document.getElementById('qtyMinus');
    const qtyPlus = document.getElementById('qtyPlus');
    
    qtyMinus.addEventListener('click', () => {
        const currentQty = parseInt(qtyInput.value);
        if (currentQty > 1) {
            qtyInput.value = currentQty - 1;
        }
    });
    
    qtyPlus.addEventListener('click', () => {
        const currentQty = parseInt(qtyInput.value);
        if (currentQty < 99) {
            qtyInput.value = currentQty + 1;
        }
    });
    
    // 加入購物車
    const addToCartBtn = document.getElementById('addToCartBtn');
    addToCartBtn.addEventListener('click', () => {
        const quantity = parseInt(qtyInput.value);
        const price = selectedSpec ? selectedSpec.price : product.price;
        const specName = selectedSpec ? selectedSpec.name : '';
        
        const cartItem = {
            id: product.id,
            name: product.name,
            price: price,
            quantity: quantity,
            image: product.image,
            selectedSpec: specName,
            selectedSpecId: selectedSpec ? selectedSpec.id : null,
            shippingType: product.shippingType || 'normal'
        };
        
        // 加入購物車（使用 cart.js 的功能）
        if (typeof addToCart === 'function') {
            addToCart(cartItem);
            alert(`已將 ${product.name} ${specName} x ${quantity} 加入購物車`);
        } else {
            // 如果 cart.js 還沒載入，存到 localStorage
            let cart = JSON.parse(localStorage.getItem('ganxin_cart') || localStorage.getItem('cart') || '[]');
            
            // 檢查是否已有相同商品和規格
            const existingItemIndex = cart.findIndex(item => 
                item.id === cartItem.id && item.selectedSpecId === cartItem.selectedSpecId
            );
            
            if (existingItemIndex !== -1) {
                cart[existingItemIndex].quantity += quantity;
            } else {
                cart.push(cartItem);
            }
            
            localStorage.setItem('ganxin_cart', JSON.stringify(cart));
            localStorage.setItem('cart', JSON.stringify(cart)); // 同步舊 key
            
            // 更新購物車數量顯示
            updateCartCount();
            
            alert(`已將 ${product.name} ${specName} x ${quantity} 加入購物車`);
        }
    });
    
    // 立即購買
    const buyNowBtn = document.getElementById('buyNowBtn');
    buyNowBtn.addEventListener('click', () => {
        const quantity = parseInt(qtyInput.value);
        const price = selectedSpec ? selectedSpec.price : product.price;
        const specName = selectedSpec ? selectedSpec.name : '';
        
        const cartItem = {
            id: product.id,
            name: product.name,
            price: price,
            quantity: quantity,
            image: product.image,
            selectedSpec: specName,
            selectedSpecId: selectedSpec ? selectedSpec.id : null,
            shippingType: product.shippingType || 'normal'
        };
        
        // 清空購物車，只保留當前商品
        localStorage.setItem('ganxin_cart', JSON.stringify([cartItem]));
        localStorage.setItem('cart', JSON.stringify([cartItem])); // 同步舊 key
        
        // 跳轉到結帳頁
        window.location.href = 'checkout.html';
    });
}

// 更新購物車數量顯示
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('ganxin_cart') || localStorage.getItem('cart') || '[]');
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(el => {
        el.textContent = totalCount;
        el.style.display = totalCount > 0 ? 'flex' : 'none';
    });
}

// 頁面載入時執行
document.addEventListener('DOMContentLoaded', () => {
    const productId = getProductIdFromUrl();
    
    // 等待 products 資料載入
    if (typeof products !== 'undefined') {
        const product = getProductById(productId);
        renderProductDetail(product);
        updateCartCount();
    } else {
        // 如果 products 還沒載入，等待一下
        setTimeout(() => {
            if (typeof products !== 'undefined') {
                const product = getProductById(productId);
                renderProductDetail(product);
                updateCartCount();
            } else {
                document.getElementById('productDetailContainer').innerHTML = `
                    <div class="product-not-found">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h2>載入失敗</h2>
                        <p>無法載入商品資料，請稍後再試</p>
                        <a href="products.html" class="btn-primary">返回商品列表</a>
                    </div>
                `;
            }
        }, 500);
    }
});
