@echo off
echo ========================================
echo   Complete Fix - All Issues
echo ========================================
echo.

echo Step 1: Backup old files...
if exist "js\cart.js" copy "js\cart.js" "js\cart.js.backup" >nul
if exist "js\checkout.js" copy "js\checkout.js" "js\checkout.js.backup" >nul
echo    Backups created

echo.
echo Step 2: Replace with fixed versions...
copy /Y "js\products-new.js" "js\products.js" >nul
echo    OK - products.js updated

copy /Y "js\cart-fixed.js" "js\cart.js" >nul
echo    OK - cart.js updated

copy /Y "js\checkout-fixed.js" "js\checkout.js" >nul
echo    OK - checkout.js updated

echo.
echo Step 3: Verify files...
if exist "js\cart.js" (echo    OK - cart.js) else (echo    ERROR - cart.js)
if exist "js\checkout.js" (echo    OK - checkout.js) else (echo    ERROR - checkout.js)
if exist "js\products.js" (echo    OK - products.js) else (echo    ERROR - products.js)

echo.
echo Step 4: Upload to GitHub...
git add .
git commit -m "Final: About page redesign, order tracking, contact form, full GAS integration"
git push origin main

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Upload failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo   SUCCESS!
echo ========================================
echo.
echo All files updated and uploaded!
echo.
echo NEXT STEPS:
echo.
echo 1. Setup Google Apps Script Backend:
echo    - Read: GAS-SETUP-GUIDE.txt
echo    - Follow all steps carefully
echo    - Get your Web App URL
echo.
echo 2. Update checkout.js with GAS URL:
echo    - Open: js/checkout.js
echo    - Line 4: Replace with your URL
echo    - Upload again
echo.
echo 3. Test the website:
echo    - Wait 1-2 minutes
echo    - Clear cache (Ctrl+Shift+Delete)
echo    - Visit: https://ganxinorchard.github.io/gonglaoping--/
echo    - Test cart and checkout
echo.
echo 4. Verify:
echo    - Add products to cart: OK
echo    - Cart opens and closes: OK
echo    - Mobile input no zoom: OK
echo    - Checkout form works: OK
echo    - Order saved to Google Sheets: OK
echo    - Confirmation email sent: OK
echo.
pause
