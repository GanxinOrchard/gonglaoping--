# 清理購物車按鈕和相關內容
Write-Host "清理購物車按鈕..." -ForegroundColor Green

$files = @("farming.html", "grading.html", "guide.html", "products.html", "knowledge.html")

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "處理: $file" -ForegroundColor Yellow
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
        
        # 清理多餘空行
        $content = $content -replace '\r?\n\s*\r?\n\s*\r?\n', "`n`n"
        
        Set-Content -Path $file -Value $content -Encoding UTF8 -NoNewline
        Write-Host "完成: $file" -ForegroundColor Green
    }
}

Write-Host "清理完成！" -ForegroundColor Green
