/**
 * Cookie 同意橫幅
 * 符合GDPR規範
 */

(function() {
    'use strict';
    
    // 檢查是否已同意
    if (localStorage.getItem('cookieConsent')) {
        return;
    }
    
    // 創建橫幅HTML
    const bannerHTML = `
        <div id="cookieConsent" style="
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0, 0, 0, 0.95);
            color: white;
            padding: 20px;
            z-index: 10000;
            box-shadow: 0 -4px 20px rgba(0,0,0,0.3);
            animation: slideUp 0.5s ease;
        ">
            <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap;">
                <div style="flex: 1; min-width: 300px;">
                    <h3 style="margin: 0 0 10px 0; font-size: 18px;">
                        <i class="fas fa-cookie-bite" style="margin-right: 8px; color: #ff6b35;"></i>
                        Cookie 使用說明
                    </h3>
                    <p style="margin: 0; font-size: 14px; line-height: 1.6; opacity: 0.9;">
                        依據歐盟施行的個人資料保護法，我們致力於保護您的個人資料並提供您對個人資料的掌握。
                        按一下「全部接受」，代表您允許我們置放 Cookie 來提升您在本網站上的使用體驗、協助我們分析網站效能和使用狀況，以及讓我們投放相關聯的行銷內容。
                    </p>
                </div>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <button onclick="manageCookies()" style="
                        padding: 12px 24px;
                        background: transparent;
                        color: white;
                        border: 2px solid white;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: 600;
                        transition: all 0.3s;
                    " onmouseover="this.style.background='white'; this.style.color='black';" onmouseout="this.style.background='transparent'; this.style.color='white';">
                        管理Cookies
                    </button>
                    <button onclick="acceptAllCookies()" style="
                        padding: 12px 24px;
                        background: #ff6b35;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: 600;
                        transition: all 0.3s;
                    " onmouseover="this.style.background='#e65a2b';" onmouseout="this.style.background='#ff6b35';">
                        全部接受
                    </button>
                </div>
            </div>
        </div>
        
        <!-- Cookie 管理面板 -->
        <div id="cookieManagement" style="
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 30px;
            border-radius: 16px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            z-index: 10001;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        ">
            <h2 style="margin: 0 0 20px 0; color: #2c3e50; font-size: 24px;">
                Cookie 設定
            </h2>
            <div style="margin-bottom: 20px;">
                <label style="display: flex; align-items: center; padding: 15px; background: #f8f9fa; border-radius: 8px; margin-bottom: 10px; cursor: pointer;">
                    <input type="checkbox" checked disabled style="width: 20px; height: 20px; margin-right: 15px;">
                    <div>
                        <strong style="display: block; color: #2c3e50; margin-bottom: 5px;">必要 Cookie</strong>
                        <span style="font-size: 14px; color: #666;">這些 Cookie 是網站運作所必需的，無法關閉。</span>
                    </div>
                </label>
                <label style="display: flex; align-items: center; padding: 15px; background: #f8f9fa; border-radius: 8px; margin-bottom: 10px; cursor: pointer;">
                    <input type="checkbox" id="analyticsCookie" checked style="width: 20px; height: 20px; margin-right: 15px;">
                    <div>
                        <strong style="display: block; color: #2c3e50; margin-bottom: 5px;">分析 Cookie</strong>
                        <span style="font-size: 14px; color: #666;">幫助我們了解訪客如何使用網站，以改善網站效能。</span>
                    </div>
                </label>
                <label style="display: flex; align-items: center; padding: 15px; background: #f8f9fa; border-radius: 8px; margin-bottom: 10px; cursor: pointer;">
                    <input type="checkbox" id="marketingCookie" checked style="width: 20px; height: 20px; margin-right: 15px;">
                    <div>
                        <strong style="display: block; color: #2c3e50; margin-bottom: 5px;">行銷 Cookie</strong>
                        <span style="font-size: 14px; color: #666;">用於追蹤訪客，以便顯示相關且吸引人的廣告。</span>
                    </div>
                </label>
            </div>
            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                <button onclick="closeCookieManagement()" style="
                    padding: 12px 24px;
                    background: #95a5a6;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                ">
                    取消
                </button>
                <button onclick="savePreferences()" style="
                    padding: 12px 24px;
                    background: #ff6b35;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                ">
                    確認
                </button>
            </div>
        </div>
        
        <!-- 遮罩層 -->
        <div id="cookieOverlay" style="
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 10000;
        " onclick="closeCookieManagement()"></div>
        
        <style>
            @keyframes slideUp {
                from {
                    transform: translateY(100%);
                }
                to {
                    transform: translateY(0);
                }
            }
        </style>
    `;
    
    // 插入橫幅到頁面
    document.addEventListener('DOMContentLoaded', function() {
        document.body.insertAdjacentHTML('beforeend', bannerHTML);
    });
    
    // 全部接受
    window.acceptAllCookies = function() {
        localStorage.setItem('cookieConsent', JSON.stringify({
            necessary: true,
            analytics: true,
            marketing: true,
            timestamp: new Date().toISOString()
        }));
        closeCookieBanner();
    };
    
    // 管理Cookies
    window.manageCookies = function() {
        document.getElementById('cookieManagement').style.display = 'block';
        document.getElementById('cookieOverlay').style.display = 'block';
    };
    
    // 關閉管理面板
    window.closeCookieManagement = function() {
        document.getElementById('cookieManagement').style.display = 'none';
        document.getElementById('cookieOverlay').style.display = 'none';
    };
    
    // 儲存偏好設定
    window.savePreferences = function() {
        const analytics = document.getElementById('analyticsCookie').checked;
        const marketing = document.getElementById('marketingCookie').checked;
        
        localStorage.setItem('cookieConsent', JSON.stringify({
            necessary: true,
            analytics: analytics,
            marketing: marketing,
            timestamp: new Date().toISOString()
        }));
        
        closeCookieManagement();
        closeCookieBanner();
    };
    
    // 關閉橫幅
    function closeCookieBanner() {
        const banner = document.getElementById('cookieConsent');
        if (banner) {
            banner.style.animation = 'slideDown 0.5s ease';
            setTimeout(() => {
                banner.remove();
            }, 500);
        }
    }
    
    // 添加滑出動畫
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from {
                transform: translateY(0);
            }
            to {
                transform: translateY(100%);
            }
        }
    `;
    document.head.appendChild(style);
    
})();
