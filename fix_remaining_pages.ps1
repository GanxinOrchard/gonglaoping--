# 修復剩餘頁面的腳本
Write-Host "開始修復剩餘頁面..." -ForegroundColor Green

# 需要修復的頁面列表
$pagesToFix = @(
    "season.html",
    "grading.html", 
    "guide.html",
    "knowledge.html",
    "policies.html"
)

# 從首頁提取的組件模板
$headerTemplate = @"
    <!-- Header -->
    <header class="header-modern">
        <div class="container">
            <div class="header-left">
                <a href="index.html" class="brand-logo">
                    <img src="images/柑心商標.png" alt="柑心果園" class="logo-img">
                    <div class="logo-text">
                        <span class="logo-main">柑心果園</span>
                        <span class="logo-sub">GANXIN ORCHARD</span>
                    </div>
                </a>
            </div>
            <nav class="header-nav">
                <ul class="nav-list">
                    <li class="nav-item dropdown">
                        <a href="news.html" class="nav-link">最新消息</a>
                        <div class="dropdown-content">
                            <a href="news.html?category=announcement">最新公告</a>
                            <a href="news.html?category=new">新品上市</a>
                            <a href="news.html?category=promotion">期間優惠</a>
                            <a href="news.html?category=diary">果園日誌</a>
                        </div>
                    </li>
                    <li class="nav-item dropdown">
                        <a href="season-recommend.html" class="nav-link">季節推薦</a>
                        <div class="dropdown-content">
                            <a href="season-ponkan.html">椪柑季節</a>
                            <a href="season-murcott.html">茂谷柑季節</a>
                            <a href="season-water-chestnut.html">菱角季節</a>
                            <a href="season-taro.html">芋頭季節</a>
                        </div>
                    </li>
                    <li class="nav-item dropdown">
                        <a href="products.html" class="nav-link">所有商品</a>
                        <div class="dropdown-content">
                            <a href="products.html?category=新鮮水果">新鮮水果</a>
                            <a href="products.html?category=季節限定">季節限定</a>
                            <a href="products.html?category=禮盒裝">禮盒裝</a>
                            <div class="dropdown-divider"></div>
                            <a href="guide.html">選購指南</a>
                            <a href="guide-ponkan.html">椪柑選購</a>
                            <a href="guide-murcott.html">茂谷柑選購</a>
                            <a href="guide-water-chestnut.html">菱角選購</a>
                            <a href="guide-taro.html">芋頭選購</a>
                        </div>
                    </li>
                    <li class="nav-item dropdown">
                        <a href="about.html" class="nav-link">關於我們</a>
                        <div class="dropdown-content">
                            <a href="about.html">關於柑心果園</a>
                            <a href="farming.html">農場介紹</a>
                            <a href="knowledge.html">知識分享</a>
                            <div class="dropdown-divider"></div>
                            <a href="grading.html">分級標準</a>
                            <a href="grading-ponkan.html">椪柑分級</a>
                            <a href="grading-murcott.html">茂谷柑分級</a>
                            <div class="dropdown-divider"></div>
                            <a href="contact.html">聯絡我們</a>
                        </div>
                    </li>
                    <li class="nav-item">
                        <a href="order-tracking.html" class="nav-link">訂單查詢</a>
                    </li>
                </ul>
            </nav>
            <div class="header-actions">
                <a href="cart.html" class="header-action cart-link">
                    <i class="fas fa-shopping-cart"></i>
                    <span>購物車</span>
                    <span class="cart-count" id="topCartCount">0</span>
                </a>
                <div class="language-switcher">
                    <span>繁體中文</span>
                    <i class="fas fa-chevron-down"></i>
                    <div class="language-dropdown">
                        <a href="#">English</a>
                        <a href="#">日本語</a>
                    </div>
                </div>
                <button class="menu-toggle" id="menuToggle">
                    <i class="fas fa-bars"></i>
                </button>
            </div>
        </div>
    </header>
"@

