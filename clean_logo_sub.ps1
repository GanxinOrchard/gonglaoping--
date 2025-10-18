# 清理所有頁面中的 logo-sub CSS 樣式
$files = @(
    "season.html", "season-water-chestnut.html", "season-taro.html", "season-recommend.html", 
    "season-ponkan.html", "season-murcott.html", "product-detail.html", "policies.html", 
    "order-tracking.html", "order-complete.html", "news-detail.html", "linepay.html", 
    "linepay-confirm.html", "knowledge.html", "knowledge-detail.html", "guide.html", 
    "guide-water-chestnut.html", "guide-taro.html", "guide-ponkan.html", "guide-murcott.html", 
    "grading.html", "grading-water-chestnut.html", "grading-taro.html", "grading-ponkan.html", 
    "grading-murcott.html", "confirm.html", "checkout.html", "cart.html"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "處理: $file"
        $content = Get-Content $file -Raw
        $original = $content
        
        # 移除 logo-sub CSS 樣式
        $content = $content -replace '(?s)\.menu-logo-text \.logo-sub \{[^}]*\}', ''
        
        # 移除空行
        $content = $content -replace '\n\s*\n\s*\n', "`n`n"
        
        if ($content -ne $original) {
            Set-Content $file $content -Encoding UTF8
            Write-Host "  已更新: $file" -ForegroundColor Green
        } else {
            Write-Host "  無需更新: $file" -ForegroundColor Cyan
        }
    }
}

Write-Host "清理完成！"
