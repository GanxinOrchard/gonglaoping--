# 深度清理腳本 - 清理所有殘留的購物車和社群媒體圖標
Write-Host "開始深度清理..." -ForegroundColor Green

$files = @("farming.html", "grading.html", "guide.html", "products.html", "knowledge.html", "about.html", "news.html", "contact.html", "season.html", "policies.html")

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "深度清理: $file" -ForegroundColor Yellow
        $content = Get-Content $file -Raw -Encoding UTF8
        
        # 清理購物車相關HTML
        $content = $content -replace '<span id="total">.*?</span>', ''
        $content = $content -replace '<div class="shipping-notice">.*?</div>', ''
        $content = $content -replace '<div class="discount-notice">.*?</div>', ''
        $content = $content -replace '<button class="btn-checkout".*?</button>', ''
        $content = $content -replace '<div class="cart.*?</div>', ''
        
        # 清理購物車JavaScript
        $content = $content -replace 'function initCartSidebar.*?}', ''
        $content = $content -replace 'document\.addEventListener.*?initCartSidebar.*?;', ''
        
        # 清理社群媒體圖標
        $content = $content -replace '<i class="fab fa-facebook"></i>', ''
        $content = $content -replace '<i class="fab fa-line"></i>', ''
        $content = $content -replace '<i class="fab fa-instagram"></i>', ''
        $content = $content -replace '<i class="fas fa-envelope"></i>', ''
        
        # 清理Facebook連結
        $content = $content -replace '<a href="https://www\.facebook\.com.*?</a>', ''
        
        # 清理多餘的div和空行
        $content = $content -replace '\s*</div>\s*</div>\s*</div>\s*', ''
        $content = $content -replace '\r?\n\s*\r?\n\s*\r?\n', "`n`n"
        
        # 清理破損的JavaScript
        $content = $content -replace '\);', ''
        $content = $content -replace '}\s*}\s*</script>', '}</script>'
        
        Set-Content -Path $file -Value $content -Encoding UTF8 -NoNewline
        Write-Host "完成: $file" -ForegroundColor Green
    }
}

Write-Host "深度清理完成！" -ForegroundColor Green
