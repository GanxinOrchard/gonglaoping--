# 自動修正 about.html 的腳本
Write-Host "開始修正 about.html..." -ForegroundColor Cyan

$file = "about.html"
$encoding = [System.Text.Encoding]::UTF8

# 讀取檔案
$content = [System.IO.File]::ReadAllText($file, $encoding)

Write-Host "檔案大小: $($content.Length) 字元" -ForegroundColor Yellow

# 定義要替換的模式（從 <body> 後的第一個註解到 <!-- 主要內容 --> 之前）
$pattern = '(?s)(<body>\s*)<!-- 主要導覽列 -->.*?(?=<!-- 主要內容 -->)'

# 替換為統一模板容器
$replacement = '$1<!-- 統一頁頭 -->
    <div id="header-container"></div>
    
    <!-- 手機選單 -->
    <div id="mobile-menu-container"></div>

    '

# 執行替換
$newContent = $content -replace $pattern, $replacement

# 檢查是否有變化
if ($content -eq $newContent) {
    Write-Host "未找到需要替換的內容！" -ForegroundColor Red
    Write-Host "請檢查檔案結構是否正確" -ForegroundColor Yellow
    exit 1
}

# 儲存檔案
[System.IO.File]::WriteAllText($file, $newContent, $encoding)

Write-Host "✅ about.html 已修正完成！" -ForegroundColor Green
Write-Host ""
Write-Host "已完成以下修改：" -ForegroundColor Yellow
Write-Host "  ✓ 刪除舊的 header 和選單內容" -ForegroundColor Green
Write-Host "  ✓ 添加統一頁頭容器" -ForegroundColor Green
Write-Host "  ✓ 添加手機選單容器" -ForegroundColor Green
Write-Host ""
Write-Host "請按 Ctrl + Shift + R 測試頁面！" -ForegroundColor Cyan
