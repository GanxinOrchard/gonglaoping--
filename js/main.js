// 主要功能腳本

// 等待模板載入完成後初始化
document.addEventListener('templatesLoaded', () => {
    console.log('🎯 模板載入完成，開始初始化主功能');
    // 稍微延遲以確保 DOM 完全 ready
    setTimeout(() => {
        // 初始化導覽列（包含滾動監聽）
        initNavigation();
        
        // 初始化其他功能
        initOtherFeatures();
    }, 300);
});

// 主要功能初始化（備用）
document.addEventListener('DOMContentLoaded', () => {
    // 付款方式切換顯示匯款資訊
    const paymentOptions = document.querySelectorAll('input[name="payment"]');
    const bankInfo = document.getElementById('bankInfo');
    
    if (paymentOptions && bankInfo) {
        paymentOptions.forEach(option => {
            option.addEventListener('change', function() {
                if (this.value === 'bank') {
                    bankInfo.style.display = 'block';
                } else {
                    bankInfo.style.display = 'none';
                }
            });
        });
    }
});

// 初始化導覽列
function initNavigation() {
    const mainHeader = document.querySelector('.main-header');
    
    console.log('🔧 初始化導覽功能...', { 
        mainHeader: !!mainHeader 
    });
    
    // 初始化最新消息輪播
    initNewsTicker();

    // 購物車數量更新
    updateCartCount();

    // 滑動時添加半透明效果 - 頁頭背景變化
    if (mainHeader) {
        console.log('✅ 找到 .main-header，綁定滾動監聽器');
        
        window.addEventListener('scroll', function() {
            const scrollY = window.scrollY;
            
            if (scrollY > 100) {
                mainHeader.classList.add('scrolled');
                console.log('📜 滾動 > 100px，添加 .scrolled class');
            } else {
                mainHeader.classList.remove('scrolled');
            }
        });
        
        // 立即檢查當前滾動位置
        if (window.scrollY > 100) {
            mainHeader.classList.add('scrolled');
        }
    } else {
        console.error('❌ 找不到 .main-header 元素，無法綁定滾動監聽器');
    }
    
    // 注意：手機選單的初始化已移到 mobile-menu-simple.js 中處理
    // 避免重複綁定導致衝突
}

// 初始化最新消息輪播 - 逐篇顯示
function initNewsTicker() {
    const newsTickerArrow = document.querySelector('.news-ticker-arrow');
    const newsTickerItems = document.querySelectorAll('.news-ticker-item');
    
    if (newsTickerItems.length === 0) return;
    
    let currentIndex = 0;
    let isPaused = false;
    
    // 顯示指定索引的新聞項目
    function showNewsItem(index) {
        // 移除所有active類
        newsTickerItems.forEach(item => item.classList.remove('active'));
        
        // 添加active類到當前項目
        if (newsTickerItems[index]) {
            newsTickerItems[index].classList.add('active');
        }
    }
    
    // 切換到下一篇
    function nextNews() {
        if (isPaused) return;
        
        currentIndex = (currentIndex + 1) % newsTickerItems.length;
        showNewsItem(currentIndex);
    }
    
    // 開始輪播
    function startTicker() {
        // 顯示第一篇
        showNewsItem(0);
        
        // 每2秒切換一次
        setInterval(nextNews, 2000);
    }
    
    // 點擊箭頭跳轉到最新消息頁面
    if (newsTickerArrow) {
        newsTickerArrow.addEventListener('click', function() {
            window.location.href = 'news.html';
        });
    }
    
    // 點擊最新消息內容也可以跳轉
    newsTickerItems.forEach(item => {
        item.addEventListener('click', function() {
            window.location.href = 'news.html';
        });
    });
    
    // 滑鼠懸停暫停
    const newsTickerSection = document.querySelector('.news-ticker-section');
    if (newsTickerSection) {
        newsTickerSection.addEventListener('mouseenter', function() {
            isPaused = true;
        });
        
        newsTickerSection.addEventListener('mouseleave', function() {
            isPaused = false;
        });
    }
    
    // 開始輪播
    startTicker();
}

