# 待完成功能清單

## ✅ 已完成
1. 手機版封面字體優化（段落排版）
2. 產季時間軸改小卡片（橘子圖案漸變）
3. 友善農友移到產季下方
4. 熱門分類左右滑動（手機版）
5. 各分類精選左右滑動（手機版）
6. 取消10斤裝商品
7. 商品規格選擇功能（23A/25A/27A/30A）
8. 最新消息獨立頁面（news.html）
9. 蔬果知識+獨立頁面（knowledge.html）
10. 後端程式碼修改（LINE Pay失敗不寄信）- backend-code.gs

## ⏳ 待完成（需要額外時間）

### 1. 購物車橘色背景
**檔案：** `css/style.css`
```css
.cart-sidebar {
    background: linear-gradient(135deg, #fff7ed, #ffedd5);
}

.cart-header {
    background: var(--primary-color);
    color: var(--white);
}
```

### 2. 訂購人/收件人分離
**檔案：** `index.html` 的結帳表單
需要加入：
- 「同訂購人」勾選框
- 收件人姓名、電話、地址欄位
- JavaScript 自動填入功能

### 3. 免運規則和物流規則勾選
**檔案：** `index.html`
加入結帳前的必讀條款：
```html
<div class="shipping-rules">
    <h4>配送說明</h4>
    <p>📦 滿 NT$1,800 免運費</p>
    <p>🚚 未滿免運門檻，運費 NT$150</p>
    <label>
        <input type="checkbox" id="agreeRules" required>
        我已閱讀並同意配送規則
    </label>
</div>
```

### 4. 評論系統（100則假評論）
**檔案：** 新建 `js/reviews.js`
```javascript
const reviews = [
    { id: 1, user: '王小明', rating: 5, date: '2025-01-10', content: '椪柑很新鮮，甜度剛好！' },
    { id: 2, user: '李美麗', rating: 5, date: '2025-01-09', content: '皮薄好剝，家人都很喜歡' },
    // ... 共100則
];
```

在 `product-detail.html` 加入評論區塊：
```html
<div class="reviews-section">
    <h3>顧客評價 (100)</h3>
    <div id="reviewsList"></div>
</div>
```

### 5. 商品銷售數顯示
**檔案：** `js/products.js`
在商品資料加入：
```javascript
{
    id: 1,
    name: '公老坪椪柑',
    salesCount: 1250,  // 銷售數
    // ...
}
```

在商品詳細頁顯示：
```html
<div class="sales-info">
    <i class="fas fa-fire"></i>
    已售出 <strong id="salesCount">0</strong> 件
</div>
```

## 📝 實作優先順序
1. 購物車橘色背景（最簡單）
2. 商品銷售數顯示（簡單）
3. 免運規則勾選（中等）
4. 訂購人/收件人分離（中等）
5. 評論系統（較複雜，需要生成100則不重複內容）

## 🚀 建議
先執行 `COMPLETE-ALL.bat` 上傳目前版本，測試網站功能是否正常。
剩餘功能可以分批完成，避免一次改動太多導致除錯困難。
