# 🖼️ 圖片優化指南

## 🎯 目標

優化網站圖片以提升載入速度、改善使用者體驗，並達到 Lighthouse Performance 95+ 分數。

---

## 📊 目前圖片使用情況

### 主要圖片類型
1. **商品圖片**：椪柑、茂谷柑、菱角仁
2. **LOGO**：柑心果園 LOGO
3. **背景圖片**：首頁 Hero 區塊
4. **商品介紹圖**：詳細說明圖
5. **料理方式圖**：菱角仁料理示範

---

## ✅ 圖片優化標準

### 1. 格式選擇

| 圖片類型 | 建議格式 | 備註 |
|---------|---------|------|
| 商品照片 | WebP (備援 JPG) | 壓縮率高，品質好 |
| LOGO | SVG 或 PNG | 支援透明背景 |
| 圖示 | SVG | 向量圖，任意縮放 |
| 背景圖 | WebP (備援 JPG) | 大圖片優先優化 |

### 2. 尺寸規範

| 用途 | 建議尺寸 | 最大檔案大小 |
|-----|---------|------------|
| 商品縮圖 | 400x400px | 50KB |
| 商品大圖 | 800x800px | 150KB |
| 商品詳情圖 | 1200x800px | 200KB |
| Hero 背景 | 1920x1080px | 300KB |
| LOGO | 原始尺寸 | 50KB |

### 3. 品質設定

- **WebP**：品質 80-85
- **JPG**：品質 75-85
- **PNG**：使用 TinyPNG 壓縮

---

## 🛠️ 圖片優化工具

### 線上工具（免費）

