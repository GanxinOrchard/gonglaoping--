#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
批量修正頁面的 Logo、麵包屑和 Footer
"""

import os
import re

# 需要修正的頁面列表
pages_to_fix = [
    'season-recommend.html',
    'season-water-chestnut.html',
    'season-taro.html',
    'guide-ponkan.html',
    'guide-murcott.html',
    'guide-water-chestnut.html',
    'guide-taro.html',
    'grading-ponkan.html',
    'grading-murcott.html'
]

# 麵包屑模板
breadcrumb_templates = {
    'season-recommend.html': '''
    <!-- 麵包屑導航 -->
    <nav class="breadcrumb">
        <a href="index.html"><i class="fas fa-home"></i> 首頁</a>
        <span class="breadcrumb-separator">/</span>
        <a href="season-recommend.html">本季嚴選</a>
        <span class="breadcrumb-separator">/</span>
        <span>當季推薦</span>
    </nav>
''',
    'season-water-chestnut.html': '''
    <!-- 麵包屑導航 -->
    <nav class="breadcrumb">
        <a href="index.html"><i class="fas fa-home"></i> 首頁</a>
        <span class="breadcrumb-separator">/</span>
        <a href="season-recommend.html">本季嚴選</a>
        <span class="breadcrumb-separator">/</span>
        <span>菱角產季</span>
    </nav>
''',
    'season-taro.html': '''
    <!-- 麵包屑導航 -->
    <nav class="breadcrumb">
        <a href="index.html"><i class="fas fa-home"></i> 首頁</a>
        <span class="breadcrumb-separator">/</span>
        <a href="season-recommend.html">本季嚴選</a>
        <span class="breadcrumb-separator">/</span>
        <span>芋角產季</span>
    </nav>
''',
    'guide-ponkan.html': '''
    <!-- 麵包屑導航 -->
    <nav class="breadcrumb">
        <a href="index.html"><i class="fas fa-home"></i> 首頁</a>
        <span class="breadcrumb-separator">/</span>
        <a href="guide.html">挑選指南</a>
        <span class="breadcrumb-separator">/</span>
        <span>椪柑挑選</span>
    </nav>
''',
    'guide-murcott.html': '''
    <!-- 麵包屑導航 -->
    <nav class="breadcrumb">
        <a href="index.html"><i class="fas fa-home"></i> 首頁</a>
        <span class="breadcrumb-separator">/</span>
        <a href="guide.html">挑選指南</a>
        <span class="breadcrumb-separator">/</span>
        <span>茂谷柑挑選</span>
    </nav>
''',
    'guide-water-chestnut.html': '''
    <!-- 麵包屑導航 -->
    <nav class="breadcrumb">
        <a href="index.html"><i class="fas fa-home"></i> 首頁</a>
        <span class="breadcrumb-separator">/</span>
        <a href="guide.html">挑選指南</a>
        <span class="breadcrumb-separator">/</span>
        <span>菱角挑選</span>
    </nav>
''',
    'guide-taro.html': '''
    <!-- 麵包屑導航 -->
    <nav class="breadcrumb">
        <a href="index.html"><i class="fas fa-home"></i> 首頁</a>
        <span class="breadcrumb-separator">/</span>
        <a href="guide.html">挑選指南</a>
        <span class="breadcrumb-separator">/</span>
        <span>芋角挑選</span>
    </nav>
''',
    'grading-ponkan.html': '''
    <!-- 麵包屑導航 -->
    <nav class="breadcrumb">
        <a href="index.html"><i class="fas fa-home"></i> 首頁</a>
        <span class="breadcrumb-separator">/</span>
        <a href="grading.html">規格分級</a>
        <span class="breadcrumb-separator">/</span>
        <span>椪柑規格</span>
    </nav>
''',
    'grading-murcott.html': '''
    <!-- 麵包屑導航 -->
    <nav class="breadcrumb">
        <a href="index.html"><i class="fas fa-home"></i> 首頁</a>
        <span class="breadcrumb-separator">/</span>
        <a href="grading.html">規格分級</a>
        <span class="breadcrumb-separator">/</span>
        <span>茂谷柑規格</span>
    </nav>
'''
}

# 完整的 Footer HTML
footer_html = '''
    <!-- 頁尾 -->
    <footer class="footer">
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
    </footer>
'''

def fix_page(filename):
    """修正單個頁面"""
    filepath = filename
    
    if not os.path.exists(filepath):
        print(f"❌ 檔案不存在: {filename}")
        return False
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # 1. 修正 Logo 圖片路徑
        content = content.replace(
            '<img src="./images/logo.png" alt="柑心果園">',
            '<img src="./images/商標.jpg" alt="柑心果園" width="180" height="60" loading="lazy">'
        )
        content = content.replace(
            '<img src="images/logo.png" alt="柑心果園">',
            '<img src="./images/商標.jpg" alt="柑心果園" width="180" height="60" loading="lazy">'
        )
        
        # 2. 添加麵包屑導航（如果不存在）
        if filename in breadcrumb_templates and '<!-- 麵包屑導航 -->' not in content:
            # 在 </header> 後面插入麵包屑
            content = content.replace('</header>', '</header>' + breadcrumb_templates[filename])
        
        # 3. 確保有完整的 Footer
        if '<footer class="footer">' not in content or '版權所有，翻印必究' not in content:
            # 找到 </body> 前面插入 footer
            if '</body>' in content:
                # 先移除舊的不完整 footer
                content = re.sub(r'<footer.*?</footer>', '', content, flags=re.DOTALL)
                # 在 </body> 前插入新 footer
                content = content.replace('</body>', footer_html + '\n</body>')
        
        # 只有內容有變化才寫入
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ 已修正: {filename}")
            return True
        else:
            print(f"ℹ️  無需修正: {filename}")
            return False
            
    except Exception as e:
        print(f"❌ 處理 {filename} 時發生錯誤: {str(e)}")
        return False

def main():
    """主函數"""
    print("=" * 60)
    print("開始批量修正頁面...")
    print("=" * 60)
    
    fixed_count = 0
    for filename in pages_to_fix:
        if fix_page(filename):
            fixed_count += 1
        print()
    
    print("=" * 60)
    print(f"完成！共修正 {fixed_count} 個頁面")
    print("=" * 60)

if __name__ == '__main__':
    main()
