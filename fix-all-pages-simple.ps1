# 修復所有分頁的腳本
Write-Host "開始修復所有分頁..."

# 需要修復的分頁列表（排除首頁和已修復的）
$pagesToFix = @(
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

# 頁面標題對應表
$pageTitles = @{
    "news.html" = "最新消息"
    "knowledge.html" = "蔬果知識"
    "knowledge-detail.html" = "知識詳情"
    "season.html" = "產季資訊"
    "season-recommend.html" = "季節推薦"
    "season-ponkan.html" = "椪柑產季"
    "season-murcott.html" = "茂谷柑產季"
    "season-water-chestnut.html" = "菱角產季"
    "season-taro.html" = "芋角產季"
    "farming.html" = "友善栽培"
    "guide.html" = "挑選指南"
    "guide-ponkan.html" = "椪柑挑選"
    "guide-murcott.html" = "茂谷柑挑選"
    "guide-water-chestnut.html" = "菱角挑選"
    "guide-taro.html" = "芋角挑選"
    "grading.html" = "規格分級"
    "grading-ponkan.html" = "椪柑規格"
    "grading-murcott.html" = "茂谷柑規格"
    "grading-taro.html" = "芋角規格"
    "grading-water-chestnut.html" = "菱角規格"
    "contact.html" = "聯絡我們"
    "policies.html" = "政策說明"
    "product-detail.html" = "商品詳情"
    "cart.html" = "購物車"
    "checkout.html" = "結帳"
    "confirm.html" = "確認訂單"
    "order-tracking.html" = "訂單查詢"
    "order-complete.html" = "訂單完成"
    "linepay.html" = "LINE Pay 付款"
    "linepay-confirm.html" = "LINE Pay 確認"
    "news-detail.html" = "消息詳情"
    "404.html" = "頁面不存在"
}

foreach ($page in $pagesToFix) {
    if (Test-Path $page) {
        Write-Host "修復 $page..."
        
        # 讀取文件內容
        $content = Get-Content $page -Raw -Encoding UTF8
        
        # 1. 更新CSS引用
        $content = $content -replace 'href="\./css/mobile-menu-fix\.css"', 'href="./css/navigation-clean.css"'
        $content = $content -replace 'href="\./css/menu-enhancement\.css"', 'href="./css/navigation-clean.css"'
        
        # 2. 更新JS引用
        $content = $content -replace 'src="\./js/mobile-menu-fix\.js"', 'src="./js/mobile-menu-simple.js"'
        $content = $content -replace 'src="\./js/menu-enhancement\.js"', ''
        
        # 3. 移除多餘的回到頂部按鈕（如果存在多個）
        $backToTopPattern = '<!-- 回到頂部按鈕 -->\s*<button class="back-to-top"[^>]*>.*?</button>'
        $matches = [regex]::Matches($content, $backToTopPattern, [System.Text.RegularExpressions.RegexOptions]::Singleline)
        if ($matches.Count -gt 1) {
            # 保留最後一個，移除其他的
            for ($i = 0; $i -lt $matches.Count - 1; $i++) {
                $content = $content -replace [regex]::Escape($matches[$i].Value), ''
            }
        }
        
        # 4. 確保只有一個回到頂部按鈕
        if ($content -notmatch 'back-to-top') {
            # 在 </body> 前添加回到頂部按鈕
            $content = $content -replace '</body>', '    <!-- 回到頂部按鈕 -->
    <button class="back-to-top" id="backToTop" aria-label="回到頂部">
        <i class="fas fa-arrow-up"></i>
    </button>

</body>'
        }
        
        # 寫回文件
        Set-Content $page -Value $content -Encoding UTF8
        Write-Host "✅ $page 修復完成"
    } else {
        Write-Host "❌ $page 不存在"
    }
}

Write-Host "所有分頁修復完成！"
