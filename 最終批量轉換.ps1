# 最終批量轉換腳本 - 使用farming.html的成功方法
# 作者：Cascade AI
# 日期：2025-10-30

$ErrorActionPreference = "Continue"

# 需要處理的頁面（排除已完成的）
$pages = @(
    "contact.html",
    "products.html", 
    "news.html",
    "grading.html",
    "grading-ponkan.html",
    "grading-murcott.html",
    "guide.html",
    "guide-ponkan.html",
    "guide-murcott.html",
    "guide-taro.html",
    "guide-water-chestnut.html",
    "knowledge.html",
    "season.html",
    "season-recommend.html",
    "season-ponkan.html",
    "season-murcott.html",
    "season-taro.html",
    "season-water-chestnut.html",
    "product-detail.html",
    "cart.html",
    "checkout.html",
    "order-tracking.html",
    "order-complete.html"
)

Write-Host "=== 批量轉換開始 ===" -ForegroundColor Cyan
Write-Host "將處理 $($pages.Count) 個頁面" -ForegroundColor Yellow

$success = 0
$failed = 0
$skipped = 0

foreach ($page in $pages) {
    Write-Host "`n處理: $page" -ForegroundColor Green
    
    if (-not (Test-Path $page)) {
        Write-Host "  ⚠️  檔案不存在，跳過" -ForegroundColor Yellow
        $skipped++
        continue
    }
    
    try {
        # 檢查是否已轉換
        $current = Get-Content $page -Raw -Encoding UTF8
        if ($current -match 'header-container') {
            Write-Host "  ⚠️  已轉換過，跳過" -ForegroundColor Yellow
            $skipped++
            continue
        }
        
        # 備份
        $backupDate = Get-Date -Format "yyyyMMdd-HHmmss"
        $backupPath = "backups\$($page.Replace('.html', ''))-backup-$backupDate.html"
        Copy-Item $page $backupPath -Force
        
        # 提取meta標籤
        $metaStart = $current.IndexOf('<meta charset')
        $metaEnd = $current.IndexOf('<!-- Google Fonts')
        if ($metaEnd -eq -1) {
            $metaEnd = $current.IndexOf('<link rel="preconnect"')
        }
        if ($metaEnd -eq -1) {
            $metaEnd = $current.IndexOf('<link rel="preload"')
        }
        if ($metaEnd -eq -1) {
            $metaEnd = $current.IndexOf('<link rel="stylesheet"')
        }
        
        $metaTags = $current.Substring($metaStart, $metaEnd - $metaStart).Trim()
        
        # 提取主要內容
        $contentStart = $current.IndexOf('<section')
        if ($contentStart -eq -1) {
            $contentStart = $current.IndexOf('<main')
        }
        
        $contentEnd = $current.IndexOf('<footer')
        if ($contentEnd -eq -1) {
            $contentEnd = $current.LastIndexOf('</main>')
        }
        
        $mainContent = $current.Substring($contentStart, $contentEnd - $contentStart).Trim()
        
        # 組合新檔案
        $new = @"
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    $metaTags
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

    <script src="./js/template-loader.js"></script>
    <script src="./js/mobile-menu-simple.js" defer></script>
    <script src="./js/dropdown-menu.js" defer></script>
    <script src="./js/cart.js" defer></script>
    <script src="./js/main.js" defer></script>
</body>
</html>
"@
        
        # 寫入
        $new | Out-File $page -Encoding UTF8
        
        $reduction = [math]::Round((1 - $new.Length / $current.Length) * 100, 1)
        Write-Host "  ✅ 完成！減少 $reduction%" -ForegroundColor Green
        $success++
        
    } catch {
        Write-Host "  ❌ 錯誤: $_" -ForegroundColor Red
        $failed++
    }
}

Write-Host "`n=== 批量轉換完成 ===" -ForegroundColor Cyan
Write-Host "成功: $success | 失敗: $failed | 跳過: $skipped" -ForegroundColor Yellow
Write-Host "`n請測試頁面：http://localhost:8000/" -ForegroundColor Green
