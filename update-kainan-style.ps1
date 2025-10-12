# 更新首頁為開南風格
$indexFile = "C:\Users\張-1\CascadeProjects\ganxin-orchard\index.html"

# 讀取文件
$content = Get-Content $indexFile -Raw -Encoding UTF8

# 1. 替換特色區塊
$oldFeatures = @'
    <!-- 特色介紹 -->
    <section class="features">
        <div class="container">
            <h2 class="section-title">我們的特色與優勢</h2>
            <div class="features-grid" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); max-width: 1000px; margin: 0 auto;">
                <div class="feature-item">
                    <div class="feature-icon" style="background: linear-gradient(135deg, #27ae60, #2ecc71);">
                        <i class="fas fa-leaf"></i>
                    </div>
                    <h3>自然有機種植</h3>
                    <p>採用自然農法，不使用化學農藥<br>堅持有機種植，讓您吃得安心</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon" style="background: linear-gradient(135deg, #3498db, #2980b9);">
                        <i class="fas fa-certificate"></i>
                    </div>
                    <h3>品質保證認證</h3>
                    <p>通過多項品質認證<br>每一顆水果都經過嚴格篩選</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon" style="background: linear-gradient(135deg, #e74c3c, #c0392b);">
                        <i class="fas fa-truck-fast"></i>
                    </div>
                    <h3>快速新鮮配送</h3>
                    <p>24-48 小時內送達<br>保持水果最新鮮的狀態</p>
                </div>
            </div>
        </div>
    </section>
'@

$newFeatures = @'
    <!-- 百年果園傳承 - 開南風格 -->
    <section class="heritage-section">
        <div class="container">
            <div class="heritage-content">
                <div class="heritage-circle">
                    <div class="heritage-number">100<span class="plus">+</span></div>
                    <div class="heritage-subtitle">YEARS OF HERITAGE</div>
                </div>
                <div class="heritage-text">
                    <h2 class="heritage-title">百年果園傳承<br>品質零距離</h2>
                    <p class="heritage-description">
                        經營百年以上果園經驗，柑心果園深耕於公老坪<br>
                        茶及椪柑產區與東勢茂谷柑市場，用心把關每顆水果安<br>
                        全種植，提供您安心及高品質的一站式購足服務，<br>
                        將全方位優質的購物體驗帶給您。
                    </p>
                </div>
                <div class="heritage-decoration">
                    <img src="images/椪柑產品圖/椪柑1.jpg" alt="柑心果園" class="heritage-image">
                </div>
            </div>
        </div>
    </section>
'@

$content = $content -replace [regex]::Escape($oldFeatures), $newFeatures

# 2. 更新 CSS 引用（在 head 中添加開南風格 CSS）
$cssLink = '<link rel="stylesheet" href="./css/kainan-style.css?v=20251013">'
if ($content -notmatch 'kainan-style.css') {
    $content = $content -replace '(<link rel="stylesheet" href="./css/style.css[^>]+>)', "`$1`n    $cssLink"
}

# 保存文件
$content | Set-Content $indexFile -Encoding UTF8 -NoNewline

Write-Host "✅ 首頁已更新為開南風格！" -ForegroundColor Green
Write-Host "📝 請檢查: $indexFile" -ForegroundColor Cyan
