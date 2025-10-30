# ========================================
# 移動圖片到分類資料夾
# 根據檔名智能分類
# ========================================

Write-Host "=== 移動圖片到分類資料夾 ===" -ForegroundColor Cyan

$basePath = "images"

# 定義移動規則（檔名關鍵字 -> 目標資料夾）
$moveRules = @{
    # Logo 類
    "logo" = "shared/logo"
    "商標" = "shared/logo"
    "柑心商標" = "shared/logo"
    
    # 圖示類
    "漢堡選單" = "shared/icons"
    
    # 商品類 - 椪柑
    "椪柑" = "products/ponkan"
    "ponkan" = "products/ponkan"
    
    # 商品類 - 茂谷柑
    "茂谷" = "products/murcott"
    "murcott" = "products/murcott"
    
    # 商品類 - 芋頭
    "芋頭" = "products/taro"
    "芋角" = "products/taro"
    "taro" = "products/taro"
    
    # 商品類 - 菱角
    "菱角" = "products/water-chestnut"
    "water-chestnut" = "products/water-chestnut"
    
    # 商品類 - 販賣所
    "販賣所" = "products/store"
    
    # 分頁 - 關於我們
    "關於我們" = "pages/about"
    
    # 分頁 - 最新消息
    "最新消息" = "pages/news"
    "最近消息" = "pages/news"
    
    # 分頁 - 產季
    "產季" = "pages/season/covers"
    "保存" = "pages/season/covers"
    "採收" = "pages/season/covers"
    
    # 分頁 - 指南
    "挑選" = "pages/guide/covers"
    "指南" = "pages/guide/covers"
    "切法" = "pages/guide/diagrams"
    
    # 分頁 - 分級
    "規格" = "pages/grading"
    "分級" = "pages/grading"
    
    # 分頁 - 農場/種植
    "友善栽培" = "pages/farming"
    "種植" = "pages/farming"
    
    # 分頁 - 知識
    "蔬果知識" = "pages/knowledge"
    "知識" = "pages/knowledge"
    
    # 分頁 - 聯絡
    "聯絡我們" = "pages/contact"
    
    # 分頁 - 購物車
    "購物車" = "pages/cart-checkout"
    
    # 分頁 - 商品介紹（首頁）
    "商品介紹" = "pages/home/features"
    
    # 分頁 - 常見問題
    "常見問題" = "pages/home"
}

# 取得 images 根目錄下的所有圖片（排除子資料夾）
$images = Get-ChildItem "$basePath\*" -File -Include *.png,*.jpg,*.jpeg,*.gif,*.webp

Write-Host "`n【開始分類移動】" -ForegroundColor Yellow
Write-Host "找到 $($images.Count) 個圖片需要分類`n"

$moved = 0
$skipped = 0
$unknown = @()

foreach($img in $images) {
    $fileName = $img.Name
    $matched = $false
    
    # 檢查每個規則
    foreach($keyword in $moveRules.Keys) {
        if($fileName -like "*$keyword*") {
            $targetDir = "$basePath/$($moveRules[$keyword])"
            $targetPath = Join-Path $targetDir $fileName
            
            # 檢查目標是否已存在
            if(Test-Path $targetPath) {
                Write-Host "  ⏭️ 跳過（已存在）: $fileName" -ForegroundColor Gray
                $skipped++
            } else {
                # 移動檔案
                Move-Item $img.FullName $targetPath -Force
                Write-Host "  ✅ 移動: $fileName → $($moveRules[$keyword])" -ForegroundColor Green
                $moved++
            }
            
            $matched = $true
            break
        }
    }
    
    # 如果沒有匹配規則，移到 temp
    if(-not $matched) {
        $tempPath = "$basePath/temp/$fileName"
        if(-not (Test-Path $tempPath)) {
            Move-Item $img.FullName $tempPath -Force
            Write-Host "  ⚠️ 待分類: $fileName → temp/" -ForegroundColor Yellow
            $unknown += $fileName
        }
    }
}

# 處理原本在子資料夾的圖片（椪柑產品圖、茂谷柑產品圖等）
Write-Host "`n【處理原有子資料夾】" -ForegroundColor Yellow
$oldFolders = @{
    "椪柑產品圖" = "products/ponkan"
    "茂谷柑產品圖" = "products/murcott"
    "芋角" = "products/taro"
    "菱角仁" = "products/water-chestnut"
    "關於我們圖片" = "pages/about"
}

foreach($oldFolder in $oldFolders.Keys) {
    $oldPath = "$basePath/$oldFolder"
    if(Test-Path $oldPath) {
        $files = Get-ChildItem $oldPath -File
        if($files.Count -gt 0) {
            $newPath = "$basePath/$($oldFolders[$oldFolder])"
            foreach($file in $files) {
                $targetPath = Join-Path $newPath $file.Name
                if(-not (Test-Path $targetPath)) {
                    Move-Item $file.FullName $targetPath -Force
                    Write-Host "  ✅ 移動: $($file.Name) 從 $oldFolder" -ForegroundColor Green
                    $moved++
                }
            }
        }
        # 刪除空資料夾
        if((Get-ChildItem $oldPath).Count -eq 0) {
            Remove-Item $oldPath -Force
            Write-Host "  🗑️ 刪除空資料夾: $oldFolder" -ForegroundColor Gray
        }
    }
}

Write-Host "`n=== 移動完成 ===" -ForegroundColor Green
Write-Host "  已移動: $moved 個檔案"
Write-Host "  已跳過: $skipped 個檔案（已存在）"
Write-Host "  待分類: $($unknown.Count) 個檔案（在 temp/ 資料夾）"

if($unknown.Count -gt 0) {
    Write-Host "`n【需要手動分類的檔案】" -ForegroundColor Yellow
    foreach($file in $unknown) {
        Write-Host "  - $file"
    }
}

Write-Host "`n✅ 圖片分類完成！"
