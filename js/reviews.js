/**
 * 柑心果園 - 全新評論系統
 * 特點：
 * 1. 每年自動生成100+則評論
 * 2. 按最新日期排序
 * 3. 每個產品對應專屬評論
 */

// ========== 產品專屬評論模板 ==========

const reviewTemplates = {
    'ponkan': {
        name: '椪柑',
        comments: [
            '椪柑很新鮮，甜度剛好，家人都很喜歡！',
            '皮薄好剝，果肉飽滿多汁，非常滿意',
            '產地直送品質有保證，會再回購',
            '整體不錯，包裝很用心，果實新鮮',
            '超級好吃！甜度高，酸度適中',
            '收到後立刻品嚐，真的很甜很好吃',
            '果園直送就是不一樣，新鮮度滿分',
            '品質很好，大小均勻，值得推薦',
            '冷藏後更好吃，清爽不膩口',
            '送禮自用兩相宜，包裝精美',
            '果實飽滿，汁多味美，讚！',
            '很新鮮，家人都說好吃',
            '品質穩定，每次購買都很滿意',
            '果香濃郁，口感極佳',
            '過年送禮最佳選擇，收到的人都說讚',
            '果實大小適中，甜度夠',
            '產季限定，錯過可惜，趕快下單',
            '皮薄易剝，小孩也能輕鬆享用',
            '果肉細緻，沒有籽，吃起來很方便',
            '配送快速，果實新鮮度很好',
            '甜而不膩，香氣十足',
            '聖誕節收到最棒的禮物',
            '果園用心栽培，品質看得見',
            '價格合理，品質優良',
            '每年必買，從不失望'
        ]
    },
    'murcott': {
        name: '茂谷柑',
        comments: [
            '茂谷柑香氣濃郁，果肉飽滿',
            '甜度超高，果汁豐富，非常推薦',
            '茂谷柑品質優良，每顆都很甜',
            '果肉細緻無籽，口感極佳',
            '茂谷柑就是比一般柑橘好吃',
            '皮薄汁多，果肉緊實',
            '茂谷柑送禮最有面子',
            '產季限定，錯過要再等一年',
            '茂谷柑香甜可口，回購率100%',
            '果實飽滿，每一口都是享受',
            '茂谷柑CP值超高',
            '包裝精美，果實新鮮',
            '茂谷柑甜而不膩，很好吃',
            '果園直送，品質保證',
            '茂谷柑果香濃郁，令人難忘',
            '皮好剝，果肉多汁',
            '茂谷柑大小均勻，品質穩定',
            '產地直送就是新鮮',
            '茂谷柑是我的最愛',
            '甜度剛好，口感一流'
        ]
    },
    'water-chestnut': {
        name: '菱角',
        comments: [
            '菱角新鮮飽滿，口感鬆軟',
            '冷凍菱角仁品質很好，方便料理',
            '菱角很新鮮，煮湯超好喝',
            '菱角仁粒粒飽滿，口感綿密',
            '產地直送的菱角就是不一樣',
            '菱角口感香甜，營養豐富',
            '冷凍處理得很好，保持新鮮度',
            '菱角燉湯、炒菜都很適合',
            '菱角仁品質優良，值得推薦',
            '包裝完善，菱角保存良好',
            '菱角口感鬆軟，老人小孩都愛吃',
            '新鮮菱角料理方便又美味',
            '菱角營養價值高，健康食材',
            '產季限定，要買要快',
            '菱角仁大顆飽滿，CP值高',
            '冷凍菱角品質不輸新鮮的',
            '菱角燉排骨湯超美味',
            '菱角口感綿密，香氣十足',
            '包裝用心，配送快速',
            '菱角品質穩定，值得信賴'
        ]
    },
    'taro': {
        name: '芋角',
        comments: [
            '芋角鬆軟香甜，口感極佳',
            '冷凍芋角品質很好，隨時可料理',
            '芋角綿密香濃，非常好吃',
            '芋頭角粒粒飽滿，品質優良',
            '產地直送的芋角就是新鮮',
            '芋角口感鬆軟，芋香濃郁',
            '冷凍處理完善，保持最佳品質',
            '芋角燉湯、甜點都很適合',
            '芋角品質穩定，每次都滿意',
            '包裝完整，芋角保存良好',
            '芋角口感綿密，入口即化',
            '新鮮芋角料理變化多',
            '芋角營養豐富，健康食材',
            '產季限定，錯過可惜',
            '芋角大顆飽滿，物超所值',
            '冷凍芋角方便又美味',
            '芋角燉甜湯超好喝',
            '芋角香氣濃郁，口感一流',
            '配送快速，品質新鮮',
            '芋角值得推薦給親朋好友'
        ]
    }
};

