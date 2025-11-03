/**
 * 統一模板載入器
 * 動態載入頁頭、頁尾、選單等統一元件
 */

class TemplateLoader {
    constructor() {
        this.templates = {};
        this.basePath = './templates/';
        this.initialized = false;
    }

    /**
     * 初始化 - 載入所有模板
     */
    async init() {
        try {
            console.log('🚀 開始載入統一模板...');
            
            // 並行載入所有模板
            await Promise.all([
                this.loadHeader(),
                this.loadFooter(),
                this.loadNavigation()
            ]);
            
            this.initialized = true;
            console.log('✅ 所有模板載入完成！');
            
            // 觸發模板載入完成事件
            document.dispatchEvent(new CustomEvent('templatesLoaded'));
            
            // 稍微延遲初始化，確保其他腳本準備好
            setTimeout(() => {
                this.initInteractions();
            }, 100);
            
            return true;
        } catch (error) {
            console.error('❌ 模板載入失敗:', error);
            return false;
        }
    }

    /**
     * 載入頁頭模板
     */
    async loadHeader() {
        try {
            const container = document.getElementById('header-container');
            if (!container) {
                console.warn('⚠️ 找不到 #header-container');
                return;
            }

            const template = await this.fetchTemplate('header.html');
            container.innerHTML = template;
            
            // 🔧 修復LOGO連結 - 確保指向./index.html
            this.fixLogoLinks();
            
            // 更新購物車數量
            this.updateCartCount();
            
            console.log('✓ 頁頭載入完成');
        } catch (error) {
            console.error('頁頭載入錯誤:', error);
        }
    }

    /**
     * 修復LOGO連結 - 確保在GitHub Pages正確工作
     */
    fixLogoLinks() {
        const logoLinks = document.querySelectorAll('.logo, .mobile-logo, .logo-link');
        logoLinks.forEach(link => {
            const currentHref = link.getAttribute('href');
            if (currentHref === 'index.html' || currentHref === '/index.html') {
                link.setAttribute('href', './index.html');
                console.log('✓ 已修復LOGO連結:', currentHref, '→ ./index.html');
            }
        });
    }

    /**
     * 載入頁尾模板
     */
    async loadFooter() {
        try {
            const container = document.getElementById('footer-container');
            if (!container) {
                console.warn('⚠️ 找不到 #footer-container');
                return;
            }

            const template = await this.fetchTemplate('footer.html');
            container.innerHTML = template;
            
            // 更新當前年份
            this.updateCopyrightYear();
            
            console.log('✓ 頁尾載入完成');
        } catch (error) {
            console.error('頁尾載入錯誤:', error);
        }
    }

    /**
     * 載入選單模板（手機版）
     */
    async loadNavigation() {
        try {
            const container = document.getElementById('mobile-menu-container');
            if (!container) {
                console.warn('⚠️ 找不到 #mobile-menu-container');
                return;
            }

            const template = await this.fetchTemplate('mobile-menu.html');
            container.innerHTML = template;
            
            console.log('✓ 選單載入完成');
        } catch (error) {
            console.error('選單載入錯誤:', error);
        }
    }

