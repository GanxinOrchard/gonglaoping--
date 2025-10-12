// 主要功能腳本

// 開南風格導覽列功能
document.addEventListener('DOMContentLoaded', () => {
    // 初始化開南風格導覽列
    initKainanNavigation();
    
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
    
    // 初始化其他功能
    initOtherFeatures();
});

// 初始化開南風格導覽列
function initKainanNavigation() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mainMenu = document.getElementById('mainMenu');
    const menuClose = document.getElementById('menuClose');
    const mainHeader = document.querySelector('.main-header');
    
    // 開啟選單
    if (mobileMenuToggle && mainMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // 切換選單狀態
            this.setAttribute('aria-expanded', !isExpanded);
            mainMenu.classList.toggle('active');
            
            // 切換圖標
            const icon = this.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
    }
    
    // 關閉選單
    if (menuClose && mainMenu) {
        menuClose.addEventListener('click', function() {
            mainMenu.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            
            // 重置圖標
            const icon = mobileMenuToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // 點擊選單外部關閉選單
    if (mainMenu) {
        mainMenu.addEventListener('click', function(e) {
            if (e.target === mainMenu) {
                mainMenu.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                
                // 重置圖標
                const icon = mobileMenuToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }
    
    // 點擊文檔外部關閉選單
    document.addEventListener('click', function(e) {
        if (mainMenu && mainMenu.classList.contains('active')) {
            if (!mainMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                mainMenu.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                
                // 重置圖標
                const icon = mobileMenuToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        }
    });
    
    // ESC鍵關閉選單
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mainMenu && mainMenu.classList.contains('active')) {
            mainMenu.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            
            // 重置圖標
            const icon = mobileMenuToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
    
    // 初始化最新消息輪播
    initNewsTicker();

    // 購物車數量更新
    updateCartCount();

    // 滑動時添加半透明效果
    if (mainHeader) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                mainHeader.classList.add('scrolled');
            } else {
                mainHeader.classList.remove('scrolled');
            }
        });
    }
}

// 初始化最新消息輪播
function initNewsTicker() {
    const newsTickerArrow = document.querySelector('.news-ticker-arrow');
    const newsTickerWrapper = document.querySelector('.news-ticker-wrapper');
    
    if (newsTickerArrow && newsTickerWrapper) {
        newsTickerArrow.addEventListener('click', function() {
            // 點擊箭頭跳轉到最新消息頁面
            window.location.href = 'news.html';
        });
    }
    
    // 點擊最新消息內容也可以跳轉
    const newsTickerItems = document.querySelectorAll('.news-ticker-item');
    newsTickerItems.forEach(item => {
        item.addEventListener('click', function() {
            window.location.href = 'news.html';
        });
    });
}

// 更新購物車數量
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    const topCartCount = document.getElementById('topCartCount');
    const mobileCartCount = document.getElementById('mobileCartCount');

    if (cartCount && topCartCount) {
        const count = localStorage.getItem('cartCount') || '0';
        cartCount.textContent = count;
        topCartCount.textContent = count;
        
        // 添加動畫效果
        if (cartCount) {
            cartCount.classList.add('animate');
            setTimeout(() => cartCount.classList.remove('animate'), 600);
        }
        if (topCartCount) {
            topCartCount.classList.add('animate');
            setTimeout(() => topCartCount.classList.remove('animate'), 600);
        }
    }
    
    if (mobileCartCount) {
        const count = localStorage.getItem('cartCount') || '0';
        mobileCartCount.textContent = count;
        
        // 添加動畫效果
        mobileCartCount.classList.add('animate');
        setTimeout(() => mobileCartCount.classList.remove('animate'), 600);
    }
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
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        } else {
            header.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        }
        
        lastScroll = currentScroll;
    });
    
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

// 頁面可見性變化處理已由 mobile-menu-fix.js 處理

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
                background: var(--secondary-color);
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
        this.style.background = isMobile ? 'var(--secondary-dark)' : 'var(--primary-dark)';
    });
    
    backToTop.addEventListener('mouseleave', function() {
        const isMobile = window.innerWidth <= 768;
        this.style.transform = isMobile ? 'translateX(-50%)' : 'translateY(0)';
        this.style.background = isMobile ? 'var(--secondary-color)' : 'var(--primary-color)';
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
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const productsGrid = document.getElementById('productsGrid');
    
    if (!prevBtn || !nextBtn || !productsGrid) return;
    
    let currentIndex = 0;
    const cards = productsGrid.querySelectorAll('.featured-card');
    const totalCards = cards.length;
    
    // 桌面版：4個一組，手機版：2個一組
    const isMobile = window.innerWidth <= 768;
    const cardsPerView = isMobile ? 2 : 4;
    const maxIndex = Math.max(0, totalCards - cardsPerView);
    
    function updateCarousel() {
        const translateX = -(currentIndex * (100 / cardsPerView));
        productsGrid.style.transform = `translateX(${translateX}%)`;
        
        // 更新按鈕狀態
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
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarousel();
        }
    });
    
    // 響應式處理
    window.addEventListener('resize', () => {
        const wasMobile = isMobile;
        const nowMobile = window.innerWidth <= 768;
        
        if (wasMobile !== nowMobile) {
            currentIndex = 0;
            updateCarousel();
        }
    });
    
    // 初始化
    updateCarousel();
}

// 在DOM載入完成後初始化輪播
document.addEventListener('DOMContentLoaded', () => {
    initFeaturedProductsCarousel();
    initHeroSlider();
});

// 初始化主視覺輪播
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slider .slide');
    if (slides.length <= 1) return;
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
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
