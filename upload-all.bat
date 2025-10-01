@echo off
echo ========================================
echo   Upload Complete Website
echo ========================================
echo.

echo Preparing index.html...
copy /Y index.html index.html >nul
echo Done!
echo.

echo Uploading everything to GitHub...
git add .
git commit -m "Complete website with announcement bar and product images"
git push origin main

if %errorlevel% neq 0 (
    echo.
    echo Login required!
    echo Run: login.bat first
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Success!
echo ========================================
echo.
echo Updates:
echo - Announcement bar added
echo - Hero image updated
echo - 3 products with your images
echo - Original website style integrated
echo.
echo Website: https://ganxinorchard.github.io/gonglaoping--/
echo Wait 1-2 minutes then refresh!
echo.
pause
