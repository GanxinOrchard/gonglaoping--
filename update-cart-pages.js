const fs = require('fs');
const path = require('path');

// 需要更新的頁面列表
const pages = [
    'contact.html',
    'farming.html', 
    'knowledge.html',
    'about.html',
    'product-detail.html',
    'grading.html',
    'knowledge-detail.html',
    'news-detail.html',
    'order-tracking.html',
    'policies.html',
    'guide.html',
    'season.html'
];

// 新的購物車JavaScript代碼
const newCartScript = `        // 購物車功能 - 跳轉到購物車頁面
        function initCartSidebar() {
            const cartIcon = document.getElementById('cartIcon');

            // 點擊購物車圖標跳轉到購物車頁面
            if (cartIcon) {
                cartIcon.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.location.href = 'cart.html';
                });
            }
        }

        // 初始化購物車功能
        document.addEventListener('DOMContentLoaded', initCartSidebar);`;

// 舊的購物車JavaScript模式（需要替換的部分）
const oldCartPatterns = [
    // 模式1：完整的購物車側邊欄功能
    /\/\/ 購物車側邊欄功能[\s\S]*?document\.addEventListener\('DOMContentLoaded', initCartSidebar\);/g,
    // 模式2：只有函數定義
    /function initCartSidebar\(\) \{[\s\S]*?\}/g
];

// 更新每個頁面
pages.forEach(page => {
    const filePath = path.join(__dirname, page);
    
    if (fs.existsSync(filePath)) {
        try {
            let content = fs.readFileSync(filePath, 'utf8');
            let updated = false;
            
            // 嘗試替換舊的購物車代碼
            oldCartPatterns.forEach(pattern => {
                if (pattern.test(content)) {
                    content = content.replace(pattern, newCartScript);
                    updated = true;
                }
            });
            
            if (updated) {
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`✅ 已更新: ${page}`);
            } else {
                console.log(`⚠️  未找到購物車代碼: ${page}`);
            }
        } catch (error) {
            console.error(`❌ 更新失敗: ${page}`, error.message);
        }
    } else {
        console.log(`❌ 文件不存在: ${page}`);
    }
});

console.log('🎉 批量更新完成！');
