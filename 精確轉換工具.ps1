# 精確轉換工具 - 使用類似policies.html的成功方法
# 作者：Cascade AI
# 日期：2025-10-30

param(
    [string]$PageName = "farming.html"  # 預設先測試farming.html
)

$ErrorActionPreference = "Stop"

Write-Host "=== 精確轉換工具 ===" -ForegroundColor Cyan
Write-Host "處理頁面: $PageName" -ForegroundColor Yellow

try {
    # 1. 備份
    $backupDate = Get-Date -Format "yyyyMMdd-HHmmss"
    $backupPath = "backups\$($PageName.Replace('.html', ''))-backup-$backupDate-轉換前.html"
    Copy-Item $PageName $backupPath -Force
    Write-Host "✅ 已備份至: $backupPath" -ForegroundColor Green
    
    # 2. 讀取原始檔案
    $content = Get-Content $PageName -Raw -Encoding UTF8
    Write-Host "檔案大小: $($content.Length) 字元" -ForegroundColor Gray
    
    # 3. 檢查是否已轉換
    if ($content -match 'header-container') {
        Write-Host "⚠️  此頁面已經轉換過，停止處理" -ForegroundColor Yellow
        return
    }
    
    # 4. 提取head內容（到</head>為止，但排除舊CSS連結）
    $headEnd = $content.IndexOf('</head>')
    $headContent = $content.Substring(0, $headEnd)
    
    # 移除舊的CSS連結
    $headContent = $headContent -replace '<link rel="preload"[^>]*?>', ''
    $headContent = $headContent -replace '<link rel="stylesheet" href="\./css/style\.css[^>]*?>', ''
    $headContent = $headContent -replace '<link rel="stylesheet" href="\./css/navigation-clean\.css[^>]*?>', ''
    $headContent = $headContent -replace '<link rel="stylesheet" href="news-season-styles\.css">', ''
    $headContent = $headContent -replace '<noscript>.*?</noscript>', ''
    $headContent = $headContent -replace '<link rel="stylesheet" href="https://cdnjs\.cloudflare\.com/ajax/libs/font-awesome[^>]*? media="print"[^>]*?>', ''
    
    # 移除巨大的內嵌<style>區塊（通常在head裡或body開頭）
    # 保留真正的head內容
    $headContent = $headContent -replace '(?s)<style>.*?手機選單.*?</style>', ''
    
    Write-Host "✅ head內容已提取並清理" -ForegroundColor Green
    
    # 5. 找到第一個真正的內容section
    $firstSection = $content.IndexOf('<section')
    if ($firstSection -eq -1) {
        $firstSection = $content.IndexOf('<main')
        if ($firstSection -eq -1) {
            throw "找不到主要內容區域（<section>或<main>）"
        }
    }
    Write-Host "主要內容開始位置: $firstSection" -ForegroundColor Gray
    
    # 6. 找到footer開始位置
    $footerStart = $content.IndexOf('<footer')
    if ($footerStart -eq -1) {
        # 如果沒有footer標籤，找最後的</main>或</body>前的位置
        $footerStart = $content.LastIndexOf('</main>')
        if ($footerStart -eq -1) {
            $footerStart = $content.LastIndexOf('</body>') - 50
        }
    }
    Write-Host "舊footer開始位置: $footerStart" -ForegroundColor Gray
    
    # 7. 提取主要內容（從第一個section到footer之前）
    $mainContentLength = $footerStart - $firstSection
    $mainContent = $content.Substring($firstSection, $mainContentLength)
    Write-Host "✅ 主要內容已提取（$mainContentLength 字元）" -ForegroundColor Green
    
    # 8. 檢查是否有頁面專屬的樣式/JS（在footer之後、</body>之前）
    $pageScriptsAndStyles = ""
    
    # 找特殊的樣式標籤（如FAQ樣式、產品樣式等）
    $specialStylePattern = '<!-- (?!最新消息|手機選單|導覽列)[^>]+?樣式 -->[\s\S]*?<style>[\s\S]*?</style>'
    $specialStyles = [regex]::Matches($content, $specialStylePattern)
    foreach ($match in $specialStyles) {
        $pageScriptsAndStyles += "`n" + $match.Value
    }
    
    if ($pageScriptsAndStyles) {
        Write-Host "✅ 找到頁面專屬樣式" -ForegroundColor Green
    }
    
    # 9. 組合新檔案
    $newContent = @"
<!DOCTYPE html>
<html lang="zh-TW">
<head>
$headContent
    <link rel="stylesheet" href="./css/main.css?v=20251023">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <div id="header-container"></div>
    <div id="mobile-menu-container"></div>

    <main id="main-content">
    $mainContent
    </main>

    <div id="footer-container"></div>
$pageScriptsAndStyles

    <script src="./js/template-loader.js"></script>
    <script src="./js/mobile-menu-simple.js" defer></script>
    <script src="./js/dropdown-menu.js" defer></script>
    <script src="./js/cart.js" defer></script>
    <script src="./js/main.js" defer></script>
</body>
</html>
"@
    
    # 10. 寫入新檔案
    $newContent | Out-File $PageName -Encoding UTF8 -NoNewline
    
    $newSize = $newContent.Length
    $reduction = [math]::Round((1 - $newSize / $content.Length) * 100, 1)
    
    Write-Host "`n✅ 轉換完成！" -ForegroundColor Green
    Write-Host "   原始大小: $($content.Length) 字元" -ForegroundColor Gray
    Write-Host "   新大小: $newSize 字元" -ForegroundColor Gray
    Write-Host "   減少: $reduction%" -ForegroundColor Cyan
    Write-Host "`n請測試: http://localhost:8000/$PageName" -ForegroundColor Yellow
    
} catch {
    Write-Host "`n❌ 錯誤: $_" -ForegroundColor Red
    Write-Host "已保留備份檔案: $backupPath" -ForegroundColor Yellow
}