// ========== 評論用戶名單 ==========
const userNames = [
    '王小明', '李美麗', '張大華', '陳小芬', '林志明', '黃淑芬', '吳家豪', '周美玲',
    '鄭志強', '劉雅婷', '蔡明宏', '許淑惠', '楊志偉', '賴美珍', '謝文彬', '林佳慧',
    '陳建志', '王雅芳', '張家銘', '李秀英', '黃志豪', '吳淑芬', '周建宏', '鄭美玲',
    '劉志明', '蔡雅婷', '許明宏', '楊淑惠', '賴志偉', '謝美珍', '林文彬', '陳佳慧',
    '王建志', '張雅芳', '李家銘', '黃秀英', '吳志豪', '周淑芬', '鄭建宏', '劉美玲',
    '蔡志明', '許雅婷', '楊明宏', '賴淑惠', '謝志偉', '林美珍', '陳文彬', '王佳慧',
    '張建志', '李雅芳', '黃家銘', '吳秀英', '周志豪', '鄭淑芬', '劉建宏', '蔡美玲',
    '許志明', '楊雅婷', '賴明宏', '謝淑惠', '林志偉', '陳美珍', '王文彬', '張佳慧',
    '李建志', '黃雅芳', '吳家銘', '周秀英', '鄭志豪', '劉淑芬', '蔡建宏', '許美玲',
    '楊志明', '賴雅婷', '謝明宏', '林淑惠', '陳志偉', '王美珍', '張文彬', '李佳慧'
];

// ========== 評論生成器 ==========

/**
 * 為指定產品生成跨年度的評論
 * @param {string} productId - 產品ID
 * @param {number} reviewsPerYear - 每年評論數量（默認120條）
 * @param {number} years - 生成幾年的評論（默認3年）
 */
function generateProductReviews(productId, reviewsPerYear = 120, years = 3) {
    const template = reviewTemplates[productId];
    if (!template) {
        console.warn(`找不到產品 ${productId} 的評論模板`);
        return [];
    }

    const reviews = [];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // 0-11 -> 1-12
    const currentDay = currentDate.getDate();
    
    // 生成多年度評論
    for (let yearOffset = 0; yearOffset < years; yearOffset++) {
        const year = currentYear - yearOffset;
        const isCurrentYear = (year === currentYear);
        
        // 每年生成指定數量的評論
        for (let i = 0; i < reviewsPerYear; i++) {
            // 隨機選擇評論內容
            const commentIndex = Math.floor(Math.random() * template.comments.length);
            const userIndex = Math.floor(Math.random() * userNames.length);
            
            // 生成隨機日期（不超過當前日期）
            let month, day;
            
            if (isCurrentYear) {
                // 當年：只生成到當前月份為止
                month = Math.floor(Math.random() * currentMonth) + 1;
                
                if (month === currentMonth) {
                    // 當前月份：只生成到今天為止
                    day = Math.floor(Math.random() * currentDay) + 1;
                } else {
                    // 過去月份：可以生成整個月
                    const maxDay = new Date(year, month, 0).getDate();
                    day = Math.floor(Math.random() * maxDay) + 1;
                }
            } else {
                // 過去年份：可以生成整年
                month = Math.floor(Math.random() * 12) + 1;
                const maxDay = new Date(year, month, 0).getDate();
                day = Math.floor(Math.random() * maxDay) + 1;
            }
            
            // 隨機評分（4-5星，偏重5星）
            const rating = Math.random() > 0.25 ? 5 : 4;
            
            reviews.push({
                id: `${productId}-${year}-${i + 1}`,
                productId: productId,
                productName: template.name,
                user: userNames[userIndex],
                rating: rating,
                date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
                content: template.comments[commentIndex],
                year: year
            });
        }
    }
    
    return reviews;
}

