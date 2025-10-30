/**
 * 柑心果園 - 簡化手機版選單 JavaScript
 */

(function() {
    'use strict';
    
    // 防止重複初始化
    let isInitialized = false;
    
    // 等待模板載入完成
    document.addEventListener('templatesLoaded', function() {
        console.log('📱 模板載入完成，開始初始化手機選單');
        // 增加延遲以確保 DOM 完全 ready
        setTimeout(initMobileMenu, 500);
    });
    
    // 備用：如果沒有模板系統，等待 DOM 載入
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(initMobileMenu, 600);
        });
    } else {
        setTimeout(initMobileMenu, 600);
    }
    
    function initMobileMenu() {
        // 如果已經初始化，直接返回
        if (isInitialized) {
            console.log('ℹ️ 手機選單已經初始化，跳過');
            return;
        }
        const toggle = document.getElementById('mobileMenuToggle');
        const menu = document.getElementById('mainMenu');
        const overlay = document.getElementById('menuOverlay');
        const closeBtn = document.getElementById('menuClose');
        
        if (!toggle || !menu) {
            console.warn('⚠️ 找不到手機版選單元素，1秒後重試...', { 
                toggle: !!toggle, 
                menu: !!menu,
                overlay: !!overlay,
                closeBtn: !!closeBtn
            });
            // 重試一次
            setTimeout(initMobileMenu, 1000);
            return;
        }
        
        console.log('✅ 手機版選單初始化成功', { toggle, menu, overlay, closeBtn });
        
        // 標記為已初始化
        isInitialized = true;
        
        // 綁定漢堡按鈕點擊事件
        toggle.addEventListener('click', function(e) {
            console.log('漢堡按鈕被點擊', e);
            e.preventDefault();
            e.stopPropagation();
            openMenu();
        });
        
        // 綁定關閉按鈕點擊事件
        if (closeBtn) {
            closeBtn.addEventListener('click', function(e) {
                console.log('關閉按鈕被點擊', e);
                e.preventDefault();
                e.stopPropagation();
                closeMenu();
            });
        } else {
            console.warn('找不到關閉按鈕');
        }
        
        // 綁定遮罩點擊關閉
        if (overlay) {
            overlay.addEventListener('click', function(e) {
                console.log('遮罩被點擊', e);
                e.preventDefault();
                closeMenu();
            });
        } else {
            console.warn('找不到遮罩');
        }
        
        // 綁定 ESC 鍵關閉
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && menu.classList.contains('open')) {
                console.log('ESC 鍵被按下');
                closeMenu();
            }
        });
        
        // 獲取所有下拉選單元素
        const dropdowns = menu.querySelectorAll('.menu-item.dropdown');
        console.log('找到下拉選單數量:', dropdowns.length);
        
        // 綁定下拉選單點擊事件（只執行一次）
        bindDropdownEvents();
        
        function bindDropdownEvents() {
            dropdowns.forEach(dropdown => {
                const link = dropdown.querySelector('.menu-link');
                if (link) {
                    // 移除舊的事件監聽器
                    link.removeEventListener('click', handleDropdownClick);
                    // 添加新的事件監聽器
                    link.addEventListener('click', handleDropdownClick);
                } else {
                    console.warn('找不到下拉選單連結', dropdown);
                }
            });
        }
        
        // 下拉選單點擊處理函數
        function handleDropdownClick(e) {
            console.log('下拉選單連結被點擊');
            e.preventDefault();
            e.stopPropagation();
            const dropdown = this.closest('.menu-item.dropdown');
            toggleDropdown(dropdown);
        }
        
        function openMenu() {
            console.log('開啟選單');
            menu.classList.add('open');
            menu.classList.add('active');
            if (overlay) overlay.classList.add('active');
            toggle.classList.add('active');
            toggle.setAttribute('aria-expanded', 'true');
            document.body.classList.add('menu-open');
            console.log('選單狀態', menu.classList.toString());
        }
        
        function closeMenu() {
            console.log('關閉選單');
            menu.classList.remove('open');
            menu.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
            toggle.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('menu-open');
            
            // 關閉所有下拉選單
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
            console.log('選單狀態', menu.classList.toString());
        }
        
        function toggleDropdown(dropdown) {
            const isActive = dropdown.classList.contains('active');
            console.log('切換下拉選單', dropdown, '當前狀態:', isActive);
            
            // 關閉其他下拉選單
            dropdowns.forEach(item => {
                if (item !== dropdown) {
                    item.classList.remove('active');
                }
            });
            
            if (isActive) {
                dropdown.classList.remove('active');
            } else {
                dropdown.classList.add('active');
            }
            console.log('下拉選單狀態', dropdown.classList.toString());
            
            // 檢查子選單元素
            const submenu = dropdown.querySelector('.submenu');
            if (submenu) {
                console.log('子選單元素:', submenu);
                console.log('子選單計算樣式:', window.getComputedStyle(submenu).display);
            }
        }
    }
})();
