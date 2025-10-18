# 深度清理腳本 - 移除所有購物車、頁尾、回到頂部按鈕等內容
Set-Location 'c:\Users\張-1\CascadeProjects\ganxin-orchard'

# 獲取所有HTML文件（除了index.html和模板文件）
$htmlFiles = Get-ChildItem -Path '.' -Filter '*.html' | Where-Object { 
    $_.Name -ne 'index.html' -and 
    $_.Name -ne 'template_components.html' -and
    $_.Name -ne 'header-template.html' -and
    $_.Name -ne 'footer-template.html' -and
    $_.Name -ne 'js-template.html' -and
    $_.Name -ne 'hero-template.html'
}

Write-Host "開始深度清理..." -ForegroundColor Green
Write-Host "找到 $($htmlFiles.Count) 個文件需要處理" -ForegroundColor Yellow

foreach ($file in $htmlFiles) {
    Write-Host "處理文件: $($file.Name)"
    $content = Get-Content -Path $file.FullName -Raw
    $originalContent = $content
    
    # 移除購物車相關內容
    $content = $content -replace '(?s)<a[^>]*href="cart\.html"[^>]*>.*?</a>', ''
    $content = $content -replace '(?s)<div[^>]*class="[^"]*cart[^"]*"[^>]*>.*?</div>', ''
    $content = $content -replace '(?s)<i[^>]*class="[^"]*shopping-cart[^"]*"[^>]*>.*?</i>', ''
    $content = $content -replace '(?s)購物車', ''
    $content = $content -replace '(?s)cart\.js', ''
    
    # 移除頁尾相關內容
    $content = $content -replace '(?s)<!-- 頁尾 -->.*?<!-- 回到頂部按鈕 -->', ''
    $content = $content -replace '(?s)<!-- 全新設計頁尾 -->.*?</footer>', ''
    $content = $content -replace '(?s)<footer[^>]*>.*?</footer>', ''
    $content = $content -replace '(?s)<!-- 手機選單頁尾 -->.*?</div>', ''
    $content = $content -replace '(?s)<div[^>]*class="[^"]*menu-footer[^"]*"[^>]*>.*?</div>', ''
    $content = $content -replace '(?s)<div[^>]*class="[^"]*mobile-menu-footer[^"]*"[^>]*>.*?</div>', ''
    $content = $content -replace '(?s)頁尾', ''
    
    # 移除回到頂部按鈕
    $content = $content -replace '(?s)<!-- 回到頂部按鈕 -->.*?</div>', ''
    $content = $content -replace '(?s)<a[^>]*class="[^"]*back-to-top[^"]*"[^>]*>.*?</a>', ''
    $content = $content -replace '(?s)<div[^>]*class="[^"]*scroll-top[^"]*"[^>]*>.*?</div>', ''
    $content = $content -replace '(?s)<div[^>]*class="[^"]*go-top[^"]*"[^>]*>.*?</div>', ''
    $content = $content -replace '(?s)回到頂部', ''
    
    # 移除多餘的空白行
    $content = $content -replace '(?m)^\s*$\n\s*$', "`n"
    $content = $content -replace '(?m)\n\s*\n\s*\n', "`n`n"
    
    # 清理多餘的註釋
    $content = $content -replace '(?s)<!-- 選單導航 -->\s*', ''
    $content = $content -replace '(?s)<!-- 選單底部 -->\s*', ''
    $content = $content -replace '(?s)<!-- 載入相關 JavaScript -->\s*', ''
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8
        Write-Host "  成功清理: $($file.Name)" -ForegroundColor Green
    } else {
        Write-Host "  無需清理: $($file.Name)" -ForegroundColor Cyan
    }
}

Write-Host "深度清理完成！" -ForegroundColor Green
Write-Host "處理了 $($htmlFiles.Count) 個文件" -ForegroundColor Yellow
