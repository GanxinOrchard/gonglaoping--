# 批量更新所有頁面的導覽列
# 統一導覽列結構

$standardNav = @'
                <div class="main-menu" id="mainMenu">
                    <ul>
                        <li><a href="index.html">首頁</a></li>
                        <li><a href="news.html">最新消息</a></li>
                        <li class="dropdown">
                            <a href="products.html">全部商品 <i class="fas fa-chevron-down"></i></a>
                            <ul class="dropdown-menu">
                                <li><a href="products.html">所有商品</a></li>
                                <li><a href="grading.html">規格分級</a></li>
                                <li><a href="farming.html">友善栽培</a></li>
                                <li><a href="guide.html">挑選指南</a></li>
                                <li><a href="season.html">產季資訊</a></li>
                                <li><a href="knowledge.html">蔬果知識+</a></li>
                            </ul>
                        </li>
                        <li class="dropdown">
                            <a href="about.html">關於我們 <i class="fas fa-chevron-down"></i></a>
                            <ul class="dropdown-menu">
                                <li><a href="contact.html">聯絡我們</a></li>
                            </ul>
                        </li>
                        <li><a href="order-tracking.html">訂單查詢</a></li>
                    </ul>
                </div>
'@

# 需要更新的檔案列表
$files = @(
    "product-detail.html",
    "knowledge-detail.html",
    "news-detail.html",
    "order-tracking.html",
    "policies.html",
    "grading-murcott.html",
    "grading-ponkan.html",
    "grading-taro.html",
    "grading-water-chestnut.html",
    "guide-murcott.html",
    "guide-ponkan.html",
    "guide-taro.html",
    "guide-water-chestnut.html",
    "season-murcott.html",
    "season-ponkan.html",
    "season-recommend.html",
    "season-taro.html",
    "season-water-chestnut.html"
)

foreach ($file in $files) {
    $filePath = Join-Path $PSScriptRoot $file
    
    if (Test-Path $filePath) {
        Write-Host "處理: $file" -ForegroundColor Yellow
        
        $content = Get-Content $filePath -Raw -Encoding UTF8
        
        # 使用正則表達式替換導覽列
        $pattern = '(?s)<div class="main-menu"[^>]*>.*?</div>\s*</div>\s*</nav>'
        
        if ($content -match $pattern) {
            $content = $content -replace $pattern, ($standardNav + "`n            </div>`n        </nav>")
            
            # 寫回檔案
            $content | Set-Content $filePath -Encoding UTF8 -NoNewline
            Write-Host "  ✓ 已更新" -ForegroundColor Green
        } else {
            Write-Host "  ✗ 找不到導覽列結構" -ForegroundColor Red
        }
    } else {
        Write-Host "  ✗ 檔案不存在: $file" -ForegroundColor Red
    }
}

Write-Host "`n完成！" -ForegroundColor Cyan
