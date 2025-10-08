# 網站標準模板 - 所有頁面必須統一

## 1. 標準 Logo（左上角）
```html
<div class="logo">
    <a href="index.html">
        <img src="./images/商標.jpg" alt="柑心果園" loading="lazy" width="180" height="60">
    </a>
</div>
```

## 2. 標準導覽列（9個平行按鈕，無下拉選單）
```html
<div class="main-menu" id="mainMenu">
    <ul>
        <li><a href="index.html">首頁</a></li>
        <li><a href="news.html">最新消息</a></li>
        <li><a href="season-recommend.html">本季嚴選</a></li>
        <li><a href="products.html">全部商品</a></li>
        <li><a href="farming.html">安心指南</a></li>
        <li><a href="guide.html">挑選指南</a></li>
        <li><a href="grading.html">規格分級</a></li>
        <li><a href="about.html">關於我們</a></li>
        <li><a href="order-tracking.html">訂單查詢</a></li>
    </ul>
</div>
```

## 3. 標準底部資訊
```html
<footer class="footer">
    <div class="container">
        <div class="footer-content">
            <div class="footer-section">
                <h4>關於柑心果園</h4>
                <p>我們致力於提供最新鮮、最優質的台灣在地農產品，從產地直送到您家，讓您吃得安心、健康。</p>
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
                    <li><a href="policies.html?type=terms">服務條款</a></li>
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
                    <li><i class="fas fa-map-marker-alt"></i> 台灣台中市豐原區公老坪/東勢/柑心果園</li>
                    <li><i class="fas fa-clock"></i> 週一至週五 12:00-18:00</li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2025 柑心果園 Ganxin Orchard. 版權所有，翻印必究。</p>
        </div>
    </div>
</footer>
```

## 需要更新的所有頁面清單（共27個）
1. about.html
2. contact.html
3. farming.html
4. products.html
5. guide.html
6. guide-ponkan.html
7. guide-murcott.html
8. guide-water-chestnut.html
9. guide-taro.html
10. grading.html
11. grading-ponkan.html
12. grading-murcott.html
13. season-recommend.html
14. season-ponkan.html
15. season-murcott.html
16. season-water-chestnut.html
17. season-taro.html
18. season.html
19. knowledge.html
20. knowledge-detail.html
21. news.html
22. news-detail.html
23. order-tracking.html
24. policies.html
25. product-detail.html
26. cart.html
27. checkout.html
