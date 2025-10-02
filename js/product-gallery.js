// 商品圖片輪播功能
class ProductGallery {
    constructor(productId, images) {
        this.productId = productId;
        this.images = images; // 圖片陣列
        this.currentIndex = 0;
        this.autoPlayInterval = null;
        this.init();
    }
    
    init() {
        this.renderGallery();
        this.attachEvents();
        this.createLightbox();
        this.startAutoPlay();
    }
    
    renderGallery() {
        const container = document.getElementById('productGallery');
        if (!container) return;
        
        let html = '<div class="product-gallery">';
        
        // 主圖區
        html += '<div class="main-image-container">';
        html += '<button class="gallery-nav prev" onclick="productGallery.prev()"><i class="fas fa-chevron-left"></i></button>';
        html += '<div class="main-image" onclick="productGallery.openLightbox()">';
        html += '<img src="' + this.images[this.currentIndex] + '" alt="商品圖片" id="mainProductImage" style="cursor: zoom-in;">';
        html += '<div class="zoom-hint"><i class="fas fa-search-plus"></i> 點擊放大</div>';
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
        
        // 滑鼠懸停時暫停自動輪播
        const mainContainer = document.querySelector('.main-image-container');
        if (mainContainer) {
            mainContainer.addEventListener('mouseenter', () => this.stopAutoPlay());
            mainContainer.addEventListener('mouseleave', () => this.startAutoPlay());
        }
    }
    
    // 自動輪播
    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => {
            this.next();
        }, 3000); // 每3秒切換
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    // 創建燈箱
    createLightbox() {
        if (document.getElementById('imageLightbox')) return;
        
        const lightbox = document.createElement('div');
        lightbox.id = 'imageLightbox';
        lightbox.className = 'image-lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close" onclick="productGallery.closeLightbox()">
                    <i class="fas fa-times"></i>
                </button>
                <button class="lightbox-nav prev" onclick="productGallery.lightboxPrev()">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <img id="lightboxImage" src="" alt="放大圖片">
                <button class="lightbox-nav next" onclick="productGallery.lightboxNext()">
                    <i class="fas fa-chevron-right"></i>
                </button>
                <div class="lightbox-counter">
                    <span id="lightboxCounter">1 / 1</span>
                </div>
            </div>
        `;
        document.body.appendChild(lightbox);
        
        // 點擊背景關閉
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                this.closeLightbox();
            }
        });
    }
    
    // 開啟燈箱
    openLightbox() {
        const lightbox = document.getElementById('imageLightbox');
        const lightboxImage = document.getElementById('lightboxImage');
        const counter = document.getElementById('lightboxCounter');
        
        if (lightbox && lightboxImage) {
            lightboxImage.src = this.images[this.currentIndex];
            counter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
            lightbox.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            this.stopAutoPlay();
        }
    }
    
    // 關閉燈箱
    closeLightbox() {
        const lightbox = document.getElementById('imageLightbox');
        if (lightbox) {
            lightbox.style.display = 'none';
            document.body.style.overflow = '';
            this.startAutoPlay();
        }
    }
    
    // 燈箱上一張
    lightboxPrev() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.updateLightboxImage();
    }
    
    // 燈箱下一張
    lightboxNext() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateLightboxImage();
    }
    
    // 更新燈箱圖片
    updateLightboxImage() {
        const lightboxImage = document.getElementById('lightboxImage');
        const counter = document.getElementById('lightboxCounter');
        
        if (lightboxImage) {
            lightboxImage.style.opacity = '0';
            setTimeout(() => {
                lightboxImage.src = this.images[this.currentIndex];
                counter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
                lightboxImage.style.opacity = '1';
            }, 200);
        }
        
        // 同步更新主圖
        this.updateDisplay();
    }
}

// 全域變數
let productGallery = null;

// 初始化圖片輪播
function initProductGallery(productId, images) {
    productGallery = new ProductGallery(productId, images);
}
