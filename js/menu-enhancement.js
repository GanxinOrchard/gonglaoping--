/**
 * 柑心果園 - 選單增強功能
 * 提供現代化的滑動效果和下拉選單互動
 */

(function() {
    'use strict';
    
    // 選單配置
    const MENU_CONFIG = {
        ANIMATION_DURATION: 300,
        HOVER_DELAY: 150,
        MOBILE_BREAKPOINT: 992,
        ENABLE_SMOOTH_SCROLL: true,
        ENABLE_KEYBOARD_NAV: true
    };
    
    // 選單狀態
    let menuState = {
        isMobile: window.innerWidth <= MENU_CONFIG.MOBILE_BREAKPOINT,
        activeDropdown: null,
        isAnimating: false
    };
    
    // 初始化選單增強功能
    function initMenuEnhancement() {
        console.log('🍊 柑心果園選單增強功能啟動');
        
        // 添加選單增強樣式
        addMenuStyles();
        
        // 初始化桌面版選單
        initDesktopMenu();
        
        // 手機版選單功能已移至 mobile-menu-fix.js 處理
        
        // 初始化鍵盤導航
        if (MENU_CONFIG.ENABLE_KEYBOARD_NAV) {
            initKeyboardNavigation();
        }
        
        // 監聽視窗大小變化
        window.addEventListener('resize', handleResize);
        
        // 監聽頁面滾動
        if (MENU_CONFIG.ENABLE_SMOOTH_SCROLL) {
            initSmoothScroll();
        }
    }
    
    // 添加選單增強樣式
    function addMenuStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* 選單增強動畫 */
            .nav-link {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .dropdown-menu {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            /* 選單載入動畫 */
            .nav-menu > li {
                animation: menuItemSlideIn 0.6s ease forwards;
                opacity: 0;
                transform: translateY(-20px);
            }
            
            .nav-menu > li:nth-child(1) { animation-delay: 0.1s; }
            .nav-menu > li:nth-child(2) { animation-delay: 0.2s; }
            .nav-menu > li:nth-child(3) { animation-delay: 0.3s; }
            .nav-menu > li:nth-child(4) { animation-delay: 0.4s; }
            .nav-menu > li:nth-child(5) { animation-delay: 0.5s; }
            
            @keyframes menuItemSlideIn {
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            /* 下拉選單滑動效果 */
            .dropdown-menu {
                transform: translateX(-50%) translateY(-10px);
                opacity: 0;
                visibility: hidden;
            }
            
            .dropdown:hover .dropdown-menu,
            .dropdown.active .dropdown-menu {
                transform: translateX(-50%) translateY(0);
                opacity: 1;
                visibility: visible;
            }
            
            /* 手機版選單動畫 */
            .main-menu {
                transition: all 0.3s ease;
            }
            
            .main-menu .dropdown-menu {
                max-height: 0;
                overflow: hidden;
                transition: max-height 0.3s ease;
            }
            
            .main-menu .dropdown.active .dropdown-menu {
                max-height: 300px;
            }
        `;
        document.head.appendChild(style);
    }
    
    // 初始化桌面版選單
    function initDesktopMenu() {
        if (menuState.isMobile) return;
        
        const dropdowns = document.querySelectorAll('.dropdown');
        
        dropdowns.forEach(dropdown => {
            const link = dropdown.querySelector('.nav-link');
            const menu = dropdown.querySelector('.dropdown-menu');
            
            if (!link || !menu) return;
            
            // 滑鼠進入
            dropdown.addEventListener('mouseenter', () => {
                if (menuState.isAnimating) return;
                
                menuState.activeDropdown = dropdown;
                menuState.isAnimating = true;
                
                dropdown.classList.add('active');
                
                // 添加進入動畫
                menu.style.animation = 'slideInDown 0.3s ease';
                
                setTimeout(() => {
                    menuState.isAnimating = false;
                }, MENU_CONFIG.ANIMATION_DURATION);
            });
            
            // 滑鼠離開
            dropdown.addEventListener('mouseleave', () => {
                if (menuState.isAnimating) return;
                
                menuState.isAnimating = true;
                
                // 添加離開動畫
                menu.style.animation = 'slideOutUp 0.3s ease';
                
                setTimeout(() => {
                    dropdown.classList.remove('active');
                    menuState.activeDropdown = null;
                    menuState.isAnimating = false;
                    menu.style.animation = '';
                }, MENU_CONFIG.ANIMATION_DURATION);
            });
            
            // 點擊處理
            link.addEventListener('click', (e) => {
                if (menu.querySelector('a')) {
                    e.preventDefault();
                    toggleDropdown(dropdown);
                }
            });
        });
    }
    
    // 手機版選單功能已移至 mobile-menu-fix.js 處理
    
    // 切換下拉選單
    function toggleDropdown(dropdown) {
        if (menuState.isAnimating) return;
        
        menuState.isAnimating = true;
        
        const isActive = dropdown.classList.contains('active');
        
        // 關閉其他下拉選單
        document.querySelectorAll('.dropdown.active').forEach(item => {
            if (item !== dropdown) {
                item.classList.remove('active');
            }
        });
        
        if (isActive) {
            dropdown.classList.remove('active');
        } else {
            dropdown.classList.add('active');
        }
        
        setTimeout(() => {
            menuState.isAnimating = false;
        }, MENU_CONFIG.ANIMATION_DURATION);
    }
    
    // 手機版選單功能已移至 mobile-menu-fix.js 處理
    
    // 初始化鍵盤導航
    function initKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // ESC 鍵關閉所有下拉選單
                document.querySelectorAll('.dropdown.active').forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        });
    }
    
    // 初始化平滑滾動
    function initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                if (targetId === '#') return;
                
                const target = document.querySelector(targetId);
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
    
    // 處理視窗大小變化
    function handleResize() {
        const wasMobile = menuState.isMobile;
        menuState.isMobile = window.innerWidth <= MENU_CONFIG.MOBILE_BREAKPOINT;
        
        if (wasMobile !== menuState.isMobile) {
            // 重置選單狀態
            document.querySelectorAll('.dropdown.active').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
            menuState.activeDropdown = null;
            menuState.isAnimating = false;
        }
    }
    
    // 添加選單動畫樣式
    function addAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInDown {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }
            
            @keyframes slideOutUp {
                from {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-10px);
                }
            }
            
            /* 選單項目懸停效果 */
            .nav-link {
                position: relative;
                overflow: hidden;
            }
            
            .nav-link::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 140, 66, 0.1), transparent);
                transition: left 0.4s ease;
            }
            
            .nav-link:hover::before {
                left: 100%;
            }
        `;
        document.head.appendChild(style);
    }
    
    // 頁面載入完成後初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            addAnimationStyles();
            initMenuEnhancement();
        });
    } else {
        addAnimationStyles();
        initMenuEnhancement();
    }
    
    // 導出功能供外部使用
    window.MenuEnhancement = {
        toggleDropdown,
        toggleMobileDropdown,
        initMenuEnhancement
    };
    
})();

