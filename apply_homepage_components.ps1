# �M�έ����ե��Ҧ��������}��
Write-Host "�}�l�M�έ����ե��Ҧ�����..." -ForegroundColor Green

# Ū���ҪO���
$templateContent = Get-Content "homepage_components_template.html" -Raw -Encoding UTF8

# �ݭn�B�z��HTML���C���]�ư������M�ҪO���^
$htmlFiles = @(
    "about.html", "news.html", "contact.html", "products.html", "farming.html", 
    "season.html", "grading.html", "guide.html", "knowledge.html", "policies.html",
    "season-recommend.html", "season-ponkan.html", "season-murcott.html", 
    "season-water-chestnut.html", "season-taro.html", "grading-ponkan.html", 
    "grading-murcott.html", "grading-taro.html", "guide-water-chestnut.html",
    "news-detail.html", "product-detail.html", "order-tracking.html", 
    "order-complete.html", "cart.html", "checkout.html", "confirm.html",
    "linepay.html", "linepay-confirm.html", "404.html"
)

foreach ($file in $htmlFiles) {
    if (Test-Path $file) {
        Write-Host "�B�z���: $file" -ForegroundColor Yellow
        
        $content = Get-Content $file -Raw -Encoding UTF8
        
        # �����{�������B�ʪ����B�����B�^�쳻�����s
        $content = $content -replace '<!-- ������.*?</div>\s*</div>', '', [System.Text.RegularExpressions.RegexOptions]::Singleline
        $content = $content -replace '<div class="menu-overlay".*?</div>', '', [System.Text.RegularExpressions.RegexOptions]::Singleline
        $content = $content -replace '<div class="main-menu".*?</div>', '', [System.Text.RegularExpressions.RegexOptions]::Singleline
        $content = $content -replace '<a href="cart\.html".*?</a>', '', [System.Text.RegularExpressions.RegexOptions]::Singleline
        $content = $content -replace '<footer.*?</footer>', '', [System.Text.RegularExpressions.RegexOptions]::Singleline
        $content = $content -replace '<button.*?back-to-top.*?</button>', '', [System.Text.RegularExpressions.RegexOptions]::Singleline
        $content = $content -replace '<script>.*?�W�@���O�Х\��.*?</script>', '', [System.Text.RegularExpressions.RegexOptions]::Singleline
        
        # �b </main> ���ҫᴡ�J�ҪO���e
        $content = $content -replace '</main>', "</main>`n`n$templateContent"
        
        # ��sCSS�MJS������
        $content = $content -replace 'style\.css\?v=\d+', 'style.css?v=20250115FF'
        $content = $content -replace 'mobile-menu-simple\.js\?v=\d+', 'mobile-menu-simple.js?v=20250115FF'
        $content = $content -replace 'dropdown-menu\.js\?v=\d+', 'dropdown-menu.js?v=20250115FF'
        $content = $content -replace 'products\.js\?v=\d+', 'products.js?v=20250115FF'
        $content = $content -replace 'cart\.js\?v=\d+', 'cart.js?v=20250115FF'
        $content = $content -replace 'content-protection\.js\?v=\d+', 'content-protection.js?v=20250115FF'
        $content = $content -replace 'main\.js\?v=\d+', 'main.js?v=20250115FF'
        $content = $content -replace 'auto-sales\.js\?v=\d+', 'auto-sales.js?v=20250115FF'
        
        # �T�O�]�t���n��CSS�MJS���
        if ($content -notmatch 'mobile-menu-simple\.js') {
            $content = $content -replace '</body>', '    <script src="./js/mobile-menu-simple.js?v=20250115FF" defer></script>`n    <script src="./js/dropdown-menu.js?v=20250115FF" defer></script>`n    <script src="./js/cart.js?v=20250115FF" defer></script>`n</body>'
        }
        
        # �O�s���
        Set-Content -Path $file -Value $content -Encoding UTF8 -NoNewline
        Write-Host "����: $file" -ForegroundColor Green
    } else {
        Write-Host "��󤣦s�b: $file" -ForegroundColor Red
    }
}

Write-Host "�Ҧ������w���\�M�έ����ե�I" -ForegroundColor Green
Write-Host "�]�t�\��G������B�ʪ������s�B�����B�^�쳻�����s�B�W�@���O�Х\��" -ForegroundColor Cyan
