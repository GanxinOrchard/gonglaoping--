// 商品資料
const products = [
    {
        id: 1,
        name: '公老坪椪柑',
        category: '優質水果',
        price: 699,
        image: 'images/products/ponkan/gallery/椪柑1.jpg',
        alt: '公老坪椪柑，果皮橙黃，果實飽滿，皮薄好剝',
        images: [
            'images/products/ponkan/gallery/椪柑1.jpg',
            'images/products/ponkan/gallery/椪柑2.jpg',
            'images/products/ponkan/gallery/椪柑3.png',
            'images/products/ponkan/gallery/椪柑4.png',
            'images/products/ponkan/gallery/椪柑5.png'
        ],
        description: '皮薄好剝、酸甜平衡、果香乾淨｜冷藏後更清爽｜產地直送',
        detailedDescription: '公老坪椪柑產自台中東勢高海拔山區，得天獨厚的地理環境與氣候條件，孕育出品質優異的椪柑。果實飽滿、果皮薄而易剥，果肉多汁，酸甜平衡的口感令人難忘。<br><br>我們堅持產地直送，從果園到您家，確保每一顆椪柑都保持最佳新鮮度。冷藏後風味更佳，清爽不膜口，是冬季最佳的水果選擇。',
        badge: '預購',
        salesCount: 1250,
        shippingType: 'normal',
        shippingMethod: '常溫宅配',
        weight: '箱裝',
        isPreorder: true,
        hasSpecs: true,
        specs: [
            { id: '23A', name: '23A', diameter: '6.7–7.3 cm', weight: '10斤禮盒', price: 699, description: '入門人氣款，超值體驗' },
            { id: '25A', name: '25A', diameter: '7.3–7.9 cm', weight: '10斤禮盒', price: 799, description: '經典送禮，最受歡迎' },
            { id: '27A', name: '27A', diameter: '7.9–8.5 cm', weight: '10斤禮盒', price: 899, description: '精選大果，送禮首選' },
            { id: '30A', name: '30A', diameter: '8.5–9.5 cm', weight: '10斤禮盒', price: 1080, description: '限量尊榮，稀缺稀選' }
        ],
        detailImages: [
            'images/products/ponkan/gallery/椪柑商品介紹1.png',
            'images/products/ponkan/gallery/椪柑商品介紹2.png',
            'images/products/ponkan/gallery/椪柑商品介紹3.png'
        ]
    },
    {
        id: 2,
        name: '東勢茂谷柑',
        category: '優質水果',
        price: 880,
        image: 'images/products/murcott/gallery/茂谷柑1.png',
        alt: '東勢茂谷柑，果肉飽滿，香氣濃郁，甜度高',
        images: [
            'images/products/murcott/gallery/茂谷柑1.png',
            'images/products/murcott/gallery/茂谷柑2.png',
            'images/products/murcott/gallery/茂谷柑3.png',
            'images/products/murcott/gallery/茂谷柑4.png',
            'images/products/murcott/gallery/茂谷柑5.png'
        ],
        description: '果肉飽滿、香氣濃郁、甜度高｜送禮自用兩相宜｜產地直送',
        detailedDescription: '東勢茂谷柑是柑橘中的絕佳品種，以香氣濃郁、甜度高著稱。果肉細緻、汁多味美，每一口都是享受。果皮薄而易剥，果實飽滿，是送禮自用的絕佳選擇。<br><br>茂谷柑產季限定，每年僅有2-3月供應，錯過就要再等一年。我們精選優質果園，直送到家，讓您品嚐到最道地的茂谷風味。',
        badge: '預購',
        salesCount: 980,
        shippingType: 'normal',
        shippingMethod: '常溫宅配',
        weight: '箱裝',
        isPreorder: true,
        hasSpecs: true,
        specs: [
            { id: '23A', name: '23A', diameter: '6.7–7.3 cm', weight: '10斤禮盒', price: 880, description: '入門茂谷，香甜體驗款' },
            { id: '25A', name: '25A', diameter: '7.3–7.9 cm', weight: '10斤禮盒', price: 980, description: '熱銷款，家庭/伴手禮首選' },
            { id: '27A', name: '27A', diameter: '7.9–8.5 cm', weight: '10斤禮盒', price: 1080, description: '精選大果，送禮有面子' },
            { id: '30A', name: '30A', diameter: '8.5–9.5 cm', weight: '10斤禮盒', price: 1280, description: '限量稀缺，高端禮盒' }
        ],
        detailImages: [
            'images/products/murcott/gallery/茂谷柑商品介紹1.png',
            'images/products/murcott/gallery/茂谷柑商品介紹2.png',
        ]
    },
    {
        id: 3,
        name: '冷凍菱角仁',
        category: '冷凍食品',
        price: 240,
        image: 'images/products/water-chestnut/gallery/新鮮蔬果菱角仁1.jpg',
        alt: '新鮮冷凍菱角仁，顆粒飽滿，適合煮湯、炒菜',
        images: [
            'images/products/water-chestnut/gallery/新鮮蔬果菱角仁1.jpg',
            'images/products/water-chestnut/gallery/新鮮蔬果菱角仁2.jpg',
            'images/products/water-chestnut/gallery/新鮮蔬果菱角仁3.jpg'
        ],
        description: '新鮮冷凍菱角仁｜每袋約600g｜效期：冷凍12個月｜保存：-18°C 冷凍',
        detailedDescription: '菱角仁是台灣傳統的優質食材，口感鬆軟香甜，營養價值高。我們的冷凍菱角仁採用新鮮菱角，經過快速冷凍處理，完整保留營養和風味。<br><br>適合用於各種料理，無論是燉湯、炒菜或甘甜餅，都能展現菱角的絕佳風味。冷凍保存12個月，隨時可用，方便又實惠。',
        badge: '熱銷',
        salesCount: 1371,
        shippingType: 'frozen',
        shippingMethod: '冷凍宅配',
        weight: '600g',
        hasSpecs: true,
        specs: [
            { id: 'single-jin', name: '單斤裝', weight: '600克', price: 240 },
            { id: 'single-bag', name: '單包裝', weight: '3000克', price: 990 },
            { id: 'whole-box', name: '整件裝', weight: '4入/3公斤', price: 3500 }
        ],
        cookingImages: [
            { title: '菱角排骨湯', image: 'images/products/water-chestnut/gallery/商品介紹(菱角排骨湯)新鮮蔬果菱角仁1.jpg' },
            { title: '菱角浪鮮菇', image: 'images/products/water-chestnut/gallery/商品介紹(菱角浪鮮菇)新鮮蔬果菱角仁2.jpg' },
            { title: '蜜汁菱角', image: 'images/products/water-chestnut/gallery/商品介紹(蜜汁菱角)新鮮蔬果菱角仁3.jpg' }
        ]
    },
    {
        id: 6,
        name: '冷凍大甲芋角',
        category: '冷凍食品',
        price: 280,
        image: 'images/products/taro/content/新鮮蔬果芋角2CM.jpg',
        alt: '大甲芋角，2CM切塊，適合煮糖水、做甜點',
        description: '新鮮大甲芋角｜每袋約600g｜效期：冷凍12個月｜保存：-18°C 冷凍',
        detailedDescription: '大甲芋頭是台灣著名的芋頭產區，以品質優良聞名。我們的芋角精選大甲芋頭，口感綿密鬆軟，芋香濃郁，是製作甘點和料理的上等食材。<br><br>已預先切好2CM大小，無需處理即可直接使用。適合燉湯、做芋圓、芋泥或各種甜餅，方便快速。',
        badge: '新品',
        salesCount: 50,
        shippingType: 'frozen',
        shippingMethod: '冷凍宅配',
        weight: '600g',
        hasSpecs: false
    }
]

