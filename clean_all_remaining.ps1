# �M�z�Ҧ��Ѿl������ Ganxin Orchard �M�a�}��r
Set-Location 'c:\Users\�i-1\CascadeProjects\ganxin-orchard'

# ����Ҧ�HTML���]���Findex.html�M�ҪO���^
$htmlFiles = Get-ChildItem -Path '.' -Filter '*.html' | Where-Object { 
    $_.Name -ne 'index.html' -and 
    $_.Name -ne 'template_components.html' -and
    $_.Name -ne 'header-template.html' -and
    $_.Name -ne 'footer-template.html' -and
    $_.Name -ne 'js-template.html' -and
    $_.Name -ne 'hero-template.html'
}

Write-Host "�}�l�M�z�Ҧ��Ѿl����..." -ForegroundColor Green
Write-Host "��� $($htmlFiles.Count) �Ӥ��ݭn�B�z" -ForegroundColor Yellow

foreach ($file in $htmlFiles) {
    Write-Host "�B�z���: $($file.Name)"
    $content = Get-Content -Path $file.FullName -Raw
    $originalContent = $content
    
    # ���� meta name="author" content="�a�ߪG�� Ganxin Orchard"
    $content = $content -replace '<meta name="author" content="�a�ߪG�� Ganxin Orchard">', '<meta name="author" content="�a�ߪG��">'
    
    # ���� meta name="geo.placename" content="�x�W�x�����׭�Ϥ��ѩW/�F��/�a�ߪG��"
    $content = $content -replace '<meta name="geo.placename" content="�x�W�x�����׭�Ϥ��ѩW/�F��/�a�ߪG��">', '<meta name="geo.placename" content="�x�W�x�����׭�Ϥ��ѩW/�F��">'
    
    # ���� meta name="geo.placename" content="�x���׭줽�ѩW/�F��/�a�ߪG��"
    $content = $content -replace '<meta name="geo.placename" content="�x���׭줽�ѩW/�F��/�a�ߪG��">', '<meta name="geo.placename" content="�x���׭줽�ѩW/�F��">'
    
    # ���������椤�� Ganxin Orchard
    $content = $content -replace '(?s)<div class="logo-sub">Ganxin Orchard</div>', ''
    
    # ���������椤�� �x�����׭�Ϥ��ѩW
    $content = $content -replace '(?s)<div class="mobile-contact-item">\s*<i class="fas fa-map-marker-alt"></i>\s*<span>�x�����׭�Ϥ��ѩW</span>\s*</div>', ''
    
    # ���������椤�� �x���׭줽�ѩW
    $content = $content -replace '(?s)<div class="mobile-contact-item">\s*<i class="fas fa-map-marker-alt"></i>\s*<span>�x���׭줽�ѩW</span>\s*</div>', ''
    
    # �����ťժ� mobile-contact-item �e��
    $content = $content -replace '(?s)<div class="mobile-contact-item">\s*<i class="fas fa-map-marker-alt"></i>\s*</div>', ''
    
    # �����ťժ� mobile-contact-section
    $content = $content -replace '(?s)<div class="mobile-contact-section">\s*</div>', ''
    
    # �����ťժ� mobile-social-section
    $content = $content -replace '(?s)<div class="mobile-social-section">\s*</div>', ''
    
    # �����ťժ� mobile-menu-footer
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

Write-Host "�Ҧ��Ѿl�����M�z�����I" -ForegroundColor Green
Write-Host "�B�z�F $($htmlFiles.Count) �Ӥ��" -ForegroundColor Yellow
