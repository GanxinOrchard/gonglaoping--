// 產季時間軸資料
const seasonData = {
    ponkan: {
        1: { title: '椪柑 1月', content: '橙皮貯藏，甜穩耐吃。' },
        2: { title: '椪柑 2月', content: '更甜更順口。' },
        3: { title: '椪柑 3月', content: '尾韻更圓潤。' },
        4: { title: '椪柑 4月', content: '少量尾聲。' },
        5: { title: '椪柑 5月', content: '休耕養樹。' },
        6: { title: '椪柑 6月', content: '梅雨後蓄甜。' },
        7: { title: '椪柑 7月', content: '通風日照管理。' },
        8: { title: '椪柑 8月', content: '夜溫差養甜。' },
        9: { title: '椪柑 9月', content: '成熟前夕，飽滿。' },
        10: { title: '椪柑 10月', content: '青皮開季，清爽酸香。' },
        11: { title: '椪柑 11月', content: '轉甜香揚，人氣款。' },
        12: { title: '椪柑 12月', content: '青轉橙，甜穩多汁。' }
    },
    murcott: {
        1: { title: '茂谷 1月', content: '開季清甜，汁多皮薄。' },
        2: { title: '茂谷 2月', content: '高峰期，香濃飽滿。' },
        3: { title: '茂谷 3月', content: '產季收尾，甜酸剛好。' },
        4: { title: '茂谷 4月', content: '零星供應。' },
        5: { title: '茂谷 5月', content: '整枝養力。' },
        6: { title: '茂谷 6月', content: '幼果定型。' },
        7: { title: '茂谷 7月', content: '香氣慢慢疊加。' },
        8: { title: '茂谷 8月', content: '糖酸漸平衡。' },
        9: { title: '茂谷 9月', content: '花果香更明顯。' },
        10: { title: '茂谷 10月', content: '暖身期，未上市。' },
        11: { title: '茂谷 11月', content: '早生試水，少量嚐鮮。' },
        12: { title: '茂谷 12月', content: '早生少量，清甜微酸。' }
    }
};

// 初始化產季時間軸
document.addEventListener('DOMContentLoaded', function() {
    const monthItems = document.querySelectorAll('.month-item');
    
    // 月份點擊事件
    monthItems.forEach(item => {
        item.addEventListener('click', function() {
            // 移除其他項目的 active 狀態
            monthItems.forEach(i => i.classList.remove('active'));
            
            // 添加當前項目的 active 狀態
            this.classList.add('active');
            
            // 3秒後自動移除 active 狀態
            setTimeout(() => {
                this.classList.remove('active');
            }, 3000);
        });
    });
});