// 更新購物車數量
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    const topCartCount = document.getElementById('topCartCount');
    const mobileCartCount = document.getElementById('mobileCartCount');
    const count = parseInt(localStorage.getItem('cartCount') || '0');

    if (cartCount && topCartCount) {
        cartCount.textContent = count;
        topCartCount.textContent = count;
        topCartCount.style.display = count > 0 ? 'block' : 'none';
    }
    
    if (mobileCartCount) {
        mobileCartCount.textContent = count;
        mobileCartCount.style.display = count > 0 ? 'block' : 'none';
    }
}

// 添加到購物車功能
function addToCart(productId, productName, productPrice, productImage) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    let cartCount = parseInt(localStorage.getItem('cartCount') || '0');
    
    // 檢查商品是否已存在
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1
        });
    }
    
    cartCount += 1;
    
    // 保存到localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('cartCount', cartCount.toString());
    
    // 更新顯示
    updateCartCount();
    
    // 顯示成功訊息
    showNotification('商品已加入購物車！');
}

// 顯示通知
function showNotification(message) {
    // 創建通知元素
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        z-index: 10000;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // 顯示動畫
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 3秒後自動隱藏
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// 初始化其他功能
function initOtherFeatures() {
    
    // 平滑滾動
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // 排除下拉選單和無效連結
            if (href === '#' || href === 'javascript:void(0)' || this.hasAttribute('data-dropdown')) {
                return;
            }
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                // 平滑滾動到目標
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // 滾動時固定導航欄效果
    let lastScroll = 0;
    const header = document.querySelector('.main-header');  // 修復：正確的 class 名稱
    
    // 加入空值檢查
    if (header) {
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                header.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            } else {
                header.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            }
            
            lastScroll = currentScroll;
        });
    }
    
    // 商品卡片懸停效果增強
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // 載入動畫
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 為所有區塊添加淡入效果
    const sections = document.querySelectorAll('.features, .category-section, .products-section');
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
    
    // 回到頂部按鈕
    createBackToTopButton();
}


