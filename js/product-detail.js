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

// 产品ID到评论类型的映射
const PRODUCT_REVIEW_MAP = {
    1: 'ponkan',      // 椪柑
    2: 'murcott',     // 茂谷柑
    3: 'water-chestnut', // 菱角
    6: 'water-chestnut'  // 芋角也用菱角评论
};

// 渲染商品詳情
function renderProductDetail(product) {
    const container = document.getElementById('productDetailContainer');
    
    console.log('🔍 渲染商品:', product.id, product.name);
    
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
    
    // 更新頁面標題
    document.title = `${product.name} - 柑心果園`;
    
    // 更新麵包屑
    const breadcrumbProductName = document.getElementById('breadcrumbProductName');
    if (breadcrumbProductName) {
        breadcrumbProductName.textContent = product.name;
    }
    
    // 更新封面标题
    const heroProductName = document.getElementById('heroProductName');
    if (heroProductName) {
        heroProductName.textContent = product.name;
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
        <div class="product-detail-layout">
            ${imagesHtml}
            
            <div class="product-info-section">
                <span class="product-category-tag">${product.category}</span>
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                    <h1 style="margin: 0;">${product.name}</h1>
                    ${product.salesCount ? `<span style="color: #ff6b35; font-size: 0.85rem; background: #fff5f0; padding: 4px 12px; border-radius: 20px; white-space: nowrap;"><i class="fas fa-fire"></i> 已售出 ${product.salesCount} 件</span>` : ''}
                </div>
                <p style="color: #666; font-size: 1rem; margin-bottom: 20px;">${product.description}</p>
                
                ${specsHtml}
                
                <div style="margin-bottom: 30px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                    <p style="margin-bottom: 8px; color: #666;"><i class="fas fa-shipping-fast" style="color: #ff6b35; margin-right: 8px;"></i>配送方式：${product.shippingMethod || '常溫宅配'}</p>
                    ${product.weight ? `<p style="margin: 0; color: #666;"><i class="fas fa-weight" style="color: #ff6b35; margin-right: 8px;"></i>重量：${product.weight}</p>` : ''}
                </div>
                
                <div class="quantity-selector">
                    <h3>數量</h3>
                    <div class="quantity-controls">
                        <button class="quantity-btn" id="qtyMinus">-</button>
                        <input type="number" class="quantity-input" id="quantity" value="1" min="1" max="99">
                        <button class="quantity-btn" id="qtyPlus">+</button>
                    </div>
                </div>
                
                <div class="buy-actions">
                    <button class="btn-add-cart" id="addToCartBtn">
                        <i class="fas fa-shopping-cart"></i> 加入購物車
                    </button>
                    <button class="btn-buy-now" id="buyNowBtn">
                        <i class="fas fa-bolt"></i> 立即購買
                    </button>
                </div>
            </div>
        </div>
        
        ${detailImagesHtml}
        ${cookingImagesHtml}
        
        <!-- 商品Tab區 -->
        <div class="product-tabs" style="margin-top: 60px;">
            <div class="tabs-header" style="display: flex; gap: 30px; border-bottom: 2px solid #e5e5e5; margin-bottom: 30px;">
                <button class="tab-btn active" data-tab="description" style="padding: 15px 0; background: none; border: none; font-size: 1.1rem; font-weight: 600; color: #ff6b35; cursor: pointer; border-bottom: 3px solid #ff6b35; transition: all 0.2s;">
                    商品說明
                </button>
                <button class="tab-btn" data-tab="reviews" style="padding: 15px 0; background: none; border: none; font-size: 1.1rem; font-weight: 600; color: #999; cursor: pointer; border-bottom: 3px solid transparent; transition: all 0.2s;">
                    顧客評論
                </button>
                <button class="tab-btn" data-tab="policy" style="padding: 15px 0; background: none; border: none; font-size: 1.1rem; font-weight: 600; color: #999; cursor: pointer; border-bottom: 3px solid transparent; transition: all 0.2s;">
                    常見問題
                </button>
            </div>
            
            <div class="tab-content active" id="descriptionTab">
                <div class="product-description" style="line-height: 1.8; color: #666;">
                    <p style="color: #666; font-size: 1rem; margin-bottom: 20px;">${product.description}</p>
                
                ${specsHtml}
                
                    <div style="background: linear-gradient(135deg, #fff5f0 0%, #ffffff 100%); padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 4px solid #ff6b35;">
                        <p style="font-size: 1.15rem; margin-bottom: 15px; color: #333; font-weight: 500;">${product.description}</p>
                        <p style="font-size: 1rem; color: #666; line-height: 1.8;">
                            ${product.name === '公老坡椪柑' ? '
                                公老坡椪柑產自台中東勢高海拔山區，得天獨厚的地理環境與氣候條件，孕育出品質優異的椪柑。果實飽滿、果皮薄而易剥，果肉多汁，酸甜平衡的口感令人難忘。<br><br>
                                我們堅持產地直送，從果園到您家，確保每一顆椪柑都保持最佳新鮮度。冷藏後風味更佳，清爽不膜口，是冬季最佳的水果選擇。
                            ' : product.name === '東勢茂谷柑' ? '
                                東勢茂谷柑是柑橘中的絕佳品種，以香氣濃郁、甜度高著稱。果肉細緻、汁多味美，每一口都是享受。果皮薄而易剥，果實飽滿，是送禮自用的絕佳選擇。<br><br>
                                茂谷柑產季限定，每年僅有2-3月供應，错過就要再等一年。我們精選優質果園，直送到家，讓您品嚐到最道地的茂谷風味。
                            ' : product.name === '冷凍菱角仁' ? '
                                菱角仁是台灣傳統的優質食材，口感鬆軟香甜，營養價值高。我們的冷凍菱角仁採用新鮮菱角，經過快速冷凍處理，完整保留營養和風味。<br><br>
                                適合用於各種料理，無論是燉湯、炒菜或甘甜黥，都能展現菱角的絕佳風味。冷凍保存12個月，隨時可用，方便又實惠。
                            ' : product.name === '冷凍大甲芋角' ? '
                                大甲芋頭是台灣著名的芋頭產區，以品質優良聞名。我們的芋角精選大甲芋頭，口感綿密鬆軟，芋香濃郁，是製作甘點和料理的上等食材。<br><br>
                                已預先切好2CM大小，無需處理即可直接使用。適合燉湯、做芋圓、芋泥或各種甜黥，方便快速。
                            ' : ''}
                        </p>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 25px; border-radius: 12px; margin: 20px 0;">
                        <h4 style="color: #ff6b35; margin-bottom: 20px; font-size: 1.2rem;"><i class="fas fa-info-circle"></i> 商品資訊</h4>
                        ${product.shippingMethod ? `<p style="margin-bottom: 12px; font-size: 1.05rem;"><strong>🚚 配送方式：</strong>${product.shippingMethod}</p>` : ''}
                        ${product.weight ? `<p style="margin-bottom: 12px; font-size: 1.05rem;"><strong>📦 包裝規格：</strong>${product.weight}</p>` : ''}
                        ${product.shippingType ? `<p style="margin-bottom: 12px; font-size: 1.05rem;"><strong>❄️ 配送溫層：</strong>${product.shippingType === 'frozen' ? '冷凍宅配' : '常溫宅配'}</p>` : ''}
                        <p style="margin-bottom: 12px; font-size: 1.05rem;"><strong>📍 產地：</strong>台灣</p>
                        <p style="margin-bottom: 12px; font-size: 1.05rem;"><strong>✅ 品質保證：</strong>產地直送，新鮮安心</p>
                        <p style="margin: 0; font-size: 1.05rem;"><strong>📦 付款方式：</strong>銀行匯款、LINE Pay</p>
                    </div>
                    
                    ${product.hasSpecs && product.specs ? `
                    <div style="margin-top: 20px;">
                        <h4 style="color: #ff6b35; margin-bottom: 15px;"><i class="fas fa-ruler"></i> 規格說明</h4>
                        ${product.specs.map(spec => `
                            <div style="background: white; border: 1px solid #e5e5e5; padding: 15px; border-radius: 8px; margin-bottom: 10px;">
                                <strong>${spec.name}</strong> - ${spec.diameter ? spec.diameter + ' | ' : ''}${spec.weight} - NT$ ${spec.price.toLocaleString()}
                                ${spec.description ? `<br><span style="color: #999; font-size: 0.9rem;">${spec.description}</span>` : ''}
                            </div>
                        `).join('')}
                    </div>
                    ` : ''}
                </div>
            </div>
            
            <div class="tab-content" id="reviewsTab" style="display: none;">
                <div id="reviewsList" style="display: flex; flex-direction: column; gap: 20px;">
                    <!-- 由 reviews.js 填充 -->
                </div>
            </div>
            
            <div class="tab-content" id="policyTab" style="display: none;">
                <div id="policyContent" style="line-height: 1.8; color: #666;">
                    <!-- 由 renderPolicy 函数填充 -->
                </div>
            </div>
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
    
    console.log('🖼️ 找到缩略图数量:', thumbnails.length);
    console.log('🖼️ 主图元素:', mainImage);
    
    if (thumbnails.length > 0 && mainImage) {
        thumbnails.forEach((thumb, idx) => {
            thumb.addEventListener('click', function(e) {
                e.preventDefault();
                const index = parseInt(this.dataset.index);
                console.log('📸 点击缩略图 index:', index);
                
                if (product.images && product.images[index]) {
                    mainImage.src = product.images[index];
                    console.log('✅ 切换到:', product.images[index]);
                    
                    // 更新活動狀態
                    thumbnails.forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                } else {
                    console.error('❌ 图片不存在:', index);
                }
            });
        });
    } else {
        console.warn('⚠️ 缩略图或主图元素未找到');
    }
    
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
    
    // Tab切換功能
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            
            // 更新按鈕狀態
            tabBtns.forEach(b => {
                b.classList.remove('active');
                b.style.color = '#999';
                b.style.borderBottomColor = 'transparent';
            });
            this.classList.add('active');
            this.style.color = '#ff6b35';
            this.style.borderBottomColor = '#ff6b35';
            
            // 更新內容顯示
            tabContents.forEach(content => {
                content.style.display = 'none';
                content.classList.remove('active');
            });
            
            const targetContent = document.getElementById(targetTab + 'Tab');
            if (targetContent) {
                targetContent.style.display = 'block';
                targetContent.classList.add('active');
            }
        });
    });
    
    // 初始化完整的图片轮播（ProductGallery类）
    if (product.images && product.images.length > 1 && typeof ProductGallery !== 'undefined') {
        setTimeout(() => {
            console.log('🎠 初始化ProductGallery轮播');
            window.productGallery = new ProductGallery(product.id, product.images);
        }, 100);
    }
    
    // 渲染政策内容
    setTimeout(() => {
        renderPolicy('faq');
    }, 200);
    
    // 手动触发评论渲染
    setTimeout(() => {
        const reviewType = PRODUCT_REVIEW_MAP[product.id] || 'ponkan';
        console.log('💬 渲染评论类型:', reviewType, '(产品ID:', product.id + ')');
        
        if (typeof renderReviews === 'function') {
            try {
                renderReviews(reviewType, 10);
                console.log('✅ 评论渲染成功');
            } catch (err) {
                console.error('❌ 评论渲染失败:', err);
            }
        } else {
            console.warn('⚠️ renderReviews 函数未找到');
        }
    }, 300);
}

