# 添加購物車按鈕和側邊欄到頁面的腳本

$cartHTML = @'

    <!-- 懸浮購物車按鈕 -->
    <div class="floating-cart-btn" id="floatingCartBtn">
        <i class="fas fa-shopping-cart"></i>
        <span class="cart-badge" id="floatingCartCount">0</span>
    </div>

    <!-- 購物車側邊欄 -->
    <div class="cart-sidebar" id="cartSidebar">
        <div class="cart-header">
            <h3>購物車</h3>
            <button class="close-cart" id="closeCart">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="cart-items" id="cartItems">
            <!-- 購物車項目將由 JavaScript 動態載入 -->
        </div>
        <div class="cart-footer">
            <div class="cart-total">
                <div class="subtotal">
                    <span>商品小計：</span>
                    <span id="subtotal">NT$ 0</span>
                </div>
                <div class="shipping-row">
                    <span>運費：</span>
                    <span id="shippingFee">NT$ 150</span>
                </div>
                <div class="discount-amount" id="discountAmount" style="display: none;">
                    <span>折扣：</span>
                    <span id="discountValue">-NT$ 0</span>
                </div>
                <div class="total">
                    <span>總計：</span>
                    <span id="total">NT$ 0</span>
                </div>
                <div class="shipping-notice">
                    <i class="fas fa-truck"></i> 滿 NT$1,800 免運費
                </div>
            </div>
            <button class="btn-checkout" id="checkoutBtn">前往結帳</button>
        </div>
    </div>

    <!-- 結帳彈窗 -->
    <div class="modal" id="checkoutModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>結帳資訊</h3>
                <button class="close-modal" id="closeCheckoutModal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <form id="checkoutForm">
                    <div class="form-group">
                        <label for="customerName">姓名 *</label>
                        <input type="text" id="customerName" required>
                    </div>
                    <div class="form-group">
                        <label for="customerPhone">電話 *</label>
                        <input type="tel" id="customerPhone" required>
                    </div>
                    <div class="form-group">
                        <label for="customerEmail">Email *</label>
                        <input type="email" id="customerEmail" required>
                    </div>
                    <div class="form-group">
                        <label for="customerAddress">配送地址 *</label>
                        <textarea id="customerAddress" rows="3" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="customerNote">備註</label>
                        <textarea id="customerNote" rows="2"></textarea>
                    </div>
                    <div class="order-summary">
                        <h4>訂單摘要</h4>
                        <div id="checkoutSummary"></div>
                        <div class="checkout-total">
                            <span>總金額：</span>
                            <span id="checkoutTotal">NT$ 0</span>
                        </div>
                    </div>
                    <div class="payment-methods">
                        <h4>付款方式</h4>
                        <label class="payment-option">
                            <input type="radio" name="payment" value="linepay" checked>
                            <span><i class="fab fa-line"></i> LINE Pay</span>
                        </label>
                        <label class="payment-option">
                            <input type="radio" name="payment" value="cod">
                            <span><i class="fas fa-money-bill-wave"></i> 貨到付款</span>
                        </label>
                    </div>
                    <button type="submit" class="btn-submit-order">確認訂單並付款</button>
                </form>
            </div>
        </div>
    </div>
'@

$files = @(
    "knowledge-detail.html",
    "news-detail.html"
)

foreach ($file in $files) {
    $filePath = Join-Path $PSScriptRoot $file
    
    if (Test-Path $filePath) {
        Write-Host "處理 $file ..."
        
        $content = Get-Content $filePath -Raw -Encoding UTF8
        
        # 尋找 </button> 後面的內容（懸浮 Menu 按鈕之後）
        $pattern = '(    <button class="floating-menu-btn"[^>]*>[\s\S]*?</button>\s*)'
        
        if ($content -match $pattern) {
            $replacement = $matches[1] + $cartHTML
            $newContent = $content -replace $pattern, $replacement
            
            # 寫回檔案
            [System.IO.File]::WriteAllText($filePath, $newContent, [System.Text.UTF8Encoding]::new($false))
            Write-Host "✓ $file 已更新" -ForegroundColor Green
        } else {
            Write-Host "✗ 在 $file 中找不到插入點" -ForegroundColor Red
        }
    } else {
        Write-Host "✗ 找不到檔案: $file" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Complete!" -ForegroundColor Cyan
