/**
 * 頁面過渡效果 - 帶 LOGO 載入動畫
 */

(function() {
    'use strict';
    
    // 配置
    const config = {
        minLoadingTime: 500,      // 最小載入時間（毫秒）
        maxLoadingTime: 2000,     // 最大載入時間（毫秒）
        logoPath: './images/shared/logo.png', // LOGO 路徑
        enableOnFirstLoad: true,  // 首次載入時顯示
        enableOnNavigation: true  // 導航時顯示
    };
    
    // 創建過渡元素
    function createTransitionElement() {
        // 檢查是否已存在
        if (document.getElementById('page-transition')) {
            return;
        }
        
        const transitionHTML = `
            <div class="page-transition" id="page-transition">
                <div class="transition-decoration decoration-1">🍊</div>
                <div class="transition-decoration decoration-2">🍊</div>
                <div class="transition-decoration decoration-3">🍊</div>
                <div class="transition-decoration decoration-4">🍊</div>
                
                <div class="transition-logo">
                    <img src="${config.logoPath}" alt="柑心果園" onerror="this.style.display='none'">
                </div>
                
                <div class="transition-text">載入中...</div>
                
                <div class="transition-progress">
                    <div class="transition-progress-bar" id="progress-bar"></div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', transitionHTML);
    }
    
    // 顯示過渡效果
    function showTransition() {
        const transition = document.getElementById('page-transition');
        if (!transition) return;
        
        transition.classList.add('active');
        
        // 模擬進度條
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 30;
                if (progress > 100) progress = 100;
                progressBar.style.width = progress + '%';
                
                if (progress >= 100) {
                    clearInterval(interval);
                }
            }, 200);
        }
    }
    
    // 隱藏過渡效果
    function hideTransition() {
        const transition = document.getElementById('page-transition');
        if (!transition) return;
        
        // 確保進度條完成
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            progressBar.style.width = '100%';
        }
        
        // 延遲後隱藏
        setTimeout(() => {
            transition.classList.add('fade-out');
            setTimeout(() => {
                transition.classList.remove('active', 'fade-out');
                // 重置進度條
                if (progressBar) {
                    progressBar.style.width = '0%';
                }
            }, 500);
        }, 300);
    }
    
    // 頁面載入完成時隱藏
    function onPageLoad() {
        // 確保最小載入時間
        const startTime = window.pageLoadStartTime || Date.now();
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, config.minLoadingTime - elapsed);
        
        setTimeout(() => {
            hideTransition();
        }, remaining);
    }
    
    // 攔截連結點擊
    function interceptLinks() {
        document.addEventListener('click', function(e) {
            const link = e.target.closest('a');
            
            // 檢查是否為有效的內部連結
            if (!link || !config.enableOnNavigation) return;
            if (link.target === '_blank') return;
            if (link.href.startsWith('tel:') || link.href.startsWith('mailto:')) return;
            if (link.href.includes('#')) return; // 錨點連結
            
            const url = link.href;
            const currentDomain = window.location.origin;
            
            // 只處理內部連結
            if (url.startsWith(currentDomain) || url.startsWith('/') || url.startsWith('./')) {
                e.preventDefault();
                
                // 顯示過渡效果
                showTransition();
                
                // 延遲跳轉
                setTimeout(() => {
                    window.location.href = url;
                }, 300);
            }
        });
    }
    
    // 初始化
    function init() {
        // 記錄載入開始時間
        window.pageLoadStartTime = Date.now();
        
        // 創建過渡元素
        createTransitionElement();
        
        // 首次載入顯示過渡效果
        if (config.enableOnFirstLoad) {
            showTransition();
        }
        
        // 頁面載入完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', onPageLoad);
        } else {
            onPageLoad();
        }
        
        // 完全載入後（包括圖片等）
        window.addEventListener('load', function() {
            // 確保隱藏過渡效果
            setTimeout(hideTransition, 100);
        });
        
        // 攔截連結點擊
        interceptLinks();
        
        // 處理瀏覽器返回/前進
        window.addEventListener('pageshow', function(event) {
            if (event.persisted) {
                // 從 bfcache 恢復
                hideTransition();
            }
        });
    }
    
    // 等待 DOM 準備好後初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // 暴露全局函數（如需手動控制）
    window.pageTransition = {
        show: showTransition,
        hide: hideTransition
    };
})();
