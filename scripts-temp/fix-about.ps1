# 修正 about.html 的腳本
$file = "about.html"
$content = Get-Content $file -Raw -Encoding UTF8

# 找到 <body> 和 <!-- 主要內容 --> 之間的內容並替換
$pattern = '(?s)<body>.*?<!-- 主要內容 -->'
$replacement = @'
<body>
    <!-- 統一頁頭 -->
    <div id="header-container"></div>
    
    <!-- 手機選單 -->
    <div id="mobile-menu-container"></div>

    <!-- 主要內容 -->
'@

$content = $content -replace $pattern, $replacement

# 儲存檔案
$content | Out-File $file -Encoding UTF8 -NoNewline

Write-Host "✅ about.html 已修正完成！" -ForegroundColor Green
Write-Host "已刪除舊的 header 和手機選單內容" -ForegroundColor Yellow
Write-Host "請按 Ctrl + Shift + R 測試" -ForegroundColor Cyan
