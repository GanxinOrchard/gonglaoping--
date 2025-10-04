/**
 * 導覽列下拉選單功能
 * 支援桌面版和手機版
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
            }
            
            .dropdown-arrow {
                font-size: 10px;
                transition: transform 0.3s;
            }
            
            .dropdown.active .dropdown-arrow {
                transform: rotate(180deg);
            }
            
            .dropdown-menu {
                display: none;
                position: absolute;
                top: 100%;
                left: 0;
                min-width: 200px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                padding: 10px 0;
                z-index: 1000;
                margin-top: 5px;
            }
            
            .dropdown.active .dropdown-menu {
                display: block;
                animation: fadeInDown 0.3s ease;
            }
            
            @keyframes fadeInDown {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .dropdown-menu a {
                display: block;
                padding: 12px 20px;
                color: #333;
                text-decoration: none;
                transition: all 0.3s;
                font-size: 14px;
            }
            
            .dropdown-menu a:hover {
                background: #fff5f0;
                color: var(--primary-color);
                padding-left: 25px;
            }
            
            .dropdown-menu a i {
                margin-right: 8px;
                color: var(--primary-color);
            }
            
            /* 手機版樣式 */
            @media (max-width: 992px) {
                .dropdown-menu {
                    position: static;
                    box-shadow: none;
                    background: #f8f9fa;
                    margin: 0;
                    padding: 0;
                    border-radius: 0;
                    border-left: 3px solid var(--primary-color);
                    margin-left: 15px;
                }
                
                .dropdown-menu a {
                    padding: 10px 15px;
                    font-size: 14px;
                }
                
                .dropdown-menu a:hover {
                    padding-left: 20px;
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
            const link = item.querySelector('a');
            if (!link) return;
            
            const text = link.textContent.trim();
            
            // 處理「規格分級」
            if (text === '規格分級') {
                item.classList.add('dropdown');
                link.innerHTML = `
                    規格分級 <i class="fas fa-chevron-down dropdown-arrow"></i>
                `;
                link.href = '#';
                
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
                link.href = '#';
                
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
                link.href = '#';
                
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
        
        // 添加點擊事件（桌面版）
        document.querySelectorAll('.dropdown > a').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const dropdown = this.parentElement;
                const isActive = dropdown.classList.contains('active');
                
                // 關閉所有下拉選單
                document.querySelectorAll('.dropdown').forEach(d => {
                    d.classList.remove('active');
                });
                
                // 切換當前下拉選單
                if (!isActive) {
                    dropdown.classList.add('active');
                }
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
        
        // 手機版：點擊箭頭展開/收合
        if (window.innerWidth <= 992) {
            document.querySelectorAll('.dropdown > a').forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const dropdown = this.parentElement;
                    dropdown.classList.toggle('active');
                });
            });
        }
    });
    
})();