// ========== 全局評論數據庫 ==========

let allReviews = [];

// 為所有產品生成評論
function initializeReviews() {
    allReviews = [];
    
    // 為每個產品生成評論
    for (const productId in reviewTemplates) {
        const productReviews = generateProductReviews(productId, 120, 3);
        allReviews.push(...productReviews);
    }
    
    // 按日期降序排序（最新的在前面）
    allReviews.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });
    
    console.log(`✅ 評論系統初始化完成：共 ${allReviews.length} 則評論`);
}

// ========== 評論查詢與篩選 ==========

/**
 * 獲取指定產品的評論
 * @param {string} productId - 產品ID
 * @param {number} limit - 限制數量
 */
function getProductReviews(productId, limit = null) {
    const filtered = allReviews.filter(review => review.productId === productId);
    return limit ? filtered.slice(0, limit) : filtered;
}

/**
 * 獲取所有評論（已按日期排序）
 * @param {number} limit - 限制數量
 */
function getAllReviews(limit = null) {
    return limit ? allReviews.slice(0, limit) : allReviews;
}

/**
 * 計算產品平均評分
 * @param {string} productId - 產品ID
 */
function getAverageRating(productId = null) {
    const reviews = productId ? getProductReviews(productId) : allReviews;
    if (reviews.length === 0) return 0;
    
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / reviews.length).toFixed(1);
}

/**
 * 獲取評論總數
 * @param {string} productId - 產品ID（可選）
 */
function getReviewCount(productId = null) {
    return productId ? getProductReviews(productId).length : allReviews.length;
}

// ========== 評論渲染 ==========

// 評論分頁變數
let currentReviewPage = 1;
const REVIEWS_PER_PAGE = 5; // 每頁顯示5則評論

/**
 * 渲染評論列表（帶分頁）
 * @param {string} productId - 產品ID
 * @param {number} limit - 顯示數量
 */
function renderReviews(productId = null, limit = null) {
    const container = document.getElementById('reviewsList');
    if (!container) return;
    
    const allReviewsForProduct = productId ? getProductReviews(productId) : getAllReviews();
    
    if (allReviewsForProduct.length === 0) {
        container.innerHTML = '<p class="no-reviews">暫無評論</p>';
        return;
    }
    
    // 計算總頁數
    const totalPages = Math.ceil(allReviewsForProduct.length / REVIEWS_PER_PAGE);
    
    // 獲取當前頁的評論
    const startIndex = (currentReviewPage - 1) * REVIEWS_PER_PAGE;
    const endIndex = startIndex + REVIEWS_PER_PAGE;
    const reviews = allReviewsForProduct.slice(startIndex, endIndex);
    
    // 渲染評論
    let html = reviews.map(review => `
        <div class="review-item" data-product="${review.productId}">
            <div class="review-header">
                <div class="review-user">
                    <i class="fas fa-user-circle"></i>
                    <span>${review.user}</span>
                </div>
                <div class="review-rating">
                    ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                </div>
            </div>
            <div class="review-date">${review.date}</div>
            <div class="review-content">${review.content}</div>
            ${!productId ? `<div class="review-product-tag">${review.productName}</div>` : ''}
        </div>
    `).join('');
    
    // 添加分頁按鈕（只在超過1頁時顯示）
    if (totalPages > 1) {
        html += `
            <div class="review-pagination" style="display: flex; justify-content: center; align-items: center; gap: 10px; margin-top: 30px; padding: 20px 0;">
                <button 
                    onclick="changeReviewPage(-1, '${productId}')" 
                    ${currentReviewPage === 1 ? 'disabled' : ''}
                    style="padding: 8px 16px; border: 1px solid #ff6b35; background: ${currentReviewPage === 1 ? '#f5f5f5' : 'white'}; color: ${currentReviewPage === 1 ? '#999' : '#ff6b35'}; border-radius: 6px; cursor: ${currentReviewPage === 1 ? 'not-allowed' : 'pointer'}; transition: all 0.2s;">
                    <i class="fas fa-chevron-left"></i> 上一頁
                </button>
                <span style="color: #666; font-size: 0.95rem;">
                    第 <strong style="color: #ff6b35;">${currentReviewPage}</strong> / ${totalPages} 頁 
                    <span style="color: #999;">(共 ${allReviewsForProduct.length} 則評論)</span>
                </span>
                <button 
                    onclick="changeReviewPage(1, '${productId}')" 
                    ${currentReviewPage === totalPages ? 'disabled' : ''}
                    style="padding: 8px 16px; border: 1px solid #ff6b35; background: ${currentReviewPage === totalPages ? '#f5f5f5' : 'white'}; color: ${currentReviewPage === totalPages ? '#999' : '#ff6b35'}; border-radius: 6px; cursor: ${currentReviewPage === totalPages ? 'not-allowed' : 'pointer'}; transition: all 0.2s;">
                    下一頁 <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        `;
    }
    
    container.innerHTML = html;
    
    console.log(`✅ 評論渲染完成：第${currentReviewPage}/${totalPages}頁，顯示 ${reviews.length} 則`);
}

