# 套用首頁組件到所有分頁的腳本
Write-Host "開始套用首頁組件到所有分頁..." -ForegroundColor Green

# 讀取模板文件
$templateContent = Get-Content "homepage_components_template.html" -Raw -Encoding UTF8

# 需要處理的HTML文件列表（排除首頁和模板文件）
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
        Write-Host "處理文件: $file" -ForegroundColor Yellow
        
        $content = Get-Content $file -Raw -Encoding UTF8
        
        # 移除現有的選單、購物車、頁尾、回到頂部按鈕
        $content = $content -replace '<!-- 手機選單.*?</div>\s*</div>', '', [System.Text.RegularExpressions.RegexOptions]::Singleline
        $content = $content -replace '<div class="menu-overlay".*?</div>', '', [System.Text.RegularExpressions.RegexOptions]::Singleline
        $content = $content -replace '<div class="main-menu".*?</div>', '', [System.Text.RegularExpressions.RegexOptions]::Singleline
        $content = $content -replace '<a href="cart\.html".*?</a>', '', [System.Text.RegularExpressions.RegexOptions]::Singleline
        $content = $content -replace '<footer.*?</footer>', '', [System.Text.RegularExpressions.RegexOptions]::Singleline
        $content = $content -replace '<button.*?back-to-top.*?</button>', '', [System.Text.RegularExpressions.RegexOptions]::Singleline
        $content = $content -replace '<script>.*?上一頁記憶功能.*?</script>', '', [System.Text.RegularExpressions.RegexOptions]::Singleline
        
        # 在 </main> 標籤後插入模板內容
        $content = $content -replace '</main>', "</main>`n`n$templateContent"
        
        # 更新CSS和JS版本號
        $content = $content -replace 'style\.css\?v=\d+', 'style.css?v=20250115FF'
        $content = $content -replace 'mobile-menu-simple\.js\?v=\d+', 'mobile-menu-simple.js?v=20250115FF'
        $content = $content -replace 'dropdown-menu\.js\?v=\d+', 'dropdown-menu.js?v=20250115FF'
        $content = $content -replace 'products\.js\?v=\d+', 'products.js?v=20250115FF'
        $content = $content -replace 'cart\.js\?v=\d+', 'cart.js?v=20250115FF'
        $content = $content -replace 'content-protection\.js\?v=\d+', 'content-protection.js?v=20250115FF'
        $content = $content -replace 'main\.js\?v=\d+', 'main.js?v=20250115FF'
        $content = $content -replace 'auto-sales\.js\?v=\d+', 'auto-sales.js?v=20250115FF'
        
        # 確保包含必要的CSS和JS文件
        if ($content -notmatch 'mobile-menu-simple\.js') {
            $content = $content -replace '</body>', '    <script src="./js/mobile-menu-simple.js?v=20250115FF" defer></script>`n    <script src="./js/dropdown-menu.js?v=20250115FF" defer></script>`n    <script src="./js/cart.js?v=20250115FF" defer></script>`n</body>'
        }
        
        # 保存文件
        Set-Content -Path $file -Value $content -Encoding UTF8 -NoNewline
        Write-Host "完成: $file" -ForegroundColor Green
    } else {
        Write-Host "文件不存在: $file" -ForegroundColor Red
    }
}

Write-Host "所有分頁已成功套用首頁組件！" -ForegroundColor Green
Write-Host "包含功能：手機選單、購物車按鈕、頁尾、回到頂部按鈕、上一頁記憶功能" -ForegroundColor Cyan
