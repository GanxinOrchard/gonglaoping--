// 商品資料
const products = [
    {
        id: 1,
        name: '公老坪椪柑',
        category: '優質水果',
        price: 680,
        image: 'images/商品一(椪柑果實).jpg',
        images: [
            'images/商品一(椪柑果實).jpg',
            'images/商品一(椪柑果實).jpg',
            'images/商品一(椪柑果實).jpg',
            'images/商品一(椪柑果實).jpg',
            'images/商品一(椪柑果實).jpg'
        ],
        description: '皮薄好剝、酸甜平衡、果香乾淨。冷藏後更清爽',
        badge: '熱銷',
        salesCount: 1250,
        shippingType: 'normal',
        hasSpecs: true,
        specs: [
            { id: '23A', name: '23A', diameter: '7.3-7.5 cm', price: 680 },
            { id: '25A', name: '25A', diameter: '7.6-7.8 cm', price: 780 },
            { id: '27A', name: '27A', diameter: '7.9-8.1 cm', price: 880 },
            { id: '30A', name: '30A', diameter: '8.2-8.5 cm', price: 980 }
    },
    {
        id: 2,
        name: '東勢茂谷柑',
        category: '優質水果',
        price: 850,
        image: 'images/商品二(茂谷柑).png',
        images: [
            'images/商品二(茂谷柑).png',
            'images/商品二(茂谷柑).png',
            'images/商品二(茂谷柑).png',
            'images/商品二(茂谷柑).png',
            'images/商品二(茂谷柑).png'
        ],
        description: '果肉飽滿、香氣濃郴、甜度高。送禮自用兩相宜',
        badge: '推薦',
        salesCount: 980,
        shippingType: 'normal',
        hasSpecs: true,
        specs: [
            { id: '23A', name: '23A', diameter: '7.3-7.5 cm', price: 850 },
            { id: '25A', name: '25A', diameter: '7.6-7.8 cm', price: 950 },
            { id: '27A', name: '27A', diameter: '7.9-8.1 cm', price: 1050 },
            { id: '30A', name: '30A', diameter: '8.2-8.5 cm', price: 1150 }
        ]
    },
    {
        id: 3,
        name: '菱角仁（整件）',
        category: '新鮮蔬菜',
        price: 3500,
        image: 'images/新鮮蔬果菱角仁.jpg',
        description: '3公斤 / 4包 / 1件｜效期：冷凍12個月｜保存：-18°C 冷凍',
        badge: '批發',
        salesCount: 95,
        shippingType: 'frozen',
        weight: '3公斤x4包',
        hasSpecs: false
    },
    {
        id: 4,
        name: '菱角仁（單品項）',
        category: '新鮮蔬菜',
        price: 990,
        image: 'images/新鮮蔬果菱角仁.jpg',
        description: '3公斤 / 1包｜效期：冷凍12個月｜保存：-18°C 冷凍',
        badge: '熱銷',
        salesCount: 210,
        shippingType: 'frozen',
        weight: '3公斤',
        hasSpecs: false
    },
    {
        id: 5,
        name: '菱角仁(斤)（單品項）',
        category: '新鮮蔬菜',
        price: 240,
        image: 'images/新鮮蔬果菱角仁.jpg',
        description: '每斤（約600g）｜效期：冷凍12個月｜保存：-18°C 冷凍',
        badge: '經濟',
        salesCount: 1066,
        shippingType: 'frozen',
        weight: '600g',
        hasSpecs: false
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
                    ${product.badge ? `<span class="badge">${product.badge}</span>` : ''}
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">
                        <span class="currency">NT$</span>
                        <span class="amount">${product.price}</span>
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

// 依分類篩選
function filterByCategory(category) {
    if (category === '全部') {
        renderProducts();
    } else {
        const filtered = products.filter(p => p.category === category);
        renderProducts(filtered);
    }
}

// 搜尋商品
function searchProducts(query) {
    if (!query.trim()) {
        renderProducts();
        return;
    }
    
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
    const vegetableProducts = products.filter(p => p.category === '新鮮蔬菜');
    
    renderCarouselProducts('fruitCarousel', fruitProducts);
    renderCarouselProducts('vegetableCarousel', vegetableProducts);
}

function renderCarouselProducts(containerId, productsToRender) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = productsToRender.map(product => `
        <div class="product-card" data-id="${product.id}">
            <a href="product-detail.html?id=${product.id}" class="product-link">
                <div class="product-image">
                    ${product.badge ? `<span class="badge">${product.badge}</span>` : ''}
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">
                        <span class="currency">NT$</span>
                        <span class="amount">${product.price}</span>
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
    
    // 分類篩選
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const category = btn.dataset.category;
            filterByCategory(category);
            
            // 更新按鈕狀態
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
    
    // Tab 切換
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            
            // 更新按鈕狀態
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // 更新內容顯示
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${tab}-tab`).classList.add('active');
        });
    });
    
    // 初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('Products loaded:', products.length);
    
    // 渲染商品
    renderProducts();
    
    // 渲染分類輪播
    renderCategoryCarousel();
    
    // 分類篩選按鈕
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