// 創建回到頂部按鈕
function createBackToTopButton() {
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTop.className = 'back-to-top';
    
    // 根據螢幕寬度設定不同位置
    const updatePosition = () => {
        if (window.innerWidth <= 768) {
            // 手機版：底部中間
            backToTop.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                width: 50px;
                height: 50px;
                background: var(--primary-color);
                color: white;
                border: none;
                border-radius: 50%;
                font-size: 20px;
                cursor: pointer;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                z-index: 999;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            `;
        } else {
            // 桌面版：右下角
            backToTop.style.cssText = `
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 50px;
                height: 50px;
                background: var(--primary-color);
                color: white;
                border: none;
                border-radius: 50%;
                font-size: 20px;
                cursor: pointer;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                z-index: 1000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            `;
        }
    };
    
    updatePosition();
    document.body.appendChild(backToTop);
    
    // 視窗大小改變時更新位置
    window.addEventListener('resize', updatePosition);
    
    // 顯示/隱藏按鈕
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    });
    
    // 點擊回到頂部
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // 懸停效果
    backToTop.addEventListener('mouseenter', function() {
        const isMobile = window.innerWidth <= 768;
        this.style.transform = isMobile ? 'translateX(-50%) translateY(-5px)' : 'translateY(-5px)';
        this.style.background = 'var(--primary-dark)';
    });
    
    backToTop.addEventListener('mouseleave', function() {
        const isMobile = window.innerWidth <= 768;
        this.style.transform = isMobile ? 'translateX(-50%)' : 'translateY(0)';
        this.style.background = 'var(--primary-color)';
    });
}

// 圖片載入錯誤處理
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            if (!this.dataset.errorHandled) {
                this.dataset.errorHandled = 'true';
                
                // 根據圖片類型設置不同的佔位圖
                if (this.closest('.logo')) {
                    this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="60"%3E%3Ctext x="10" y="40" font-family="Arial" font-size="24" fill="%23ff8c42"%3E柑心果園%3C/text%3E%3C/svg%3E';
                } else {
                    this.style.background = '#f0f0f0';
                    this.style.display = 'flex';
                    this.style.alignItems = 'center';
                    this.style.justifyContent = 'center';
                }
            }
        });
    });
});

// 表單驗證輔助函數
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^09\d{8}$/;
    return re.test(phone);
}

// 格式化金額
function formatCurrency(amount) {
    return new Intl.NumberFormat('zh-TW', {
        style: 'currency',
        currency: 'TWD',
        minimumFractionDigits: 0
    }).format(amount);
}

// 格式化日期
function formatDate(date) {
    return new Intl.DateTimeFormat('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(date));
}

// 防抖函數
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 節流函數
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 複製到剪貼簿
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('已複製到剪貼簿');
        }).catch(err => {
            console.error('複製失敗:', err);
        });
    } else {
        // 備用方案
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showNotification('已複製到剪貼簿');
    }
}

// 載入狀態管理
function showLoading() {
    const loading = document.createElement('div');
    loading.id = 'loading-overlay';
    loading.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255,255,255,0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    `;
    loading.innerHTML = `
        <div style="text-align: center;">
            <div class="spinner" style="
                border: 4px solid #f3f3f3;
                border-top: 4px solid var(--primary-color);
                border-radius: 50%;
                width: 50px;
                height: 50px;
                animation: spin 1s linear infinite;
                margin: 0 auto 20px;
            "></div>
            <p style="color: var(--text-dark); font-weight: 600;">載入中...</p>
        </div>
    `;
    
    // 添加旋轉動畫
    if (!document.querySelector('#spinner-style')) {
        const style = document.createElement('style');
        style.id = 'spinner-style';
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(loading);
}

function hideLoading() {
    const loading = document.getElementById('loading-overlay');
    if (loading) {
        loading.remove();
    }
}

// 錯誤處理
window.addEventListener('error', (e) => {
    console.error('全域錯誤:', e.message, 'at', e.filename, 'line', e.lineno);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('未處理的 Promise 拒絕:', e.reason);
});

// 效能監控（開發用）
if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`頁面載入時間: ${pageLoadTime}ms`);
        }, 0);
    });
}

// 初始化精選商品輪播
function initFeaturedProductsCarousel() {
    // 支援多個carousel（featured / preorder）
    const setups = [
        { prev: 'prevFeatured', next: 'nextFeatured', grid: 'productsGridFeatured' },
        { prev: 'prevPreorder', next: 'nextPreorder', grid: 'productsGridPreorder' }
    ];

    setups.forEach(({ prev, next, grid }) => {
        const prevBtn = document.getElementById(prev);
        const nextBtn = document.getElementById(next);
        const productsGrid = document.getElementById(grid);

        if (!prevBtn || !nextBtn || !productsGrid) return;

        let currentIndex = 0;
        const cards = productsGrid.querySelectorAll('.product-card');
        const totalCards = cards.length;

        function computeCardsPerView() {
            return window.innerWidth <= 768 ? 2 : 4;
        }

        function updateCarousel() {
            const cardsPerView = computeCardsPerView();
            const maxIndex = Math.max(0, totalCards - cardsPerView);
            const translateX = -(currentIndex * (100 / cardsPerView));
            productsGrid.style.transform = `translateX(${translateX}%)`;
            prevBtn.style.display = currentIndex > 0 ? 'flex' : 'none';
            nextBtn.style.display = currentIndex < maxIndex ? 'flex' : 'none';
        }

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });

        nextBtn.addEventListener('click', () => {
            const cardsPerView = computeCardsPerView();
            const maxIndex = Math.max(0, totalCards - cardsPerView);
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateCarousel();
            }
        });

        window.addEventListener('resize', () => {
            currentIndex = 0;
            updateCarousel();
        });

        updateCarousel();
    });
}

