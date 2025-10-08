# -*- coding: utf-8 -*-
import os
import re
from pathlib import Path

# 標準導覽列 HTML
STANDARD_NAV = '''                <div class="main-menu" id="mainMenu">
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
                                <li><a href="farming.html">友善栽培</a></li>
                            </ul>
                        </li>
                        <li class="dropdown">
                            <a href="guide.html">挑選指南 <i class="fas fa-chevron-down"></i></a>
                            <ul class="dropdown-menu">
                                <li><a href="guide-ponkan.html">椪柑挑選</a></li>
                                <li><a href="guide-murcott.html">茂谷柑挑選</a></li>
                                <li><a href="guide-water-chestnut.html">菱角挑選</a></li>
                                <li><a href="guide-taro.html">芋角挑選</a></li>
                            </ul>
                        </li>
                        <li class="dropdown">
                            <a href="grading.html">規格分級 <i class="fas fa-chevron-down"></i></a>
                            <ul class="dropdown-menu">
                                <li><a href="grading-ponkan.html">椪柑規格</a></li>
                                <li><a href="grading-murcott.html">茂谷柑規格</a></li>
                            </ul>
                        </li>
                        <li class="dropdown">
                            <a href="about.html">關於我們 <i class="fas fa-chevron-down"></i></a>
                            <ul class="dropdown-menu">
                                <li><a href="about.html">關於柑心果園</a></li>
                                <li><a href="contact.html">聯絡我們</a></li>
                            </ul>
                        </li>
                        <li><a href="order-tracking.html">訂單查詢</a></li>
                    </ul>
                </div>'''

# 標準底部 HTML
STANDARD_FOOTER = '''    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h4>關於柑心果園</h4>
                    <p>我們致力於提供最新鮮、最優質的台灣在地農產品，從產地直送到您家，讓您吃得安心、健康。</p>
                    <div class="social-links">
                        <a href="https://www.facebook.com/share/19vDVjSz9Y/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer"><i class="fab fa-facebook"></i></a>
                        <a href="#" target="_blank"><i class="fab fa-instagram"></i></a>
                        <a href="#" target="_blank"><i class="fab fa-line"></i></a>
                        <a href="#" target="_blank"><i class="fab fa-youtube"></i></a>
                    </div>
                </div>
                <div class="footer-section">
                    <h4>客戶服務</h4>
                    <ul>
                        <li><a href="policies.html?type=faq">常見問題</a></li>
                        <li><a href="policies.html?type=shipping">配送說明</a></li>
                        <li><a href="policies.html?type=return">退換貨政策</a></li>
                        <li><a href="policies.html?type=privacy">隱私權政策</a></li>
                        <li><a href="policies.html?type=terms">服務條款</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>購物指南</h4>
                    <ul>
                        <li><a href="policies.html?type=how-to-order">如何訂購</a></li>
                        <li><a href="policies.html?type=payment">付款方式</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>聯絡我們</h4>
                    <ul class="contact-list">
                        <li><i class="fas fa-phone"></i> 0933-721-978</li>
                        <li><i class="fas fa-envelope"></i> s9000721@gmail.com</li>
                        <li><i class="fas fa-map-marker-alt"></i> 台灣台中市豐原區公老坪/東勢/柑心果園</li>
                        <li><i class="fas fa-clock"></i> 週一至週五 12:00-18:00</li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2025 柑心果園 Ganxin Orchard. 版權所有，翻印必究。</p>
            </div>
        </div>
    </footer>'''

# 標準 Logo HTML
STANDARD_LOGO = '''                    <div class="logo">
                        <a href="index.html">
                            <img src="./images/商標.jpg" alt="柑心果園" loading="lazy" width="180" height="60">
                        </a>
                    </div>'''

def update_html_file(filepath):
    """更新單個 HTML 檔案"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # 更新 Logo
        logo_pattern = r'<div class="logo">.*?</div>\s*</div>\s*<div class="nav-icons">'
        if re.search(logo_pattern, content, re.DOTALL):
            content = re.sub(
                logo_pattern,
                STANDARD_LOGO + '\n                    \n                    <div class="nav-icons">',
                content,
                flags=re.DOTALL
            )
        
        # 更新導覽列
        nav_pattern = r'<div class="main-menu" id="mainMenu">.*?</div>\s*</div>\s*</div>\s*</nav>'
        if re.search(nav_pattern, content, re.DOTALL):
            content = re.sub(
                nav_pattern,
                STANDARD_NAV + '\n            </div>\n        </div>\n    </nav>',
                content,
                flags=re.DOTALL
            )
        
        # 更新底部
        footer_pattern = r'<footer class="footer">.*?</footer>'
        if re.search(footer_pattern, content, re.DOTALL):
            content = re.sub(
                footer_pattern,
                STANDARD_FOOTER,
                content,
                flags=re.DOTALL
            )
        
        # 如果有更新，寫回檔案
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
        
    except Exception as e:
        print(f"錯誤處理 {filepath}: {str(e)}")
        return False

def main():
    """主程式"""
    base_dir = Path(__file__).parent
    
    # 要更新的檔案列表（排除測試和診斷檔案）
    html_files = [
        'about.html', 'cart.html', 'checkout.html', 'contact.html',
        'farming.html', 'grading-murcott.html', 'grading-ponkan.html',
        'grading.html', 'guide-murcott.html', 'guide-ponkan.html',
        'guide-taro.html', 'guide-water-chestnut.html', 'guide.html',
        'knowledge-detail.html', 'knowledge.html', 'news-detail.html',
        'news.html', 'order-complete.html', 'order-tracking.html',
        'policies.html', 'product-detail.html', 'products.html',
        'season-murcott.html', 'season-ponkan.html', 'season-recommend.html',
        'season-taro.html', 'season-water-chestnut.html', 'season.html'
    ]
    
    updated_count = 0
    for filename in html_files:
        filepath = base_dir / filename
        if filepath.exists():
            if update_html_file(filepath):
                print(f"✓ 已更新: {filename}")
                updated_count += 1
            else:
                print(f"- 跳過: {filename} (無需更新或找不到對應區塊)")
        else:
            print(f"✗ 找不到: {filename}")
    
    print(f"\n完成！共更新 {updated_count} 個檔案")

if __name__ == '__main__':
    main()
