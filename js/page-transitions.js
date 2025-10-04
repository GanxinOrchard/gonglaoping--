/**
 * 全站動畫效果
 * 包含頁面過渡、商標動畫、滾動動畫
 */

(function() {
    'use strict';
    
    // ========== 頁面過渡動畫 ==========
    
    // 添加頁面過渡CSS
    const transitionStyles = `
        <style>
            /* 頁面載入動畫 */
            body {
                opacity: 0;
                animation: pageFadeIn 0.5s ease-out forwards;
            }
            
            @keyframes pageFadeIn {
                to {
                    opacity: 1;
                }
            }
            
            /* 頁面離開動畫 */
            body.page-exit {
                animation: pageSlideOut 0.3s ease-in forwards;
            }
            
            @keyframes pageSlideOut {
                to {
                    opacity: 0;
                    transform: translateX(-20px);
                }
            }
            
            /* 商標動畫 */
            .logo img {
                animation: logoFloat 3s ease-in-out infinite;
            }
            
            @keyframes logoFloat {
                0%, 100% {
                    transform: translateY(0px);
                }
                50% {
                    transform: translateY(-5px);
                }
            }
            
            .logo:hover img {
                animation: logoSpin 0.6s ease;
            }
            
            @keyframes logoSpin {
                0% {
                    transform: rotate(0deg) scale(1);
                }
                50% {
                    transform: rotate(180deg) scale(1.1);
                }
                100% {
                    transform: rotate(360deg) scale(1);
                }
            }
            
            /* 元素滾動進入動畫 */
            .fade-in-up {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            
            .fade-in-up.visible {
                opacity: 1;
                transform: translateY(0);
            }
            
            .fade-in-left {
                opacity: 0;
                transform: translateX(-30px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            
            .fade-in-left.visible {
                opacity: 1;
                transform: translateX(0);
            }
            
            .fade-in-right {
                opacity: 0;
                transform: translateX(30px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            
            .fade-in-right.visible {
                opacity: 1;
                transform: translateX(0);
            }
            
            /* 卡片放大動畫 */
            .scale-in {
                opacity: 0;
                transform: scale(0.9);
                transition: opacity 0.5s ease, transform 0.5s ease;
            }
            
            .scale-in.visible {
                opacity: 1;
                transform: scale(1);
            }
            
            /* 按鈕波紋效果 */
            .btn-ripple {
                position: relative;
                overflow: hidden;
            }
            
            .btn-ripple::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.5);
                transform: translate(-50%, -50%);
                transition: width 0.6s, height 0.6s;
            }
            
            .btn-ripple:active::after {
                width: 300px;
                height: 300px;
            }
            
            /* 側邊購物車滑入動畫 */
            .cart-icon {
                transition: transform 0.3s ease;
            }
            
            .cart-icon:hover {
                transform: scale(1.1) rotate(5deg);
            }
            
            /* 商品卡片懸停效果增強 */
            .product-card {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .product-card:hover {
                transform: translateY(-8px);
                box-shadow: 0 12px 24px rgba(0,0,0,0.15);
            }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', transitionStyles);
    
    // ========== 頁面離開動畫 ==========
    
    function handlePageTransition(e) {
        const target = e.currentTarget;
        const href = target.href;
        
        // 忽略外部連結和特殊連結
        if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || target.target === '_blank') {
            return;
        }
        
        // 阻止默認行為
        e.preventDefault();
        
        // 添加離開動畫
        document.body.classList.add('page-exit');
        
        // 動畫結束後跳轉
        setTimeout(() => {
            window.location.href = href;
        }, 300);
    }
    
    // ========== 滾動動畫觀察器 ==========
    
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);
        
        // 觀察所有需要動畫的元素
        document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .scale-in').forEach(el => {
            observer.observe(el);
        });
        
        // 自動為某些元素添加動畫類
        document.querySelectorAll('.product-card').forEach((card, index) => {
            card.classList.add('scale-in');
            card.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(card);
        });
        
        document.querySelectorAll('.section-title').forEach(title => {
            title.classList.add('fade-in-up');
            observer.observe(title);
        });
    }
    
    // ========== 按鈕波紋效果 ==========
    
    function addRippleEffect() {
        document.querySelectorAll('button, .btn, .cta-btn').forEach(btn => {
            if (!btn.classList.contains('btn-ripple')) {
                btn.classList.add('btn-ripple');
            }
        });
    }
    
    // ========== 平滑滾動 ==========
    
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    // ========== 返回頂部按鈕 ==========
    
    function initBackToTop() {
        // 創建返回頂部按鈕
        const backToTop = document.createElement('button');
        backToTop.id = 'backToTop';
        backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
        backToTop.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: var(--primary-color);
            color: white;
            border: none;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s;
            z-index: 999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        `;
        
        document.body.appendChild(backToTop);
        
        // 滾動顯示/隱藏
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.style.opacity = '1';
                backToTop.style.visibility = 'visible';
            } else {
                backToTop.style.opacity = '0';
                backToTop.style.visibility = 'hidden';
            }
        });
        
        // 點擊返回頂部
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Hover效果
        backToTop.addEventListener('mouseenter', () => {
            backToTop.style.transform = 'scale(1.1)';
        });
        
        backToTop.addEventListener('mouseleave', () => {
            backToTop.style.transform = 'scale(1)';
        });
    }
    
    // ========== 初始化 ==========
    
    document.addEventListener('DOMContentLoaded', () => {
        // 初始化滾動動畫
        initScrollAnimations();
        
        // 添加按鈕波紋效果
        addRippleEffect();
        
        // 初始化平滑滾動
        initSmoothScroll();
        
        // 初始化返回頂部按鈕
        initBackToTop();
        
        // 為內部連結添加頁面過渡
        document.querySelectorAll('a').forEach(link => {
            if (link.hostname === window.location.hostname) {
                link.addEventListener('click', handlePageTransition);
            }
        });
    });
    
})();
