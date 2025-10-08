# knowledge.html 修改說明

## 需要修改的地方

### 1. CSS 部分（約第29-56行）

**找到並刪除：**
```css
.knowledge-carousel-container {
    position: relative;
    overflow: hidden;
    padding: 20px 0;
}

.knowledge-carousel {
    display: flex;
    gap: 30px;
    overflow-x: auto;
    scroll-behavior: smooth;
    padding: 20px;
    cursor: grab;
    user-select: none;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
}

.knowledge-carousel::-webkit-scrollbar {
    display: none;
}

.knowledge-carousel.grabbing {
    cursor: grabbing;
}
```

**替換為：**
```css
.knowledge-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
    padding: 20px 0;
}

@media (max-width: 992px) {
    .knowledge-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
    }
}

@media (max-width: 576px) {
    .knowledge-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
    }
}
```

**修改 .knowledge-card：**
找到 `.knowledge-card {` 這一行，刪除其中的 `flex: 0 0 350px;`

---

### 2. 添加麵包屑（約第287行）

在 `</header>` 之後，`<script>` 之前添加：

```html
    <!-- 麵包屑導航 -->
    <nav class="breadcrumb">
        <a href="index.html"><i class="fas fa-home"></i> 首頁</a>
        <span class="breadcrumb-separator">/</span>
        <span>蔬果知識+</span>
    </nav>
```

---

### 3. HTML 結構（約第363行）

**找到：**
```html
<div class="knowledge-carousel-container">
    <div class="knowledge-carousel" id="knowledgeCarousel">
```

**改為：**
```html
<div class="knowledge-grid">
```

注意：刪除了第二層的 `<div class="knowledge-carousel" id="knowledgeCarousel">`

---

### 4. 刪除輪播控制按鈕（約第457-465行）

**找到並刪除整個區塊：**
```html
<div class="carousel-controls">
    <button class="carousel-btn" onclick="scrollCarousel('knowledge', -1)">
        <i class="fas fa-chevron-left"></i>
    </button>
    <button class="carousel-btn" onclick="scrollCarousel('knowledge', 1)">
        <i class="fas fa-chevron-right"></i>
    </button>
</div>
```

同時要確保對應的 `</div>` 標籤正確閉合。

---

### 5. 刪除 JavaScript（約第304-349行）

**找到並刪除：**
```javascript
// 拖曳滑動功能
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.getElementById('knowledgeCarousel');
    let isDown = false;
    let startX;
    let scrollLeft;

    carousel.addEventListener('mousedown', (e) => {
        isDown = true;
        carousel.classList.add('grabbing');
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
    });

    carousel.addEventListener('mouseleave', () => {
        isDown = false;
        carousel.classList.remove('grabbing');
    });

    carousel.addEventListener('mouseup', () => {
        isDown = false;
        carousel.classList.remove('grabbing');
    });

    carousel.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2;
        carousel.scrollLeft = scrollLeft - walk;
    });

    // 觸控支援
    let touchStartX = 0;
    let touchScrollLeft = 0;

    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].pageX;
        touchScrollLeft = carousel.scrollLeft;
    });

    carousel.addEventListener('touchmove', (e) => {
        const touchX = e.touches[0].pageX;
        const walk = (touchStartX - touchX) * 1.5;
        carousel.scrollLeft = touchScrollLeft + walk;
    });
});
```

---

## 修改完成後的效果

- ✅ 文章以九宮格方式顯示（桌面版 3 欄）
- ✅ 手機版自動變成 2 欄
- ✅ 有麵包屑導航
- ✅ 移除了輪播功能
- ✅ 文章按日期從新到舊排列（已經是正確順序）

---

## 快速修改方法

1. 用 VS Code 或任何文本編輯器打開 `knowledge.html`
2. 使用 Ctrl+F 搜索上述關鍵字
3. 按照說明逐一修改
4. 保存文件
5. 用瀏覽器打開測試效果

修改完成後記得提交到 Git！
