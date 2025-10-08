import re
import os

# 需要處理的文件列表
files = [
    'about.html',
    'contact.html', 
    'knowledge-detail.html',
    'knowledge.html',
    'news-detail.html',
    'news.html',
    'order-tracking.html',
    'policies.html'
]

# 要移除的懸浮按鈕模式
floating_pattern = r'<!-- 懸浮.*?</div>\s*'

# 回到頂部按鈕HTML
back_to_top = '''
    <!-- 回到頂部按鈕 -->
    <button class="back-to-top" id="backToTop" aria-label="回到頂部">
        <i class="fas fa-arrow-up"></i>
    </button>
'''

for filename in files:
    filepath = filename
    if not os.path.exists(filepath):
        print(f"文件不存在: {filepath}")
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 移除懸浮按鈕
    content = re.sub(r'<!-- 懸浮 Menu 按鈕 -->.*?</button>\s*', '', content, flags=re.DOTALL)
    content = re.sub(r'<!-- 懸浮購物車按鈕 -->.*?</div>\s*', '', content, flags=re.DOTALL)
    
    # 檢查是否已有回到頂部按鈕
    if 'back-to-top' not in content:
        # 在 footer 結束後添加回到頂部按鈕
        content = re.sub(r'(</footer>)', r'\1' + back_to_top, content)
    
    # 檢查是否有載入 main.js
    if 'main.js' not in content:
        # 在 </body> 前添加
        content = re.sub(r'(</body>)', r'    <script src="./js/main.js"></script>\n\1', content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"已處理: {filename}")

print("完成！")
