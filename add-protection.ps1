# 添加內容保護功能到所有 HTML 頁面
# PowerShell 腳本

$htmlFiles = @(
    "index.html", "about.html", "cart.html", "checkout.html", "confirm.html",
    "contact.html", "farming.html", "grading.html", "guide.html", "knowledge.html",
    "knowledge-detail.html", "linepay.html", "linepay-confirm.html", "news.html",
    "news-detail.html", "order-complete.html", "order-tracking.html", "policies.html",
    "product-detail.html", "products.html", "season.html", "404.html", "force-update.html",
    "grading-murcott.html", "grading-ponkan.html", "grading-taro.html", "grading-water-chestnut.html",
    "guide-murcott.html", "guide-ponkan.html", "guide-taro.html", "guide-water-chestnut.html",
    "season-murcott.html", "season-ponkan.html", "season-recommend.html", "season-taro.html", "season-water-chestnut.html"
)

$protectionScript = '    <script src="./js/content-protection.js?v=20250110" defer></script>'

foreach ($file in $htmlFiles) {
    if (Test-Path $file) {
        Write-Host "處理文件: $file"
        
        # 讀取文件內容
        $content = Get-Content $file -Raw -Encoding UTF8
        
        # 檢查是否已經有保護腳本
        if ($content -notmatch "content-protection\.js") {
            # 找到 main.js 的位置並在其前面插入保護腳本
            if ($content -match "(\s*<script src=.*main\.js.*?>\s*</script>)") {
                $replacement = $protectionScript + "`n" + $matches[1]
                $content = $content -replace [regex]::Escape($matches[1]), $replacement
                
                # 寫回文件
                Set-Content $file -Value $content -Encoding UTF8
                Write-Host "✅ 已添加保護功能到: $file"
            } else {
                Write-Host "⚠️  未找到 main.js 在: $file"
            }
        } else {
            Write-Host "ℹ️  保護功能已存在於: $file"
        }
    } else {
        Write-Host "❌ 文件不存在: $file"
    }
}

Write-Host "`n內容保護功能添加完成！"
