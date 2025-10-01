// 清除快取並重新載入
(function() {
    // 版本號 - 每次更新時修改這個數字
    const CURRENT_VERSION = '2.1.0';
    const VERSION_KEY = 'ganxin_version';
    
    // 檢查版本
    const savedVersion = localStorage.getItem(VERSION_KEY);
    
    if (savedVersion !== CURRENT_VERSION) {
        console.log('檢測到新版本，清除快取...');
        
        // 清除 localStorage（保留購物車）
        const cart = localStorage.getItem('cart');
        localStorage.clear();
        if (cart) {
            localStorage.setItem('cart', cart);
        }
        
        // 清除 sessionStorage
        sessionStorage.clear();
        
        // 更新版本號
        localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
        
        // 清除瀏覽器快取並重新載入
        if ('caches' in window) {
            caches.keys().then(function(names) {
                for (let name of names) {
                    caches.delete(name);
                }
            });
        }
        
        console.log('快取已清除，重新載入頁面...');
        
        // 強制重新載入（不使用快取）
        window.location.reload(true);
    }
})();

// 手動清除快取函數
function clearAllCache() {
    if (confirm('確定要清除所有快取嗎？這將會重新載入頁面。')) {
        // 清除所有 localStorage
        localStorage.clear();
        
        // 清除所有 sessionStorage
        sessionStorage.clear();
        
        // 清除瀏覽器快取
        if ('caches' in window) {
            caches.keys().then(function(names) {
                for (let name of names) {
                    caches.delete(name);
                }
            });
        }
        
        // 強制重新載入
        window.location.reload(true);
    }
}

// 在控制台提供清除快取的快捷方式
console.log('%c柑心果園 - 開發工具', 'color: #ff8c42; font-size: 16px; font-weight: bold;');
console.log('%c輸入 clearAllCache() 可以手動清除快取', 'color: #666; font-size: 12px;');