$mobileMenuTemplate = @"
    <!-- 手機選單 - 現代化設計 -->
    <div class="menu-overlay" id="menuOverlay"></div>
    <div class="main-menu" id="mainMenu">
        <!-- 選單頭部 -->
        <div class="menu-header">
            <div class="menu-logo">
                <img src="images/柑心商標.png" alt="柑心果園" class="menu-logo-img">
                <div class="menu-logo-text">
                    <div class="logo-main">柑心果園</div>
                    <div class="logo-sub">Ganxin Orchard</div>
                </div>
            </div>
            <button class="menu-close" id="menuClose">
                <i class="fas fa-times"></i>
            </button>
        </div>
        
        <!-- 選單導航 -->
        <nav class="menu-nav">
            <ul class="menu-list">
                <li class="menu-item dropdown">
                    <a href="javascript:void(0)" class="menu-link">
                        <i class="fas fa-newspaper menu-icon"></i>
                        <span class="menu-text">最新消息</span>
                        <i class="fas fa-chevron-down menu-arrow"></i>
                    </a>
                    <ul class="submenu">
                        <li><a href="news.html?category=announcement" class="submenu-link">最新公告</a></li>
                        <li><a href="news.html?category=new" class="submenu-link">新品上市</a></li>
                        <li><a href="news.html?category=promotion" class="submenu-link">期間優惠</a></li>
                        <li><a href="news.html?category=diary" class="submenu-link">果園日誌</a></li>
                    </ul>
                </li>
                
                <li class="menu-item dropdown">
                    <a href="javascript:void(0)" class="menu-link">
                        <i class="fas fa-calendar-alt menu-icon"></i>
                        <span class="menu-text">季節推薦</span>
                        <i class="fas fa-chevron-down menu-arrow"></i>
                    </a>
                    <ul class="submenu">
                        <li><a href="season-recommend.html" class="submenu-link">季節推薦</a></li>
                        <li><a href="season-ponkan.html" class="submenu-link">椪柑季節</a></li>
                        <li><a href="season-murcott.html" class="submenu-link">茂谷柑季節</a></li>
                        <li><a href="season-water-chestnut.html" class="submenu-link">菱角季節</a></li>
                        <li><a href="season-taro.html" class="submenu-link">芋頭季節</a></li>
                    </ul>
                </li>
                
                <li class="menu-item dropdown">
                    <a href="javascript:void(0)" class="menu-link">
                        <i class="fas fa-shopping-bag menu-icon"></i>
                        <span class="menu-text">所有商品</span>
                        <i class="fas fa-chevron-down menu-arrow"></i>
                    </a>
                    <ul class="submenu">
                        <li><a href="products.html?category=新鮮水果" class="submenu-link">新鮮水果</a></li>
                        <li><a href="products.html?category=季節限定" class="submenu-link">季節限定</a></li>
                        <li><a href="products.html?category=禮盒裝" class="submenu-link">禮盒裝</a></li>
                        <li class="submenu-divider"></li>
                        <li><a href="guide.html" class="submenu-link">選購指南</a></li>
                        <li><a href="guide-ponkan.html" class="submenu-link">椪柑選購</a></li>
                        <li><a href="guide-murcott.html" class="submenu-link">茂谷柑選購</a></li>
                        <li><a href="guide-water-chestnut.html" class="submenu-link">菱角選購</a></li>
                        <li><a href="guide-taro.html" class="submenu-link">芋頭選購</a></li>
                    </ul>
                </li>
                
                <li class="menu-item dropdown">
                    <a href="javascript:void(0)" class="menu-link">
                        <i class="fas fa-info-circle menu-icon"></i>
                        <span class="menu-text">關於我們</span>
                        <i class="fas fa-chevron-down menu-arrow"></i>
                    </a>
                    <ul class="submenu">
                        <li><a href="about.html" class="submenu-link">關於柑心果園</a></li>
                        <li><a href="farming.html" class="submenu-link">農場介紹</a></li>
                        <li><a href="knowledge.html" class="submenu-link">知識分享</a></li>
                        <li class="submenu-divider"></li>
                        <li><a href="grading.html" class="submenu-link">分級標準</a></li>
                        <li><a href="grading-ponkan.html" class="submenu-link">椪柑分級</a></li>
                        <li><a href="grading-murcott.html" class="submenu-link">茂谷柑分級</a></li>
                        <li class="submenu-divider"></li>
                        <li><a href="contact.html" class="submenu-link">聯絡我們</a></li>
                    </ul>
                </li>
                
                <li class="menu-item">
                    <a href="order-tracking.html" class="menu-link">
                        <i class="fas fa-search menu-icon"></i>
                        <span class="menu-text">訂單查詢</span>
                    </a>
                </li>
            </ul>
        </nav>
        
        <!-- 手機選單頁尾內容 -->
        <div class="mobile-menu-footer">
            <!-- 聯絡我們區域 -->
            <div class="mobile-contact-section">
                <div class="mobile-contact-info">
                    <div class="mobile-contact-item">
                        <i class="fas fa-phone-alt"></i>
                        <span>0933-721-978</span>
                    </div>
                    <div class="mobile-contact-item">
                        <i class="fas fa-envelope"></i>
                        <span>s9000721@gmail.com</span>
                    </div>
                    <div class="mobile-contact-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>台中豐原公老坪</span>
                    </div>
                </div>
            </div>
            
            <!-- 關注我們區域 -->
            <div class="mobile-social-section">
                <div class="mobile-social-buttons">
                    <a href="https://www.facebook.com/share/19vDVjSz9Y/?mibextid=wwXIfr" target="_blank" class="mobile-social-btn facebook">
                        <i class="fab fa-facebook-f"></i>
                        <span>Facebook</span>
                    </a>
                    <a href="#" target="_blank" class="mobile-social-btn line">
                        <i class="fab fa-line"></i>
                        <span>LINE</span>
                    </a>
                    <a href="#" target="_blank" class="mobile-social-btn instagram">
                        <i class="fab fa-instagram"></i>
                        <span>Instagram</span>
                    </a>
                </div>
            </div>
        </div>
    </div>
