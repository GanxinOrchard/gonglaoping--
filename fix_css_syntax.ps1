# 修復CSS語法錯誤腳本
Write-Host "開始修復CSS語法錯誤..." -ForegroundColor Green

$files = @("farming.html", "grading.html", "contact.html", "about.html", "news.html", "products.html", "season.html", "policies.html", "knowledge.html", "guide.html")

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "修復: $file" -ForegroundColor Yellow
        $content = Get-Content $file -Raw -Encoding UTF8
        
        # 修復缺少分號的CSS屬性
        $content = $content -replace '(\w+):\s*([^;{}]+)(?=\s*[{}])', '$1: $2;'
        
        # 修復缺少括號的CSS函數
        $content = $content -replace 'linear-gradient\(([^)]+)(?=\s*[;{}])', 'linear-gradient($1)'
        $content = $content -replace 'rgba\(([^)]+)(?=\s*[;{}])', 'rgba($1)'
        $content = $content -replace 'var\(([^)]+)(?=\s*[;{}])', 'var($1)'
        $content = $content -replace 'repeat\(([^)]+)(?=\s*[;{}])', 'repeat($1)'
        $content = $content -replace 'minmax\(([^)]+)(?=\s*[;{}])', 'minmax($1)'
        $content = $content -replace 'scale\(([^)]+)(?=\s*[;{}])', 'scale($1)'
        $content = $content -replace 'translateY\(([^)]+)(?=\s*[;{}])', 'translateY($1)'
        $content = $content -replace 'translateX\(([^)]+)(?=\s*[;{}])', 'translateX($1)'
        
        # 修復@keyframes中的語法錯誤
        $content = $content -replace 'transform:\s*scale\(([^)]+)(?=\s*[;{}])', 'transform: scale($1);'
        $content = $content -replace 'transform:\s*translateY\(([^)]+)(?=\s*[;{}])', 'transform: translateY($1);'
        
        Set-Content -Path $file -Value $content -Encoding UTF8 -NoNewline
        Write-Host "完成: $file" -ForegroundColor Green
    }
}

Write-Host "CSS語法修復完成！" -ForegroundColor Green
