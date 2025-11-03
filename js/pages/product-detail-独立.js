// 商品詳情頁 - 獨立JavaScript
// 不影響其他頁面

let currentProduct = null;
let selectedSpec = null;
let currentQuantity = 1;

// 頁面載入時初始化
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    if (productId && typeof products !== 'undefined') {
        currentProduct = products.find(p => p.id === productId);
        if (currentProduct) {
            renderProduct();
            renderRecommendProducts();
        } else {
            showError('找不到商品');
        }
    } else {
        showError('商品ID無效');
    }
});

// 渲染商品資訊
function renderProduct() {
    // 更新頁面標題
    document.title = `${currentProduct.name} - 柑心果園`;
    document.getElementById('pageTitle').textContent = `${currentProduct.name} - 柑心果園`;
    document.getElementById('pageDescription').setAttribute('content', currentProduct.description);
    
    // 麵包屑
    document.getElementById('breadcrumbProductName').textContent = currentProduct.name;
    
    // 商品徽章
    if (currentProduct.badge) {
        document.getElementById('productBadge').textContent = currentProduct.badge;
    }
    
    // 商品名稱和描述
    document.getElementById('productName').textContent = currentProduct.name;
    document.getElementById('productDesc').textContent = currentProduct.description;
    
    // 銷售數量
    document.getElementById('salesCount').textContent = currentProduct.salesCount || 0;
    
    // 配送方式
    document.getElementById('shippingMethod').textContent = currentProduct.shippingMethod;
    
    // 圖片
    renderImages();
    
    // 規格
    if (currentProduct.hasSpecs && currentProduct.specs && currentProduct.specs.length > 0) {
        renderSpecs();
        // 預設選擇第一個規格
        selectSpec(0);
    } else {
        // 沒有規格，直接顯示價格
        document.getElementById('displayPrice').textContent = currentProduct.price.toLocaleString();
        document.querySelector('.spec-section').style.display = 'none';
    }
    
    // 詳細圖片
    renderDetailImages();
}

// 渲染商品圖片
function renderImages() {
    const images = currentProduct.images || [currentProduct.image];
    const mainImage = document.getElementById('mainImage');
    const thumbnailList = document.getElementById('thumbnailList');
    
    // 設置主圖
    mainImage.src = images[0];
    mainImage.alt = currentProduct.name;
    
    // 生成縮圖
    thumbnailList.innerHTML = images.map((img, index) => `
        <div class="thumbnail ${index === 0 ? 'active' : ''}" onclick="changeMainImage(${index})">
            <img src="${img}" alt="${currentProduct.name}">
        </div>
    `).join('');
}

// 切換主圖
function changeMainImage(index) {
    const images = currentProduct.images || [currentProduct.image];
    document.getElementById('mainImage').src = images[index];
    
    // 更新縮圖active狀態
    document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}

// 渲染規格選項
function renderSpecs() {
    const specOptions = document.getElementById('specOptions');
    
    specOptions.innerHTML = currentProduct.specs.map((spec, index) => `
        <button class="spec-btn" onclick="selectSpec(${index})">
            <div class="spec-btn-title">${spec.name}</div>
            <div class="spec-btn-info">${spec.diameter || spec.weight}</div>
            <div class="spec-btn-info">NT$ ${spec.price.toLocaleString()}</div>
        </button>
    `).join('');
}

// 選擇規格
function selectSpec(index) {
    selectedSpec = currentProduct.specs[index];
    
    // 更新按鈕狀態
    document.querySelectorAll('.spec-btn').forEach((btn, i) => {
        btn.classList.toggle('active', i === index);
    });
    
    // 更新價格
    document.getElementById('displayPrice').textContent = selectedSpec.price.toLocaleString();
    
    // 更新規格說明
    const specInfo = document.getElementById('specInfo');
    if (selectedSpec.description) {
        specInfo.innerHTML = `<strong>${selectedSpec.name}</strong> - ${selectedSpec.description}`;
        specInfo.style.display = 'block';
    } else {
        specInfo.style.display = 'none';
    }
}

