// 商品資料
const products = [
    {
        id: 1,
        name: '有機文旦禮盒',
        category: '禮盒專區',
        price: 880,
        image: 'https://via.placeholder.com/300x300/ff8c42/ffffff?text=有機文旦禮盒',
        description: '精選有機文旦，果肉細緻多汁，送禮自用兩相宜',
        badge: '熱銷'
    },
    {
        id: 2,
        name: '椪柑禮盒',
        category: '禮盒專區',
        price: 680,
        image: 'https://via.placeholder.com/300x300/ff8c42/ffffff?text=椪柑禮盒',
        description: '竹崎山區椪柑，渾圓飽滿、鮮甜多汁',
        badge: '新品'
    },
    {
        id: 3,
        name: '金鑽鳳梨',
        category: '優質水果',
        price: 450,
        image: 'https://via.placeholder.com/300x300/ff8c42/ffffff?text=金鑽鳳梨',
        description: '台灣在地金鑽鳳梨，香甜可口',
        badge: ''
    },
    {
        id: 4,
        name: '無花果',
        category: '優質水果',
        price: 380,
        image: 'https://via.placeholder.com/300x300/ff8c42/ffffff?text=無花果',
        description: '雲林四湖無花果，營養滿分',
        badge: ''
    },
    {
        id: 5,
        name: '有機蔬菜箱',
        category: '新鮮蔬菜',
        price: 550,
        image: 'https://via.placeholder.com/300x300/ff8c42/ffffff?text=有機蔬菜箱',
        description: '當季有機蔬菜組合，新鮮直送',
        badge: '推薦'
    },
    {
        id: 6,
        name: '有機茉莉香米',
        category: '米、雜糧',
        price: 320,
        image: 'https://via.placeholder.com/300x300/ff8c42/ffffff?text=有機茉莉香米',
        description: '花蓮玉里有機米，清香Q彈',
        badge: ''
    },
    {
        id: 7,
        name: '土地之歌有機白米',
        category: '米、雜糧',
        price: 480,
        image: 'https://via.placeholder.com/300x300/ff8c42/ffffff?text=土地之歌有機白米',
        description: '台粳74號良質香米，口感極佳',
        badge: ''
    },
    {
        id: 8,
        name: '青蕉麵',
        category: '加工食品',
        price: 180,
        image: 'https://via.placeholder.com/300x300/ff8c42/ffffff?text=青蕉麵',
        description: '添加青香蕉澱粉，富含抗性澱粉',
        badge: '熱銷'
    },
    {
        id: 9,
        name: '綠蕉薯條',
        category: '加工食品',
        price: 150,
        image: 'https://via.placeholder.com/300x300/ff8c42/ffffff?text=綠蕉薯條',
        description: '台灣青香蕉製作，健康零食',
        badge: ''
    },
    {
        id: 10,
        name: '黑豆方塊酥',
        category: '加工食品',
        price: 120,
        image: 'https://via.placeholder.com/300x300/ff8c42/ffffff?text=黑豆方塊酥',
        description: '無防腐劑，純素健康點心',
        badge: ''
    },
    {
        id: 11,
        name: '阿里山咖啡',
        category: '茶葉飲品',
        price: 580,
        image: 'https://via.placeholder.com/300x300/ff8c42/ffffff?text=阿里山咖啡',
        description: 'SL34品種，山泉水洗處理',
        badge: '精選'
    },
    {
        id: 12,
        name: '台灣高山茶',
        category: '茶葉飲品',
        price: 650,
        image: 'https://via.placeholder.com/300x300/ff8c42/ffffff?text=台灣高山茶',
        description: '高山茶葉，香氣濃郁',
        badge: ''
    },
    {
        id: 13,
        name: '冷凍桑椹',
        category: '優質水果',
        price: 280,
        image: 'https://via.placeholder.com/300x300/ff8c42/ffffff?text=冷凍桑椹',
        description: '產銷履歷驗證，快速冷凍保鮮',
        badge: ''
    },
    {
        id: 14,
        name: '蜂蜜禮盒',
        category: '禮盒專區',
        price: 750,
        image: 'https://via.placeholder.com/300x300/ff8c42/ffffff?text=蜂蜜禮盒',
        description: '純天然龍眼蜜，香甜濃郁',
        badge: '推薦'
    },
    {
        id: 15,
        name: '壺底蔭油禮盒',
        category: '禮盒專區',
        price: 890,
        image: 'https://via.placeholder.com/300x300/ff8c42/ffffff?text=壺底蔭油禮盒',
        description: '西螺百年釀造技法，日曝一年熟成',
        badge: ''
    },
    {
        id: 16,
        name: '有機糙米',
        category: '米、雜糧',
        price: 350,
        image: 'https://via.placeholder.com/300x300/ff8c42/ffffff?text=有機糙米',
        description: '保留完整營養，健康首選',
        badge: ''
    }
];

// 渲染商品列表
function renderProducts(productsToRender = products) {
    const productsGrid = document.getElementById('productsGrid');
    
    if (!productsGrid) return;
    
    productsGrid.innerHTML = productsToRender.map(product => `
        <div class="product-card" data-id="${product.id}">
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
                    <button class="btn-add-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> 加入購物車
                    </button>
                </div>
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

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    
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
