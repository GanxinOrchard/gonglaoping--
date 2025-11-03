@echo off
echo 正在啟動本地伺服器...
echo.
echo 請在瀏覽器中開啟以下網址測試：
echo   - 首頁: http://localhost:8000/index.html
echo   - 商品頁: http://localhost:8000/products.html
echo   - 商品詳情: http://localhost:8000/product-detail.html
echo   - 購物車: http://localhost:8000/cart.html
echo.
echo 按 Ctrl+C 停止伺服器
echo.
python -m http.server 8000
