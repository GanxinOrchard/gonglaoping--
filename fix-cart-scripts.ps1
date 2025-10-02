# 批量添加 cart.js 和 products.js 到所有頁面

$files = @(
    'knowledge.html',
    'knowledge-detail.html',
    'news.html',
    'news-detail.html',
    'policies.html',
    'order-tracking.html'
)

foreach ($file in $files) {
    $filePath = Join-Path $PSScriptRoot $file
    
    if (Test-Path $filePath) {
        Write-Host "Processing $file ..." -ForegroundColor Cyan
        
        $content = Get-Content $filePath -Raw -Encoding UTF8
        
        # 檢查是否已經有 cart.js
        if ($content -match 'cart\.js') {
            Write-Host "  $file already has cart.js" -ForegroundColor Green
            continue
        }
        
        # 在 main.js 之前插入 products.js 和 cart.js
        $pattern = '(\s*<script src="\./js/main\.js"></script>)'
        $replacement = "`n    <script src=`"./js/products.js`"></script>`n    <script src=`"./js/cart.js`"></script>`$1"
        
        $newContent = $content -replace $pattern, $replacement
        
        if ($newContent -ne $content) {
            [System.IO.File]::WriteAllText($filePath, $newContent, [System.Text.UTF8Encoding]::new($false))
            Write-Host "  Updated $file" -ForegroundColor Green
        } else {
            Write-Host "  No changes needed for $file" -ForegroundColor Yellow
        }
    } else {
        Write-Host "  File not found: $file" -ForegroundColor Red
    }
}

Write-Host "`nDone!" -ForegroundColor Cyan
