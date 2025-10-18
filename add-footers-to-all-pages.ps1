# 將統一頁尾結構應用到所有頁面

# 統一頁尾內容（從products.html複製）
$unifiedFooter = @'
    <!-- 頁尾 -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h4>關於柑心果園</h4>
                    <p>柑心果園專營公老坪椪柑、東勢茂谷柑等優質水果，產地直送新鮮美味。我們堅持自然有機種植，讓您品嚐到最純正的台灣水果風味。</p>
                    <div class="social-links">
                        <a href="https://www.facebook.com/share/19vDVjSz9Y/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer"><i class="fab fa-facebook"></i></a>
                        <a href="#" target="_blank"><i class="fab fa-instagram"></i></a>
                        <a href="#" target="_blank"><i class="fab fa-line"></i></a>
                        <a href="#" target="_blank"><i class="fab fa-youtube"></i></a>
                    </div>
                </div>
                <div class="footer-section">
                    <h4>客戶服務</h4>
                    <ul>
                        <li><a href="policies.html?type=faq">常見問題</a></li>
                        <li><a href="policies.html?type=shipping">配送說明</a></li>
                        <li><a href="policies.html?type=return">退換貨政策</a></li>
                        <li><a href="policies.html?type=privacy">隱私權政策</a></li>
                        <li><a href="policies.html?type=terms">使用條款</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>購物指南</h4>
                    <ul>
                        <li><a href="policies.html?type=how-to-order">如何訂購</a></li>
                        <li><a href="policies.html?type=payment">付款方式</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>聯絡我們</h4>
                    <ul class="contact-list">
                        <li><i class="fas fa-phone"></i> 0933-721-978</li>
                        <li><i class="fas fa-envelope"></i> s9000721@gmail.com</li>
                        <li><i class="fas fa-map-marker-alt"></i> 台中豐原公老坪/東勢/柑心果園</li>
                        <li><i class="fas fa-clock"></i> 週一至週日 12:00-18:00</li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2025 柑心果園 Ganxin Orchard. 版權所有</p>
            </div>
        </div>
    </footer>

    <!-- 回到頂部按鈕 -->
    <button class="back-to-top" id="backToTop" aria-label="回到頂部">
        <i class="fas fa-arrow-up"></i>
    </button>
'@

# 需要添加頁尾的頁面列表
$pagesToAddFooter = @(
    "about.html",
    "contact.html",
    "news.html",
    "farming.html",
    "knowledge.html",
    "grading.html",
    "policies.html",
    "cart.html",
    "checkout.html",
    "confirm.html",
    "order-tracking.html",
    "order-complete.html",
    "product-detail.html",
    "knowledge-detail.html",
    "news-detail.html",
    "season.html",
    "season-recommend.html",
    "season-ponkan.html",
    "season-murcott.html",
    "season-water-chestnut.html",
    "season-taro.html",
    "guide.html",
    "guide-ponkan.html",
    "guide-murcott.html",
    "guide-water-chestnut.html",
    "guide-taro.html",
    "grading-ponkan.html",
    "grading-murcott.html",
    "linepay.html",
    "linepay-confirm.html"
)

foreach ($page in $pagesToAddFooter) {
    if (Test-Path $page) {
        Write-Host "正在為 $page 添加統一頁尾..."
        try {
            $content = Get-Content -Path $page -Encoding UTF8 -Raw

            # 檢查是否已經有統一頁尾
            $hasUnifiedFooter = $content -match '關於柑心果園.*柑心果園專營公老坪椪柑'

            if (-not $hasUnifiedFooter) {
                # 尋找結尾標籤</body>
                $bodyEndIndex = $content.LastIndexOf('</body>')

                if ($bodyEndIndex -ge 0) {
                    # 在</body>之前插入頁尾
                    $beforeBody = $content.Substring(0, $bodyEndIndex)
                    $afterBody = $content.Substring($bodyEndIndex)
                    $newContent = $beforeBody + $unifiedFooter + $afterBody

                    Set-Content -Path $page -Value $newContent -Encoding UTF8
                    Write-Host "✓ $page 頁尾添加完成"
                } else {
                    Write-Host "✗ $page 找不到</body>標籤，跳過"
                }
            } else {
                Write-Host "✓ $page 已經有統一頁尾，跳過"
            }
        }
        catch {
            Write-Host "✗ $page 頁尾添加失敗: $($_.Exception.Message)"
        }
    } else {
        Write-Host "✗ $page 檔案不存在"
    }
}

Write-Host "所有頁面頁尾添加完成！"
