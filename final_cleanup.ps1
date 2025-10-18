# �̲ײM�z�}�� - �M�z�Ҧ��������ʪ����B�����B�^�쳻�����s�����e
# �ư����� index.html

Write-Host "�}�l�̲ײM�z�Ҧ�����..." -ForegroundColor Green

# �w�q�ݭn�M�z�����C���]�ư������^
$filesToClean = @(
    "about.html",
    "news.html", 
    "contact.html",
    "products.html",
    "farming.html",
    "season.html",
    "grading.html",
    "guide.html",
    "knowledge.html",
    "policies.html",
    "cart.html",
    "checkout.html",
    "confirm.html",
    "grading-murcott.html",
    "grading-ponkan.html", 
    "grading-taro.html",
    "grading-water-chestnut.html",
    "guide-murcott.html",
    "guide-ponkan.html",
    "guide-taro.html",
    "guide-water-chestnut.html",
    "knowledge-detail.html",
    "linepay-confirm.html",
    "linepay.html",
    "news-detail.html",
    "order-complete.html",
    "order-tracking.html",
    "product-detail.html",
    "season-murcott.html",
    "season-ponkan.html",
    "season-recommend.html",
    "season-taro.html",
    "season-water-chestnut.html",
    "404.html"
)

foreach ($file in $filesToClean) {
    if (Test-Path $file) {
        Write-Host "�M�z���: $file" -ForegroundColor Yellow
        
        $content = Get-Content $file -Raw -Encoding UTF8
        
        # 1. �M�z�ʪ�������HTML
        $content = $content -replace '(?s)<!-- �ʪ���.*?<!-- /�ʪ��� -->', ''
        $content = $content -replace '(?s)<div class="cart.*?</div>', ''
        $content = $content -replace '(?s)<button class="close-cart".*?</button>', ''
        $content = $content -replace '(?s)<div class="shipping-row.*?</div>', ''
        $content = $content -replace '(?s)<div class="discount-amount.*?</div>', ''
        $content = $content -replace '(?s)<div class="total.*?</div>', ''
        $content = $content -replace '(?s)<div class="cart-actions.*?</div>', ''
        $content = $content -replace '(?s)<div class="cart-summary.*?</div>', ''
        
        # 2. �M�z��������HTML
        $content = $content -replace '(?s)<!-- ����.*?<!-- /���� -->', ''
        $content = $content -replace '(?s)<footer.*?</footer>', ''
        
        # 3. �M�z�^�쳻�����s
        $content = $content -replace '(?s)<!-- �^�쳻�����s.*?<!-- /�^�쳻�����s -->', ''
        $content = $content -replace '(?s)<button.*?back-to-top.*?</button>', ''
        $content = $content -replace '(?s)<div.*?back-to-top.*?</div>', ''
        
        # 4. �M�z�ʪ�������JavaScript
        $content = $content -replace '(?s)// �ʪ����\��.*?// �ʪ����\�൲��', ''
        $content = $content -replace '(?s)const cartIcon.*?cart\.html.*?}', ''
        $content = $content -replace '(?s)if \(cartIcon\).*?}', ''
        
        # 5. �M�z�^�쳻������JavaScript
        $content = $content -replace '(?s)// �^�쳻���\��.*?// �^�쳻���\�൲��', ''
        $content = $content -replace '(?s)window\.scrollTo.*?}', ''
        
        # 6. �M�z�h�l�������M�Ŧ�
        $content = $content -replace '(?s)<!-- Footer -->\s*', ''
        $content = $content -replace '(?s)\s*</main>\s*<!-- Footer -->\s*', "`n    </main>`n"
        
        # 7. �M�z�h�l��div����
        $content = $content -replace '(?s)\s*</div>\s*</div>\s*</main>', "`n    </main>"
        
        # 8. �M�zGanxin Orchard������r
        $content = $content -replace 'Ganxin Orchard', ''
        $content = $content -replace '�x�����׭�Ϥ��ѩW', ''
        
        # 9. �M�zlogo-sub CSS�˦�
        $content = $content -replace '(?s)\.menu-logo-text \.logo-sub\s*\{[^}]*\}', ''
        
        # 10. �M�z�h�l���Ŧ�
        $content = $content -replace '\r?\n\s*\r?\n\s*\r?\n', "`n`n"
        
        # �O�s���
        Set-Content -Path $file -Value $content -Encoding UTF8 -NoNewline
        
        Write-Host "�����M�z: $file" -ForegroundColor Green
    } else {
        Write-Host "��󤣦s�b: $file" -ForegroundColor Red
    }
}

Write-Host "�Ҧ������M�z�����I" -ForegroundColor Green
Write-Host "�w�M�z�����e�]�A�G" -ForegroundColor Cyan
Write-Host "- �ʪ�������HTML�MJavaScript" -ForegroundColor White
Write-Host "- ��������HTML" -ForegroundColor White  
Write-Host "- �^�쳻�����s" -ForegroundColor White
Write-Host "- Ganxin Orchard������r" -ForegroundColor White
Write-Host "- logo-sub CSS�˦�" -ForegroundColor White
