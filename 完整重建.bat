@echo off
chcp 65001 >nul
echo ========================================
echo   Complete Rebuild with Folder Structure
echo ========================================
echo.

echo [1/4] Creating folder structure...
if not exist "css" mkdir css
if not exist "js" mkdir js
if not exist "images" mkdir images
echo Done!
echo.

echo [2/4] Downloading files from GitHub...
echo Downloading style.css...
curl -s -o css\style.css https://raw.githubusercontent.com/GanxinOrchard/gonglaoping--/main/style.css

echo Downloading products.js...
curl -s -o js\products.js https://raw.githubusercontent.com/GanxinOrchard/gonglaoping--/main/products.js

echo Downloading cart.js...
curl -s -o js\cart.js https://raw.githubusercontent.com/GanxinOrchard/gonglaoping--/main/cart.js

echo Downloading checkout.js...
curl -s -o js\checkout.js https://raw.githubusercontent.com/GanxinOrchard/gonglaoping--/main/checkout.js

echo Downloading main.js...
curl -s -o js\main.js https://raw.githubusercontent.com/GanxinOrchard/gonglaoping--/main/main.js

echo Done!
echo.

echo [3/4] Using correct index.html...
copy /Y index-github.html index.html >nul
echo Done!
echo.

echo [4/4] Uploading to GitHub...
git add .
git commit -m "Complete folder structure with css and js folders"
git push origin main --force

if %errorlevel% neq 0 (
    echo.
    echo Upload failed! Please login with GanxinOrchard account.
    echo.
    echo Run Google登入GitHub.bat first, then run this again.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Success!
echo ========================================
echo.
echo Folder structure:
echo ganxin-orchard/
echo   - index.html
echo   - css/
echo       - style.css
echo   - js/
echo       - products.js
echo       - cart.js
echo       - checkout.js
echo       - main.js
echo.
echo Your website: https://ganxinorchard.github.io/gonglaoping--/
echo Wait 1-2 minutes then refresh!
echo.
pause
