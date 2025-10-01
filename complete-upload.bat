@echo off
echo ========================================
echo   Complete Website Upload
echo ========================================
echo.

echo Uploading all updates...
git add .
git commit -m "Complete website: category buttons, carousel, news, knowledge sections"
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
echo New Features Added:
echo - Smaller category buttons with filtering
echo - Category product carousel with tabs
echo - News section (3 news cards)
echo - Knowledge section (3 articles)
echo - Product detail page
echo - Bank transfer payment
echo - All responsive design
echo.
echo Website: https://ganxinorchard.github.io/gonglaoping--/
echo.
pause
