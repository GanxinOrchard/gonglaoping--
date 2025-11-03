const fs = require('fs');
const path = require('path');

// 檢查 sharp 是否已安裝
let sharp;
try {
    sharp = require('sharp');
} catch (error) {
    console.log('❌ 錯誤：找不到 sharp 套件');
    console.log('請先執行：npm install sharp');
    process.exit(1);
}

console.log('===================================');
console.log('   圖片壓縮工具 (使用 Sharp)');
console.log('===================================\n');

// 配置
const config = {
    quality: 80,  // 壓縮品質 (1-100)
    maxWidth: 1920,  // 最大寬度
    maxHeight: 1920,  // 最大高度
    backup: true  // 是否備份原始檔案
};

// 統計
let totalFiles = 0;
let totalOriginalSize = 0;
let totalCompressedSize = 0;
let processedFiles = 0;

// 掃描圖片
function scanImages(dir) {
    const files = [];
    
    function scan(currentPath) {
        const items = fs.readdirSync(currentPath);
        
        for (const item of items) {
            const fullPath = path.join(currentPath, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory() && !item.includes('backup')) {
                scan(fullPath);
            } else if (/\.(png|jpg|jpeg)$/i.test(item)) {
                files.push({
                    path: fullPath,
                    name: item,
                    size: stat.size,
                    ext: path.extname(item).toLowerCase()
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

// 壓縮單個圖片
async function compressImage(imgInfo) {
    try {
        const originalSize = imgInfo.size;
        totalOriginalSize += originalSize;
        
        // 備份原始檔案
        if (config.backup) {
            const backupDir = path.join(path.dirname(imgInfo.path), 'backup');
            if (!fs.existsSync(backupDir)) {
                fs.mkdirSync(backupDir, { recursive: true });
            }
            const backupPath = path.join(backupDir, imgInfo.name);
            if (!fs.existsSync(backupPath)) {
                fs.copyFileSync(imgInfo.path, backupPath);
            }
        }
        
        // 壓縮圖片
        const image = sharp(imgInfo.path);
        const metadata = await image.metadata();
        
        // 調整尺寸（如果超過最大值）
        let resizeOptions = null;
        if (metadata.width > config.maxWidth || metadata.height > config.maxHeight) {
            resizeOptions = {
                width: config.maxWidth,
                height: config.maxHeight,
                fit: 'inside',
                withoutEnlargement: true
            };
        }
        
        // 根據檔案類型壓縮
        if (imgInfo.ext === '.png') {
            await image
                .resize(resizeOptions)
                .png({ quality: config.quality, compressionLevel: 9 })
                .toFile(imgInfo.path + '.tmp');
        } else {
            await image
                .resize(resizeOptions)
                .jpeg({ quality: config.quality, mozjpeg: true })
                .toFile(imgInfo.path + '.tmp');
        }
        
        // 替換原始檔案
        const newSize = fs.statSync(imgInfo.path + '.tmp').size;
        
        // 只有在壓縮後更小時才替換
        if (newSize < originalSize) {
            fs.unlinkSync(imgInfo.path);
            fs.renameSync(imgInfo.path + '.tmp', imgInfo.path);
            totalCompressedSize += newSize;
            
            const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);
            console.log(`✓ ${path.relative(__dirname, imgInfo.path)}`);
            console.log(`  ${formatSize(originalSize)} → ${formatSize(newSize)} (節省 ${savings}%)\n`);
        } else {
            fs.unlinkSync(imgInfo.path + '.tmp');
            totalCompressedSize += originalSize;
            console.log(`⊙ ${path.relative(__dirname, imgInfo.path)}`);
            console.log(`  已經是最佳大小 (${formatSize(originalSize)})\n`);
        }
        
        processedFiles++;
        
    } catch (error) {
        console.log(`❌ 錯誤處理 ${imgInfo.name}: ${error.message}\n`);
    }
}

// 主函數
async function main() {
    const imagesDir = path.join(__dirname, 'images');
    console.log('正在掃描圖片...\n');
    
    const images = scanImages(imagesDir);
    totalFiles = images.length;
    
    console.log(`找到 ${totalFiles} 個圖片檔案\n`);
    console.log('開始壓縮...\n');
    
    // 逐一處理圖片
    for (const img of images) {
        await compressImage(img);
    }
    
    // 顯示統計
    console.log('===================================');
    console.log('壓縮完成！');
    console.log('===================================');
    console.log(`處理檔案: ${processedFiles}/${totalFiles}`);
    console.log(`原始大小: ${formatSize(totalOriginalSize)}`);
    console.log(`壓縮後: ${formatSize(totalCompressedSize)}`);
    
    if (totalOriginalSize > totalCompressedSize) {
        const totalSavings = ((totalOriginalSize - totalCompressedSize) / totalOriginalSize * 100).toFixed(1);
        const savedSpace = totalOriginalSize - totalCompressedSize;
        console.log(`節省空間: ${formatSize(savedSpace)} (${totalSavings}%)`);
    }
    
    console.log('\n✓ 原始檔案已備份到各資料夾的 backup 子資料夾');
    console.log('===================================');
}

// 執行
main().catch(console.error);
