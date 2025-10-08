# 快速批次更新所有 HTML 檔案的導覽列

$files = @(
    "guide-ponkan.html", "guide-murcott.html", "guide-water-chestnut.html", "guide-taro.html", "guide.html",
    "grading-ponkan.html", "grading-murcott.html", "grading.html",
    "season-recommend.html", "season-water-chestnut.html", "season-taro.html", "season.html",
    "knowledge.html", "knowledge-detail.html", "news-detail.html",
    "order-tracking.html", "policies.html", "product-detail.html"
)

$oldNav = @'
                            <a href="products.html">全部商品 <i class="fas fa-chevron-down"></i></a>
                            <ul class="dropdown-menu">
                                <li><a href="products.html">所有商品</a></li>
                                <li><a href="grading.html">規格分級</a></li>
                                <li><a href="farming.html">友善栽培</a></li>
                                <li><a href="guide.html">挑選指南</a></li>
                                <li><a href="season.html">產季資訊</a></li>
                                <li><a href="knowledge.html">蔬果知識+</a></li>
                            </ul>
'@

$newNav = @'
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
'@

$oldAbout = @'
                            <a href="about.html">關於我們 <i class="fas fa-chevron-down"></i></a>
                            <ul class="dropdown-menu">
                                <li><a href="contact.html">聯絡我們</a></li>
                            </ul>
'@

$newAbout = @'
                            <a href="about.html">關於我們 <i class="fas fa-chevron-down"></i></a>
                            <ul class="dropdown-menu">
                                <li><a href="about.html">關於柑心果園</a></li>
                                <li><a href="contact.html">聯絡我們</a></li>
                            </ul>
'@

$updated = 0
foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw -Encoding UTF8
        $originalContent = $content
        
        # 更新導覽列
        $content = $content -replace [regex]::Escape($oldNav), $newNav
        
        # 更新關於我們
        $content = $content -replace [regex]::Escape($oldAbout), $newAbout
        
        if ($content -ne $originalContent) {
            $content | Out-File $file -Encoding UTF8 -NoNewline
            Write-Host "✓ 已更新: $file" -ForegroundColor Green
            $updated++
        } else {
            Write-Host "- 跳過: $file (無需更新)" -ForegroundColor Yellow
        }
    } else {
        Write-Host "✗ 找不到: $file" -ForegroundColor Red
    }
}

Write-Host "`n完成！共更新 $updated 個檔案" -ForegroundColor Cyan
