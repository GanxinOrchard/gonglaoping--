# 從所有 HTML 文件中移除 mobile-menu-fix.css 的引用
$files = Get-ChildItem -Path "." -Filter "*.html" -File

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    
    # 移除 mobile-menu-fix.css 的引用
    $pattern = '<link rel="stylesheet" href="\./css/mobile-menu-fix\.css(\?v=\d+)?">'
    
    if ($content -match $pattern) {
        $content = $content -replace $pattern, ''
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
        Write-Host "Updated: $($file.Name)" -ForegroundColor Green
    }
}

Write-Host "`nAll HTML files updated!" -ForegroundColor Cyan
