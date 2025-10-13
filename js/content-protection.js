/**
 * 柑心果園 - 內容保護系統
 * 防止右鍵、選取、複製、列印等操作
 */

(function() {
    'use strict';
    
    // 保護配置 - 暫時關閉以便測試
    const PROTECTION_CONFIG = {
        ENABLE_RIGHT_CLICK_BLOCK: false,       // 禁用右鍵
        ENABLE_SELECTION_BLOCK: false,         // 禁用選取
        ENABLE_DRAG_BLOCK: false,              // 禁用拖拽
        ENABLE_KEYBOARD_SHORTCUTS: false,      // 禁用鍵盤快捷鍵
        ENABLE_DEVTOOLS_DETECTION: false,      // 檢測開發者工具
        ENABLE_PRINT_BLOCK: false,             // 禁用列印
        ENABLE_SAVE_BLOCK: false,              // 禁用儲存
        SHOW_WARNING_MESSAGE: false,           // 顯示警告訊息
        WARNING_MESSAGE: '此內容受版權保護，請勿複製或下載。'
    };
    
    // 警告訊息樣式
    const warningStyle = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.9);
        color: #ff6b6b;
        padding: 20px 30px;
        border-radius: 10px;
        font-family: 'Microsoft JhengHei', sans-serif;
        font-size: 16px;
        font-weight: bold;
        z-index: 999999;
        text-align: center;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        border: 2px solid #ff6b6b;
        animation: warningPulse 0.5s ease-in-out;
    `;
    
    // 添加警告動畫樣式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes warningPulse {
            0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
            50% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
        
        .protection-warning {
            ${warningStyle}
        }
        
        /* 禁用選取 */
        body {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            -webkit-touch-callout: none;
            -webkit-tap-highlight-color: transparent;
        }
        
        /* 允許輸入框選取 */
        input, textarea, [contenteditable] {
            -webkit-user-select: text;
            -moz-user-select: text;
            -ms-user-select: text;
            user-select: text;
        }
    `;
    document.head.appendChild(style);
    
    // 顯示警告訊息
    function showWarning(message = PROTECTION_CONFIG.WARNING_MESSAGE) {
        if (!PROTECTION_CONFIG.SHOW_WARNING_MESSAGE) return;
        
        // 移除現有警告
        const existingWarning = document.querySelector('.protection-warning');
        if (existingWarning) {
            existingWarning.remove();
        }
        
        // 創建新警告
        const warning = document.createElement('div');
        warning.className = 'protection-warning';
        warning.textContent = message;
        document.body.appendChild(warning);
        
        // 3秒後自動移除
        setTimeout(() => {
            if (warning.parentNode) {
                warning.remove();
            }
        }, 3000);
    }
    
    // 禁用右鍵
    if (PROTECTION_CONFIG.ENABLE_RIGHT_CLICK_BLOCK) {
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            showWarning('右鍵功能已被禁用');
            return false;
        });
    }
    
    // 禁用選取
    if (PROTECTION_CONFIG.ENABLE_SELECTION_BLOCK) {
        document.addEventListener('selectstart', function(e) {
            // 允許輸入框選取
            if (e.target.tagName === 'INPUT' || 
                e.target.tagName === 'TEXTAREA' || 
                e.target.contentEditable === 'true') {
                return true;
            }
            e.preventDefault();
            showWarning('文字選取已被禁用');
            return false;
        });
        
        // 禁用拖拽選取
        document.addEventListener('dragstart', function(e) {
            if (PROTECTION_CONFIG.ENABLE_DRAG_BLOCK) {
                e.preventDefault();
                return false;
            }
        });
    }
    
    // 禁用鍵盤快捷鍵
    if (PROTECTION_CONFIG.ENABLE_KEYBOARD_SHORTCUTS) {
        document.addEventListener('keydown', function(e) {
            // Ctrl+A (全選)
            if (e.ctrlKey && e.key === 'a') {
                e.preventDefault();
                showWarning('全選功能已被禁用');
                return false;
            }
            
            // Ctrl+C (複製)
            if (e.ctrlKey && e.key === 'c') {
                e.preventDefault();
                showWarning('複製功能已被禁用');
                return false;
            }
            
            // Ctrl+V (貼上)
            if (e.ctrlKey && e.key === 'v') {
                e.preventDefault();
                showWarning('貼上功能已被禁用');
                return false;
            }
            
            // Ctrl+X (剪下)
            if (e.ctrlKey && e.key === 'x') {
                e.preventDefault();
                showWarning('剪下功能已被禁用');
                return false;
            }
            
            // Ctrl+S (儲存)
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                showWarning('儲存功能已被禁用');
                return false;
            }
            
            // Ctrl+P (列印)
            if (e.ctrlKey && e.key === 'p') {
                e.preventDefault();
                showWarning('列印功能已被禁用');
                return false;
            }
            
            // F12 (開發者工具)
            if (e.key === 'F12') {
                e.preventDefault();
                showWarning('開發者工具已被禁用');
                return false;
            }
            
            // Ctrl+Shift+I (開發者工具)
            if (e.ctrlKey && e.shiftKey && e.key === 'I') {
                e.preventDefault();
                showWarning('開發者工具已被禁用');
                return false;
            }
            
            // Ctrl+Shift+J (控制台)
            if (e.ctrlKey && e.shiftKey && e.key === 'J') {
                e.preventDefault();
                showWarning('控制台已被禁用');
                return false;
            }
            
            // Ctrl+U (檢視原始碼)
            if (e.ctrlKey && e.key === 'u') {
                e.preventDefault();
                showWarning('檢視原始碼已被禁用');
                return false;
            }
        });
    }
    
    // 禁用列印
    if (PROTECTION_CONFIG.ENABLE_PRINT_BLOCK) {
        window.addEventListener('beforeprint', function(e) {
            e.preventDefault();
            showWarning('列印功能已被禁用');
            return false;
        });
    }
    
    // 檢測開發者工具
    if (PROTECTION_CONFIG.ENABLE_DEVTOOLS_DETECTION) {
        let devtools = false;
        const threshold = 160;
        
        setInterval(function() {
            if (window.outerHeight - window.innerHeight > threshold || 
                window.outerWidth - window.innerWidth > threshold) {
                if (!devtools) {
                    devtools = true;
                    showWarning('檢測到開發者工具，請關閉後繼續瀏覽');
                    // 可以選擇重定向或關閉頁面
                    // window.location.href = 'about:blank';
                }
            } else {
                devtools = false;
            }
        }, 500);
    }
    
    // 禁用儲存
    if (PROTECTION_CONFIG.ENABLE_SAVE_BLOCK) {
        // 禁用 Ctrl+S
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                showWarning('儲存功能已被禁用');
                return false;
            }
        });
        
        // 禁用右鍵選單中的儲存
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
        });
    }
    
    // 禁用圖片拖拽
    document.addEventListener('dragstart', function(e) {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
            showWarning('圖片拖拽已被禁用');
            return false;
        }
    });
    
    // 禁用文字拖拽
    document.addEventListener('dragstart', function(e) {
        if (e.target.tagName === 'P' || 
            e.target.tagName === 'H1' || 
            e.target.tagName === 'H2' || 
            e.target.tagName === 'H3' || 
            e.target.tagName === 'DIV' || 
            e.target.tagName === 'SPAN') {
            e.preventDefault();
            return false;
        }
    });
    
    // 控制台警告
    console.clear();
    console.log('%c⚠️ 警告', 'color: #ff6b6b; font-size: 20px; font-weight: bold;');
    console.log('%c此網站受版權保護，請勿嘗試複製或下載內容。', 'color: #ff6b6b; font-size: 14px;');
    console.log('%c任何未經授權的複製行為都可能涉及法律責任。', 'color: #ff6b6b; font-size: 14px;');
    
    // 頁面載入完成後顯示保護提示
    window.addEventListener('load', function() {
        console.log('%c🛡️ 內容保護系統已啟動', 'color: #4CAF50; font-size: 16px; font-weight: bold;');
    });
    
})();