// ========================================
// 商品頁面專用變數和設定
// ========================================
const PRODUCTS_PER_PAGE = 20; // 每頁顯示 20 個商品 (5x4)
let currentPage = 1;
let totalPages = 1;
let currentFilters = {
    category: '全部',
    status: '全部'
};

// ========================================
// 渲染商品列表（統一版本）
// ========================================
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    const noProducts = document.getElementById('noProducts');
    const productCount = document.getElementById('productCount');
    
    if (!productsGrid) {
        console.log('productsGrid not found');
        return;
    }
    
    // 檢查是否為首頁或商品頁
    const isHomePage = window.location.pathname === '/' || window.location.pathname.includes('index.html');
    const isProductsPage = window.location.pathname.includes('products.html');
    
    // 首頁：顯示前 3 個商品
    if (isHomePage) {
        const displayProducts = products.slice(0, 3);
        renderProductCards(productsGrid, displayProducts, false);
        return;
    }
    
    // 商品頁：完整的篩選和分頁功能
    if (isProductsPage) {
        // 篩選商品
        let filteredProducts = products.filter(product => {
            let matchCategory = currentFilters.category === '全部' || product.category === currentFilters.category;
            let matchStatus = currentFilters.status === '全部' || 
                             (currentFilters.status === '預購' && product.isPreorder) ||
                             (currentFilters.status === '現貨' && !product.isPreorder);
            return matchCategory && matchStatus;
        });
        
        // 計算總頁數
        totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
        if (currentPage > totalPages) {
            currentPage = Math.max(1, totalPages);
        }
        
        // 更新商品數量
        if (productCount) {
            productCount.textContent = filteredProducts.length;
        }
        
        // 無商品提示
        if (filteredProducts.length === 0) {
            productsGrid.style.display = 'none';
            if (noProducts) {
                noProducts.style.display = 'block';
            }
            const pagination = document.getElementById('pagination');
            if (pagination) pagination.style.display = 'none';
            return;
        }
        
        productsGrid.style.display = 'grid';
        if (noProducts) {
            noProducts.style.display = 'none';
        }
        
        // 分頁
        const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
        const endIndex = startIndex + PRODUCTS_PER_PAGE;
        const currentProducts = filteredProducts.slice(startIndex, endIndex);
        
        // 渲染商品卡片
        renderProductCards(productsGrid, currentProducts, true);
        
        // 渲染分頁器
        renderPagination();
    }
}

