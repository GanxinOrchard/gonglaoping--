# 批次簡化所有頁面的導覽列 - 移除下拉選單，改為9個平行按鈕

$files = @(
    "about.html", "contact.html", "farming.html", "products.html",
    "guide.html", "guide-ponkan.html", "guide-murcott.html", "guide-water-chestnut.html", "guide-taro.html",
    "grading.html", "grading-ponkan.html", "grading-murcott.html",
    "season-recommend.html", "season-ponkan.html", "season-murcott.html", "season-water-chestnut.html", "season-taro.html", "season.html",
    "knowledge.html", "knowledge-detail.html",
    "news.html", "news-detail.html",
    "order-tracking.html", "policies.html", "product-detail.html"
)

# 新的簡化導覽列（9個平行按鈕）
$newNav = @'
                <div class="main-menu" id="mainMenu">
                    <ul>
                        <li><a href="index.html">首頁</a></li>
                        <li><a href="news.html">最新消息</a></li>
                        <li><a href="season-recommend.html">本季嚴選</a></li>
                        <li><a href="products.html">全部商品</a></li>
                        <li><a href="farming.html">安心指南</a></li>
                        <li><a href="guide.html">挑選指南</a></li>
                        <li><a href="grading.html">規格分級</a></li>
                        <li><a href="about.html">關於我們</a></li>
                        <li><a href="order-tracking.html">訂單查詢</a></li>
                    </ul>
                </div>
'@

$updated = 0
foreach ($file in $files) {
    if (Test-Path $file) {
        try {
            $content = Get-Content $file -Raw -Encoding UTF8
            
            # 使用正則表達式匹配整個 main-menu 區塊
            $pattern = '<div class="main-menu" id="mainMenu">.*?</div>\s*</div>\s*</nav>'
            
            if ($content -match $pattern) {
                $replacement = $newNav + "`n            </div>`n        </nav>"
                $content = $content -replace $pattern, $replacement
                
                $content | Out-File $file -Encoding UTF8 -NoNewline
                Write-Host "✓ 已更新: $file" -ForegroundColor Green
                $updated++
            } else {
                Write-Host "- 跳過: $file (找不到導覽列區塊)" -ForegroundColor Yellow
            }
        } catch {
            Write-Host "✗ 錯誤: $file - $_" -ForegroundColor Red
        }
    } else {
        Write-Host "✗ 找不到: $file" -ForegroundColor Red
    }
}

Write-Host "`n完成！共更新 $updated 個檔案" -ForegroundColor Cyan
