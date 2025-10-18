# �M�z�Ҧ��������� logo-sub CSS �˦�
$files = @(
    "season.html", "season-water-chestnut.html", "season-taro.html", "season-recommend.html", 
    "season-ponkan.html", "season-murcott.html", "product-detail.html", "policies.html", 
    "order-tracking.html", "order-complete.html", "news-detail.html", "linepay.html", 
    "linepay-confirm.html", "knowledge.html", "knowledge-detail.html", "guide.html", 
    "guide-water-chestnut.html", "guide-taro.html", "guide-ponkan.html", "guide-murcott.html", 
    "grading.html", "grading-water-chestnut.html", "grading-taro.html", "grading-ponkan.html", 
    "grading-murcott.html", "confirm.html", "checkout.html", "cart.html"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "�B�z: $file"
        $content = Get-Content $file -Raw
        $original = $content
        
        # ���� logo-sub CSS �˦�
        $content = $content -replace '(?s)\.menu-logo-text \.logo-sub \{[^}]*\}', ''
        
        # �����Ŧ�
        $content = $content -replace '\n\s*\n\s*\n', "`n`n"
        
        if ($content -ne $original) {
            Set-Content $file $content -Encoding UTF8
            Write-Host "  �w��s: $file" -ForegroundColor Green
        } else {
            Write-Host "  �L�ݧ�s: $file" -ForegroundColor Cyan
        }
    }
}

Write-Host "�M�z�����I"