"@

$cartButtonsTemplate = @"
    <!-- 購物車按鈕 -->
    <a href="cart.html" class="header-action cart-link">
        <i class="fas fa-shopping-cart"></i>
        <span>購物車</span>
        <span class="cart-count" id="topCartCount">0</span>
    </a>

    <!-- 手機版購物車按鈕 -->
    <a href="cart.html" class="mobile-action cart-link">
        <i class="fas fa-shopping-cart"></i>
        <span>購物車</span>
        <span class="cart-count" id="mobileCartCount">0</span>
    </a>
"@

$footerTemplate = @"
    <!-- 頁尾 -->
    <footer class="footer footer-modern">
        <div class="container">
            <!-- 頁尾波浪裝飾 -->
            <div class="footer-wave">
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="currentColor"></path>
                    <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="currentColor"></path>
                    <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor"></path>
                </svg>
            </div>
            
            <!-- 主要內容區域 -->
            <div class="footer-main">
                <!-- 左側品牌區域 -->
                <div class="footer-left">
                    <div class="brand-showcase">
                        <div class="brand-logo-modern">
                            <img src="images/柑心商標.png" alt="柑心果園" class="logo-img">
                            <div class="brand-text-modern">
                                <h2>柑心果園</h2>
                                <p class="brand-subtitle">GANXIN ORCHARD</p>
                            </div>
                        </div>
                        <p class="brand-description-modern">
                            台中豐原公老坪優質水果供應商，傳承百年果園經驗，提供新鮮的椪柑、茂谷柑等優質水果，產地直送到府，讓您品嚐最純正的台灣水果風味。
                        </p>
                        <div class="brand-tags">
                            <span class="tag">友善栽培</span>
                            <span class="tag">產地直送</span>
                            <span class="tag">品質保證</span>
                        </div>
                    </div>
                </div>
                
                <!-- 右側連結區域 -->
                <div class="footer-right">
                    <div class="links-grid">
                        <div class="link-group">
                            <h4 class="group-title">
                                <i class="fas fa-handshake"></i>
                                服務專區
                            </h4>
                            <ul class="link-list">
                                <li><a href="about.html">關於我們</a></li>
                                <li><a href="news.html">最新動態</a></li>
                                <li><a href="products.html">精選商品</a></li>
                                <li><a href="farming.html">農場介紹</a></li>
                            </ul>
                        </div>
                        
                        <div class="link-group">
                            <h4 class="group-title">
                                <i class="fas fa-users"></i>
                                會員專區
                            </h4>
                            <ul class="link-list">
                                <li><a href="order-tracking.html">訂單查詢</a></li>
                                <li><a href="contact.html">門市資訊</a></li>
                                <li><a href="policies.html?type=faq">常見問題</a></li>
                                <li><a href="policies.html?type=terms">會員條款</a></li>
                            </ul>
                        </div>
                        
                        <div class="link-group">
                            <h4 class="group-title">
                                <i class="fas fa-shopping-bag"></i>
                                商品分類
                            </h4>
                            <ul class="link-list">
                                <li><a href="products.html?category=新鮮水果">新鮮水果</a></li>
                                <li><a href="products.html?category=季節限定">季節限定</a></li>
                                <li><a href="products.html?category=禮盒裝">禮盒裝</a></li>
                                <li><a href="season-recommend.html">季節推薦</a></li>
                            </ul>
                        </div>
                        
                        <div class="link-group">
                            <h4 class="group-title">
                                <i class="fas fa-phone"></i>
                                聯繫我們
                            </h4>
                            <div class="contact-modern">
                                <div class="contact-item-modern">
                                    <i class="fas fa-phone"></i>
                                    <div>
                                        <span class="contact-label">客服專線</span>
                                        <span class="contact-value">0933-721-978</span>
                                    </div>
                                </div>
                                <div class="contact-item-modern">
                                    <i class="fas fa-envelope"></i>
                                    <div>
                                        <span class="contact-label">電子信箱</span>
                                        <span class="contact-value">s9000721@gmail.com</span>
                                    </div>
                                </div>
                                <div class="contact-item-modern">
                                    <i class="fas fa-map-marker-alt"></i>
                                    <div>
                                        <span class="contact-label">營業地址</span>
                                        <span class="contact-value">台中市豐原區公老坪</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- 社群媒體區域 -->
            <div class="footer-social-modern">
                <div class="social-content">
                    <h4>關注我們</h4>
                    <p>追蹤我們的社群媒體，獲取最新優惠資訊</p>
                    <div class="social-buttons">
                        <a href="https://www.facebook.com/share/19vDVjSz9Y/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" class="social-btn facebook">
                            <i class="fab fa-facebook-f"></i>
                            <span>Facebook</span>
                        </a>
                        <a href="#" target="_blank" class="social-btn line">
                            <i class="fab fa-line"></i>
                            <span>LINE</span>
                        </a>
                        <a href="#" target="_blank" class="social-btn instagram">
                            <i class="fab fa-instagram"></i>
                            <span>Instagram</span>
                        </a>
                    </div>
                </div>
            </div>
            
            <!-- 品牌標語區域 -->
            <div class="footer-slogan">
                <div class="slogan-item">
                    <div class="slogan-icon">柑心</div>
                    <span>柑心果園 GANXIN ORCHARD</span>
                </div>
                <div class="slogan-item">
                    <div class="slogan-icon">優質</div>
                    <span>優質水果 QUALITY FRUITS</span>
                </div>
                <div class="slogan-item">
                    <div class="slogan-icon">直送</div>
                    <span>產地直送 FRESH DELIVERY</span>
                </div>
            </div>
            
            <!-- 版權資訊 -->
            <div class="footer-copyright">
                <p>&copy; 2025 柑心果園有限公司 | 版權所有 All Rights Reserved.</p>
                <p>台中豐原公老坪優質水果供應商 | 東勢茂谷柑產地直送</p>
            </div>
        </div>
    </footer>
