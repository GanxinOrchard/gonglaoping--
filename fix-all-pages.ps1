# 修復所有頁面的選單問題
# 將 mobile-menu-fix.css 和 menu-enhancement.css 替換為 navigation-clean.css

$files = @(
    "404.html", "about.html", "cart.html", "checkout.html", "confirm.html", "contact.html",
    "farming.html", "grading.html", "grading-murcott.html", "grading-ponkan.html", 
    "grading-taro.html", "grading-water-chestnut.html", "guide.html", "guide-murcott.html",
    "guide-ponkan.html", "guide-taro.html", "guide-water-chestnut.html", "knowledge.html",
    "knowledge-detail.html", "linepay.html", "linepay-confirm.html", "news.html", 
    "news-detail.html", "order-complete.html", "order-tracking.html", "policies.html",
    "product-detail.html", "products.html", "season.html", "season-murcott.html",
    "season-ponkan.html", "season-recommend.html", "season-taro.html", "season-water-chestnut.html"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "修復 $file..."
        
        # 讀取文件內容
        $content = Get-Content $file -Raw -Encoding UTF8
        
        # 替換 CSS 引用
        $content = $content -replace 'css/mobile-menu-fix\.css[^"]*', 'css/navigation-clean.css'
        $content = $content -replace '\./css/mobile-menu-fix\.css[^"]*', './css/navigation-clean.css'
        $content = $content -replace 'css/menu-enhancement\.css[^"]*', 'css/navigation-clean.css'
        $content = $content -replace '\./css/menu-enhancement\.css[^"]*', './css/navigation-clean.css'
        
        # 替換 JavaScript 引用
        $content = $content -replace 'js/mobile-menu-fix\.js[^"]*', 'js/mobile-menu-simple.js'
        $content = $content -replace '\./js/mobile-menu-fix\.js[^"]*', './js/mobile-menu-simple.js'
        $content = $content -replace 'js/menu-enhancement\.js[^"]*', ''
        $content = $content -replace '\./js/menu-enhancement\.js[^"]*', ''
        
        # 寫回文件
        Set-Content $file -Value $content -Encoding UTF8
        Write-Host "✓ $file 修復完成"
    } else {
        Write-Host "⚠ $file 不存在"
    }
}

Write-Host "所有頁面修復完成！"
