/**
 * 頁面過渡效果 - 帶 LOGO 載入動畫
 */

(function() {
    'use strict';
    
    // 配置
    const config = {
        minLoadingTime: 800,      // 最小載入時間（毫秒）- 延長確保完整載入
        maxLoadingTime: 3000,     // 最大載入時間（毫秒）
        progressSpeed: 15,        // 進度條速度（數字越小越慢）
        logoPath: './images/shared/logo/柑心商標.png', // 橘子商標圖案
        brandName: 'Ganxin Orchard', // 品牌英文名稱
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
                
                <div class="transition-brand-name">${config.brandName}</div>
                
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
        
        // 模擬進度條 - 更慢更流暢
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            let progress = 0;
            const interval = setInterval(() => {
                // 進度增量隨當前進度遞減，讓載入更自然
                const increment = Math.random() * config.progressSpeed * (1 - progress / 150);
                progress += increment;
                
                // 限制在 95% 以下，等待真正載入完成
                if (progress > 95) progress = 95;
                
                progressBar.style.width = progress + '%';
                
                if (progress >= 95) {
                    clearInterval(interval);
                }
            }, 150); // 更新頻率提高，讓動畫更流暢
            
            // 儲存 interval ID，以便後續清理
            transition.dataset.progressInterval = interval;
        }
    }
    
    // 隱藏過渡效果
    function hideTransition() {
        const transition = document.getElementById('page-transition');
        if (!transition) return;
        
        // 清理進度條計時器
        if (transition.dataset.progressInterval) {
            clearInterval(parseInt(transition.dataset.progressInterval));
        }
        
        // 確保進度條完成到 100%
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            progressBar.style.transition = 'width 0.3s ease';
            progressBar.style.width = '100%';
        }
        
        // 延遲後隱藏，讓使用者看到 100% 完成
        setTimeout(() => {
            transition.classList.add('fade-out');
            setTimeout(() => {
                transition.classList.remove('active', 'fade-out');
                // 重置進度條
                if (progressBar) {
                    progressBar.style.transition = '';
                    progressBar.style.width = '0%';
                }
            }, 500);
        }, 400); // 稍微延長讓使用者看到完成狀態
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
