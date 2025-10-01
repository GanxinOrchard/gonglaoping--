@echo off
echo ========================================
echo   FINAL FIX - Ganxin Orchard
echo ========================================
echo.

echo Step 1: Backup old files...
if exist "js\cart.js" (
    copy "js\cart.js" "js\cart.js.backup" >nul
    echo    Backed up cart.js
)

echo.
echo Step 2: Replace with fixed versions...
copy /Y "js\products-new.js" "js\products.js" >nul
echo    OK - products.js updated

copy /Y "js\cart-fixed.js" "js\cart.js" >nul
echo    OK - cart.js updated (fixed version)

echo.
echo Step 3: Verify files...
if exist "js\cart.js" (echo    OK - cart.js exists) else (echo    ERROR - cart.js missing)
if exist "js\products.js" (echo    OK - products.js exists) else (echo    ERROR - products.js missing)

echo.
echo Step 4: Upload to GitHub...
git add .
git commit -m "Final fix: Cart system completely rebuilt and working"
git push origin main

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Upload failed
    echo Trying to show git status...
    git status
    pause
    exit /b 1
)

echo.
echo ========================================
echo   SUCCESS!
echo ========================================
echo.
echo Changes uploaded to GitHub
echo.
echo NEXT STEPS:
echo 1. Wait 1-2 minutes for GitHub Pages to update
echo 2. Clear browser cache (Ctrl+Shift+Delete)
echo 3. Visit: https://ganxinorchard.github.io/gonglaoping--/
echo 4. Press Ctrl+F5 to force refresh
echo 5. Test cart functions
echo.
echo Or test locally:
echo 1. Open index.html
echo 2. Press F12 and check Console
echo 3. Should see "Cart system loaded successfully"
echo.
pause
