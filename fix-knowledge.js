const fs = require('fs');

// 讀取文件
let content = fs.readFileSync('knowledge.html', 'utf8');

// 1. 修改 CSS - 添加九宮格樣式
const cssReplacement = `        .knowledge-section {
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
        }`;

// 替換 CSS
const cssPattern = /\.knowledge-section \{[^}]+\}[\s\S]*?\.knowledge-card \{[^}]+\}/;
content = content.replace(cssPattern, cssReplacement);

// 2. 添加麵包屑
const breadcrumb = `    </header>

    <!-- 麵包屑導航 -->
    <nav class="breadcrumb">
        <a href="index.html"><i class="fas fa-home"></i> 首頁</a>
        <span class="breadcrumb-separator">/</span>
        <span>蔬果知識+</span>
    </nav>

    <script>`;

content = content.replace('    </header>\n    <script>', breadcrumb);

// 3. 修改 HTML 結構
content = content.replace('<div class="knowledge-carousel-container">', '<div class="knowledge-grid">');
content = content.replace('<div class="knowledge-carousel" id="knowledgeCarousel">', '');

// 移除輪播控制按鈕
const carouselPattern = /<\/div>\s*<div class="carousel-controls">[\s\S]*?<\/div>\s*<\/div>/;
content = content.replace(carouselPattern, '</div>');

// 移除拖曳功能的 JavaScript
const jsPattern = /\/\/ 拖曳滑動功能[\s\S]*?\}\);[\s\S]*?\}\);/;
content = content.replace(jsPattern, '');

// 寫入文件
fs.writeFileSync('knowledge.html', content, 'utf8');

console.log('✅ knowledge.html 修改完成！');
