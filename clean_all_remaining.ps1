# 清理所有剩餘頁面的 Ganxin Orchard 和地址文字
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

Write-Host "開始清理所有剩餘頁面..." -ForegroundColor Green
Write-Host "找到 $($htmlFiles.Count) 個文件需要處理" -ForegroundColor Yellow

foreach ($file in $htmlFiles) {
    Write-Host "處理文件: $($file.Name)"
    $content = Get-Content -Path $file.FullName -Raw
    $originalContent = $content
    
    # 移除 meta name="author" content="柑心果園 Ganxin Orchard"
    $content = $content -replace '<meta name="author" content="柑心果園 Ganxin Orchard">', '<meta name="author" content="柑心果園">'
    
    # 移除 meta name="geo.placename" content="台灣台中市豐原區公老坪/東勢/柑心果園"
    $content = $content -replace '<meta name="geo.placename" content="台灣台中市豐原區公老坪/東勢/柑心果園">', '<meta name="geo.placename" content="台灣台中市豐原區公老坪/東勢">'
    
    # 移除 meta name="geo.placename" content="台中豐原公老坪/東勢/柑心果園"
    $content = $content -replace '<meta name="geo.placename" content="台中豐原公老坪/東勢/柑心果園">', '<meta name="geo.placename" content="台中豐原公老坪/東勢">'
    
    # 移除手機選單中的 Ganxin Orchard
    $content = $content -replace '(?s)<div class="logo-sub">Ganxin Orchard</div>', ''
    
    # 移除手機選單中的 台中市豐原區公老坪
    $content = $content -replace '(?s)<div class="mobile-contact-item">\s*<i class="fas fa-map-marker-alt"></i>\s*<span>台中市豐原區公老坪</span>\s*</div>', ''
    
    # 移除手機選單中的 台中豐原公老坪
    $content = $content -replace '(?s)<div class="mobile-contact-item">\s*<i class="fas fa-map-marker-alt"></i>\s*<span>台中豐原公老坪</span>\s*</div>', ''
    
    # 移除空白的 mobile-contact-item 容器
    $content = $content -replace '(?s)<div class="mobile-contact-item">\s*<i class="fas fa-map-marker-alt"></i>\s*</div>', ''
    
    # 移除空白的 mobile-contact-section
    $content = $content -replace '(?s)<div class="mobile-contact-section">\s*</div>', ''
    
    # 移除空白的 mobile-social-section
    $content = $content -replace '(?s)<div class="mobile-social-section">\s*</div>', ''
    
    # 移除空白的 mobile-menu-footer
    $content = $content -replace '(?s)<div class="mobile-menu-footer">\s*</div>', ''
    
    # 清理多餘的空白行
    $content = $content -replace '(?m)^\s*$\n\s*$', "`n"
    $content = $content -replace '(?m)\n\s*\n\s*\n', "`n`n"
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8
        Write-Host "  成功清理: $($file.Name)" -ForegroundColor Green
    } else {
        Write-Host "  無需清理: $($file.Name)" -ForegroundColor Cyan
    }
}

Write-Host "所有剩餘頁面清理完成！" -ForegroundColor Green
Write-Host "處理了 $($htmlFiles.Count) 個文件" -ForegroundColor Yellow
