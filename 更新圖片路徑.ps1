# ========================================
# 批量更新 HTML 圖片路徑
# 因應圖片資料夾重組
# ========================================

Write-Host "=== 批量更新 HTML 圖片路徑 ===" -ForegroundColor Cyan

# 備份所有 HTML
Write-Host "`n【步驟1】備份 HTML 檔案" -ForegroundColor Yellow
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupFolder = "backups/path-update-$timestamp"
New-Item -ItemType Directory -Path $backupFolder -Force | Out-Null

$htmlFiles = Get-ChildItem "*.html" | Where-Object {
    $_.Name -notlike "*backup*" -and 
    $_.Name -notlike "*test*"
}

foreach($file in $htmlFiles) {
    Copy-Item $file.FullName "$backupFolder/$($file.Name)" -Force
}
Write-Host "  ✅ 已備份 $($htmlFiles.Count) 個檔案到 $backupFolder" -ForegroundColor Green

# 定義路徑映射規則
$pathMappings = @{
    # Products 商品圖片
    'images/椪柑(\d+)\.(jpg|png)' = 'images/products/ponkan/gallery/椪柑$1.$2'
    'images/ponkan\.jpg' = 'images/products/ponkan/main/ponkan.jpg'
    'images/椪柑產品圖(\d+)\.(jpg|png)' = 'images/products/ponkan/gallery/椪柑產品圖$1.$2'
    
    'images/茂谷柑(\d+)\.(jpg|png)' = 'images/products/murcott/gallery/茂谷柑$1.$2'
    'images/murcott\.jpg' = 'images/products/murcott/main/murcott.jpg'
    'images/茂谷柑產品圖(\d+)\.(jpg|png)' = 'images/products/murcott/gallery/茂谷柑產品圖$1.$2'
    
    'images/water-chestnut\.jpg' = 'images/products/water-chestnut/main/water-chestnut.jpg'
    'images/新鮮蔬果菱角(\d+)\.(jpg|png)' = 'images/products/water-chestnut/gallery/新鮮蔬果菱角$1.$2'
    'images/商品照\(菱角.*?\)(.*?)\.jpg' = 'images/products/water-chestnut/gallery/$2.jpg'
    
    'images/新鮮蔬果芋頭2CM\.jpg' = 'images/products/taro/content/新鮮蔬果芋頭2CM.jpg'
    
    'images/柑心果園販賣所-(\d+)\.png' = 'images/products/store/gallery/柑心果園販賣所-$1.png'
    
    # Pages - Index
    'images/商品介紹(\d+)\.png' = 'images/pages/index/features/商品介紹$1.png'
    
    # Pages - About
    'images/關於我們的封面首頁\.png' = 'images/pages/about/covers/關於我們的封面首頁.png'
    'images/公老坪百年傳承\.png' = 'images/pages/about/content/公老坪百年傳承.png'
    'images/友善栽培\.png' = 'images/pages/about/content/友善栽培.png'
    
    # Pages - News
    'images/最新消息封面\.png' = 'images/pages/news/covers/最新消息封面.png'
    'images/最近消息\(果實進拍1\)\.jpg' = 'images/pages/news/articles/最近消息(果實進拍1).jpg'
    
    # Pages - Season
    'images/產季推薦封面圖\.png' = 'images/pages/season/recommend/產季推薦封面圖.png'
    'images/椪柑如何保存最新鮮封面(圖)?\.png' = 'images/pages/season/ponkan/椪柑如何保存最新鮮封面$1.png'
    'images/茂谷柑產季封面圖\.png' = 'images/pages/season/murcott/茂谷柑產季封面圖.png'
    'images/芋頭採收封面圖\.png' = 'images/pages/season/taro/芋頭採收封面圖.png'
    
    # Pages - Guide
    'images/挑選指南封面圖\.png' = 'images/pages/guide/covers/挑選指南封面圖.png'
    'images/挑選椪柑指南封面圖\.png' = 'images/pages/guide/ponkan/挑選椪柑指南封面圖.png'
    'images/挑選茂谷柑封面圖\.png' = 'images/pages/guide/murcott/挑選茂谷柑封面圖.png'
    'images/挑選芋頭指南封面圖\.png' = 'images/pages/guide/taro/挑選芋頭指南封面圖.png'
    'images/挑選菱角指南封面圖\.png' = 'images/pages/guide/water-chestnut/挑選菱角指南封面圖.png'
    'images/4刀切法\.png' = 'images/pages/guide/diagrams/4刀切法.png'
    
    # Pages - Grading
    'images/規格分級說明封面圖\.png' = 'images/pages/grading/covers/規格分級說明封面圖.png'
    'images/精選特級椪柑\.png' = 'images/pages/grading/ponkan/精選特級椪柑.png'
    'images/精選特級茂谷柑封面圖\.png' = 'images/pages/grading/murcott/精選特級茂谷柑封面圖.png'
    
    # Pages - Farming
    'images/友善栽培的封面圖\.png' = 'images/pages/farming/covers/友善栽培的封面圖.png'
    'images/種植菱角的封面圖\.png' = 'images/pages/farming/covers/種植菱角的封面圖.png'
    
    # Pages - Knowledge
    'images/蔬果知識封面圖\.png' = 'images/pages/knowledge/covers/蔬果知識封面圖.png'
    
    # Pages - Contact
    'images/聯絡我們\.png' = 'images/pages/contact/covers/聯絡我們.png'
    
    # Pages - Cart/Checkout
    'images/購物車封面\.png' = 'images/pages/cart-checkout/covers/購物車封面.png'
    
    # Shared
    'images/logo\.png' = 'images/shared/logo/logo.png'
    'images/商標\.jpg' = 'images/shared/logo/商標.jpg'
    'images/柑心商標\.png' = 'images/shared/logo/柑心商標.png'
    'images/漢堡選單\.png' = 'images/shared/icons/漢堡選單.png'
}

# 執行替換
Write-Host "`n【步驟2】更新圖片路徑" -ForegroundColor Yellow
$totalUpdates = 0

foreach($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    $fileUpdates = 0
    
    foreach($pattern in $pathMappings.Keys) {
        $replacement = $pathMappings[$pattern]
        if($content -match $pattern) {
            $content = $content -replace $pattern, $replacement
            $fileUpdates++
        }
    }
    
    if($content -ne $originalContent) {
        $content | Out-File $file.FullName -Encoding UTF8 -NoNewline
        Write-Host "  ✅ $($file.Name): $fileUpdates 處更新" -ForegroundColor Green
        $totalUpdates += $fileUpdates
    }
}

Write-Host "`n=== 完成 ===" -ForegroundColor Green
Write-Host "  總共更新: $totalUpdates 處圖片路徑" -ForegroundColor Cyan
Write-Host "  備份位置: $backupFolder" -ForegroundColor Gray
Write-Host "`n💡 建議：測試所有頁面，確認圖片正常顯示"
