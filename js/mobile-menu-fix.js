/**
 * 手機漢堡選單修復 JavaScript
 * 解決「偶爾打不開或瞬間又關起來」的問題
 */

(function() {
    'use strict';
    
    // 等待 DOM 載入完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileMenu);
    } else {
        initMobileMenu();
    }
    
    function initMobileMenu() {
        const toggle = document.getElementById('mobileMenuToggle');
        const floatingBtn = document.getElementById('floatingMenuBtn');
        const drawer = document.getElementById('mainMenu');
        
        if (!drawer) {
            console.warn('找不到選單元素 #mainMenu');
            return;
        }
        
        // 創建遮罩
        let overlay = document.getElementById('menuOverlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'menuOverlay';
            overlay.className = 'menu-overlay';
            document.body.appendChild(overlay);
        }
        
        let isOpen = false;
        let isAnimating = false;
        
        // 開啟選單
        function openMenu(button) {
            if (isAnimating || isOpen) return;
            
            isAnimating = true;
            isOpen = true;
            
        // 更新 class
        drawer.classList.add('open');
        drawer.classList.add('active');
        overlay.classList.add('active');
        document.body.classList.add('menu-open');
            
            // 更新按鈕狀態
            if (button) {
                button.classList.add('active');
                button.setAttribute('aria-expanded', 'true');
                const icon = button.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                }
            }
            
            // 延遲綁定外部點擊事件，避免立即觸發
            setTimeout(() => {
                isAnimating = false;
                document.addEventListener('click', handleOutsideClick);
            }, 300);
        }
        
        // 關閉選單
        function closeMenu() {
            if (isAnimating || !isOpen) return;
            
            isAnimating = true;
            isOpen = false;
            
            // 移除外部點擊監聽
            document.removeEventListener('click', handleOutsideClick);
            
            // 更新 class
            drawer.classList.remove('open');
            drawer.classList.remove('active');
            overlay.classList.remove('active');
            document.body.classList.remove('menu-open');
            
            // 更新所有按鈕狀態
            [toggle, floatingBtn].forEach(button => {
                if (button) {
                    button.classList.remove('active');
                    button.setAttribute('aria-expanded', 'false');
                    const icon = button.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            });
            
            setTimeout(() => {
                isAnimating = false;
            }, 300);
        }
        
        // 切換選單
        function toggleMenu(button) {
            if (isOpen) {
                closeMenu();
            } else {
                openMenu(button);
            }
        }
        
        // 處理外部點擊
        function handleOutsideClick(e) {
            // 如果點擊的是抽屜內部，不關閉
            if (drawer.contains(e.target)) {
                return;
            }
            
            // 如果點擊的是按鈕，不關閉（由按鈕事件處理）
            if (toggle && toggle.contains(e.target)) {
                return;
            }
            if (floatingBtn && floatingBtn.contains(e.target)) {
                return;
            }
            
            // 點擊外部，關閉選單
            closeMenu();
        }
        
        // 綁定漢堡按鈕事件
        if (toggle) {
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                toggleMenu(this);
            });
        }
        
        // 綁定懸浮按鈕事件
        if (floatingBtn) {
            floatingBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                toggleMenu(this);
            });
        }
        
        // 綁定遮罩點擊事件
        overlay.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeMenu();
        });
        
        // 阻止抽屜內部點擊冒泡
        drawer.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        
        // 處理下拉選單
        const dropdowns = drawer.querySelectorAll('.dropdown > a');
        dropdowns.forEach(link => {
            link.addEventListener('click', function(e) {
                // 只在手機版才阻止默認行為
                if (window.innerWidth <= 992) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const dropdown = this.parentElement;
                    const wasActive = dropdown.classList.contains('active');
                    
                    // 關閉其他下拉選單
                    drawer.querySelectorAll('.dropdown').forEach(d => {
                        if (d !== dropdown) {
                            d.classList.remove('active');
                        }
                    });
                    
                    // 切換當前下拉選單
                    dropdown.classList.toggle('active');
                }
            });
        });
        
        // 點擊選單內的連結後關閉選單（排除下拉選單的父連結）
        const menuLinks = drawer.querySelectorAll('a:not(.dropdown > a)');
        menuLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // 如果是真實連結（不是 javascript:void(0)），關閉選單
                const href = this.getAttribute('href');
                if (href && href !== '#' && href !== 'javascript:void(0)') {
                    setTimeout(() => {
                        closeMenu();
                    }, 100);
                }
            });
        });
        
        // ESC 鍵關閉選單
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isOpen) {
                closeMenu();
            }
        });
        
        // 視窗大小改變時關閉選單
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                if (window.innerWidth > 992 && isOpen) {
                    closeMenu();
                }
            }, 250);
        });
        
        console.log('✅ 手機選單已成功初始化');
    }
})();
