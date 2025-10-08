# PowerShell 腳本：批次更新所有 HTML 檔案的導覽列

$standardNav = @'
                <div class="main-menu" id="mainMenu">
                    <ul>
                        <li><a href="index.html">首頁</a></li>
                        <li><a href="news.html">最新消息</a></li>
                        <li class="dropdown">
                            <a href="season-recommend.html">本季嚴選 <i class="fas fa-chevron-down"></i></a>
                            <ul class="dropdown-menu">
                                <li><a href="season-recommend.html">當季推薦</a></li>
                                <li><a href="season-ponkan.html">椪柑產季</a></li>
                                <li><a href="season-murcott.html">茂谷柑產季</a></li>
                                <li><a href="season-water-chestnut.html">菱角產季</a></li>
                                <li><a href="season-taro.html">芋角產季</a></li>
                            </ul>
                        </li>
                        <li class="dropdown">
                            <a href="products.html">全部商品 <i class="fas fa-chevron-down"></i></a>
                            <ul class="dropdown-menu">
                                <li><a href="products.html?category=優質水果">優質水果</a></li>
                                <li><a href="products.html?category=新鮮蔬果">新鮮蔬果</a></li>
                                <li><a href="products.html?category=冷凍食品">冷凍食品</a></li>
                            </ul>
                        </li>
                        <li class="dropdown">
                            <a href="farming.html">安心指南 <i class="fas fa-chevron-down"></i></a>
                            <ul class="dropdown-menu">
                                <li><a href="farming.html">友善栽培</a></li>
                                <li><a href="season.html">產季資訊</a></li>
                                <li><a href="knowledge.html">蔬果知識+</a></li>
                            </ul>
                        </li>
                        <li class="dropdown">
                            <a href="guide.html">挑選指南 <i class="fas fa-chevron-down"></i></a>
                            <ul class="dropdown-menu">
                                <li><a href="guide-ponkan.html">椪柑挑選</a></li>
                                <li><a href="guide-murcott.html">茂谷柑挑選</a></li>
                                <li><a href="guide-water-chestnut.html">菱角挑選</a></li>
                                <li><a href="guide-taro.html">芋角挑選</a></li>
                            </ul>
                        </li>
                        <li class="dropdown">
                            <a href="grading.html">規格分級 <i class="fas fa-chevron-down"></i></a>
                            <ul class="dropdown-menu">
                                <li><a href="grading-ponkan.html">椪柑規格</a></li>
                                <li><a href="grading-murcott.html">茂谷柑規格</a></li>
                                <li><a href="grading-water-chestnut.html">菱角規格</a></li>
                                <li><a href="grading-taro.html">芋角規格</a></li>
                            </ul>
                        </li>
                        <li class="dropdown">
                            <a href="about.html">關於我們 <i class="fas fa-chevron-down"></i></a>
                            <ul class="dropdown-menu">
                                <li><a href="about.html">關於柑心果園</a></li>
                                <li><a href="contact.html">聯絡我們</a></li>
                            </ul>
                        </li>
                        <li><a href="order-tracking.html">訂單查詢</a></li>
                    </ul>
                </div>
'@

# 取得所有 HTML 檔案（排除測試檔案）
$htmlFiles = Get-ChildItem -Path . -Filter *.html | Where-Object { 
    $_.Name -notmatch 'CSS-TEST|診斷' 
}

$updatedCount = 0

foreach ($file in $htmlFiles) {
    Write-Host "處理: $($file.Name)" -ForegroundColor Cyan
    
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    
    # 使用正則表達式替換導覽列
    $pattern = '(?s)<div class="main-menu"[^>]*>.*?</div>\s*</div>\s*</nav>'
    
    if ($content -match $pattern) {
        $newContent = $content -replace $pattern, ($standardNav + "`r`n            </div>`r`n        </nav>")
        
        if ($newContent -ne $content) {
            Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8 -NoNewline
            Write-Host "  ✓ 已更新" -ForegroundColor Green
            $updatedCount++
        } else {
            Write-Host "  - 無變更" -ForegroundColor Yellow
        }
    } else {
        Write-Host "  ! 找不到導覽列" -ForegroundColor Red
    }
}

Write-Host "`n完成！共更新了 $updatedCount 個檔案" -ForegroundColor Green