    /**
     * 取得模板內容
     */
    async fetchTemplate(templateName) {
        try {
            const response = await fetch(`${this.basePath}${templateName}?v=${Date.now()}`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return await response.text();
        } catch (error) {
            console.error(`無法載入模板 ${templateName}:`, error);
            throw error;
        }
    }

    /**
     * 初始化互動功能
     */
    initInteractions() {
        // 注意：手機選單由 mobile-menu-simple.js 負責初始化
        // 避免重複綁定事件監聽器
        // this.initMobileMenu();  ← 已註解，避免衝突
        
        // 桌面版下拉選單
        this.initDesktopDropdowns();
        
        // 購物車更新
        this.initCartListeners();
        
        // 設定當前頁面高亮
        this.highlightCurrentPage();
    }

    /**
     * 手機選單功能
     */
    initMobileMenu() {
        const menuToggle = document.getElementById('mobileMenuToggle');
        const menuClose = document.getElementById('menuClose');
        const mainMenu = document.getElementById('mainMenu');
        const menuOverlay = document.getElementById('menuOverlay');

        if (!menuToggle || !mainMenu) return;

        // 開啟選單
        const openMenu = () => {
            mainMenu.classList.add('show');
            if (menuOverlay) menuOverlay.classList.add('show');
            document.body.style.overflow = 'hidden';
        };

        // 關閉選單
        const closeMenu = () => {
            mainMenu.classList.remove('show');
            if (menuOverlay) menuOverlay.classList.remove('show');
            document.body.style.overflow = '';
        };

        menuToggle.addEventListener('click', openMenu);
        if (menuClose) menuClose.addEventListener('click', closeMenu);
        if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

        // 子選單展開
        const dropdowns = mainMenu.querySelectorAll('.dropdown > .menu-link');
        dropdowns.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const parent = link.parentElement;
                parent.classList.toggle('active');
            });
        });
    }

    /**
     * 桌面版下拉選單
     */
    initDesktopDropdowns() {
        const dropdowns = document.querySelectorAll('.desktop-nav .dropdown');
        
        dropdowns.forEach(dropdown => {
            dropdown.addEventListener('mouseenter', () => {
                dropdown.classList.add('active');
            });
            
            dropdown.addEventListener('mouseleave', () => {
                dropdown.classList.remove('active');
            });
        });
    }

    /**
     * 更新購物車數量
     */
    updateCartCount() {
        try {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
            
            // 更新所有購物車數量顯示
            const counters = document.querySelectorAll('.cart-count, #topCartCount, #mobileCartCount');
            counters.forEach(counter => {
                if (counter) {
                    counter.textContent = totalItems;
                    counter.style.display = totalItems > 0 ? 'flex' : 'none';
                }
            });
        } catch (error) {
            console.error('更新購物車數量失敗:', error);
        }
    }

    /**
     * 監聽購物車變化
     */
    initCartListeners() {
        // 監聽 localStorage 變化
        window.addEventListener('storage', (e) => {
            if (e.key === 'cart') {
                this.updateCartCount();
            }
        });

        // 監聽自訂事件
        window.addEventListener('cartUpdated', () => {
            this.updateCartCount();
        });
    }

    /**
     * 更新版權年份
     */
    updateCopyrightYear() {
        const yearElements = document.querySelectorAll('.copyright-year');
        const currentYear = new Date().getFullYear();
        
        yearElements.forEach(el => {
            el.textContent = currentYear;
        });
    }

    /**
     * 高亮當前頁面
     */
    highlightCurrentPage() {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        
        // 所有連結
        const links = document.querySelectorAll('a[href]');
        
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href && (href === currentPath || href.includes(currentPath))) {
                link.classList.add('active');
                
                // 如果是子選單項目，也展開父選單
                const parentDropdown = link.closest('.dropdown');
                if (parentDropdown) {
                    parentDropdown.classList.add('active-page');
                }
            }
        });
    }

    /**
     * 重新載入特定模板
     */
    async reload(templateName) {
        switch(templateName) {
            case 'header':
                await this.loadHeader();
                break;
            case 'footer':
                await this.loadFooter();
                break;
            case 'navigation':
                await this.loadNavigation();
                break;
            default:
                console.warn(`未知的模板: ${templateName}`);
        }
        
        this.initInteractions();
    }

    /**
     * 檢查模板是否已載入
     */
    isReady() {
        return this.initialized;
    }
}

// 建立全域實例
const templateLoader = new TemplateLoader();

// 頁面載入完成後自動初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        templateLoader.init();
    });
} else {
    templateLoader.init();
}

// 匯出供其他腳本使用
window.TemplateLoader = TemplateLoader;
window.templateLoader = templateLoader;
