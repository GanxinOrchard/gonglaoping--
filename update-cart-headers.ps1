# 批量更新購物車側邊欄 Header，加入 Logo
# 使用方法：在 PowerShell 中執行此腳本

$files = @(
    "about.html",
    "contact.html",
    "farming.html",
    "grading.html",
    "guide.html",
    "knowledge-detail.html",
    "knowledge.html",
    "news-detail.html",
    "news.html",
    "order-tracking.html",
    "policies.html",
    "product-detail.html",
    "products.html",
    "season.html"
)

$oldPattern = @"
        <div class="cart-header">
            <h3>購物車</h3>
            <button class="close-cart" id="closeCart">
                <i class="fas fa-times"></i>
            </button>
        </div>
"@

$newPattern = @"
        <div class="cart-header">
            <div class="cart-header-left">
                <img src="./images/商標.jpg" alt="柑心果園" class="cart-header-logo">
                <h3>購物車</h3>
            </div>
            <button class="close-cart" id="closeCart">
                <i class="fas fa-times"></i>
            </button>
        </div>
"@

$updatedCount = 0

foreach ($file in $files) {
    $filePath = Join-Path $PSScriptRoot $file
    
    if (Test-Path $filePath) {
        Write-Host "處理: $file" -ForegroundColor Cyan
        
        $content = Get-Content $filePath -Raw -Encoding UTF8
        
        if ($content -match [regex]::Escape($oldPattern)) {
            $content = $content -replace [regex]::Escape($oldPattern), $newPattern
            Set-Content $filePath -Value $content -Encoding UTF8 -NoNewline
            Write-Host "  ✓ 已更新" -ForegroundColor Green
            $updatedCount++
        } else {
            Write-Host "  - 未找到匹配內容或已更新" -ForegroundColor Yellow
        }
    } else {
        Write-Host "  ✗ 檔案不存在" -ForegroundColor Red
    }
}

Write-Host "`n完成！共更新 $updatedCount 個檔案" -ForegroundColor Green
Write-Host "請檢查 index.html 和 cart.html 是否已手動更新" -ForegroundColor Yellow
