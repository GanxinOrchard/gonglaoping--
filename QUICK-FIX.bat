@echo off
echo ========================================
echo   Quick Fix - Ganxin Orchard
echo ========================================
echo.

echo Fixing...
echo.

echo Step 1: Replace products.js...
if exist "js\products-new.js" (
    copy /Y "js\products-new.js" "js\products.js" >nul
    echo    OK - products.js updated
) else (
    echo    ERROR - products-new.js not found
)

echo.
echo Step 2: Check files...
if exist "js\cart.js" (echo    OK - cart.js) else (echo    ERROR - cart.js)
if exist "js\products.js" (echo    OK - products.js) else (echo    ERROR - products.js)
if exist "index.html" (echo    OK - index.html) else (echo    ERROR - index.html)

echo.
echo Step 3: Upload to GitHub...
git add .
git commit -m "Quick fix: Cart and products issues resolved"
git push origin main

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Upload failed!
    echo.
    echo Please check:
    echo 1. Internet connection
    echo 2. Git configuration
    echo 3. GitHub permissions
    pause
    exit /b 1
)

echo.
echo ========================================
echo   SUCCESS!
echo ========================================
echo.
echo Next steps:
echo 1. Open CLEAR-CACHE-AND-TEST.html
echo 2. Click "Clear All Cache"
echo 3. Press Ctrl+F5 to refresh
echo 4. Test cart functions
echo.
echo Or visit:
echo https://ganxinorchard.github.io/gonglaoping--/
echo.
echo Wait 1-2 minutes for GitHub Pages to update
echo.
pause
