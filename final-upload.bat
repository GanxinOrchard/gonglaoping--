@echo off
echo ========================================
echo   Final Upload - All Features
echo ========================================
echo.

echo Uploading all files...
git add .
git commit -m "Add product detail page, bank transfer, contact info update"
git push origin main

if %errorlevel% neq 0 (
    echo.
    echo Login required!
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Complete!
echo ========================================
echo.
echo New Features:
echo - Product detail page (click product to view)
echo - Bank transfer payment option
echo - Contact info updated (0933-721-978)
echo - Form field descriptions added
echo - All pages ready
echo.
echo Website: https://ganxinorchard.github.io/gonglaoping--/
echo.
pause
