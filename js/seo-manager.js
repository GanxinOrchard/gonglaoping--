/**
 * SEO 管理器 - 統一管理頁面 SEO 標籤
 * 用於更新和管理頁面的 meta tags
 */

const SEOManager = {
    // 網站通用資訊
    siteInfo: {
        siteName: '柑心果園',
        author: '柑心果園 Ganxin Orchard',
        baseUrl: 'https://ganxinorchard.github.io/gonglaoping--/',
        defaultImage: 'https://ganxinorchard.github.io/gonglaoping--/images/柑心果園販賣所-2.png',
        locale: 'zh_TW',
        twitterCard: 'summary_large_image'
    },

    // 頁面配置
    pages: {
        'index.html': {
            title: '柑心果園 | 台中豐原公老坪新鮮水果產地直送',
            description: '柑心果園位於台中豐原公老坪，提供新鮮椪柑、茂谷柑等優質水果，產地直送，品質保證。',
            keywords: '柑心果園,椪柑,茂谷柑,台中豐原,公老坪,水果,產地直送'
        },
        'products.html': {
            title: '全部商品 - 柑心果園 | 新鮮椪柑、茂谷柑線上選購',
            description: '柑心果園全部商品，提供新鮮椪柑、茂谷柑等優質水果，產地直送，品質保證。',
            keywords: '柑心果園,椪柑,茂谷柑,水果,商品,線上購物,台中豐原,公老坪'
        },
        'about.html': {
            title: '關於我們 - 柑心果園 | 台中豐原公老坪果園介紹',
            description: '了解柑心果園的故事，我們位於台中豐原公老坪，致力於提供最新鮮的水果給消費者。',
            keywords: '柑心果園,關於我們,台中豐原,公老坪,果園介紹'
        },
        'contact.html': {
            title: '聯絡我們 - 柑心果園 | 客服資訊與聯絡方式',
            description: '柑心果園聯絡資訊，歡迎透過電話、LINE 或 Facebook 與我們聯繫。',
            keywords: '柑心果園,聯絡我們,客服,電話,LINE,Facebook'
        }
        // ... 可以繼續新增其他頁面
    },

    /**
     * 初始化 SEO 標籤
     */
    init() {
        const currentPage = this.getCurrentPage();
        const pageConfig = this.pages[currentPage];

        if (pageConfig) {
            this.updateMetaTags(pageConfig);
            this.updateOpenGraph(pageConfig);
            this.updateTwitterCard(pageConfig);
        }
    },

    /**
     * 獲取當前頁面檔名
     */
    getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop() || 'index.html';
        return page;
    },

    /**
     * 更新基本 Meta 標籤
     */
    updateMetaTags(config) {
        document.title = config.title;
        
        this.setMetaTag('description', config.description);
        this.setMetaTag('keywords', config.keywords);
        this.setMetaTag('author', this.siteInfo.author);
        this.setMetaTag('robots', 'index, follow');
    },

    /**
     * 更新 Open Graph 標籤
     */
    updateOpenGraph(config) {
        const currentUrl = this.siteInfo.baseUrl + this.getCurrentPage();
        
        this.setMetaProperty('og:type', 'website');
        this.setMetaProperty('og:url', currentUrl);
        this.setMetaProperty('og:title', config.title);
        this.setMetaProperty('og:description', config.description);
        this.setMetaProperty('og:image', this.siteInfo.defaultImage);
        this.setMetaProperty('og:locale', this.siteInfo.locale);
        this.setMetaProperty('og:site_name', this.siteInfo.siteName);
    },

    /**
     * 更新 Twitter Card 標籤
     */
    updateTwitterCard(config) {
        const currentUrl = this.siteInfo.baseUrl + this.getCurrentPage();
        
        this.setMetaTag('twitter:card', this.siteInfo.twitterCard, 'name');
        this.setMetaTag('twitter:url', currentUrl, 'name');
        this.setMetaTag('twitter:title', config.title, 'name');
        this.setMetaTag('twitter:description', config.description, 'name');
        this.setMetaTag('twitter:image', this.siteInfo.defaultImage, 'name');
    },

    /**
     * 設置 Meta 標籤（name 屬性）
     */
    setMetaTag(name, content, attribute = 'name') {
        let meta = document.querySelector(`meta[${attribute}="${name}"]`);
        
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute(attribute, name);
            document.head.appendChild(meta);
        }
        
        meta.setAttribute('content', content);
    },

    /**
     * 設置 Meta 標籤（property 屬性，用於 Open Graph）
     */
    setMetaProperty(property, content) {
        this.setMetaTag(property, content, 'property');
    },

    /**
     * 更新 Canonical URL
     */
    updateCanonical() {
        const currentUrl = this.siteInfo.baseUrl + this.getCurrentPage();
        let canonical = document.querySelector('link[rel="canonical"]');
        
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            document.head.appendChild(canonical);
        }
        
        canonical.setAttribute('href', currentUrl);
    }
};

// 頁面載入完成後自動執行
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => SEOManager.init());
} else {
    SEOManager.init();
}
