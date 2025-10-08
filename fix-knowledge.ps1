# 讀取文件
$content = Get-Content -Path "knowledge.html" -Raw -Encoding UTF8

# 1. 修改 CSS - 將輪播改成九宮格
$content = $content -replace '\.knowledge-carousel-container \{[^}]+\}', ''
$content = $content -replace '\.knowledge-carousel \{[^}]+\}', ''
$content = $content -replace '\.knowledge-carousel::-webkit-scrollbar \{[^}]+\}', ''
$content = $content -replace '\.knowledge-carousel\.grabbing \{[^}]+\}', ''

# 添加九宮格 CSS
$gridCSS = @"
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
        
"@

$content = $content -replace '(\.knowledge-section \{[^}]+\})', "`$1`n`n$gridCSS"

# 2. 修改 HTML 結構
$content = $content -replace '<div class="knowledge-carousel-container">', '<div class="knowledge-grid">'
$content = $content -replace '<div class="knowledge-carousel" id="knowledgeCarousel">', ''
$content = $content -replace '</div>\s*<div class="carousel-controls">[\s\S]*?</div>\s*</div>', '</div>'

# 3. 修改 knowledge-card 樣式
$content = $content -replace 'flex: 0 0 350px;', ''

# 4. 添加麵包屑
$breadcrumb = @"
    </header>

    <!-- 麵包屑導航 -->
    <nav class="breadcrumb">
        <a href="index.html"><i class="fas fa-home"></i> 首頁</a>
        <span class="breadcrumb-separator">/</span>
        <span>蔬果知識+</span>
    </nav>

    <script>
"@

$content = $content -replace '</header>\s*<script>', $breadcrumb

# 5. 移除拖曳功能的 JavaScript
$content = $content -replace '// 拖曳滑動功能[\s\S]*?}\);[\s\S]*?}\);', ''

# 寫入文件
$content | Out-File -FilePath "knowledge.html" -Encoding UTF8 -NoNewline

Write-Host "knowledge.html 修改完成！" -ForegroundColor Green
