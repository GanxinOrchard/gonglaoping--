# 更新所有分頁的腳本
# 刪除購物車、選單、頁尾、回到頂部按鈕，並套用首頁的結構

# 定義需要處理的HTML文件（排除首頁和模板文件）
$htmlFiles = @(
    "about.html", "cart.html", "checkout.html", "confirm.html", "contact.html", 
    "farming.html", "grading-murcott.html", "grading-ponkan.html", "grading-taro.html", 
    "grading-water-chestnut.html", "grading.html", "guide-murcott.html", "guide-ponkan.html", 
    "guide-taro.html", "guide-water-chestnut.html", "guide.html", "knowledge-detail.html", 
    "knowledge.html", "linepay-confirm.html", "linepay.html", "news-detail.html", 
    "news.html", "order-complete.html", "order-tracking.html", "policies.html", 
    "product-detail.html", "products.html", "season-murcott.html", "season-ponkan.html", 
    "season-recommend.html", "season-taro.html", "season-water-chestnut.html", "season.html"
)

# 讀取首頁的樣式（內嵌CSS）
$indexContent = Get-Content "index.html" -Raw -Encoding UTF8

# 提取首頁的內嵌樣式
$styleStart = $indexContent.IndexOf('<style>')
$styleEnd = $indexContent.IndexOf('</style>') + 8
$embeddedStyles = $indexContent.Substring($styleStart, $styleEnd - $styleStart)

# 讀取模板組件
$templateComponents = Get-Content "template_components.html" -Raw -Encoding UTF8

foreach ($file in $htmlFiles) {
    if (Test-Path $file) {
        Write-Host "處理文件: $file"
        
        # 讀取文件內容
        $content = Get-Content $file -Raw -Encoding UTF8
        
        # 1. 刪除現有的header、nav、footer、購物車、回到頂部按鈕
        # 刪除header標籤及其內容
        $content = $content -replace '<header[^>]*>.*?</header>', '', [System.Text.RegularExpressions.RegexOptions]::Singleline
        
        # 刪除nav標籤及其內容
        $content = $content -replace '<nav[^>]*>.*?</nav>', '', [System.Text.RegularExpressions.RegexOptions]::Singleline
        
        # 刪除footer標籤及其內容
        $content = $content -replace '<footer[^>]*>.*?</footer>', '', [System.Text.RegularExpressions.RegexOptions]::Singleline
        
        # 刪除購物車相關元素
        $content = $content -replace '<div[^>]*class="[^"]*cart[^"]*"[^>]*>.*?</div>', '', [System.Text.RegularExpressions.RegexOptions]::Singleline
        $content = $content -replace '<a[^>]*href="[^"]*cart[^"]*"[^>]*>.*?</a>', '', [System.Text.RegularExpressions.RegexOptions]::Singleline
        
        # 刪除回到頂部按鈕
        $content = $content -replace '<div[^>]*class="[^"]*back-to-top[^"]*"[^>]*>.*?</div>', '', [System.Text.RegularExpressions.RegexOptions]::Singleline
        $content = $content -replace '<div[^>]*class="[^"]*scroll-top[^"]*"[^>]*>.*?</div>', '', [System.Text.RegularExpressions.RegexOptions]::Singleline
        $content = $content -replace '<div[^>]*class="[^"]*top-button[^"]*"[^>]*>.*?</div>', '', [System.Text.RegularExpressions.RegexOptions]::Singleline
        $content = $content -replace '<div[^>]*class="[^"]*go-top[^"]*"[^>]*>.*?</div>', '', [System.Text.RegularExpressions.RegexOptions]::Singleline
        
        # 刪除手機選單相關元素
        $content = $content -replace '<div[^>]*class="[^"]*menu-overlay[^"]*"[^>]*>.*?</div>', '', [System.Text.RegularExpressions.RegexOptions]::Singleline
        $content = $content -replace '<div[^>]*class="[^"]*main-menu[^"]*"[^>]*>.*?</div>', '', [System.Text.RegularExpressions.RegexOptions]::Singleline
        
        # 2. 在</head>之前添加首頁的內嵌樣式
        $headEndIndex = $content.IndexOf('</head>')
        if ($headEndIndex -gt 0) {
            $content = $content.Insert($headEndIndex, "`n$embeddedStyles`n")
        }
        
        # 3. 在<body>之後添加首頁的組件
        $bodyStartIndex = $content.IndexOf('<body>')
        if ($bodyStartIndex -gt 0) {
            $bodyStartIndex = $content.IndexOf('>', $bodyStartIndex) + 1
            $content = $content.Insert($bodyStartIndex, "`n$templateComponents`n")
        }
        
        # 4. 更新CSS和JS的版本號
        $content = $content -replace 'style\.css\?v=\d+', 'style.css?v=20250115FF'
        $content = $content -replace 'mobile-menu-simple\.js\?v=\d+', 'mobile-menu-simple.js?v=20250115FF'
        $content = $content -replace 'dropdown-menu\.js\?v=\d+', 'dropdown-menu.js?v=20250115FF'
        $content = $content -replace 'products\.js\?v=\d+', 'products.js?v=20250115FF'
        $content = $content -replace 'cart\.js\?v=\d+', 'cart.js?v=20250115FF'
        $content = $content -replace 'content-protection\.js\?v=\d+', 'content-protection.js?v=20250115FF'
        $content = $content -replace 'main\.js\?v=\d+', 'main.js?v=20250115FF'
        $content = $content -replace 'auto-sales\.js\?v=\d+', 'auto-sales.js?v=20250115FF'
        $content = $content -replace 'navigation-clean\.css\?v=\d+', 'navigation-clean.css?v=20250115FF'
        
        # 5. 添加必要的JavaScript引用（如果不存在）
        if ($content -notmatch 'mobile-menu-simple\.js') {
            $scriptEndIndex = $content.LastIndexOf('</body>')
            if ($scriptEndIndex -gt 0) {
                $scripts = @"
    <script src="./js/mobile-menu-simple.js?v=20250115FF" defer></script>
    <script src="./js/dropdown-menu.js?v=20250115FF" defer></script>
    <script src="./js/products.js?v=20250115FF" defer></script>
    <script src="./js/cart.js?v=20250115FF" defer></script>
    <script src="./js/content-protection.js?v=20250115FF" defer></script>
    <script src="./js/main.js?v=20250115FF" defer></script>
    <script src="./js/auto-sales.js?v=20250115FF" defer></script>
    <link rel="stylesheet" href="./css/navigation-clean.css?v=20250115FF">
"@
                $content = $content.Insert($scriptEndIndex, "`n$scripts`n")
            }
        }
        
        # 6. 保存文件
        $content | Set-Content $file -Encoding UTF8
        Write-Host "完成處理: $file"
    } else {
        Write-Host "文件不存在: $file"
    }
}

Write-Host "所有文件處理完成！"
