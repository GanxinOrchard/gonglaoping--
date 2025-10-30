#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
about.html 轉換腳本
將 about.html 改造為使用統一模板系統
"""

import re

# 讀取檔案
with open('about.html', 'r', encoding='utf-8') as f:
    content = f.read()

print("開始轉換 about.html...")

# 1. 替換頁頭（從 <!-- 主要導覽列 --> 到 </header>）
header_pattern = r'<!-- 主要導覽列 -->.*?</header>'
header_replacement = '<!-- 統一頁頭 -->\n    <div id="header-container"></div>'
content = re.sub(header_pattern, header_replacement, content, flags=re.DOTALL)
print("✓ 頁頭已替換")

# 2. 替換手機選單（從 <!-- 手機選單 到第二個 </div>）
menu_pattern = r'<!-- 手機選單.*?</div>\s*</div>\s*\n'
menu_replacement = '<!-- 手機選單 -->\n    <div id="mobile-menu-container"></div>\n\n'
content = re.sub(menu_pattern, menu_replacement, content, flags=re.DOTALL)
print("✓ 手機選單已替換")

# 3. 替換頁尾（從 <footer 到 </footer>）
footer_pattern = r'<footer class="footer.*?</footer>'
footer_replacement = '<!-- 統一頁尾 -->\n    <div id="footer-container"></div>'
content = re.sub(footer_pattern, footer_replacement, content, flags=re.DOTALL)
print("✓ 頁尾已替換")

# 4. 更新 JavaScript（在 </body> 之前）
# 先移除舊的 JS 引用
old_js_pattern = r'<script src="js/mobile-menu-simple\.js.*?</script>\s*<script src="js/dropdown-menu\.js.*?</script>\s*<script src="js/cart\.js.*?</script>\s*<script src="js/main\.js.*?</script>'
content = re.sub(old_js_pattern, '', content, flags=re.DOTALL)

# 添加新的 JS
new_js = '''    <!-- JavaScript -->
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <script>
        AOS.init({
            duration: 1000,
            once: true
        });
    </script>
    <script src="./js/template-loader.js"></script>
    <script src="./js/mobile-menu-simple.js" defer></script>
    <script src="./js/dropdown-menu.js" defer></script>
    <script src="./js/cart.js" defer></script>
    <script src="./js/main.js" defer></script>
</body>
</html>'''

# 替換 </body></html>
content = re.sub(r'</body>\s*</html>', new_js, content)
print("✓ JavaScript 已更新")

# 儲存新檔案
with open('about-converted.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("\n✅ 轉換完成！")
print("新檔案已儲存為：about-converted.html")
print("\n請檢查 about-converted.html，確認無誤後：")
print("1. 刪除 about.html")
print("2. 將 about-converted.html 重新命名為 about.html")
print("\n或者執行：")
print("  move about-converted.html about.html")