1. **[TinyPNG](https://tinypng.com/)**
   - 支援 PNG、JPG、WebP
   - 批次處理最多 20 張
   - 壓縮率高，品質損失小

2. **[Squoosh](https://squoosh.app/)**
   - Google 開發
   - 支援多種格式轉換
   - 可即時預覽效果

3. **[CloudConvert](https://cloudconvert.com/)**
   - 支援批次轉換
   - 格式支援完整

### 桌面工具

1. **[XnConvert](https://www.xnview.com/en/xnconvert/)**（免費）
   - 批次處理
   - 支援 500+ 格式
   - 可設定自動化流程

2. **[ImageOptim](https://imageoptim.com/)**（Mac，免費）
   - 無損壓縮
   - 拖放即用

### 命令列工具

```bash
# 安裝 cwebp（WebP 轉換工具）
# Windows: 下載 libwebp
# Mac: brew install webp
# Linux: sudo apt-get install webp

# JPG 轉 WebP
cwebp -q 80 input.jpg -o output.webp

# 批次轉換（Windows PowerShell）
Get-ChildItem *.jpg | ForEach-Object { cwebp -q 80 $_.FullName -o ($_.BaseName + ".webp") }

# 批次轉換（Mac/Linux）
for file in *.jpg; do cwebp -q 80 "$file" -o "${file%.jpg}.webp"; done
```

---

## 📝 優化步驟

### 步驟 1：整理現有圖片

```bash
# 建立圖片資料夾結構
images/
├── products/          # 商品圖片
│   ├── ponkan/       # 椪柑
│   ├── murcott/      # 茂谷柑
│   └── water-caltrop/ # 菱角仁
├── detail/           # 商品詳情圖
├── cooking/          # 料理方式圖
├── hero/             # 首頁背景圖
└── logo.png          # LOGO
```

### 步驟 2：批次壓縮和轉換

#### 方法 1：使用 TinyPNG（推薦新手）

1. 前往 [TinyPNG](https://tinypng.com/)
2. 拖放最多 20 張圖片
3. 等待壓縮完成
4. 下載壓縮後的圖片
5. 重複直到所有圖片完成

#### 方法 2：使用 Squoosh（推薦進階使用者）

1. 前往 [Squoosh](https://squoosh.app/)
2. 上傳圖片
3. 選擇輸出格式：WebP
4. 調整品質：80-85
5. 下載優化後的圖片

#### 方法 3：使用命令列（推薦開發者）

```bash
# 進入圖片資料夾
cd C:\Users\張-1\CascadeProjects\ganxin-orchard\images

# 批次轉換為 WebP
Get-ChildItem -Recurse -Include *.jpg,*.png | ForEach-Object {
    $outputPath = $_.DirectoryName + "\" + $_.BaseName + ".webp"
    cwebp -q 80 $_.FullName -o $outputPath
}
```

### 步驟 3：更新 HTML 使用 `<picture>` 標籤

#### 原始寫法（僅 JPG）
```html
<img src="images/products/ponkan1.jpg" alt="公老坪椪柑">
```

#### 優化後寫法（WebP + JPG 備援）
```html
<picture>
    <source srcset="images/products/ponkan1.webp" type="image/webp">
    <img src="images/products/ponkan1.jpg" alt="公老坪椪柑" loading="lazy">
</picture>
```

#### 響應式圖片（不同螢幕尺寸）
```html
<picture>
    <source 
        srcset="images/products/ponkan1-400.webp 400w,
                images/products/ponkan1-800.webp 800w,
                images/products/ponkan1-1200.webp 1200w"
        sizes="(max-width: 768px) 100vw, 50vw"
        type="image/webp">
    <img 
        src="images/products/ponkan1.jpg" 
        alt="公老坪椪柑"
        loading="lazy"
        width="800"
        height="800">
</picture>
```

### 步驟 4：加入 Lazy Loading

所有非首屏圖片都應加入 `loading="lazy"`：

```html
<img src="image.jpg" alt="描述" loading="lazy">
```

**例外情況**（不要加 lazy loading）：
- 首頁 Hero 區塊的背景圖
- Logo
- 首屏可見的前 3-4 張圖片

### 步驟 5：設定圖片尺寸屬性

為所有圖片加入 `width` 和 `height` 屬性，避免 Layout Shift：

```html
<img 
    src="image.jpg" 
    alt="描述" 
    width="800" 
    height="600"
    loading="lazy">
```

---

## 🎨 具體優化清單

### 首頁 (index.html)

```html
<!-- Hero 背景圖 -->
<div class="hero" style="background-image: url('images/hero/hero-bg.webp');">
    <!-- 不要加 loading="lazy" -->
</div>

<!-- 商品卡片 -->
<picture>
    <source srcset="images/products/ponkan1.webp" type="image/webp">
    <img 
        src="images/products/ponkan1.jpg" 
        alt="公老坪椪柑 23A"
        width="400"
        height="400"
        loading="lazy">
</picture>
```

### 商品列表頁 (products.html)

```javascript
// 在 JavaScript 中動態生成
function renderProductCard(product) {
    return `
        <div class="product-card">
            <picture>
                <source srcset="${product.image.replace('.jpg', '.webp')}" type="image/webp">
                <img 
                    src="${product.image}" 
                    alt="${product.name}"
                    width="400"
                    height="400"
                    loading="lazy">
            </picture>
        </div>
    `;
}
```

### 商品詳情頁 (product-detail.html)

```html
<!-- 主圖 -->
<picture>
    <source srcset="images/products/ponkan1.webp" type="image/webp">
    <img 
        src="images/products/ponkan1.jpg" 
        alt="公老坪椪柑"
        width="800"
        height="800"
        loading="eager">  <!-- 主圖不要 lazy -->
</picture>

<!-- 詳情圖 -->
<picture>
    <source srcset="images/detail/ponkan-detail1.webp" type="image/webp">
    <img 
        src="images/detail/ponkan-detail1.jpg" 
        alt="椪柑詳細介紹"
        width="1200"
        height="800"
        loading="lazy">
</picture>
```

---

## 📊 效能檢測

### 使用 Lighthouse

1. 開啟 Chrome DevTools（F12）
2. 切換到「Lighthouse」標籤
3. 選擇「Performance」
4. 點擊「Analyze page load」
5. 檢查以下項目：
   - ✅ Properly size images
   - ✅ Efficiently encode images
   - ✅ Serve images in next-gen formats
   - ✅ Defer offscreen images

### 目標分數

- **Performance**: 95+
- **Accessibility**: 95+
- **Best Practices**: 95+
- **SEO**: 100

---

## 🔧 進階優化

### 1. 使用 CDN

將圖片上傳到 CDN 服務：
- **Cloudflare Images**（付費）
- **Cloudinary**（免費額度）
- **imgix**（付費）

### 2. 自動化優化

在 GitHub Actions 中加入圖片優化流程：

```yaml
# .github/workflows/optimize-images.yml
name: Optimize Images

on:
  push:
    paths:
      - 'images/**'

jobs:
  optimize:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Optimize images
        uses: calibreapp/image-actions@main
        with:
          githubToken: ${{ secrets.GITHUB_TOKEN }}
          jpegQuality: 80
          pngQuality: 80
          webpQuality: 80
```

### 3. 預載入關鍵圖片

在 `<head>` 中預載入首屏圖片：

```html
<link rel="preload" as="image" href="images/hero/hero-bg.webp" type="image/webp">
<link rel="preload" as="image" href="images/logo.png">
```

---

## 📋 檢查清單

### 圖片準備
- [ ] 所有商品圖片已壓縮
- [ ] 轉換為 WebP 格式
- [ ] 保留 JPG 作為備援
- [ ] 圖片尺寸符合規範
- [ ] 檔案大小符合標準

### HTML 更新
- [ ] 使用 `<picture>` 標籤
- [ ] 加入 `loading="lazy"`（非首屏）
- [ ] 設定 `width` 和 `height`
- [ ] 加入有意義的 `alt` 文字
- [ ] 首屏圖片使用 `loading="eager"`

### 效能測試
- [ ] Lighthouse Performance 95+
- [ ] 圖片載入時間 < 2 秒
- [ ] 無 Layout Shift 問題
- [ ] 所有圖片正常顯示

---

## 🆘 常見問題

### Q1: WebP 在舊瀏覽器不支援怎麼辦？
A: 使用 `<picture>` 標籤提供 JPG 備援，瀏覽器會自動選擇支援的格式。

### Q2: 如何批次重新命名圖片？
A: 使用 PowerShell：
```powershell
Get-ChildItem *.jpg | ForEach-Object -Begin {$count=1} -Process {
    Rename-Item $_ -NewName "ponkan$count.jpg"
    $count++
}
```

### Q3: 圖片壓縮後品質下降怎麼辦？
A: 調整品質參數（80-90），或使用無損壓縮工具如 ImageOptim。

### Q4: 如何檢查圖片是否已優化？
A: 使用 Chrome DevTools → Network 標籤，檢查圖片大小和格式。

---

## 📚 參考資源

- [Google Web.dev - 圖片優化](https://web.dev/fast/#optimize-your-images)
- [WebP 官方文件](https://developers.google.com/speed/webp)
- [MDN - Responsive Images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)

---

**最後更新：2025-10-03**
