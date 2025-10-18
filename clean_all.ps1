# 簡單清理腳本
$files = Get-ChildItem -Path '.' -Filter '*.html' | Where-Object { $_.Name -ne 'index.html' }

foreach ($file in $files) {
    Write-Host "Cleaning: $($file.Name)"
    $content = Get-Content -Path $file.FullName -Raw
    
    # 移除購物車相關
    $content = $content -replace 'cart\.js', ''
    $content = $content -replace '購物車', ''
    $content = $content -replace 'shopping-cart', ''
    
    # 移除頁尾相關
    $content = $content -replace '<!-- 頁尾 -->.*?<!-- 回到頂部按鈕 -->', '', [System.Text.RegularExpressions.RegexOptions]::Singleline
    $content = $content -replace '<!-- 回到頂部按鈕 -->.*?</body>', '</body>', [System.Text.RegularExpressions.RegexOptions]::Singleline
    
    # 移除多餘空行
    $content = $content -replace '(?m)^\s*$\n\s*$', "`n"
    
    Set-Content -Path $file.FullName -Value $content -Encoding UTF8
    Write-Host "Done: $($file.Name)"
}
