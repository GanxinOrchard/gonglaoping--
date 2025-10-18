# 簡化版套用首頁組件腳本
Write-Host "開始套用首頁組件到主要分頁..." -ForegroundColor Green

# 讀取模板內容
$templateContent = Get-Content "homepage_components_template.html" -Raw -Encoding UTF8

# 主要頁面列表
$mainPages = @("about.html", "news.html", "contact.html", "products.html", "farming.html")

foreach ($file in $mainPages) {
    if (Test-Path $file) {
        Write-Host "處理文件: $file" -ForegroundColor Yellow
        
        $content = Get-Content $file -Raw -Encoding UTF8
        
        # 在 </main> 後插入模板內容
        if ($content -match '</main>') {
            $content = $content -replace '</main>', "</main>`n`n$templateContent"
            
            # 更新版本號
            $content = $content -replace 'style\.css\?v=\d+', 'style.css?v=20250115FF'
            $content = $content -replace 'mobile-menu-simple\.js\?v=\d+', 'mobile-menu-simple.js?v=20250115FF'
            $content = $content -replace 'dropdown-menu\.js\?v=\d+', 'dropdown-menu.js?v=20250115FF'
            $content = $content -replace 'cart\.js\?v=\d+', 'cart.js?v=20250115FF'
            
            # 保存文件
            Set-Content -Path $file -Value $content -Encoding UTF8 -NoNewline
            Write-Host "完成: $file" -ForegroundColor Green
        } else {
            Write-Host "警告: $file 中未找到 </main> 標籤" -ForegroundColor Red
        }
    } else {
        Write-Host "文件不存在: $file" -ForegroundColor Red
    }
}

Write-Host "主要分頁已成功套用首頁組件！" -ForegroundColor Green
