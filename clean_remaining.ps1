# 清理殘留的品牌名稱和地址資訊
$files = Get-ChildItem -Path '.' -Filter '*.html' | Where-Object { 
    $_.Name -ne 'index.html' -and 
    $_.Name -ne 'template_components.html' -and
    $_.Name -ne 'header-template.html' -and
    $_.Name -ne 'footer-template.html' -and
    $_.Name -ne 'js-template.html' -and
    $_.Name -ne 'hero-template.html'
}

Write-Host "開始清理殘留內容..." -ForegroundColor Green
Write-Host "找到 $($files.Count) 個文件需要處理" -ForegroundColor Yellow

foreach ($file in $files) {
    Write-Host "處理文件: $($file.Name)"
    $content = Get-Content -Path $file.FullName -Raw
    $originalContent = $content
    
    # 移除手機選單中的聯絡資訊
    $content = $content -replace '(?s)<div class="mobile-contact-item">.*?<span>台中市豐原區公老坪</span>.*?</div>', ''
    $content = $content -replace '(?s)<div class="mobile-contact-item">.*?<span>s9000721@gmail.com</span>.*?</div>', ''
    $content = $content -replace '(?s)<div class="mobile-contact-item">.*?<span>0933-721-978</span>.*?</div>', ''
    
    # 移除空的 mobile-contact-item 容器
    $content = $content -replace '(?s)<div class="mobile-contact-item">\s*</div>', ''
    
    # 移除空的 mobile-contact-section
    $content = $content -replace '(?s)<div class="mobile-contact-section">\s*</div>', ''
    
    # 移除空的 mobile-social-section
    $content = $content -replace '(?s)<div class="mobile-social-section">\s*</div>', ''
    
    # 移除空的 mobile-menu-footer
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

Write-Host "清理完成！" -ForegroundColor Green
