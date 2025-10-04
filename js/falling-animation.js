/**
 * 菱角/芋角落下動畫
 * 用於產品詳情頁面
 */

(function() {
    'use strict';
    
    // 根據頁面URL判斷要顯示什麼動畫
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    let emoji = '';
    let animationColor = '';
    
    // 判斷產品類型
    if (productId === '3' || window.location.pathname.includes('water-chestnut')) {
        emoji = '🌰'; // 菱角
        animationColor = '#8e44ad';
    } else if (productId === '6' || window.location.pathname.includes('taro')) {
        emoji = '🍠'; // 芋頭
        animationColor = '#9b59b6';
    } else {
        return; // 不是菱角或芋角，不顯示動畫
    }
    
    // 創建動畫容器
    const animationContainer = document.createElement('div');
    animationContainer.id = 'fallingAnimation';
    animationContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
        overflow: hidden;
    `;
    
    // 創建CSS動畫
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fall {
            0% {
                transform: translateY(-100px) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(calc(100vh + 100px)) rotate(360deg);
                opacity: 0;
            }
        }
        
        @keyframes sway {
            0%, 100% {
                transform: translateX(0);
            }
            50% {
                transform: translateX(30px);
            }
        }
        
        .falling-item {
            position: absolute;
            font-size: 30px;
            animation: fall linear infinite, sway ease-in-out infinite;
            will-change: transform, opacity;
        }
    `;
    document.head.appendChild(style);
    
    // 創建落下物件
    function createFallingItem() {
        const item = document.createElement('div');
        item.className = 'falling-item';
        item.textContent = emoji;
        
        // 隨機位置和動畫時間
        const left = Math.random() * 100;
        const duration = 5 + Math.random() * 5; // 5-10秒
        const delay = Math.random() * 5; // 0-5秒延遲
        const swayDuration = 2 + Math.random() * 2; // 2-4秒
        const size = 20 + Math.random() * 20; // 20-40px
        
        item.style.left = `${left}%`;
        item.style.fontSize = `${size}px`;
        item.style.animationDuration = `${duration}s, ${swayDuration}s`;
        item.style.animationDelay = `${delay}s`;
        
        animationContainer.appendChild(item);
        
        // 動畫結束後移除元素
        setTimeout(() => {
            item.remove();
        }, (duration + delay) * 1000);
    }
    
    // 初始化動畫
    function initAnimation() {
        document.body.appendChild(animationContainer);
        
        // 創建初始物件
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                createFallingItem();
            }, i * 800);
        }
        
        // 定期創建新物件
        setInterval(() => {
            createFallingItem();
        }, 3000);
    }
    
    // 等待DOM載入完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAnimation);
    } else {
        initAnimation();
    }
    
    // 提供停止動畫的方法
    window.stopFallingAnimation = function() {
        const container = document.getElementById('fallingAnimation');
        if (container) {
            container.remove();
        }
    };
    
    // 提供重新開始動畫的方法
    window.startFallingAnimation = function() {
        stopFallingAnimation();
        initAnimation();
    };
    
})();
