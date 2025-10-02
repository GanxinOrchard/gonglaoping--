// 橘子背景動畫
(function() {
    'use strict';
    
    // 創建橘子動畫容器
    function createOrangeAnimation() {
        // 檢查是否已存在
        if (document.querySelector('.orange-animation-container')) {
            return;
        }
        
        const container = document.createElement('div');
        container.className = 'orange-animation-container';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
            overflow: hidden;
        `;
        
        // 創建多個橘子
        const orangeCount = 15;
        for (let i = 0; i < orangeCount; i++) {
            createOrange(container, i);
        }
        
        document.body.insertBefore(container, document.body.firstChild);
        
        // 確保其他內容在動畫之上
        const mainContent = document.querySelector('body > *:not(.orange-animation-container)');
        if (mainContent) {
            document.body.style.position = 'relative';
            document.body.style.zIndex = '1';
        }
    }
    
    // 創建單個橘子元素
    function createOrange(container, index) {
        const orange = document.createElement('div');
        orange.className = 'floating-orange';
        
        // 隨機大小、位置和動畫延遲
        const size = Math.random() * 40 + 30; // 30-70px
        const left = Math.random() * 100; // 0-100%
        const animationDuration = Math.random() * 20 + 15; // 15-35秒
        const animationDelay = Math.random() * 5; // 0-5秒延遲
        const opacity = Math.random() * 0.15 + 0.05; // 0.05-0.2 (更淡)
        
        orange.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${left}%;
            top: -100px;
            opacity: ${opacity};
            animation: floatDown ${animationDuration}s linear ${animationDelay}s infinite;
            background: radial-gradient(circle at 30% 30%, #ffb347, #ff8c42);
            border-radius: 50%;
            box-shadow: inset -5px -5px 10px rgba(0,0,0,0.2),
                        inset 5px 5px 10px rgba(255,255,255,0.3);
        `;
        
        // 添加橘子的葉子
        const leaf = document.createElement('div');
        leaf.style.cssText = `
            position: absolute;
            top: -5px;
            right: ${size * 0.3}px;
            width: ${size * 0.3}px;
            height: ${size * 0.2}px;
            background: #4caf50;
            border-radius: 50% 0;
            transform: rotate(45deg);
        `;
        orange.appendChild(leaf);
        
        container.appendChild(orange);
    }
    
    // 添加CSS動畫
    function addAnimationStyles() {
        if (document.querySelector('#orange-animation-styles')) {
            return;
        }
        
        const style = document.createElement('style');
        style.id = 'orange-animation-styles';
        style.textContent = `
            @keyframes floatDown {
                0% {
                    transform: translateY(0) rotate(0deg);
                }
                100% {
                    transform: translateY(calc(100vh + 100px)) rotate(360deg);
                }
            }
            
            .floating-orange {
                will-change: transform;
            }
            
            /* 確保主要內容在動畫之上 */
            body > *:not(.orange-animation-container) {
                position: relative;
                z-index: 2;
            }
            
            /* 卡片元素需要更高的 z-index */
            .product-card,
            .category-card,
            .news-card,
            .knowledge-card,
            .feature-item,
            .timeline-item {
                position: relative;
                z-index: 10;
            }
        `;
        
        document.head.appendChild(style);
    }
    
    // 初始化
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                addAnimationStyles();
                createOrangeAnimation();
            });
        } else {
            addAnimationStyles();
            createOrangeAnimation();
        }
    }
    
    init();
})();
