/**
 * 公共 Header 載入器
 * 為所有頁面提供統一的導航欄和選單結構
 */

(function() {
    'use strict';
    
    // 等待 DOM 載入
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCommonHeader);
    } else {
        initCommonHeader();
    }
    
    function initCommonHeader() {
        // 檢查是否已有 header，避免重複載入
        if (document.querySelector('.header')) {
            console.log('Header already exists, skipping common-header.js');
            return;
        }
        
        const headerHTML = `
            <!-- 導航欄 -->
            <header class="header">
                <div class="container">
                    <div class="nav-content">
                        <div class="logo">
                            <a href="index.html">
                                <img src="./images/商標.jpg" alt="柑心果園" loading="lazy" width="180" height="60">
                            </a>
                        </div>
                        
                        <div class="search-bar">
                            <input type="text" placeholder="搜尋商品..." id="searchInput">
                            <button type="button" id="searchBtn"><i class="fas fa-search"></i></button>
                        </div>
                        
                        <div class="nav-icons">
                            <a href="cart.html" class="cart-icon" id="cartIcon">
                                <i class="fas fa-shopping-cart"></i>
                                <span class="cart-count" id="cartCount">0</span>
                            </a>
                            <button type="button" class="mobile-menu-toggle" id="mobileMenuToggle" aria-controls="mainMenu" aria-expanded="false" aria-label="開啟選單">
                                <i class="fas fa-bars"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="main-menu" id="mainMenu">
                        <ul>
                            <li><a href="index.html">首頁</a></li>
                            <li><a href="news.html">最新消息</a></li>
                            <li class="dropdown">
                                <a href="season-recommend.html">本季嚴選 <i class="fas fa-chevron-down"></i></a>
                                <ul class="dropdown-menu">
                                    <li><a href="season-recommend.html">當季推薦</a></li>
                                    <li><a href="season-ponkan.html">椪柑產季</a></li>
                                    <li><a href="season-murcott.html">茂谷柑產季</a></li>
                                    <li><a href="season-water-chestnut.html">菱角產季</a></li>
                                    <li><a href="season-taro.html">芋角產季</a></li>
                                </ul>
                            </li>
                            <li class="dropdown">
                                <a href="products.html">全部商品 <i class="fas fa-chevron-down"></i></a>
                                <ul class="dropdown-menu">
                                    <li><a href="products.html?category=優質水果">優質水果</a></li>
                                    <li><a href="products.html?category=新鮮蔬果">新鮮蔬果</a></li>
                                    <li><a href="products.html?category=冷凍食品">冷凍食品</a></li>
                                </ul>
                            </li>
                            <li class="dropdown">
                                <a href="farming.html">安心指南 <i class="fas fa-chevron-down"></i></a>
                                <ul class="dropdown-menu">
                                    <li><a href="farming.html">栽種過程</a></li>
                                    <li><a href="guide.html">選購指南</a></li>
                                    <li><a href="grading.html">分級標準</a></li>
                                </ul>
                            </li>
                            <li><a href="knowledge.html">知識專欄</a></li>
                            <li><a href="about.html">關於我們</a></li>
                            <li><a href="contact.html">聯絡我們</a></li>
                        </ul>
                    </div>
                </div>
            </header>
        `;
        
        // 插入 header 到 body 開頭
        document.body.insertAdjacentHTML('afterbegin', headerHTML);
        
        // 確保必要的 CSS 被載入
        ensureStylesLoaded();
        
        // 載入必要的 JS
        loadRequiredScripts();
        
        console.log('✅ Common header loaded successfully');
    }
    
    function ensureStylesLoaded() {
        const stylesToLoad = [
            { href: './css/navigation-clean.css', id: 'navigation-clean-css' }
        ];
        
        stylesToLoad.forEach(style => {
            if (!document.getElementById(style.id)) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = style.href;
                link.id = style.id;
                document.head.appendChild(link);
            }
        });
    }
    
    function loadRequiredScripts() {
        const scriptsToLoad = [
            { src: './js/mobile-menu-simple.js', id: 'mobile-menu-simple-js' },
            { src: './js/dropdown-menu.js', id: 'dropdown-menu-js' }
        ];
        
        scriptsToLoad.forEach(scriptInfo => {
            if (!document.getElementById(scriptInfo.id)) {
                const script = document.createElement('script');
                script.src = scriptInfo.src;
                script.id = scriptInfo.id;
                script.defer = true;
                document.body.appendChild(script);
            }
        });
    }
})();
