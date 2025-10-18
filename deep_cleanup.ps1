# �`�ײM�z�}�� - �M�z�Ҧ��ݯd���ʪ����M���s�C��ϼ�
Write-Host "�}�l�`�ײM�z..." -ForegroundColor Green

$files = @("farming.html", "grading.html", "guide.html", "products.html", "knowledge.html", "about.html", "news.html", "contact.html", "season.html", "policies.html")

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "�`�ײM�z: $file" -ForegroundColor Yellow
        $content = Get-Content $file -Raw -Encoding UTF8
        
        # �M�z�ʪ�������HTML
        $content = $content -replace '<span id="total">.*?</span>', ''
        $content = $content -replace '<div class="shipping-notice">.*?</div>', ''
        $content = $content -replace '<div class="discount-notice">.*?</div>', ''
        $content = $content -replace '<button class="btn-checkout".*?</button>', ''
        $content = $content -replace '<div class="cart.*?</div>', ''
        
        # �M�z�ʪ���JavaScript
        $content = $content -replace 'function initCartSidebar.*?}', ''
        $content = $content -replace 'document\.addEventListener.*?initCartSidebar.*?;', ''
        
        # �M�z���s�C��ϼ�
        $content = $content -replace '<i class="fab fa-facebook"></i>', ''
        $content = $content -replace '<i class="fab fa-line"></i>', ''
        $content = $content -replace '<i class="fab fa-instagram"></i>', ''
        $content = $content -replace '<i class="fas fa-envelope"></i>', ''
        
        # �M�zFacebook�s��
        $content = $content -replace '<a href="https://www\.facebook\.com.*?</a>', ''
        
        # �M�z�h�l��div�M�Ŧ�
        $content = $content -replace '\s*</div>\s*</div>\s*</div>\s*', ''
        $content = $content -replace '\r?\n\s*\r?\n\s*\r?\n', "`n`n"
        
        # �M�z�}�l��JavaScript
        $content = $content -replace '\);', ''
        $content = $content -replace '}\s*}\s*</script>', '}</script>'
        
        Set-Content -Path $file -Value $content -Encoding UTF8 -NoNewline
        Write-Host "����: $file" -ForegroundColor Green
    }
}

Write-Host "�`�ײM�z�����I" -ForegroundColor Green
