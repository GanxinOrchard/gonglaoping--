# 刪除所有分頁的購物車、選單、頁尾、回到頂部按鈕腳本
# 排除首頁 index.html

Write-Host "開始刪除所有分頁的組件..." -ForegroundColor Green

# 獲取所有 HTML 文件，排除首頁
$htmlFiles = Get-ChildItem -Path '.' -Filter '*.html' | Where-Object { 
    $_.Name -ne 'index.html' -and 
    $_.Name -ne 'template_components.html' -and
    $_.Name -ne 'footer-template.html' -and
    $_.Name -ne 'header-template.html' -and
    $_.Name -ne 'hero-template.html' -and
    $_.Name -ne 'js-template.html'
}

Write-Host "找到 $($htmlFiles.Count) 個文件需要處理" -ForegroundColor Yellow

foreach ($file in $htmlFiles) {
    Write-Host "正在處理: $($file.Name)" -ForegroundColor Cyan
    
    try {
        $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
        $originalContent = $content
        
        # 1. 刪除 header 標籤及其內容
        $content = $content -replace '(?s)<header[^>]*>.*?</header>', ''
        
        # 2. 刪除 nav 標籤及其內容 (桌面導航)
        $content = $content -replace '(?s)<nav[^>]*class="[^"]*nav[^"]*"[^>]*>.*?</nav>', ''
        
        # 3. 刪除 footer 標籤及其內容
        $content = $content -replace '(?s)<footer[^>]*>.*?</footer>', ''
        
        # 4. 刪除購物車相關元素
        $content = $content -replace '(?s)<div[^>]*class="[^"]*cart[^"]*"[^>]*>.*?</div>', ''
        $content = $content -replace '(?s)<a[^>]*href="[^"]*cart[^"]*"[^>]*>.*?</a>', ''
        
        # 5. 刪除回到頂部按鈕
        $content = $content -replace '(?s)<div[^>]*class="[^"]*back-to-top[^"]*"[^>]*>.*?</div>', ''
        $content = $content -replace '(?s)<div[^>]*class="[^"]*scroll-top[^"]*"[^>]*>.*?</div>', ''
        $content = $content -replace '(?s)<div[^>]*class="[^"]*top-button[^"]*"[^>]*>.*?</div>', ''
        $content = $content -replace '(?s)<div[^>]*class="[^"]*go-top[^"]*"[^>]*>.*?</div>', ''
        $content = $content -replace '(?s)<button[^>]*class="[^"]*back-to-top[^"]*"[^>]*>.*?</button>', ''
        
        # 6. 刪除手機選單相關元素
        $content = $content -replace '(?s)<div[^>]*class="[^"]*menu-overlay[^"]*"[^>]*>.*?</div>', ''
        $content = $content -replace '(?s)<div[^>]*class="[^"]*main-menu[^"]*"[^>]*>.*?</div>', ''
        $content = $content -replace '(?s)<div[^>]*class="[^"]*mobile-menu[^"]*"[^>]*>.*?</div>', ''
        
        # 7. 刪除選單按鈕
        $content = $content -replace '(?s)<button[^>]*class="[^"]*menu-toggle[^"]*"[^>]*>.*?</button>', ''
        $content = $content -replace '(?s)<button[^>]*class="[^"]*menu-close[^"]*"[^>]*>.*?</button>', ''
        
        # 8. 刪除購物車計數器
        $content = $content -replace '(?s)<span[^>]*class="[^"]*cart-count[^"]*"[^>]*>.*?</span>', ''
        
        # 9. 清理多餘的空行
        $content = $content -replace '\r?\n\s*\r?\n\s*\r?\n', "`r`n`r`n"
        
        # 檢查是否有修改
        if ($content -ne $originalContent) {
            Set-Content -Path $file.FullName -Value $content -Encoding UTF8
            Write-Host "  ✓ 已清理: $($file.Name)" -ForegroundColor Green
        } else {
            Write-Host "  - 無需修改: $($file.Name)" -ForegroundColor Gray
        }
        
    } catch {
        Write-Host "  ✗ 處理失敗: $($file.Name) - $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n清理完成！" -ForegroundColor Green
Write-Host "已處理 $($htmlFiles.Count) 個文件" -ForegroundColor Yellow
