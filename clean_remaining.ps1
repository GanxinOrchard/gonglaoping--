# �M�z�ݯd���~�P�W�٩M�a�}��T
$files = Get-ChildItem -Path '.' -Filter '*.html' | Where-Object { 
    $_.Name -ne 'index.html' -and 
    $_.Name -ne 'template_components.html' -and
    $_.Name -ne 'header-template.html' -and
    $_.Name -ne 'footer-template.html' -and
    $_.Name -ne 'js-template.html' -and
    $_.Name -ne 'hero-template.html'
}

Write-Host "�}�l�M�z�ݯd���e..." -ForegroundColor Green
Write-Host "��� $($files.Count) �Ӥ��ݭn�B�z" -ForegroundColor Yellow

foreach ($file in $files) {
    Write-Host "�B�z���: $($file.Name)"
    $content = Get-Content -Path $file.FullName -Raw
    $originalContent = $content
    
    # ���������椤���p����T
    $content = $content -replace '(?s)<div class="mobile-contact-item">.*?<span>�x�����׭�Ϥ��ѩW</span>.*?</div>', ''
    $content = $content -replace '(?s)<div class="mobile-contact-item">.*?<span>s9000721@gmail.com</span>.*?</div>', ''
    $content = $content -replace '(?s)<div class="mobile-contact-item">.*?<span>0933-721-978</span>.*?</div>', ''
    
    # �����Ū� mobile-contact-item �e��
    $content = $content -replace '(?s)<div class="mobile-contact-item">\s*</div>', ''
    
    # �����Ū� mobile-contact-section
    $content = $content -replace '(?s)<div class="mobile-contact-section">\s*</div>', ''
    
    # �����Ū� mobile-social-section
    $content = $content -replace '(?s)<div class="mobile-social-section">\s*</div>', ''
    
    # �����Ū� mobile-menu-footer
    $content = $content -replace '(?s)<div class="mobile-menu-footer">\s*</div>', ''
    
    # �M�z�h�l���ťզ�
    $content = $content -replace '(?m)^\s*$\n\s*$', "`n"
    $content = $content -replace '(?m)\n\s*\n\s*\n', "`n`n"
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8
        Write-Host "  ���\�M�z: $($file.Name)" -ForegroundColor Green
    } else {
        Write-Host "  �L�ݲM�z: $($file.Name)" -ForegroundColor Cyan
    }
}

Write-Host "�M�z�����I" -ForegroundColor Green
