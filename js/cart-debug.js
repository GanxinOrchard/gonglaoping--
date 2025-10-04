// 購物車診斷腳本
console.log('=== 購物車診斷開始 ===');

document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ DOMContentLoaded 事件觸發');
    
    // 檢查所有購物車相關元素
    const elements = {
        cartIcon: document.getElementById('cartIcon'),
        cartSidebar: document.getElementById('cartSidebar'),
        cartOverlay: document.getElementById('cartOverlay'),
        cartCount: document.getElementById('cartCount'),
        closeCart: document.getElementById('closeCart'),
        checkoutBtn: document.getElementById('checkoutBtn'),
        floatingCartBtn: document.getElementById('floatingCartBtn')
    };
    
    console.log('=== 元素檢查 ===');
    for (const [key, element] of Object.entries(elements)) {
        if (element) {
            console.log(`✅ ${key}: 找到`, element);
            
            // 檢查元素樣式
            const styles = window.getComputedStyle(element);
            console.log(`  - display: ${styles.display}`);
            console.log(`  - visibility: ${styles.visibility}`);
            console.log(`  - opacity: ${styles.opacity}`);
            console.log(`  - z-index: ${styles.zIndex}`);
            console.log(`  - pointer-events: ${styles.pointerEvents}`);
        } else {
            console.error(`❌ ${key}: 未找到`);
        }
    }
    
    // 檢查購物車圖示點擊事件
    if (elements.cartIcon) {
        console.log('=== 測試購物車圖示點擊 ===');
        
        // 添加診斷點擊監聽器
        elements.cartIcon.addEventListener('click', (e) => {
            console.log('🔔 購物車圖示被點擊！');
            console.log('  - Event:', e);
            console.log('  - Target:', e.target);
            console.log('  - CurrentTarget:', e.currentTarget);
        }, true); // 使用捕獲階段
        
        // 檢查是否有其他事件監聽器
        const listeners = getEventListeners ? getEventListeners(elements.cartIcon) : null;
        if (listeners) {
            console.log('  - 事件監聽器:', listeners);
        }
    }
    
    // 檢查購物車資料
    console.log('=== 購物車資料檢查 ===');
    try {
        const cartData = localStorage.getItem('cart');
        const cart = JSON.parse(cartData) || [];
        console.log('✅ 購物車資料:', cart);
        console.log('  - 商品數量:', cart.length);
    } catch (e) {
        console.error('❌ 讀取購物車資料失敗:', e);
    }
    
    // 檢查 cart.js 是否載入
    console.log('=== JavaScript 檢查 ===');
    console.log('  - cart 變數存在:', typeof cart !== 'undefined');
    console.log('  - addToCart 函數存在:', typeof addToCart !== 'undefined');
    console.log('  - updateCartUI 函數存在:', typeof updateCartUI !== 'undefined');
    console.log('  - closeCartSidebar 函數存在:', typeof closeCartSidebar !== 'undefined');
    
    // 檢查 z-index 層級
    console.log('=== Z-Index 檢查 ===');
    const zIndexElements = [
        { name: 'header', selector: 'header' },
        { name: 'mainMenu', selector: '#mainMenu' },
        { name: 'cartSidebar', selector: '#cartSidebar' },
        { name: 'cartOverlay', selector: '#cartOverlay' },
        { name: 'cartIcon', selector: '#cartIcon' }
    ];
    
    zIndexElements.forEach(({ name, selector }) => {
        const el = document.querySelector(selector);
        if (el) {
            const zIndex = window.getComputedStyle(el).zIndex;
            console.log(`  - ${name}: ${zIndex}`);
        }
    });
    
    console.log('=== 購物車診斷完成 ===');
    console.log('請檢查上述結果，尋找 ❌ 標記的錯誤');
});

// 手動測試函數
window.testCartClick = function() {
    console.log('=== 手動測試購物車點擊 ===');
    const cartIcon = document.getElementById('cartIcon');
    if (cartIcon) {
        console.log('✅ 找到購物車圖示');
        cartIcon.click();
        console.log('✅ 已觸發點擊事件');
    } else {
        console.error('❌ 找不到購物車圖示');
    }
};

window.testOpenCart = function() {
    console.log('=== 手動測試打開購物車 ===');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    
    if (cartSidebar && cartOverlay) {
        console.log('✅ 找到購物車元素');
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
        cartOverlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
        console.log('✅ 已手動打開購物車');
    } else {
        console.error('❌ 找不到購物車元素');
        console.log('cartSidebar:', cartSidebar);
        console.log('cartOverlay:', cartOverlay);
    }
};

console.log('💡 提示：可以在 Console 中執行以下命令進行測試：');
console.log('  - testCartClick() : 測試購物車點擊');
console.log('  - testOpenCart() : 手動打開購物車');
