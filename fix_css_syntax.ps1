# �״_CSS�y�k���~�}��
Write-Host "�}�l�״_CSS�y�k���~..." -ForegroundColor Green

$files = @("farming.html", "grading.html", "contact.html", "about.html", "news.html", "products.html", "season.html", "policies.html", "knowledge.html", "guide.html")

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "�״_: $file" -ForegroundColor Yellow
        $content = Get-Content $file -Raw -Encoding UTF8
        
        # �״_�ʤ֤�����CSS�ݩ�
        $content = $content -replace '(\w+):\s*([^;{}]+)(?=\s*[{}])', '$1: $2;'
        
        # �״_�ʤ֬A����CSS���
        $content = $content -replace 'linear-gradient\(([^)]+)(?=\s*[;{}])', 'linear-gradient($1)'
        $content = $content -replace 'rgba\(([^)]+)(?=\s*[;{}])', 'rgba($1)'
        $content = $content -replace 'var\(([^)]+)(?=\s*[;{}])', 'var($1)'
        $content = $content -replace 'repeat\(([^)]+)(?=\s*[;{}])', 'repeat($1)'
        $content = $content -replace 'minmax\(([^)]+)(?=\s*[;{}])', 'minmax($1)'
        $content = $content -replace 'scale\(([^)]+)(?=\s*[;{}])', 'scale($1)'
        $content = $content -replace 'translateY\(([^)]+)(?=\s*[;{}])', 'translateY($1)'
        $content = $content -replace 'translateX\(([^)]+)(?=\s*[;{}])', 'translateX($1)'
        
        # �״_@keyframes�����y�k���~
        $content = $content -replace 'transform:\s*scale\(([^)]+)(?=\s*[;{}])', 'transform: scale($1);'
        $content = $content -replace 'transform:\s*translateY\(([^)]+)(?=\s*[;{}])', 'transform: translateY($1);'
        
        Set-Content -Path $file -Value $content -Encoding UTF8 -NoNewline
        Write-Host "����: $file" -ForegroundColor Green
    }
}

Write-Host "CSS�y�k�״_�����I" -ForegroundColor Green