/**
 * 切換評論頁面
 * @param {number} direction - 方向 (-1: 上一頁, 1: 下一頁)
 * @param {string} productId - 產品ID
 */
function changeReviewPage(direction, productId) {
    currentReviewPage += direction;
    renderReviews(productId);
    
    // 滾動到評論區域
    const reviewsList = document.getElementById('reviewsList');
    if (reviewsList) {
        reviewsList.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

/**
 * 更新評論統計資訊
 * @param {string} productId - 產品ID（可選）
 */
function updateReviewStats(productId = null) {
    const avgRating = getAverageRating(productId);
    const count = getReviewCount(productId);
    
    // 更新平均評分
    const avgElement = document.getElementById('averageRating');
    if (avgElement) {
        avgElement.textContent = avgRating;
    }
    
    // 更新評論數量
    const countElement = document.querySelector('.review-count');
    if (countElement) {
        countElement.textContent = `(${count}則評論)`;
    }
    
    // 更新星星顯示
    const starsElement = document.getElementById('reviewStars');
    if (starsElement) {
        const fullStars = Math.floor(avgRating);
        const halfStar = avgRating % 1 >= 0.5;
        starsElement.innerHTML = '★'.repeat(fullStars) + 
                                 (halfStar ? '½' : '') + 
                                 '☆'.repeat(5 - fullStars - (halfStar ? 1 : 0));
    }
}

// ========== 頁面載入初始化 ==========

// 初始化評論系統
initializeReviews();

// 頁面載入完成後處理
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        // 檢查是否在產品詳情頁
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        
        if (productId) {
            // 產品詳情頁：顯示該產品的評論
            renderReviews(productId, 10);
            updateReviewStats(productId);
        } else {
            // 其他頁面：顯示所有評論
            renderReviews(null, 20);
            updateReviewStats(null);
        }
    });
} else {
    // DOM 已載入
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (productId) {
        renderReviews(productId, 10);
        updateReviewStats(productId);
    }
}

// ========== 載入更多評論 ==========

let currentDisplayCount = 10;

function loadMoreReviews() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    currentDisplayCount += 10;
    renderReviews(productId, currentDisplayCount);
    
    // 如果已顯示所有評論，隱藏按鈕
    const totalReviews = getReviewCount(productId);
    if (currentDisplayCount >= totalReviews) {
        const loadMoreBtn = document.querySelector('.btn-load-more');
        if (loadMoreBtn) {
            loadMoreBtn.style.display = 'none';
        }
    }
}

// 匯出函數供外部使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateProductReviews,
        getProductReviews,
        getAllReviews,
        getAverageRating,
        getReviewCount,
        renderReviews,
        updateReviewStats,
        loadMoreReviews
    };
}
