/**
 * 導覽列下拉選單功能
 * 支援桌面版和手機版
 * 仿照參考網站的滑動動畫效果
 */

(function() {
    'use strict';
    
    // 下拉選單HTML結構
    const dropdownHTML = `
        <style>
            .dropdown {
                position: relative;
            }
            
            .dropdown > a {
                display: flex;
                align-items: center;
                gap: 5px;
                position: relative;
            }
            
            .dropdown-arrow {
                font-size: 10px;
                transition: transform 0.3s ease;
            }
            
            .dropdown.active .dropdown-arrow,
            .dropdown:hover .dropdown-arrow {
                transform: rotate(180deg);
            }
            
            /* 手機版樣式 */
            @media (max-width: 992px) {
                .dropdown-menu {
                    position: static !important;
                    box-shadow: none !important;
                    background: #f8f9fa !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    border-radius: 0 !important;
                    border-left: 3px solid var(--primary-color) !important;
                    margin-left: 15px !important;
                    border-top: none !important;
                    transform: none !important;
                    left: auto !important;
                }
                
                .dropdown-menu li {
                    opacity: 1 !important;
                    transform: none !important;
                }
                
                .dropdown-menu li a {
                    padding: 10px 15px !important;
                    font-size: 14px !important;
                    border-bottom: none !important;
                }
                
                .dropdown-menu li a:hover {
                    padding-left: 20px !important;
                }
            }
        </style>
    `;
    
    // 插入樣式
    document.head.insertAdjacentHTML('beforeend', dropdownHTML);
    
    // 等待DOM載入完成
    document.addEventListener('DOMContentLoaded', function() {
        const mainMenu = document.querySelector('.main-menu ul');
        if (!mainMenu) return;
        
        // 尋找需要轉換為下拉選單的項目
        const menuItems = mainMenu.querySelectorAll('li');
        
        menuItems.forEach(item => {
            // 跳過已經有 dropdown class 的項目（HTML 中已手動設定）
            if (item.classList.contains('dropdown')) return;
            
            const link = item.querySelector('a');
            if (!link) return;
            
            const text = link.textContent.trim();
            
            // 處理「規格分級」
            if (text === '規格分級') {
                item.classList.add('dropdown');
                link.innerHTML = `
                    規格分級 <i class="fas fa-chevron-down dropdown-arrow"></i>
                `;
                link.href = 'javascript:void(0)';
                link.setAttribute('data-dropdown', 'true');
                
                const dropdownMenu = document.createElement('div');
                dropdownMenu.className = 'dropdown-menu';
                dropdownMenu.innerHTML = `
                    <a href="grading-ponkan.html"><i class="fas fa-star"></i> 椪柑規格</a>
                    <a href="grading-murcott.html"><i class="fas fa-star"></i> 茂谷柑規格</a>
                    <a href="grading-water-chestnut.html"><i class="fas fa-star"></i> 菱角規格</a>
                    <a href="grading-taro.html"><i class="fas fa-star"></i> 芋角規格</a>
                `;
                item.appendChild(dropdownMenu);
            }
            
            // 處理「挑選指南」
            else if (text === '挑選指南') {
                item.classList.add('dropdown');
                link.innerHTML = `
                    挑選指南 <i class="fas fa-chevron-down dropdown-arrow"></i>
                `;
                link.href = 'javascript:void(0)';
                link.setAttribute('data-dropdown', 'true');
                
                const dropdownMenu = document.createElement('div');
                dropdownMenu.className = 'dropdown-menu';
                dropdownMenu.innerHTML = `
                    <a href="guide-ponkan.html"><i class="fas fa-book"></i> 椪柑挑選</a>
                    <a href="guide-murcott.html"><i class="fas fa-book"></i> 茂谷柑挑選</a>
                    <a href="guide-water-chestnut.html"><i class="fas fa-book"></i> 菱角挑選</a>
                    <a href="guide-taro.html"><i class="fas fa-book"></i> 芋角挑選</a>
                `;
                item.appendChild(dropdownMenu);
            }
            
            // 處理「產季資訊」
            else if (text === '產季資訊') {
                item.classList.add('dropdown');
                link.innerHTML = `
                    產季資訊 <i class="fas fa-chevron-down dropdown-arrow"></i>
                `;
                link.href = 'javascript:void(0)';
                link.setAttribute('data-dropdown', 'true');
                
                const dropdownMenu = document.createElement('div');
                dropdownMenu.className = 'dropdown-menu';
                dropdownMenu.innerHTML = `
                    <a href="season-recommend.html"><i class="fas fa-calendar-star"></i> 當季推薦</a>
                    <a href="season-ponkan.html"><i class="fas fa-calendar-alt"></i> 椪柑產季</a>
                    <a href="season-murcott.html"><i class="fas fa-calendar-alt"></i> 茂谷柑產季</a>
                    <a href="season-water-chestnut.html"><i class="fas fa-calendar-alt"></i> 菱角產季</a>
                    <a href="season-taro.html"><i class="fas fa-calendar-alt"></i> 芋角產季</a>
                `;
                item.appendChild(dropdownMenu);
            }
        });
        
        // 桌面版：使用 hover 效果（CSS 已處理，這裡只是備用）
        function initDesktopDropdown() {
            if (window.innerWidth > 992) {
                document.querySelectorAll('.dropdown').forEach(dropdown => {
                    // 桌面版主要依賴 CSS :hover，這裡添加額外的支援
                    dropdown.addEventListener('mouseenter', function() {
                        // 關閉其他下拉選單
                        document.querySelectorAll('.dropdown').forEach(d => {
                            if (d !== this) d.classList.remove('active');
                        });
                        this.classList.add('active');
                    });
                    
                    dropdown.addEventListener('mouseleave', function() {
                        this.classList.remove('active');
                    });
                });
            }
        }
        
        // 手機版：使用點擊事件
        function initMobileDropdown() {
            if (window.innerWidth <= 992) {
                document.querySelectorAll('.dropdown > a').forEach(link => {
                    link.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        const dropdown = this.parentElement;
                        
                        // 關閉其他下拉選單
                        document.querySelectorAll('.dropdown').forEach(d => {
                            if (d !== dropdown) d.classList.remove('active');
                        });
                        
                        dropdown.classList.toggle('active');
                    });
                });
            }
        }
        
        // 初始化
        initDesktopDropdown();
        initMobileDropdown();
        
        // 確保下拉選單內的連結可以正常導航
        document.querySelectorAll('.dropdown-menu a').forEach(link => {
            link.addEventListener('click', function(e) {
                // 不阻止默認行為，讓連結正常導航
                e.stopPropagation();
            });
        });
        
        // 點擊外部關閉下拉選單
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.dropdown')) {
                document.querySelectorAll('.dropdown').forEach(d => {
                    d.classList.remove('active');
                });
            }
        });
        
        // 視窗大小改變時重新初始化
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                // 清除所有 active 狀態
                document.querySelectorAll('.dropdown').forEach(d => {
                    d.classList.remove('active');
                });
                // 重新初始化
                initDesktopDropdown();
                initMobileDropdown();
            }, 250);
        });
    });
    
})();
