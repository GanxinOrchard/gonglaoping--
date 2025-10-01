@echo off
echo ========================================
echo   Quick Upload - Replace products.js
echo ========================================
echo.

echo Step 1: Replacing products.js...
copy /Y "js\products-new.js" "js\products.js"

echo.
echo Step 2: Uploading to GitHub...
git add .
git commit -m "Complete: Floating cart, recommended products, about page image, all features done"
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
echo Website: https://ganxinorchard.github.io/gonglaoping--/
echo.
echo Next steps:
echo 1. Test the website
echo 2. Check shopping cart
echo 3. Test checkout
echo.
pause
