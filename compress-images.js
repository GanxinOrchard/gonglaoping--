const fs = require('fs');
const path = require('path');

// 簡單的圖片壓縮腳本（無需額外依賴）
console.log('===================================');
console.log('   圖片壓縮工具');
console.log('===================================\n');

// 統計
let totalFiles = 0;
let totalOriginalSize = 0;
let totalCompressedSize = 0;

// 掃描圖片
function scanImages(dir) {
    const files = [];
    
    function scan(currentPath) {
        const items = fs.readdirSync(currentPath);
        
        for (const item of items) {
            const fullPath = path.join(currentPath, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                scan(fullPath);
            } else if (/\.(png|jpg|jpeg)$/i.test(item)) {
                files.push({
                    path: fullPath,
                    name: item,
                    size: stat.size
                });
            }
        }
    }
    
    scan(dir);
    return files;
}

// 格式化檔案大小
function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

// 掃描圖片
const imagesDir = path.join(__dirname, 'images');
console.log('正在掃描圖片...\n');

const images = scanImages(imagesDir);
totalFiles = images.length;

console.log(`找到 ${totalFiles} 個圖片檔案\n`);

// 顯示統計
images.forEach(img => {
    totalOriginalSize += img.size;
    console.log(`📄 ${path.relative(imagesDir, img.path)}`);
    console.log(`   大小: ${formatSize(img.size)}\n`);
});

console.log('===================================');
console.log(`總檔案數: ${totalFiles}`);
console.log(`總大小: ${formatSize(totalOriginalSize)}`);
console.log('===================================\n');

console.log('⚠️  注意：圖片壓縮需要安裝 sharp 套件');
console.log('請執行以下命令安裝：');
console.log('npm install sharp');
console.log('\n安裝完成後執行：');
console.log('node compress-images-with-sharp.js');
