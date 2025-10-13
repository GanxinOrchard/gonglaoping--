# 簡化的分頁修復腳本
Write-Host "開始修復分頁..."

# 需要修復的分頁列表
$pages = @(
    "news.html",
    "knowledge.html", 
    "knowledge-detail.html",
    "season.html",
    "season-recommend.html",
    "season-ponkan.html",
    "season-murcott.html",
    "season-water-chestnut.html",
    "season-taro.html",
    "farming.html",
    "guide.html",
    "guide-ponkan.html",
    "guide-murcott.html",
    "guide-water-chestnut.html",
    "guide-taro.html",
    "grading.html",
    "grading-ponkan.html",
    "grading-murcott.html",
    "grading-taro.html",
    "grading-water-chestnut.html",
    "contact.html",
    "policies.html",
    "product-detail.html",
    "cart.html",
    "checkout.html",
    "confirm.html",
    "order-tracking.html",
    "order-complete.html",
    "linepay.html",
    "linepay-confirm.html",
    "news-detail.html",
    "404.html"
)

foreach ($page in $pages) {
    if (Test-Path $page) {
        Write-Host "修復 $page..."
        
        # 讀取文件
        $content = Get-Content $page -Raw
        
        # 替換 CSS 引用
        $content = $content -replace 'href="\./css/menu-enhancement\.css[^"]*"', 'href="./css/navigation-clean.css?v=20250110"'
        $content = $content -replace 'href="css/mobile-menu-fix\.css[^"]*"', ''
        
        # 替換 JS 引用
        $content = $content -replace 'src="\./js/menu-enhancement\.js[^"]*"', ''
        $content = $content -replace 'src="js/mobile-menu-fix\.js[^"]*"', 'src="./js/mobile-menu-simple.js?v=20250110"'
        
        # 寫回文件
        $content | Out-File $page -Encoding UTF8
        Write-Host "✅ $page 修復完成"
    } else {
        Write-Host "❌ $page 不存在"
    }
}

Write-Host "所有分頁修復完成！"
