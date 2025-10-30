# ========================================
# 建立圖片資料夾結構
# ========================================

Write-Host "=== 建立圖片分類資料夾結構 ===" -ForegroundColor Cyan

$basePath = "images"

# 定義資料夾結構
$folders = @(
    # 共用圖片
    "$basePath/shared/logo",
    "$basePath/shared/icons",
    "$basePath/shared/hero",
    
    # 分頁圖片
    "$basePath/pages/home/hero",
    "$basePath/pages/home/features",
    "$basePath/pages/home/promotion",
    
    "$basePath/pages/about",
    
    "$basePath/pages/news",
    
    "$basePath/pages/season/covers",
    "$basePath/pages/season/content",
    
    "$basePath/pages/guide/covers",
    "$basePath/pages/guide/diagrams",
    
    "$basePath/pages/grading",
    
    "$basePath/pages/farming",
    
    "$basePath/pages/knowledge",
    
    "$basePath/pages/contact",
    
    "$basePath/pages/cart-checkout",
    
    # 商品圖片
    "$basePath/products/ponkan",
    "$basePath/products/murcott",
    "$basePath/products/taro",
    "$basePath/products/water-chestnut",
    "$basePath/products/store",
    
    # 臨時
    "$basePath/temp"
)

Write-Host "`n【建立資料夾】" -ForegroundColor Yellow
$created = 0
$existed = 0

foreach($folder in $folders) {
    if(-not (Test-Path $folder)) {
        New-Item -ItemType Directory -Path $folder -Force | Out-Null
        Write-Host "  ✅ 建立: $folder" -ForegroundColor Green
        $created++
    } else {
        Write-Host "  ℹ️ 已存在: $folder" -ForegroundColor Gray
        $existed++
    }
}

Write-Host "`n=== 完成 ===" -ForegroundColor Green
Write-Host "  新建立: $created 個資料夾"
Write-Host "  已存在: $existed 個資料夾"
Write-Host "`n✅ 資料夾結構建立完成！"
