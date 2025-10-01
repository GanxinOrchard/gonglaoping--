// 商品資料
const products = [
    {
        id: 1,
        name: '公老坪椪柑 10斤裝',
        category: '優質水果',
        price: 880,
        image: 'images/10斤產品圖片.png',
        description: '皮薄好剝、酸甜平衡、果香乾淨。冷藏後更清爽',
        badge: '熱銷'
    },
    {
        id: 2,
        name: '公老坪椪柑（果實）',
        category: '優質水果',
        price: 680,
        image: 'images/商品一(椪柑果實).jpg',
        description: '百年果園傳承，甜度穩、風味正、放心給家人吃',
        badge: '推薦'
    },
    {
        id: 3,
        name: '東勢茂谷柑',
        category: '優質水果',
        price: 950,
        image: 'images/商品二(茂谷柑).png',
        description: '皮薄多汁、細嫩飽滿、色澤橙亮。4刀6塊，好吃不沾手',
        badge: '新品'
    },
];

// 渲染商品列表
function renderProducts(productsToRender = products) {
    const productsGrid = document.getElementById('productsGrid');
    
    if (!productsGrid) return;
    
    productsGrid.innerHTML = productsToRender.map(product => `
        <div class="product-card" data-id="${product.id}">
            <a href="product-detail.html?id=${product.id}" class="product-link">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                </div>
                <div class="product-info">
                    <div class="product-category">${product.category}</div>
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-footer">
                        <div class="product-price">
                            <span class="currency">NT$</span> ${product.price}
                        </div>
                    </div>
                </div>
            </a>
            <div class="product-actions">
                <a href="product-detail.html?id=${product.id}" class="btn-view-detail">
                    <i class="fas fa-info-circle"></i> 商品詳情
                </a>
            </div>
        </div>
    `).join('');
}

// 搜尋商品
function searchProducts(query) {
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
    );
    
    renderProducts(filteredProducts);
}

// 渲染分類商品輪播
function renderCategoryCarousel() {
    const fruitProducts = products.filter(p => p.category === '優質水果');
    const giftProducts = products.filter(p => p.category === '禮盒專區');
    const vegetableProducts = products.filter(p => p.category === '新鮮蔬菜');
    
    renderCarouselProducts('fruitCarousel', fruitProducts);
    renderCarouselProducts('giftCarousel', giftProducts.length > 0 ? giftProducts : fruitProducts);
    renderCarouselProducts('vegetableCarousel', vegetableProducts.length > 0 ? vegetableProducts : fruitProducts);
}

function renderCarouselProducts(containerId, productsToRender) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = productsToRender.map(product => `
        <div class="product-card" data-id="${product.id}">
            <a href="product-detail.html?id=${product.id}" class="product-link">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                </div>
                <div class="product-info">
                    <div class="product-category">${product.category}</div>
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-footer">
                        <div class="product-price">
                            <span class="currency">NT$</span> ${product.price}
                        </div>
                    </div>
                </div>
            </a>
            <div class="product-actions">
                <a href="product-detail.html?id=${product.id}" class="btn-view-detail">
                    <i class="fas fa-info-circle"></i> 商品詳情
                </a>
            </div>
        </div>
    `).join('');
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    renderCategoryCarousel();
    
    // Tab切換功能
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            
            // 移除所有active
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            // 添加active
            this.classList.add('active');
            document.getElementById(tabName + '-tab').classList.add('active');
        });
    });
    
    // 分類按鈕篩選
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.dataset.category;
            
            // 移除所有active
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 篩選商品
            if (category === '全部') {
                renderProducts(products);
            } else {
                const filtered = products.filter(p => p.category === category);
                renderProducts(filtered);
            }
            
            // 滾動到商品區
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // 搜尋功能
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', () => {
            searchProducts(searchInput.value);
        });
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchProducts(searchInput.value);
            }
        });
    }
});
