# 簡單清理腳本
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
        
        # 清理 meta author
        $content = $content -replace 'content="柑心果園 Ganxin Orchard"', 'content="柑心果園"'
        
        # 清理 geo.placename
        $content = $content -replace 'content="台灣台中市豐原區公老坪/東勢/柑心果園"', 'content="台灣台中市豐原區公老坪/東勢"'
        $content = $content -replace 'content="台中豐原公老坪/東勢/柑心果園"', 'content="台中豐原公老坪/東勢"'
        
        # 清理 logo-sub
        $content = $content -replace '<div class="logo-sub">Ganxin Orchard</div>', ''
        
        # 清理地址
        $content = $content -replace '<span>台中市豐原區公老坪</span>', ''
        $content = $content -replace '<span>台中豐原公老坪</span>', ''
        
        if ($content -ne $original) {
            Set-Content $file $content -Encoding UTF8
            Write-Host "  已更新: $file" -ForegroundColor Green
        } else {
            Write-Host "  無需更新: $file" -ForegroundColor Cyan
        }
    }
}

Write-Host "清理完成！"
