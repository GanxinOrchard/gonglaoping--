# 批量轉換頁面到統一模板
# 作者：Cascade AI
# 日期：2025-10-30

$ErrorActionPreference = "Stop"
$backupDate = Get-Date -Format "yyyyMMdd-HHmmss"

# 需要處理的頁面清單（排除已完成的）
$pagesToConvert = @(
    "cart.html",
    "checkout.html", 
    "confirm.html",
    "contact.html",
    "farming.html",
    "grading-murcott.html",
    "grading-ponkan.html",
    "grading.html",
    "guide-murcott.html",
    "guide-ponkan.html",
    "guide-taro.html",
    "guide-water-chestnut.html",
    "guide.html",
    "index.html",
    "knowledge.html",
    "linepay-confirm.html",
    "linepay.html",
    "news.html",
    "order-complete.html",
    "order-tracking.html",
    "product-detail.html",
    "products.html",
    "season-murcott.html",
    "season-ponkan.html",
    "season-recommend.html",
    "season-taro.html",
    "season-water-chestnut.html",
    "season.html"
)

Write-Host "=== 批量轉換開始 ===" -ForegroundColor Cyan
Write-Host "將處理 $($pagesToConvert.Count) 個頁面" -ForegroundColor Yellow

function Convert-PageToTemplate {
    param (
        [string]$PageName
    )
    
    Write-Host "`n處理: $PageName" -ForegroundColor Green
    
    try {
        # 1. 讀取原始檔案
        $content = Get-Content $PageName -Raw -Encoding UTF8
        
        # 2. 檢查是否已經轉換過
        if ($content -match 'header-container') {
            Write-Host "  ⚠️  已經轉換過，跳過" -ForegroundColor Yellow
            return
        }
        
        # 3. 備份
        $backupPath = "backups\$($PageName.Replace('.html', ''))-backup-$backupDate.html"
        Copy-Item $PageName $backupPath -Force
        Write-Host "  ✅ 備份: $backupPath" -ForegroundColor Gray
        
        # 4. 提取主要內容區域（從第一個<section>或<main>到</main>）
        $mainStart = $content.IndexOf('<section')
        if ($mainStart -eq -1) {
            $mainStart = $content.IndexOf('<main')
        }
        if ($mainStart -eq -1) {
            Write-Host "  ❌ 找不到主要內容區域" -ForegroundColor Red
            return
        }
        
        $mainEnd = $content.LastIndexOf('</main>')
        if ($mainEnd -eq -1) {
            # 如果沒有</main>，找footer前的位置
            $mainEnd = $content.IndexOf('<!-- Footer -->')
            if ($mainEnd -eq -1) {
                $mainEnd = $content.IndexOf('<footer')
            }
        }
        
        if ($mainEnd -eq -1 -or $mainEnd -le $mainStart) {
            Write-Host "  ❌ 無法確定內容結束位置" -ForegroundColor Red
            return
        }
        
        $mainContent = $content.Substring($mainStart, $mainEnd - $mainStart)
        
        # 5. 提取head部分（SEO等）
        $headStart = $content.IndexOf('<head>')
        $headEnd = $content.IndexOf('<link rel="stylesheet"')
        $headContent = $content.Substring($headStart + 6, $headEnd - $headStart - 6)
        
        # 6. 提取頁面專屬樣式（如果有FAQ、產品等特殊樣式）
        $pageStyle = ""
        if ($content -match '<!-- .+?樣式 -->[\s\S]*?<style>[\s\S]*?</style>') {
            # 提取頁面專屬樣式（非1400行那個巨大的）
            $styleMatches = [regex]::Matches($content, '<!-- (.+?)樣式 -->\s*<style>([\s\S]*?)</style>')
            foreach ($match in $styleMatches) {
                $styleName = $match.Groups[1].Value
                if ($styleName -notmatch '最新消息|手機選單|導覽列') {
                    $pageStyle += $match.Groups[0].Value + "`n`n"
                }
            }
        }
        
        # 7. 組合新檔案
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

$pageStyle
    <script src="./js/template-loader.js"></script>
    <script src="./js/mobile-menu-simple.js" defer></script>
    <script src="./js/dropdown-menu.js" defer></script>
    <script src="./js/cart.js" defer></script>
    <script src="./js/main.js" defer></script>
</body>
</html>
"@
        
        # 8. 寫入新檔案
        $newContent | Out-File $PageName -Encoding UTF8 -NoNewline
        
        Write-Host "  ✅ 轉換完成" -ForegroundColor Green
        
    } catch {
        Write-Host "  ❌ 錯誤: $_" -ForegroundColor Red
    }
}

# 主程式
foreach ($page in $pagesToConvert) {
    if (Test-Path $page) {
        Convert-PageToTemplate -PageName $page
    } else {
        Write-Host "`n❌ 檔案不存在: $page" -ForegroundColor Red
    }
}

Write-Host "`n=== 批量轉換完成 ===" -ForegroundColor Cyan
Write-Host "請測試頁面是否正常運作" -ForegroundColor Yellow
