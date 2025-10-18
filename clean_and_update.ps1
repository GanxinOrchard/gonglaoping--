# 清理重複組件並更新版本號的腳本

# 定義需要處理的HTML文件
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

foreach ($file in $htmlFiles) {
    if (Test-Path $file) {
        Write-Host "處理文件: $file"
        
        # 讀取文件內容
        $content = Get-Content $file -Raw -Encoding UTF8
        
        # 更新版本號
        $content = $content -replace 'style\.css\?v=\d+', 'style.css?v=20250115FF'
        $content = $content -replace 'mobile-menu-simple\.js\?v=\d+', 'mobile-menu-simple.js?v=20250115FF'
        $content = $content -replace 'dropdown-menu\.js\?v=\d+', 'dropdown-menu.js?v=20250115FF'
        $content = $content -replace 'products\.js\?v=\d+', 'products.js?v=20250115FF'
        $content = $content -replace 'cart\.js\?v=\d+', 'cart.js?v=20250115FF'
        $content = $content -replace 'content-protection\.js\?v=\d+', 'content-protection.js?v=20250115FF'
        $content = $content -replace 'main\.js\?v=\d+', 'main.js?v=20250115FF'
        $content = $content -replace 'auto-sales\.js\?v=\d+', 'auto-sales.js?v=20250115FF'
        $content = $content -replace 'navigation-clean\.css\?v=\d+', 'navigation-clean.css?v=20250115FF'
        
        # 保存文件
        $content | Set-Content $file -Encoding UTF8
        Write-Host "完成處理: $file"
    } else {
        Write-Host "文件不存在: $file"
    }
}

Write-Host "所有文件版本號更新完成！"