// 首頁商品分頁切換
function initProductsTabs() {
    const tabButtons = document.querySelectorAll('.products-tabs .tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    if (!tabButtons.length || !tabContents.length) return;

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;

            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            tabContents.forEach(c => c.classList.remove('active'));
            const targetEl = document.getElementById(`tab-${target}`);
            if (targetEl) targetEl.classList.add('active');
        });
    });
}

// 初始化封面輪播
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slider .slide');
    const sliderContainer = document.querySelector('.hero-slider .slider-container');
    
    if (!slides.length || !sliderContainer) return;
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    function showSlide(index) {
        // 移除所有active類別
        slides.forEach(slide => slide.classList.remove('active'));
        
        // 顯示當前幻燈片
        if (slides[index]) {
            slides[index].classList.add('active');
        }
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }
    
    // 自動輪播（每5秒切換）
    setInterval(nextSlide, 5000);
    
    // 初始化顯示第一張
    showSlide(0);
}

// 初始化商品卡片點擊事件
function initProductCardEvents() {
    const addToCartButtons = document.querySelectorAll('.btn-add-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const card = this.closest('.product-card');
            if (!card) return;
            
            const productId = card.dataset.productId || 'product-' + Math.random().toString(36).substr(2, 9);
            const productName = card.querySelector('.product-title')?.textContent || '商品';
            const productPrice = card.querySelector('.product-price')?.textContent || '0';
            const productImage = card.querySelector('.product-image img')?.src || '';
            
            addToCart(productId, productName, productPrice, productImage);
        });
    });
}

// 在DOM載入完成後初始化輪播
document.addEventListener('DOMContentLoaded', () => {
    initHeroSlider();
    initFeaturedProductsCarousel();
    initProductsTabs();
    initProductCardEvents();
    initMobileCarousel();
});

// 手機版輪播功能
function initMobileCarousel() {
    // 延遲執行，確保頁面完全載入
    setTimeout(() => {
        // 為每個輪播容器添加滾動監聽
        const carousels = document.querySelectorAll('.featured-products-carousel');
        carousels.forEach(carousel => {
            const grid = carousel.querySelector('.featured-products-grid');
            const prevBtn = carousel.querySelector('.carousel-arrow.prev');
            const nextBtn = carousel.querySelector('.carousel-arrow.next');
            
            if (grid && prevBtn && nextBtn) {
                // 更新按鈕狀態
                function updateButtons() {
                    const scrollLeft = grid.scrollLeft;
                    const maxScroll = grid.scrollWidth - grid.clientWidth;
                    
                    prevBtn.style.display = scrollLeft <= 0 ? 'none' : 'flex';
                    nextBtn.style.display = scrollLeft >= maxScroll ? 'none' : 'flex';
                }
                
                // 添加點擊事件監聽器
                prevBtn.addEventListener('click', () => {
                    scrollCarousel(grid.id, -1);
                });
                
                nextBtn.addEventListener('click', () => {
                    scrollCarousel(grid.id, 1);
                });
                
                // 初始狀態
                updateButtons();
                
                // 監聽滾動事件
                grid.addEventListener('scroll', updateButtons);
            }
        });
    }, 100); // 延遲100ms執行
}

// 輪播滾動函數
function scrollCarousel(gridId, direction) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    
    const productCard = grid.querySelector('.product-card');
    if (!productCard) return; // 確保商品卡片存在
    
    const cardWidth = productCard.offsetWidth;
    if (cardWidth === 0) return; // 確保卡片寬度已載入
    
    const scrollAmount = (cardWidth + 15) * direction; // 包含間距
    
    grid.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
    });
}
