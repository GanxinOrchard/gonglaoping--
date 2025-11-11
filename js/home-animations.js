/**
 * 首頁滑入動畫效果
 * 使用 Intersection Observer API 實現滾動觸發動畫
 */

// 等待 DOM 載入完成
document.addEventListener('DOMContentLoaded', function() {
    // 設定觀察器選項
    const observerOptions = {
        root: null, // 使用視窗作為根元素
        rootMargin: '0px',
        threshold: 0.1 // 當元素 10% 可見時觸發
    };

    // 創建觀察器
    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry, index) {
            if (entry.isIntersecting) {
                // 添加延遲效果，讓卡片依序出現
                setTimeout(function() {
                    entry.target.classList.add('animated');
                }, index * 100); // 每個卡片延遲 100ms
                
                // 動畫執行後停止觀察（避免重複觸發）
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 選取所有需要動畫的元素
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    // 開始觀察每個元素
    animateElements.forEach(function(element) {
        observer.observe(element);
    });

    // 為卡片添加交錯延遲效果
    const advantageCards = document.querySelectorAll('.advantage-card');
    advantageCards.forEach(function(card, index) {
        card.style.animationDelay = (index * 0.1) + 's';
    });

    const productCards = document.querySelectorAll('.modern-product-card');
    productCards.forEach(function(card, index) {
        card.style.animationDelay = (index * 0.1) + 's';
    });

    const qualityItems = document.querySelectorAll('.quality-item');
    qualityItems.forEach(function(card, index) {
        card.style.animationDelay = (index * 0.1) + 's';
    });
});