// 改變數量
function changeQuantity(delta) {
    currentQuantity = Math.max(1, currentQuantity + delta);
    document.getElementById('quantity').value = currentQuantity;
}

// 渲染詳細圖片
function renderDetailImages() {
    const detailImages = document.getElementById('detailImages');
    
    if (currentProduct.detailImages && currentProduct.detailImages.length > 0) {
        detailImages.innerHTML = currentProduct.detailImages.map(img => `
            <img src="${img}" alt="${currentProduct.name} 商品說明">
        `).join('');
    } else if (currentProduct.cookingImages && currentProduct.cookingImages.length > 0) {
        detailImages.innerHTML = currentProduct.cookingImages.map(item => `
            <div>
                <h4>${item.title}</h4>
                <img src="${item.image}" alt="${item.title}">
            </div>
        `).join('');
    } else {
        detailImages.innerHTML = '<p>商品詳細說明將陸續更新</p>';
    }
}

// 渲染推薦商品
function renderRecommendProducts() {
    const recommendGrid = document.getElementById('recommendProducts');
    
    // 取得其他商品（排除當前商品）
    const otherProducts = products.filter(p => p.id !== currentProduct.id).slice(0, 4);
    
    recommendGrid.innerHTML = otherProducts.map(product => `
        <div class="recommend-card" onclick="location.href='product-detail.html?id=${product.id}'">
            <div class="recommend-card-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="recommend-card-info">
                <div class="recommend-card-name">${product.name}</div>
                <div class="recommend-card-price">NT$ ${product.price.toLocaleString()}</div>
            </div>
        </div>
    `).join('');
}

// 切換Tab
function switchTab(index) {
    document.querySelectorAll('.tab-btn').forEach((btn, i) => {
        btn.classList.toggle('active', i === index);
    });
    
    document.querySelectorAll('.tab-content').forEach((content, i) => {
        content.classList.toggle('active', i === index);
    });
}

// 加入購物車
function addToCart() {
    if (!selectedSpec && currentProduct.hasSpecs) {
        alert('請選擇規格');
        return;
    }
    
    const cartItem = {
        productId: currentProduct.id,
        productName: currentProduct.name,
        specName: selectedSpec ? selectedSpec.name : '',
        specInfo: selectedSpec ? (selectedSpec.diameter || selectedSpec.weight) : '',
        price: selectedSpec ? selectedSpec.price : currentProduct.price,
        quantity: currentQuantity,
        image: currentProduct.image
    };
    
    // 取得購物車
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // 檢查是否已存在相同商品和規格
    const existingIndex = cart.findIndex(item => 
        item.productId === cartItem.productId && 
        item.specName === cartItem.specName
    );
    
    if (existingIndex >= 0) {
        // 增加數量
        cart[existingIndex].quantity += cartItem.quantity;
    } else {
        // 新增商品
        cart.push(cartItem);
    }
    
    // 儲存購物車
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // 更新購物車數量顯示
    updateCartCount();
    
    // 顯示成功訊息
    alert('✓ 已加入購物車');
}

// 立即購買
function buyNow() {
    addToCart();
    window.location.href = 'cart.html';
}

// 更新購物車數量
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // 更新所有購物車數量顯示
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = totalCount;
        el.style.display = totalCount > 0 ? 'flex' : 'none';
    });
}

// 顯示錯誤
function showError(message) {
    document.querySelector('.product-container').innerHTML = `
        <div style="text-align: center; padding: 100px 20px;">
            <i class="fas fa-exclamation-circle" style="font-size: 4rem; color: #ff6b35; margin-bottom: 20px;"></i>
            <h2 style="color: #333; margin-bottom: 15px;">${message}</h2>
            <p style="color: #666; margin-bottom: 30px;">請返回商品列表重新選擇</p>
            <a href="products.html" style="
                display: inline-block;
                padding: 12px 30px;
                background: #ff6b35;
                color: white;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
            ">返回商品列表</a>
        </div>
    `;
}

// 初始化購物車數量
updateCartCount();
