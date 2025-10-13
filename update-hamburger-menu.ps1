# 批量更新所有HTML文件中的漢堡選單按鈕
$files = Get-ChildItem -Path "." -Filter "*.html" -File

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    
    # 替換模式1: <i class="fas fa-bars"></i>
    $pattern1 = '<i class="fas fa-bars"></i>'
    $replacement1 = '<span class="menu-line"></span>
                            <span class="menu-line"></span>
                            <span class="menu-line"></span>'
    
    # 替換模式2: <img src="images/漢堡選單.png" alt="選單" class="hamburger-icon">
    $pattern2 = '<img src="images/漢堡選單\.png" alt="選單" class="hamburger-icon">'
    $replacement2 = '<span class="menu-line"></span>
                            <span class="menu-line"></span>
                            <span class="menu-line"></span>'
    
    $updated = $false
    
    if ($content -match [regex]::Escape($pattern1)) {
        $content = $content -replace [regex]::Escape($pattern1), $replacement1
        $updated = $true
        Write-Host "已更新 $($file.Name) - 替換 fa-bars 圖標" -ForegroundColor Green
    }
    
    if ($content -match $pattern2) {
        $content = $content -replace $pattern2, $replacement2
        $updated = $true
        Write-Host "已更新 $($file.Name) - 替換漢堡選單圖片" -ForegroundColor Green
    }
    
    if ($updated) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
    }
}

Write-Host "`nAll HTML files updated successfully!" -ForegroundColor Cyan
Write-Host "Orange-style hamburger menu applied to all pages" -ForegroundColor Cyan
