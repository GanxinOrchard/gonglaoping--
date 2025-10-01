// 商品圖片輪播功能
class ProductGallery {
    constructor(productId, images) {
        this.productId = productId;
        this.images = images; // 圖片陣列
        this.currentIndex = 0;
        this.init();
    }
    
    init() {
        this.renderGallery();
        this.attachEvents();
    }
    
    renderGallery() {
        const container = document.getElementById('productGallery');
        if (!container) return;
        
        let html = '<div class="product-gallery">';
        
        // 主圖區
        html += '<div class="main-image-container">';
        html += '<button class="gallery-nav prev" onclick="productGallery.prev()"><i class="fas fa-chevron-left"></i></button>';
        html += '<div class="main-image">';
        html += '<img src="' + this.images[this.currentIndex] + '" alt="商品圖片" id="mainProductImage">';
        html += '</div>';
        html += '<button class="gallery-nav next" onclick="productGallery.next()"><i class="fas fa-chevron-right"></i></button>';
        html += '</div>';
        
        // 縮圖區
        html += '<div class="thumbnail-container">';
        this.images.forEach((img, index) => {
            const activeClass = index === this.currentIndex ? ' active' : '';
            html += '<div class="thumbnail' + activeClass + '" onclick="productGallery.goTo(' + index + ')">';
            html += '<img src="' + img + '" alt="縮圖 ' + (index + 1) + '">';
            html += '</div>';
        });
        html += '</div>';
        
        html += '</div>';
        
        container.innerHTML = html;
    }
    
    goTo(index) {
        this.currentIndex = index;
        this.updateDisplay();
    }
    
    next() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateDisplay();
    }
    
    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.updateDisplay();
    }
    
    updateDisplay() {
        // 更新主圖
        const mainImage = document.getElementById('mainProductImage');
        if (mainImage) {
            mainImage.style.opacity = '0';
            setTimeout(() => {
                mainImage.src = this.images[this.currentIndex];
                mainImage.style.opacity = '1';
            }, 200);
        }
        
        // 更新縮圖active狀態
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumb, index) => {
            if (index === this.currentIndex) {
                thumb.classList.add('active');
            } else {
                thumb.classList.remove('active');
            }
        });
    }
    
    attachEvents() {
        // 鍵盤控制
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });
    }
}

// 全域變數
let productGallery = null;

// 初始化圖片輪播
function initProductGallery(productId, images) {
    productGallery = new ProductGallery(productId, images);
}
