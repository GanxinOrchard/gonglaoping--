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
        let toggle = document.getElementById('mobileMenuToggle');
        const floatingBtn = document.getElementById('floatingMenuBtn');
        let drawer = document.getElementById('mainMenu') || document.querySelector('.main-menu');
        
        // 若找不到主選單，嘗試建立一個基本容器，避免無法初始化
        if (!drawer) {
            const header = document.querySelector('.header .container') || document.querySelector('header .container') || document.body;
            const menuEl = document.createElement('nav');
            menuEl.className = 'main-menu';
            menuEl.id = 'mainMenu';
            menuEl.innerHTML = '<ul></ul>';
            header.appendChild(menuEl);
            drawer = menuEl;
            console.warn('未找到主選單，已建立基本的主選單容器');
        }
        
        // 若沒有漢堡按鈕則自動注入到 .nav-icons（或 header 末端）
        if (!toggle) {
            const navIcons = document.querySelector('.nav-icons') || document.querySelector('.navbar .container') || document.querySelector('.header .container') || document.body;
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'mobile-menu-toggle';
            btn.id = 'mobileMenuToggle';
            btn.setAttribute('aria-controls', 'mainMenu');
            btn.setAttribute('aria-expanded', 'false');
            btn.setAttribute('aria-label', '開啟選單');
            btn.innerHTML = '<i class="fas fa-bars"></i>';
            navIcons.appendChild(btn);
            toggle = btn;
            console.log('未找到漢堡按鈕，已自動注入');
        }
        
        // 創建遮罩
        let overlay = document.getElementById('menuOverlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'menuOverlay';
            overlay.className = 'menu-overlay';
            document.body.appendChild(overlay);
        }
        
        // 確保遮罩在正確的層級和初始狀態
        overlay.style.zIndex = '999998';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.display = 'none';
        overlay.style.opacity = '0';
        overlay.style.visibility = 'hidden';
        overlay.style.pointerEvents = 'none';
        
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

            // 強制確保遮罩可見且可點擊（避免部分瀏覽器/外掛干擾）
            overlay.style.display = 'block';
            overlay.style.opacity = '1';
            overlay.style.visibility = 'visible';
            overlay.style.pointerEvents = 'auto';
            
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

            // 關閉時同步還原遮罩狀態
            overlay.style.opacity = '0';
            overlay.style.visibility = 'hidden';
            overlay.style.pointerEvents = 'none';
            // 延遲隱藏，配合過場
            setTimeout(() => { overlay.style.display = 'none'; }, 200);
            
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