"@

$backToTopTemplate = @"
    <!-- 回到頂部按鈕 -->
    <button id="backToTop" class="back-to-top" title="回到頂部">
        <i class="fas fa-chevron-up"></i>
    </button>
"@

$javascriptTemplate = @"
    <!-- 上一頁記憶功能 JavaScript -->
    <script>
    // 上一頁記憶功能
    function initBackButton() {
        // 檢查是否有上一頁歷史記錄
        if (window.history.length > 1) {
            const backButton = document.createElement('button');
            backButton.id = 'backButton';
            backButton.className = 'back-button';
            backButton.title = '回到上一頁';
            backButton.innerHTML = '<i class="fas fa-arrow-left"></i>';
            document.body.appendChild(backButton);

            backButton.addEventListener('click', function() {
                window.history.back();
            });
        }
    }

    // 回到頂部功能
    function initBackToTop() {
        const backToTopButton = document.getElementById('backToTop');
        
        if (backToTopButton) {
            // 顯示/隱藏按鈕
            window.addEventListener('scroll', function() {
                if (window.scrollY > 200) { // 捲動超過200px時顯示
                    backToTopButton.style.display = 'block';
                    backToTopButton.style.opacity = '1';
                } else {
                    backToTopButton.style.opacity = '0';
                    // 使用 setTimeout 延遲 display: none，確保動畫完成
                    setTimeout(() => {
                        if (window.scrollY <= 200) { // 再次檢查，避免快速捲動時的閃爍
                            backToTopButton.style.display = 'none';
                        }
                    }, 300);
                }
            });

            // 點擊回到頂部
            backToTopButton.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    // 購物車功能
    function initCartSidebar() {
        const cartIcon = document.getElementById('cartIcon');
        if (cartIcon) {
            cartIcon.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = 'cart.html';
            });
        }
    }

    // 手機選單功能
    function initMobileMenu() {
        const menuToggle = document.getElementById('menuToggle');
        const menuOverlay = document.getElementById('menuOverlay');
        const mainMenu = document.getElementById('mainMenu');
        const menuClose = document.getElementById('menuClose');
        const dropdowns = document.querySelectorAll('.menu-item.dropdown > .menu-link');

        if (menuToggle && menuOverlay && mainMenu && menuClose) {
            menuToggle.addEventListener('click', (e) => {
                e.stopPropagation(); // 防止點擊菜單按鈕時觸發 overlay 的點擊事件
                mainMenu.classList.add('show');
                menuOverlay.classList.add('show');
                document.body.style.overflow = 'hidden'; // 防止背景滾動
            });

            menuClose.addEventListener('click', () => {
                mainMenu.classList.remove('show');
                menuOverlay.classList.remove('show');
                document.body.style.overflow = ''; // 恢復背景滾動
            });

            menuOverlay.addEventListener('click', () => {
                mainMenu.classList.remove('show');
                menuOverlay.classList.remove('show');
                document.body.style.overflow = ''; // 恢復背景滾動
            });
        }

        // 下拉選單功能
        dropdowns.forEach(dropdownLink => {
            const submenu = dropdownLink.nextElementSibling;
            const arrow = dropdownLink.querySelector('.menu-arrow');

            if (submenu && arrow) {
                dropdownLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation(); // 阻止事件冒泡到父級菜單項

                    const isOpen = submenu.style.display === 'block';

                    // 關閉所有其他打開的下拉選單
                    dropdowns.forEach(otherDropdownLink => {
                        const otherSubmenu = otherDropdownLink.nextElementSibling;
                        const otherArrow = otherDropdownLink.querySelector('.menu-arrow');
                        if (otherSubmenu && otherArrow && otherSubmenu !== submenu) {
                            if (otherSubmenu.style.display === 'block') {
                                otherSubmenu.style.display = 'none';
                                otherArrow.style.transform = 'rotate(0deg)';
                            }
                        }
                    });
                    
                    // 切換當前下拉選單
                    if (isOpen) {
                        submenu.style.display = 'none';
                        arrow.style.transform = 'rotate(0deg)';
                    } else {
                        submenu.style.display = 'block';
                        arrow.style.transform = 'rotate(180deg)';
                    }
                });
            }
        });
    }

    // 頁面載入完成後執行
    document.addEventListener('DOMContentLoaded', () => {
        initBackButton(); // 初始化上一頁按鈕
        initBackToTop(); // 初始化回到頂部按鈕
        initCartSidebar(); // 初始化購物車側邊欄
        initMobileMenu(); // 初始化手機選單
    });
    </script>
