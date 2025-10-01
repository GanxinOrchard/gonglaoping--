@echo off
echo ========================================
echo   Complete Rebuild
echo ========================================
echo.

echo [1/4] Creating folders...
if not exist "css" mkdir css
if not exist "js" mkdir js
if not exist "images" mkdir images
echo Done!
echo.

echo [2/4] Downloading files...
echo - style.css
curl -s -o css\style.css https://raw.githubusercontent.com/GanxinOrchard/gonglaoping--/main/style.css

echo - products.js
curl -s -o js\products.js https://raw.githubusercontent.com/GanxinOrchard/gonglaoping--/main/products.js

echo - cart.js
curl -s -o js\cart.js https://raw.githubusercontent.com/GanxinOrchard/gonglaoping--/main/cart.js

echo - checkout.js
curl -s -o js\checkout.js https://raw.githubusercontent.com/GanxinOrchard/gonglaoping--/main/checkout.js

echo - main.js
curl -s -o js\main.js https://raw.githubusercontent.com/GanxinOrchard/gonglaoping--/main/main.js

echo Done!
echo.

echo [3/4] Preparing index.html...
copy /Y index-github.html index.html >nul
echo Done!
echo.

echo [4/4] Uploading to GitHub...
git add .
git commit -m "Complete folder structure"
git push origin main --force

if %errorlevel% neq 0 (
    echo.
    echo ========================================
    echo   Login Required
    echo ========================================
    echo.
    echo Please run: Google login script first
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Success!
echo ========================================
echo.
echo Website: https://ganxinorchard.github.io/gonglaoping--/
echo Wait 1-2 minutes then refresh!
echo.
pause
