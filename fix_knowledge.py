#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import re

# 讀取文件
with open('knowledge.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. 修改 CSS - 添加九宮格樣式
css_replacement = '''        .knowledge-section {
            padding: 60px 0;
            background: #f0fdf4;
        }
        
        .knowledge-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 30px;
            padding: 20px 0;
        }
        
        @media (max-width: 768px) {
            .knowledge-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 20px;
            }
        }
        
        .knowledge-card {
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            transition: all 0.3s;
        }'''

# 替換 CSS
pattern = r'\.knowledge-section \{[^}]+\}.*?\.knowledge-card \{[^}]+\}'
content = re.sub(pattern, css_replacement, content, flags=re.DOTALL)

# 2. 添加麵包屑
breadcrumb = '''    </header>

    <!-- 麵包屑導航 -->
    <nav class="breadcrumb">
        <a href="index.html"><i class="fas fa-home"></i> 首頁</a>
        <span class="breadcrumb-separator">/</span>
        <span>蔬果知識+</span>
    </nav>

    <script>'''

content = content.replace('    </header>\n    <script>', breadcrumb)

# 3. 修改 HTML 結構 - 將輪播改成九宮格
content = content.replace('<div class="knowledge-carousel-container">', '<div class="knowledge-grid">')
content = content.replace('<div class="knowledge-carousel" id="knowledgeCarousel">', '')

# 移除輪播控制按鈕
pattern = r'</div>\s*<div class="carousel-controls">.*?</div>\s*</div>'
content = re.sub(pattern, '</div>', content, flags=re.DOTALL)

# 移除拖曳功能的 JavaScript
pattern = r'// 拖曳滑動功能.*?}\);.*?}\);'
content = re.sub(pattern, '', content, flags=re.DOTALL)

# 寫入文件
with open('knowledge.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ knowledge.html 修改完成！")