"@

$cssTemplate = @"
    <!-- 回到頂部按鈕樣式 -->
    <style>
    .back-to-top {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s ease;
    }

    .back-to-top.show {
        opacity: 1;
        visibility: visible;
    }

    /* 上一頁按鈕樣式 */
    .back-button {
        position: fixed;
        bottom: 80px; /* 調整位置，避免與回到頂部按鈕重疊 */
        right: 20px;
        background-color: #6c757d; /* 灰色 */
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        transition: background-color 0.3s ease;
    }

    .back-button:hover {
        background-color: #5a6268;
    }

    @media (max-width: 768px) {
        .back-to-top, .back-button {
            width: 45px;
            height: 45px;
            font-size: 20px;
            bottom: 15px;
            right: 15px;
        }
        .back-button {
            bottom: 70px; /* 調整手機版位置 */
        }
    }
    </style>
"@

# 為每個頁面創建基本結構
foreach ($page in $pagesToFix) {
    Write-Host "修復頁面: $page" -ForegroundColor Yellow
    
    # 創建基本頁面結構
    $pageContent = @"
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>$($page.Replace('.html', '')) - 柑心果園</title>
    <meta name="description" content="柑心果園 - 優質水果供應商">
    <link rel="stylesheet" href="./css/style.css?v=20250115EE">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
$headerTemplate
$mobileMenuTemplate

    <!-- 主要內容 -->
    <main>
        <div class="container" style="padding: 4rem 0; text-align: center;">
            <h1 style="color: #ff6b35; font-size: 2.5rem; margin-bottom: 2rem;">$($page.Replace('.html', ''))</h1>
            <p style="color: #666; font-size: 1.2rem;">頁面內容正在更新中...</p>
        </div>
    </main>

$cartButtonsTemplate
$footerTemplate
$backToTopTemplate
$javascriptTemplate
$cssTemplate
</body>
</html>
"@
    
    # 寫入文件
    Set-Content -Path $page -Value $pageContent -Encoding UTF8
    Write-Host "完成: $page" -ForegroundColor Green
}

Write-Host "所有剩餘頁面修復完成！" -ForegroundColor Green
