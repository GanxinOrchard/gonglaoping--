
# 柑心果園｜GitHub Pages 多頁式骨架（含共享 Header/Footer）

## 上線步驟
1. 把整個資料夾上傳到你的 GitHub repo（若是專案頁面，建議放在 `/docs`，並在 repo Settings → Pages 指向 `docs/`）。
2. 進入 GitHub Pages 網址存取：
   - 使用者頁面：`https://<你的帳號>.github.io/`（放在 `main` 根目錄）
   - 專案頁面：`https://<你的帳號>.github.io/<repo>/`（放在 `docs`）
3. 導覽列的連結使用相對路徑（例如 `products.html`），可避免子目錄問題。

## 你可以改的地方
- 圖片連結：在各頁 `<img src="...">` 改成你自己的圖片（e.g. GitHub raw 或自己主機）。
- 價格/規格：`product-pokan.html` 的 `<select id="specSel">` 改 `data-price` / `data-was`。
- 下單邏輯：`assets/js/main.js` 的 `goOrder()` 改成你的表單或 Glide/WordPress 購物車連結。
- LINE 連結：`goLine()` 改成你的 LINE OA。

## 結構
- `partials/header.html`、`partials/footer.html` 由各頁用 JS 載入（減少重複）。
- `assets/css/style.css` 與 `assets/js/main.js` 提供共用樣式與互動。

