# �`�ײM�z�}�� - �����Ҧ��ʪ����B�����B�^�쳻�����s�����e
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

Write-Host "�}�l�`�ײM�z..." -ForegroundColor Green
Write-Host "��� $($htmlFiles.Count) �Ӥ��ݭn�B�z" -ForegroundColor Yellow

foreach ($file in $htmlFiles) {
    Write-Host "�B�z���: $($file.Name)"
    $content = Get-Content -Path $file.FullName -Raw
    $originalContent = $content
    
    # �����ʪ����������e
    $content = $content -replace '(?s)<a[^>]*href="cart\.html"[^>]*>.*?</a>', ''
    $content = $content -replace '(?s)<div[^>]*class="[^"]*cart[^"]*"[^>]*>.*?</div>', ''
    $content = $content -replace '(?s)<i[^>]*class="[^"]*shopping-cart[^"]*"[^>]*>.*?</i>', ''
    $content = $content -replace '(?s)�ʪ���', ''
    $content = $content -replace '(?s)cart\.js', ''
    
    # ���������������e
    $content = $content -replace '(?s)<!-- ���� -->.*?<!-- �^�쳻�����s -->', ''
    $content = $content -replace '(?s)<!-- ���s�]�p���� -->.*?</footer>', ''
    $content = $content -replace '(?s)<footer[^>]*>.*?</footer>', ''
    $content = $content -replace '(?s)<!-- �����歶�� -->.*?</div>', ''
    $content = $content -replace '(?s)<div[^>]*class="[^"]*menu-footer[^"]*"[^>]*>.*?</div>', ''
    $content = $content -replace '(?s)<div[^>]*class="[^"]*mobile-menu-footer[^"]*"[^>]*>.*?</div>', ''
    $content = $content -replace '(?s)����', ''
    
    # �����^�쳻�����s
    $content = $content -replace '(?s)<!-- �^�쳻�����s -->.*?</div>', ''
    $content = $content -replace '(?s)<a[^>]*class="[^"]*back-to-top[^"]*"[^>]*>.*?</a>', ''
    $content = $content -replace '(?s)<div[^>]*class="[^"]*scroll-top[^"]*"[^>]*>.*?</div>', ''
    $content = $content -replace '(?s)<div[^>]*class="[^"]*go-top[^"]*"[^>]*>.*?</div>', ''
    $content = $content -replace '(?s)�^�쳻��', ''
    
    # �����h�l���ťզ�
    $content = $content -replace '(?m)^\s*$\n\s*$', "`n"
    $content = $content -replace '(?m)\n\s*\n\s*\n', "`n`n"
    
    # �M�z�h�l������
    $content = $content -replace '(?s)<!-- ���ɯ� -->\s*', ''
    $content = $content -replace '(?s)<!-- ��橳�� -->\s*', ''
    $content = $content -replace '(?s)<!-- ���J���� JavaScript -->\s*', ''
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8
        Write-Host "  ���\�M�z: $($file.Name)" -ForegroundColor Green
    } else {
        Write-Host "  �L�ݲM�z: $($file.Name)" -ForegroundColor Cyan
    }
}

Write-Host "�`�ײM�z�����I" -ForegroundColor Green
Write-Host "�B�z�F $($htmlFiles.Count) �Ӥ��" -ForegroundColor Yellow
