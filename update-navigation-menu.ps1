# 批量更新所有頁面的導覽列選單，添加蔬果知識選項

# 需要更新的 HTML 文件列表（排除已經手動更新的文件）
$filesToUpdate = @(
    "about.html",
    "cart.html",
    "checkout.html",
    "confirm.html",
    "contact.html",
    "farming.html",
    "grading.html",
    "grading-murcott.html",
    "grading-ponkan.html",
    "grading-taro.html",
    "grading-water-chestnut.html",
    "guide.html",
    "guide-murcott.html",
    "guide-ponkan.html",
    "guide-taro.html",
    "guide-water-chestnut.html",
    "linepay.html",
    "linepay-confirm.html",
    "order-complete.html",
    "order-tracking.html",
    "policies.html",
    "product-detail.html",
    "season-recommend.html",
    "season-murcott.html",
    "season-ponkan.html",
    "season-taro.html",
    "season-water-chestnut.html"
)

# 需要替換的模式
$pattern1 = '<li><a href="news\.html">最新消息</a></li>\s*<li class="dropdown">'
$replacement1 = '<li><a href="news.html">最新消息</a></li>
                        <li><a href="knowledge.html">蔬果知識</a></li>
                        <li class="dropdown">'

$pattern2 = '<li><a href="news\.html" class="active">最新消息</a></li>\s*<li class="dropdown">'
$replacement2 = '<li><a href="news.html" class="active">最新消息</a></li>
                        <li><a href="knowledge.html">蔬果知識</a></li>
                        <li class="dropdown">'

# 處理每個文件
foreach ($file in $filesToUpdate) {
    if (Test-Path $file) {
        Write-Host "正在更新 $file..."
        
        # 讀取文件內容
        $content = Get-Content $file -Raw -Encoding UTF8
        
        # 替換模式1（沒有 active 類別的最新消息）
        if ($content -match $pattern1) {
            $content = $content -replace $pattern1, $replacement1
            Write-Host "  - 已替換模式1"
        }
        # 替換模式2（有 active 類別的最新消息）
        elseif ($content -match $pattern2) {
            $content = $content -replace $pattern2, $replacement2
            Write-Host "  - 已替換模式2"
        }
        else {
            Write-Host "  - 未找到匹配的模式"
        }
        
        # 寫回文件
        Set-Content $file -Value $content -Encoding UTF8
        Write-Host "  - 已保存 $file"
    }
    else {
        Write-Host "文件不存在: $file"
    }
}

Write-Host "批量更新完成！"
