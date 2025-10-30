const fs = require('fs');

console.log('開始修正 about.html...');

// 讀取檔案
const content = fs.readFileSync('about.html', 'utf8');
console.log(`檔案大小: ${content.length} 字元`);

// 定義要刪除的區塊（從第 1701 行的註解到第 1953 行）
// 匹配從 <!-- 主要導覽列 --> 到 <!-- 主要內容 --> 之前的所有內容
const pattern = /(<body>\s*)<!-- 主要導覽列 -->[\s\S]*?(?=<!-- 主要內容 -->)/;

// 替換為統一模板容器
const replacement = `$1<!-- 統一頁頭 -->
    <div id="header-container"></div>
    
    <!-- 手機選單 -->
    <div id="mobile-menu-container"></div>

    `;

// 執行替換
const newContent = content.replace(pattern, replacement);

// 檢查是否有變化
if (content === newContent) {
    console.log('❌ 未找到需要替換的內容！');
    console.log('可能檔案已經修正過');
    process.exit(1);
}

// 計算刪除的字元數
const removed = content.length - newContent.length;
console.log(`✓ 已刪除 ${removed} 個字元的舊內容`);

// 儲存檔案
fs.writeFileSync('about.html', newContent, 'utf8');

console.log('\n✅ about.html 已修正完成！\n');
console.log('已完成以下修改：');
console.log('  ✓ 刪除舊的 header 和選單內容');
console.log('  ✓ 添加統一頁頭容器');
console.log('  ✓ 添加手機選單容器');
console.log('\n請按 Ctrl + Shift + R 測試頁面！');
