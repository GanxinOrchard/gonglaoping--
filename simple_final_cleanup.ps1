# 簡單的最終清理腳本
Write-Host "開始清理所有分頁..." -ForegroundColor Green

$files = @(
    "about.html", "news.html", "contact.html", "products.html", "farming.html", 
    "season.html", "grading.html", "guide.html", "knowledge.html", "policies.html",
    "cart.html", "checkout.html", "confirm.html", "grading-murcott.html", 
    "grading-ponkan.html", "grading-taro.html", "grading-water-chestnut.html",
    "guide-murcott.html", "guide-ponkan.html", "guide-taro.html", "guide-water-chestnut.html",
    "knowledge-detail.html", "linepay-confirm.html", "linepay.html", "news-detail.html",
    "order-complete.html", "order-tracking.html", "product-detail.html",
    "season-murcott.html", "season-ponkan.html", "season-recommend.html",
    "season-taro.html", "season-water-chestnut.html", "404.html"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "清理: $file" -ForegroundColor Yellow
        $content = Get-Content $file -Raw -Encoding UTF8
        
        # 清理購物車按鈕
        $content = $content -replace '<button class="close-cart".*?</button>', ''
        
        # 清理購物車相關div
        $content = $content -replace '<div class="shipping-row".*?</div>', ''
        $content = $content -replace '<div class="discount-amount".*?</div>', ''
        $content = $content -replace '<div class="total".*?</div>', ''
        
        # 清理購物車JavaScript
        $content = $content -replace 'const cartIcon.*?cart\.html.*?}', ''
        $content = $content -replace 'if \(cartIcon\).*?}', ''
        
        # 清理Ganxin Orchard
        $content = $content -replace 'Ganxin Orchard', ''
        $content = $content -replace '台中市豐原區公老坪', ''
        
        # 清理logo-sub CSS
        $content = $content -replace '\.menu-logo-text \.logo-sub\s*\{[^}]*\}', ''
        
        # 清理多餘空行
        $content = $content -replace '\r?\n\s*\r?\n\s*\r?\n', "`n`n"
        
        Set-Content -Path $file -Value $content -Encoding UTF8 -NoNewline
        Write-Host "完成: $file" -ForegroundColor Green
    }
}

Write-Host "清理完成！" -ForegroundColor Green
