/**
 * 柑心果園 - 自動已售出數量系統
 * 特點：
 * 1. 根據天數自動增加已售出數量
 * 2. 產季期間增加較快，非產季期間增加較慢
 * 3. 每年自動重置
 * 4. 不同產品有不同的增長模式
 */

// ========== 產品產季配置 ==========
const productSeasons = {
    'ponkan': {
        name: '椪柑',
        peakSeason: { start: 11, end: 2 }, // 11月到2月
        offSeason: { start: 3, end: 10 },  // 3月到10月
        dailyIncrease: {
            peak: { min: 3, max: 8 },    // 產季期間每天增加3-8件
            off: { min: 0, max: 2 }      // 非產季期間每天增加0-2件
        },
        baseSales: 1250 // 基礎銷量
    },
    'murcott': {
        name: '茂谷柑',
        peakSeason: { start: 12, end: 3 }, // 12月到3月
        offSeason: { start: 4, end: 11 },  // 4月到11月
        dailyIncrease: {
            peak: { min: 2, max: 6 },
            off: { min: 0, max: 1 }
        },
        baseSales: 980
    },
    'water-chestnut': {
        name: '菱角',
        peakSeason: { start: 8, end: 11 }, // 8月到11月
        offSeason: { start: 12, end: 7 },  // 12月到7月
        dailyIncrease: {
            peak: { min: 1, max: 4 },
            off: { min: 0, max: 1 }
        },
        baseSales: 650
    },
    'taro': {
        name: '芋角',
        peakSeason: { start: 9, end: 12 }, // 9月到12月
        offSeason: { start: 1, end: 8 },   // 1月到8月
        dailyIncrease: {
            peak: { min: 1, max: 3 },
            off: { min: 0, max: 1 }
        },
        baseSales: 420
    }
};

// ========== 銷售數據存儲 ==========
const SALES_STORAGE_KEY = 'ganxin_sales_data';

/**
 * 獲取或初始化銷售數據
 */
function getSalesData() {
    const stored = localStorage.getItem(SALES_STORAGE_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.warn('銷售數據解析失敗，重新初始化');
        }
    }
    
    // 初始化銷售數據
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    const salesData = {
        year: currentYear,
        lastUpdate: currentDate.toISOString().split('T')[0],
        products: {}
    };
    
    // 為每個產品設置初始銷量
    for (const [productId, config] of Object.entries(productSeasons)) {
        salesData.products[productId] = {
            currentSales: config.baseSales,
            lastUpdate: currentDate.toISOString().split('T')[0]
        };
    }
    
    saveSalesData(salesData);
    return salesData;
}

/**
 * 保存銷售數據
 */
function saveSalesData(data) {
    localStorage.setItem(SALES_STORAGE_KEY, JSON.stringify(data));
}

/**
 * 檢查是否為產季
 */
function isPeakSeason(productId, month) {
    const config = productSeasons[productId];
    if (!config) return false;
    
    const { start, end } = config.peakSeason;
    
    // 處理跨年產季
    if (start > end) {
        return month >= start || month <= end;
    } else {
        return month >= start && month <= end;
    }
}

/**
 * 計算應該增加的銷量
 */
function calculateSalesIncrease(productId, days) {
    const config = productSeasons[productId];
    if (!config) return 0;
    
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // getMonth() 返回 0-11
    const isPeak = isPeakSeason(productId, currentMonth);
    
    const increaseConfig = isPeak ? config.dailyIncrease.peak : config.dailyIncrease.off;
    const dailyIncrease = Math.floor(Math.random() * (increaseConfig.max - increaseConfig.min + 1)) + increaseConfig.min;
    
    return dailyIncrease * days;
}

/**
 * 更新產品銷量
 */
function updateProductSales(productId) {
    const salesData = getSalesData();
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const today = currentDate.toISOString().split('T')[0];
    
    // 檢查是否需要重置年度數據
    if (salesData.year !== currentYear) {
        console.log(`年度重置：${salesData.year} -> ${currentYear}`);
        salesData.year = currentYear;
        salesData.lastUpdate = today;
        
        // 重置所有產品銷量
        for (const [pid, config] of Object.entries(productSeasons)) {
            salesData.products[pid] = {
                currentSales: config.baseSales,
                lastUpdate: today
            };
        }
        
        saveSalesData(salesData);
        return salesData.products[productId].currentSales;
    }
    
    const productData = salesData.products[productId];
    if (!productData) {
        console.warn(`找不到產品 ${productId} 的銷售數據`);
        return 0;
    }
    
    const lastUpdate = new Date(productData.lastUpdate);
    const daysDiff = Math.floor((currentDate - lastUpdate) / (1000 * 60 * 60 * 24));
    
    if (daysDiff > 0) {
        const increase = calculateSalesIncrease(productId, daysDiff);
        productData.currentSales += increase;
        productData.lastUpdate = today;
        salesData.lastUpdate = today;
        
        saveSalesData(salesData);
        console.log(`${productSeasons[productId]?.name || productId}: +${increase} (${daysDiff}天)`);
    }
    
    return productData.currentSales;
}

/**
 * 更新所有產品銷量
 */
function updateAllProductSales() {
    const salesData = getSalesData();
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    // 檢查年度重置
    if (salesData.year !== currentYear) {
        console.log(`年度重置：${salesData.year} -> ${currentYear}`);
        salesData.year = currentYear;
        salesData.lastUpdate = currentDate.toISOString().split('T')[0];
        
        for (const [productId, config] of Object.entries(productSeasons)) {
            salesData.products[productId] = {
                currentSales: config.baseSales,
                lastUpdate: currentDate.toISOString().split('T')[0]
            };
        }
        
        saveSalesData(salesData);
        return;
    }
    
    // 更新所有產品
    for (const productId of Object.keys(productSeasons)) {
        updateProductSales(productId);
    }
}

/**
 * 獲取產品當前銷量
 */
function getProductSales(productId) {
    const salesData = getSalesData();
    const productData = salesData.products[productId];
    
    if (!productData) {
        console.warn(`找不到產品 ${productId} 的銷售數據`);
        return productSeasons[productId]?.baseSales || 0;
    }
    
    return productData.currentSales;
}

/**
 * 更新頁面中的銷量顯示
 */
function updateSalesDisplay() {
    // 更新產品列表頁面
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        const productId = card.dataset.productId;
        if (productId) {
            const salesCount = getProductSales(productId);
            const salesElement = card.querySelector('.sales-count');
            if (salesElement) {
                salesElement.textContent = `已售出 ${salesCount} 件`;
            }
        }
    });
    
    // 更新產品詳情頁面
    const salesElement = document.querySelector('.sales-count');
    if (salesElement) {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        if (productId) {
            const salesCount = getProductSales(productId);
            salesElement.textContent = `已售出 ${salesCount} 件`;
        }
    }
}

// ========== 初始化 ==========

// 頁面載入時更新銷量
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        updateAllProductSales();
        updateSalesDisplay();
    });
} else {
    updateAllProductSales();
    updateSalesDisplay();
}

// 每小時檢查一次（可選）
setInterval(() => {
    updateAllProductSales();
    updateSalesDisplay();
}, 60 * 60 * 1000); // 1小時

// 匯出函數供外部使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getProductSales,
        updateProductSales,
        updateAllProductSales,
        updateSalesDisplay
    };
}
