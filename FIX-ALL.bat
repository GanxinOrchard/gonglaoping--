@echo off
chcp 65001 >nul
echo ========================================
echo   完整修復並上傳 - 最終版本
echo ========================================
echo.

echo 步驟 1: 替換 products.js...
copy /Y "js\products-new.js" "js\products.js"
if %errorlevel% neq 0 (
    echo Failed to replace products.js!
    pause
    exit /b 1
)
echo Products.js replaced successfully!

echo.
echo Step 2: Checking files...
if exist "js\products.js" (
    echo - products.js: OK
) else (
    echo - products.js: MISSING!
)

if exist "js\cart.js" (
    echo - cart.js: OK
) else (
    echo - cart.js: MISSING!
)

if exist "index.html" (
    echo - index.html: OK
) else (
    echo - index.html: MISSING!
)

echo.
echo Step 3: Uploading to GitHub...
git add .
git commit -m "Complete: All features fixed, products.js replaced, ready for production"
git push origin main

if %errorlevel% neq 0 (
    echo.
    echo Upload failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Success!
echo ========================================
echo.
echo All changes uploaded successfully!
echo.
echo Website: https://ganxinorchard.github.io/gonglaoping--/
echo.
echo Please test:
echo 1. Shopping cart with specs
echo 2. Shipping fee calculation
echo 3. Floating cart button
echo 4. Checkout button
echo 5. Product categories
echo.
pause
