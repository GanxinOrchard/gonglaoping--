// 主要功能腳本

// 手機選單切換
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
    
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const floatingMenuBtn = document.getElementById('floatingMenuBtn');
    const mainMenu = document.getElementById('mainMenu');
    
    // 創建手機選單遮罩（純視覺效果，不阻擋點擊）
    let menuOverlay = document.getElementById('menuOverlay');
    if (!menuOverlay) {
        menuOverlay = document.createElement('div');
        menuOverlay.id = 'menuOverlay';
        menuOverlay.className = 'menu-overlay';
        document.body.appendChild(menuOverlay);
    }
    
    // 點擊選單外的區域關閉選單
    document.addEventListener('click', (e) => {
        if (mainMenu && mainMenu.classList.contains('active')) {
            // 如果點擊的不是選單內容，也不是 Menu 按鈕
            if (!mainMenu.contains(e.target) && 
                !e.target.closest('#floatingMenuBtn') && 
                !e.target.closest('#mobileMenuToggle')) {
                closeMenu();
            }
        }
    });
    
    // 關閉選單的統一函數
    function closeMenu() {
        if (mainMenu) mainMenu.classList.remove('active');
        if (menuOverlay) menuOverlay.classList.remove('active');
        if (mobileMenuToggle) {
            mobileMenuToggle.classList.remove('active');
            const icon = mobileMenuToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
        if (floatingMenuBtn) {
            floatingMenuBtn.classList.remove('active');
            const icon = floatingMenuBtn.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
        document.body.style.overflow = '';
    }
    
    // 開啟選單的統一函數
    function openMenu(button) {
        if (mainMenu) mainMenu.classList.add('active');
        if (menuOverlay) menuOverlay.classList.add('active');
        if (button) {
            button.classList.add('active');
            const icon = button.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            }
        }
        document.body.style.overflow = 'hidden';
    }
    
    // 綁定原來的漢堡按鈕（如果存在）
    if (mobileMenuToggle && mainMenu) {
        mobileMenuToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const isActive = mainMenu.classList.contains('active');
            if (isActive) {
                closeMenu();
            } else {
                openMenu(mobileMenuToggle);
            }
        });
    }
    
    // 綁定懸浮 Menu 按鈕
    if (floatingMenuBtn && mainMenu) {
        floatingMenuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const isActive = mainMenu.classList.contains('active');
            if (isActive) {
                closeMenu();
            } else {
                openMenu(floatingMenuBtn);
            }
        });
    }
    
    // 手機版下拉選單
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        
        if (link) {
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 992) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            });
        }
    });
    
    // 平滑滾動
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || href === 'javascript:void(0)') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                // 關閉手機選單
                if (mainMenu) {
                    mainMenu.classList.remove('active');
                }
                
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
});

// 創建回到頂部按鈕
function createBackToTopButton() {
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTop.className = 'back-to-top';
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
    
    document.body.appendChild(backToTop);
    
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
        this.style.transform = 'translateY(-5px)';
        this.style.background = 'var(--primary-dark)';
    });
    
    backToTop.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
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
    console.error('全域錯誤:', e.error);
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
