// 商品資料
const products = [
    {
        id: 1,
        name: '公老坪椪柑 10斤裝',
        category: '優質水果',
        price: 680,
        image: 'images/椪柑產品圖/椪柑1.jpg',
        images: [
            'images/椪柑產品圖/椪柑1.jpg',
            'images/椪柑產品圖/椪柑2.jpg',
            'images/椪柑產品圖/椪柑3.png',
            'images/椪柑產品圖/椪柑4.png',
            'images/椪柑產品圖/椪柑5.png'
        ],
        description: '皮薄好剝、酸甜平衡、果香乾淨｜冷藏後更清爽｜產地直送',
        badge: '熱銷',
        salesCount: 1250,
        shippingType: 'normal',
        weight: '10台斤/箱',
        hasSpecs: true,
        specs: [
            { id: '23A', name: '23A', diameter: 'Ø 6.7-7.3 cm', price: 680 },
            { id: '25A', name: '25A', diameter: 'Ø 7.3-7.9 cm', price: 780 },
            { id: '27A', name: '27A', diameter: 'Ø 7.9-8.5 cm', price: 880 },
            { id: '30A', name: '30A', diameter: 'Ø 8.5-9.5 cm', price: 980 }
        ],
        detailImages: [
            'images/椪柑產品圖/椪柑商品介紹1.png',
            'images/椪柑產品圖/椪柑商品介紹2.png',
            'images/椪柑產品圖/椪柑商品介紹3.png'
        ]
    },
    {
        id: 2,
        name: '東勢茂谷柑 10斤裝',
        category: '優質水果',
        price: 850,
        image: 'images/茂谷柑產品圖/茂谷柑1.png',
        images: [
            'images/茂谷柑產品圖/茂谷柑1.png',
            'images/茂谷柑產品圖/茂谷柑2.png',
            'images/茂谷柑產品圖/茂谷柑3.png',
            'images/茂谷柑產品圖/茂谷柑4.png',
            'images/茂谷柑產品圖/茂谷柑5.png'
        ],
        description: '果肉飽滿、香氣濃郁、甜度高｜送禮自用兩相宜｜產地直送',
        badge: '推薦',
        salesCount: 980,
        shippingType: 'normal',
        weight: '10台斤/箱',
        hasSpecs: true,
        specs: [
            { id: '23A', name: '23A', diameter: 'Ø 6.7-7.3 cm', price: 850 },
            { id: '25A', name: '25A', diameter: 'Ø 7.3-7.9 cm', price: 950 },
            { id: '27A', name: '27A', diameter: 'Ø 7.9-8.5 cm', price: 1050 },
            { id: '30A', name: '30A', diameter: 'Ø 8.5-9.5 cm', price: 1150 }
        ],
        detailImages: [
            'images/茂谷柑產品圖/茂谷柑商品介紹1.png',
            'images/茂谷柑產品圖/茂谷柑商品介紹2.png',
            'images/茂谷柑產品圖/茂谷柑商品介紹3.png'
        ]
    },
    {
        id: 3,
        name: '冷凍菱角仁（整件）',
        category: '新鮮蔬果',
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
        name: '冷凍菱角仁（單品項）',
        category: '新鮮蔬果',
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
        name: '冷凍菱角仁(斤)（單品項）',
        category: '新鮮蔬果',
        price: 240,
        image: 'images/新鮮蔬果菱角仁.jpg',
        description: '每斤（約600g）｜效期：冷凍12個月｜保存：-18°C 冷凍',
        badge: '經濟',
        salesCount: 1066,
        shippingType: 'frozen',
        weight: '600g',
        hasSpecs: false
    },
    {
        id: 6,
        name: '冷凍大甲芋角',
        category: '新鮮蔬果',
        price: 280,
        image: 'images/新鮮蔔果芋角2CM.jpg',
        description: '新鮮大甲芋角｜每袋約600g｜效期：冷凍12個月｜保存：-18°C 冷凍',
        badge: '新品',
        salesCount: 50,
        shippingType: 'frozen',
        weight: '600g',
        hasSpecs: false
    }
]

// 渲染商品列表
function renderProducts(productsToRender = products) {
    const productsGrid = document.getElementById('productsGrid');
    
    if (!productsGrid) {
        console.log('productsGrid not found');
        return;
    }
    
    console.log('Rendering products:', productsToRender.length);
    
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
    const vegetableProducts = products.filter(p => p.category === '新鮮蔬果');
    
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

// 商品輪播功能
let currentProductIndex = 0;
let autoPlayInterval = null;

function initProductCarousel() {
    const productsGrid = document.getElementById('productsGrid');
    const prevBtn = document.getElementById('productsPrev');
    const nextBtn = document.getElementById('productsNext');
    
    if (!productsGrid || !prevBtn || !nextBtn) return;
    
    // 左右按鈕點擊
    prevBtn.addEventListener('click', () => {
        stopAutoPlay();
        showPreviousProducts();
        startAutoPlay();
    });
    
    nextBtn.addEventListener('click', () => {
        stopAutoPlay();
        showNextProducts();
        startAutoPlay();
    });
    
    // 開始自動輪播
    startAutoPlay();
}

function showPreviousProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    if (currentProductIndex > 0) {
        currentProductIndex--;
        updateCarouselPosition();
    }
}

function showNextProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    const maxIndex = products.length - 3;
    if (currentProductIndex < maxIndex) {
        currentProductIndex++;
        updateCarouselPosition();
    } else {
        // 回到開始
        currentProductIndex = 0;
        updateCarouselPosition();
    }
}

function updateCarouselPosition() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    const cardWidth = productsGrid.querySelector('.product-card')?.offsetWidth || 300;
    const gap = 30;
    const offset = currentProductIndex * (cardWidth + gap);
    
    productsGrid.style.transform = `translateX(-${offset}px)`;
}

function startAutoPlay() {
    stopAutoPlay();
    autoPlayInterval = setInterval(() => {
        showNextProducts();
    }, 5000); // 每5秒自動切換
}

function stopAutoPlay() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('Products script loaded');
    console.log('Products count:', products.length);
    
    // 渲染所有商品（輪播會顯示3個）
    renderProducts();
    
    // 初始化輪播功能（只在桌面版）
    const isHomePage = window.location.pathname === '/' || window.location.pathname.includes('index.html');
    if (isHomePage && window.innerWidth > 768) {
        initProductCarousel();
    }
    
    // 渲染分類輪播
    renderCategoryCarousel();
    
    // 分類篩選按鈕
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const category = btn.dataset.category;
            filterByCategory(category);
        });
    });
    
    // 視窗大小改變時重新計算位置
    window.addEventListener('resize', () => {
        updateCarouselPosition();
    });
});