// 渲染政策内容
function renderPolicy(type = 'faq') {
    const container = document.getElementById('policyContent');
    if (!container) {
        console.warn('⚠️ policyContent 容器未找到');
        return;
    }
    
    // 检查policies.js是否已加载
    if (typeof policiesData === 'undefined') {
        console.warn('⚠️ policiesData 未定义，使用默认FAQ');
        container.innerHTML = `
            <h2>訂購相關</h2>
            <h3>Q: 如何訂購商品？</h3>
            <p>您可以透過以下方式訂購：</p>
            <ul>
                <li>線上購物車：將商品加入購物車後，填寫收件資訊即可完成訂購</li>
                <li>電話訂購：撥打 0933-721-978，由專人為您服務</li>
                <li>Facebook 訊息：透過我們的粉絲專頁私訊訂購</li>
            </ul>
            
            <h3>Q: 配送需要多久時間？</h3>
            <p>一般商品：訂單確認後 2-3 個工作天送達<br>
            冷凍商品：訂單確認後 3-5 個工作天送達（需配合冷凍車班次）</p>
            
            <h3>Q: 有哪些付款方式？</h3>
            <p>我們提供以下付款方式：</p>
            <ul>
                <li>銀行匯款（ATM 轉帳）</li>
                <li>LINE Pay</li>
                <li>貨到付款（需加收手續費 NT$30）</li>
            </ul>
            
            <h3>Q: 收到商品後發現有瑕疵怎麼辦？</h3>
            <p>請於收到商品後 24 小時內拍照並聯絡我們，我們會立即為您處理退換貨事宜。</p>
            
            <div class="highlight-box" style="background: #fff5f0; padding: 20px; border-radius: 8px; margin-top: 20px;">
                <p><strong>還有其他問題？</strong><br>
                歡迎透過電話 0933-721-978 或 Facebook 粉絲專頁與我們聯繫，我們很樂意為您服務！</p>
            </div>
        `;
        return;
    }
    
    // 使用policies.js的完整内容
    if (policiesData[type]) {
        container.innerHTML = policiesData[type].content;
        console.log('✅ 政策内容渲染成功:', policiesData[type].title);
    } else {
        console.warn('⚠️ 找不到政策类型:', type);
    }
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