// ========================================
// 渲染商品卡片（電商風格）
// ========================================
function renderProductCards(container, productsArray, showFullCard = true) {
    // 徽章類型對應（與CSS class一致）
    const badgeClass = {
        '熱銷': 'badge-hot',
        '預購': 'badge-preorder',
        '新品': 'badge-new'
    };
    
    container.innerHTML = productsArray.map(product => `
        <a href="product-detail.html?id=${product.id}" class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                ${product.badge ? `<span class="product-badge ${badgeClass[product.badge] || ''}">${product.badge}</span>` : ''}
                ${showFullCard && product.category ? `<span class="product-category">${product.category}</span>` : ''}
                <img src="${product.image}" 
                     alt="${product.alt || product.name}" 
                     loading="lazy" 
                     onerror="this.style.background='#ddd'; this.onerror=null;">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">
                    <span class="currency">NT$</span>
                    ${product.price.toLocaleString()}
                    ${product.hasSpecs ? '<span class="suffix">起</span>' : ''}
                </div>
            </div>
            ${showFullCard ? `
            <div class="product-actions">
                <button class="btn-buy" onclick="event.preventDefault(); location.href='product-detail.html?id=${product.id}'">
                    <i class="fas fa-shopping-cart"></i>
                    立即購買
                </button>
            </div>
            ` : ''}
        </a>
    `).join('');
    
    console.log('✅ 商品渲染完成，共', productsArray.length, '個商品');
}

