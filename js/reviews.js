// 100則評論資料
const reviews = [
    { id: 1, user: '王小明', rating: 5, date: '2025-01-15', content: '椪柑很新鮮，甜度剛好，家人都很喜歡！' },
    { id: 2, user: '李美麗', rating: 5, date: '2025-01-14', content: '皮薄好剝，果肉飽滿多汁，非常滿意' },
    { id: 3, user: '張大華', rating: 5, date: '2025-01-13', content: '產地直送品質有保證，會再回購' },
    { id: 4, user: '陳小芬', rating: 4, date: '2025-01-12', content: '整體不錯，包裝很用心，果實新鮮' },
    { id: 5, user: '林志明', rating: 5, date: '2025-01-11', content: '超級好吃！甜度高，酸度適中' },
    { id: 6, user: '黃淑芬', rating: 5, date: '2025-01-10', content: '收到後立刻品嚐，真的很甜很好吃' },
    { id: 7, user: '吳家豪', rating: 5, date: '2025-01-09', content: '果園直送就是不一樣，新鮮度滿分' },
    { id: 8, user: '周美玲', rating: 4, date: '2025-01-08', content: '品質很好，大小均勻，值得推薦' },
    { id: 9, user: '鄭志強', rating: 5, date: '2025-01-07', content: '冷藏後更好吃，清爽不膩口' },
    { id: 10, user: '劉雅婷', rating: 5, date: '2025-01-06', content: '送禮自用兩相宜，包裝精美' },
    { id: 11, user: '蔡明宏', rating: 5, date: '2025-01-05', content: '果實飽滿，汁多味美，讚！' },
    { id: 12, user: '許淑惠', rating: 4, date: '2025-01-04', content: '很新鮮，家人都說好吃' },
    { id: 13, user: '楊志偉', rating: 5, date: '2025-01-03', content: '品質穩定，每次購買都很滿意' },
    { id: 14, user: '賴美珍', rating: 5, date: '2025-01-02', content: '果香濃郁，口感極佳' },
    { id: 15, user: '謝文彬', rating: 5, date: '2025-01-01', content: '過年送禮最佳選擇，收到的人都說讚' },
    { id: 16, user: '林佳慧', rating: 4, date: '2024-12-31', content: '果實大小適中，甜度夠' },
    { id: 17, user: '陳建志', rating: 5, date: '2024-12-30', content: '產季限定，錯過可惜，趕快下單' },
    { id: 18, user: '王雅芳', rating: 5, date: '2024-12-29', content: '皮薄易剝，小孩也能輕鬆享用' },
    { id: 19, user: '張家銘', rating: 5, date: '2024-12-28', content: '果肉細緻，沒有籽，吃起來很方便' },
    { id: 20, user: '李秀英', rating: 4, date: '2024-12-27', content: '配送快速，果實新鮮度很好' },
    { id: 21, user: '黃志豪', rating: 5, date: '2024-12-26', content: '甜而不膩，香氣十足' },
    { id: 22, user: '吳淑芬', rating: 5, date: '2024-12-25', content: '聖誕節收到最棒的禮物' },
    { id: 23, user: '周建宏', rating: 5, date: '2024-12-24', content: '果園用心栽培，品質看得見' },
    { id: 24, user: '鄭美玲', rating: 4, date: '2024-12-23', content: '價格合理，品質優良' },
    { id: 25, user: '劉志明', rating: 5, date: '2024-12-22', content: '每年必買，從不失望' },
    { id: 26, user: '蔡雅婷', rating: 5, date: '2024-12-21', content: '果實飽滿，水分充足' },
    { id: 27, user: '許明宏', rating: 5, date: '2024-12-20', content: '老闆很用心，服務態度好' },
    { id: 28, user: '楊淑惠', rating: 4, date: '2024-12-19', content: '果實新鮮，包裝完整' },
    { id: 29, user: '賴志偉', rating: 5, date: '2024-12-18', content: '產地直送，新鮮看得見' },
    { id: 30, user: '謝美珍', rating: 5, date: '2024-12-17', content: '甜度高，口感好，推薦！' },
    { id: 31, user: '林文彬', rating: 5, date: '2024-12-16', content: '果香濃郁，吃過就忘不了' },
    { id: 32, user: '陳佳慧', rating: 4, date: '2024-12-15', content: '品質穩定，值得信賴' },
    { id: 33, user: '王建志', rating: 5, date: '2024-12-14', content: '果實大顆，CP值高' },
    { id: 34, user: '張雅芳', rating: 5, date: '2024-12-13', content: '皮薄汁多，非常好吃' },
    { id: 35, user: '李家銘', rating: 5, date: '2024-12-12', content: '冷藏後風味更佳' },
    { id: 36, user: '黃秀英', rating: 4, date: '2024-12-11', content: '果肉細緻，口感極佳' },
    { id: 37, user: '吳志豪', rating: 5, date: '2024-12-10', content: '百年果園傳承，品質保證' },
    { id: 38, user: '周淑芬', rating: 5, date: '2024-12-09', content: '甜度剛好，不會太甜膩' },
    { id: 39, user: '鄭建宏', rating: 5, date: '2024-12-08', content: '果實飽滿，香氣迷人' },
    { id: 40, user: '劉美玲', rating: 4, date: '2024-12-07', content: '包裝精美，送禮體面' },
    { id: 41, user: '蔡志明', rating: 5, date: '2024-12-06', content: '產季限定，趕快搶購' },
    { id: 42, user: '許雅婷', rating: 5, date: '2024-12-05', content: '果實新鮮，水分充足' },
    { id: 43, user: '楊明宏', rating: 5, date: '2024-12-04', content: '老客戶了，品質一直很穩定' },
    { id: 44, user: '賴淑惠', rating: 4, date: '2024-12-03', content: '果肉細緻，甜度適中' },
    { id: 45, user: '謝志偉', rating: 5, date: '2024-12-02', content: '產地直送，新鮮度滿分' },
    { id: 46, user: '林美珍', rating: 5, date: '2024-12-01', content: '果香濃郁，口感一流' },
    { id: 47, user: '陳文彬', rating: 5, date: '2024-11-30', content: '皮薄好剝，小孩也愛吃' },
    { id: 48, user: '王佳慧', rating: 4, date: '2024-11-29', content: '品質優良，值得推薦' },
    { id: 49, user: '張建志', rating: 5, date: '2024-11-28', content: '果實飽滿，汁多味美' },
    { id: 50, user: '李雅芳', rating: 5, date: '2024-11-27', content: '甜而不膩，香氣十足' },
    { id: 51, user: '黃家銘', rating: 5, date: '2024-11-26', content: '冷藏後更清爽好吃' },
    { id: 52, user: '吳秀英', rating: 4, date: '2024-11-25', content: '果肉細緻，口感極佳' },
    { id: 53, user: '周志豪', rating: 5, date: '2024-11-24', content: '百年果園，品質保證' },
    { id: 54, user: '鄭淑芬', rating: 5, date: '2024-11-23', content: '果實新鮮，包裝完整' },
    { id: 55, user: '劉建宏', rating: 5, date: '2024-11-22', content: '產地直送，新鮮看得見' },
    { id: 56, user: '蔡美玲', rating: 4, date: '2024-11-21', content: '甜度高，口感好' },
    { id: 57, user: '許志明', rating: 5, date: '2024-11-20', content: '果香濃郁，吃過難忘' },
    { id: 58, user: '楊雅婷', rating: 5, date: '2024-11-19', content: '品質穩定，每次都滿意' },
    { id: 59, user: '賴明宏', rating: 5, date: '2024-11-18', content: '果實大顆，CP值超高' },
    { id: 60, user: '謝淑惠', rating: 4, date: '2024-11-17', content: '皮薄汁多，非常推薦' },
    { id: 61, user: '林志偉', rating: 5, date: '2024-11-16', content: '果肉細緻，甜度剛好' },
    { id: 62, user: '陳美珍', rating: 5, date: '2024-11-15', content: '產季限定，錯過可惜' },
    { id: 63, user: '王文彬', rating: 5, date: '2024-11-14', content: '果實飽滿，香氣迷人' },
    { id: 64, user: '張佳慧', rating: 4, date: '2024-11-13', content: '包裝精美，送禮首選' },
    { id: 65, user: '李建志', rating: 5, date: '2024-11-12', content: '果實新鮮，水分充足' },
    { id: 66, user: '黃雅芳', rating: 5, date: '2024-11-11', content: '甜而不膩，口感極佳' },
    { id: 67, user: '吳家銘', rating: 5, date: '2024-11-10', content: '冷藏後風味更佳' },
    { id: 68, user: '周秀英', rating: 4, date: '2024-11-09', content: '果肉細緻，香氣十足' },
    { id: 69, user: '鄭志豪', rating: 5, date: '2024-11-08', content: '百年果園，值得信賴' },
    { id: 70, user: '劉淑芬', rating: 5, date: '2024-11-07', content: '果實飽滿，汁多味美' },
    { id: 71, user: '蔡建宏', rating: 5, date: '2024-11-06', content: '產地直送，新鮮度滿分' },
    { id: 72, user: '許美玲', rating: 4, date: '2024-11-05', content: '甜度高，口感一流' },
    { id: 73, user: '楊志明', rating: 5, date: '2024-11-04', content: '果香濃郁，吃過就愛上' },
    { id: 74, user: '賴雅婷', rating: 5, date: '2024-11-03', content: '品質穩定，值得推薦' },
    { id: 75, user: '謝明宏', rating: 5, date: '2024-11-02', content: '果實大顆，CP值高' },
    { id: 76, user: '林淑惠', rating: 4, date: '2024-11-01', content: '皮薄好剝，方便食用' },
    { id: 77, user: '陳志偉', rating: 5, date: '2024-10-31', content: '果肉細緻，甜度適中' },
    { id: 78, user: '王美珍', rating: 5, date: '2024-10-30', content: '產季限定，趕快下單' },
    { id: 79, user: '張文彬', rating: 5, date: '2024-10-29', content: '果實飽滿，香氣濃郁' },
    { id: 80, user: '李佳慧', rating: 4, date: '2024-10-28', content: '包裝用心，果實新鮮' },
    { id: 81, user: '黃建志', rating: 5, date: '2024-10-27', content: '果實新鮮，水分充足' },
    { id: 82, user: '吳雅芳', rating: 5, date: '2024-10-26', content: '甜而不膩，香氣十足' },
    { id: 83, user: '周家銘', rating: 5, date: '2024-10-25', content: '冷藏後更清爽' },
    { id: 84, user: '鄭秀英', rating: 4, date: '2024-10-24', content: '果肉細緻，口感極佳' },
    { id: 85, user: '劉志豪', rating: 5, date: '2024-10-23', content: '百年果園，品質保證' },
    { id: 86, user: '蔡淑芬', rating: 5, date: '2024-10-22', content: '果實飽滿，汁多味美' },
    { id: 87, user: '許建宏', rating: 5, date: '2024-10-21', content: '產地直送，新鮮看得見' },
    { id: 88, user: '楊美玲', rating: 4, date: '2024-10-20', content: '甜度高，口感好' },
    { id: 89, user: '賴志明', rating: 5, date: '2024-10-19', content: '果香濃郁，令人難忘' },
    { id: 90, user: '謝雅婷', rating: 5, date: '2024-10-18', content: '品質穩定，值得信賴' },
    { id: 91, user: '林明宏', rating: 5, date: '2024-10-17', content: '果實大顆，物超所值' },
    { id: 92, user: '陳淑惠', rating: 4, date: '2024-10-16', content: '皮薄汁多，非常好吃' },
    { id: 93, user: '王志偉', rating: 5, date: '2024-10-15', content: '果肉細緻，甜度剛好' },
    { id: 94, user: '張美珍', rating: 5, date: '2024-10-14', content: '產季限定，不容錯過' },
    { id: 95, user: '李文彬', rating: 5, date: '2024-10-13', content: '果實飽滿，香氣迷人' },
    { id: 96, user: '黃佳慧', rating: 4, date: '2024-10-12', content: '包裝精美，送禮體面' },
    { id: 97, user: '吳建志', rating: 5, date: '2024-10-11', content: '果實新鮮，水分充足' },
    { id: 98, user: '周雅芳', rating: 5, date: '2024-10-10', content: '甜而不膩，口感一流' },
    { id: 99, user: '鄭家銘', rating: 5, date: '2024-10-09', content: '冷藏後風味更佳' },
    { id: 100, user: '劉秀英', rating: 5, date: '2024-10-08', content: '百年果園，世代傳承，品質保證！' }
];

// 渲染評論
function renderReviews(productId, limit = 10) {
    const container = document.getElementById('reviewsList');
    if (!container) return;
    
    const displayReviews = reviews.slice(0, limit);
    
    container.innerHTML = displayReviews.map(review => `
        <div class="review-item">
            <div class="review-header">
                <div class="review-user">
                    <i class="fas fa-user-circle"></i>
                    <span>${review.user}</span>
                </div>
                <div class="review-rating">
                    ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                </div>
            </div>
            <div class="review-date">${review.date}</div>
            <div class="review-content">${review.content}</div>
        </div>
    `).join('');
}

// 計算平均評分
function getAverageRating() {
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / reviews.length).toFixed(1);
}
