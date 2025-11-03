# 批量更新所有 HTML 檔案的版本號
# 統一版本號：v=20251103180

$version = "20251103180"

# 獲取所有 HTML 檔案（排除備份和 Google 驗證檔案）
$htmlFiles = Get-ChildItem -Path . -Filter "*.html" -File | 
    Where-Object { $_.Name -notmatch "backup|wrong|empty|old|google" }

Write-Host "找到 $($htmlFiles.Count) 個需要更新的 HTML 檔案" -ForegroundColor Cyan
Write-Host ""

foreach ($file in $htmlFiles) {
    Write-Host "處理: $($file.Name)" -ForegroundColor Yellow
    
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $updated = $false
    
    # 更新 CSS 版本號
    if ($content -match '\.css\?v=\d+') {
        $content = $content -replace '\.css\?v=\d+', ".css?v=$version"
        $updated = $true
        Write-Host "  ✓ 更新 CSS 版本號" -ForegroundColor Green
    }
    
    # 為沒有版本號的 CSS 添加版本號
    if ($content -match '\.css"(?!\?v=)') {
        $content = $content -replace '(href="[^"]+\.css)"', "`$1?v=$version`""
        $updated = $true
        Write-Host "  ✓ 添加 CSS 版本號" -ForegroundColor Green
    }
    
    # 更新 JS 版本號
    if ($content -match '\.js\?v=\d+') {
        $content = $content -replace '\.js\?v=\d+', ".js?v=$version"
        $updated = $true
        Write-Host "  ✓ 更新 JS 版本號" -ForegroundColor Green
    }
    
    # 為沒有版本號的 JS 添加版本號（排除 CDN 和某些特殊腳本）
    if ($content -match 'src="\.\/js\/[^"]+\.js"(?!\?v=)') {
        $content = $content -replace '(src="\.\/js\/[^"]+\.js)"', "`$1?v=$version`""
        $updated = $true
        Write-Host "  ✓ 添加 JS 版本號" -ForegroundColor Green
    }
    
    if ($updated) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
        Write-Host "  ✅ 已更新" -ForegroundColor Green
    } else {
        Write-Host "  ⏭️ 無需更新" -ForegroundColor Gray
    }
    Write-Host ""
}

Write-Host "================================" -ForegroundColor Cyan
Write-Host "✅ 所有檔案處理完成！" -ForegroundColor Green
Write-Host "統一版本號：v=$version" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