// ========================================
// 分頁器渲染
// ========================================
function renderPagination() {
    const pagination = document.getElementById('pagination');
    const pageNumbers = document.getElementById('pageNumbers');
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    
    if (!pagination || !pageNumbers) return;
    
    // 如果只有一頁，隱藏分頁器
    if (totalPages <= 1) {
        pagination.style.display = 'none';
        return;
    }
    
    pagination.style.display = 'flex';
    
    // 更新上一頁/下一頁按鈕
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages;
    
    // 生成頁碼
    let pageNumbersHTML = '';
    let startPage = Math.max(1, currentPage - 3);
    let endPage = Math.min(totalPages, currentPage + 3);
    
    if (currentPage <= 3) endPage = Math.min(totalPages, 7);
    if (currentPage >= totalPages - 2) startPage = Math.max(1, totalPages - 6);
    
    // 第一頁
    if (startPage > 1) {
        pageNumbersHTML += `<button class="pagination-btn" onclick="goToPage(1)">1</button>`;
        if (startPage > 2) {
            pageNumbersHTML += `<span style="padding: 0 10px; color: #999;">...</span>`;
        }
    }
    
    // 頁碼按鈕
    for (let i = startPage; i <= endPage; i++) {
        pageNumbersHTML += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    }
    
    // 最後一頁
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            pageNumbersHTML += `<span style="padding: 0 10px; color: #999;">...</span>`;
        }
        pageNumbersHTML += `<button class="pagination-btn" onclick="goToPage(${totalPages})">${totalPages}</button>`;
    }
    
    pageNumbers.innerHTML = pageNumbersHTML;
}

// ========================================
// 分頁控制
// ========================================
function changePage(direction) {
    const newPage = currentPage + direction;
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        renderProducts();
        scrollToProducts();
    }
}

function goToPage(page) {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
        currentPage = page;
        renderProducts();
        scrollToProducts();
    }
}

function scrollToProducts() {
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ========================================
// 篩選功能
// ========================================
function initFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const filterType = this.dataset.filter;
            const filterValue = this.dataset.value;
            
            // 更新按鈕狀態
            document.querySelectorAll(`[data-filter="${filterType}"]`).forEach(b => {
                b.classList.remove('active');
            });
            this.classList.add('active');
            
            // 更新篩選條件
            currentFilters[filterType] = filterValue;
            
            // 重置到第一頁
            currentPage = 1;
            
            // 重新渲染
            renderProducts();
        });
    });
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
                        ${product.hasSpecs ? '<span class="price-suffix"> 起</span>' : ''}
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
    
    // 如果商品數量 <= 3，不啟動輪播，隱藏按鈕
    if (products.length <= 3) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        return;
    }
    
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

// ========================================
// 初始化（統一入口）
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('=== Products.js 載入完成 ===');
    console.log('商品數量:', products.length);
    
    const isHomePage = window.location.pathname === '/' || window.location.pathname.includes('index.html');
    const isProductsPage = window.location.pathname.includes('products.html');
    
    // 渲染商品
    renderProducts();
    
    // 商品頁專用功能
    if (isProductsPage) {
        console.log('初始化商品頁功能...');
        initFilters();
    }
    
    // 首頁專用功能
    if (isHomePage) {
        console.log('初始化首頁功能...');
        renderCategoryCarousel();
        if (window.innerWidth > 1024) {
            initProductCarousel();
        }
        
        // 分類篩選按鈕
        const categoryBtns = document.querySelectorAll('.category-btn');
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                categoryBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const category = btn.dataset.category;
                if (category === '全部') {
                    renderProducts();
                } else {
                    const filtered = products.filter(p => p.category === category);
                    renderProductCards(document.getElementById('productsGrid'), filtered.slice(0, 3), false);
                }
            });
        });
        
        window.addEventListener('resize', () => {
            updateCarouselPosition();
        });
    }
    
    console.log('=== 初始化完成 ===');
});
