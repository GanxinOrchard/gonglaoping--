@echo off
echo ========================================
echo   Final Complete Upload
echo ========================================
echo.

echo Uploading all updates...
git add .
git commit -m "Complete: mobile fix, intro card, season timeline, product detail button"
git push origin main

if %errorlevel% neq 0 (
    echo Upload failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Success!
echo ========================================
echo.
echo Updates:
echo - Mobile hero text fixed
echo - Login/Register removed
echo - Intro card added
echo - Season timeline added
echo - Product button changed to detail
echo - All responsive
echo.
echo Website: https://ganxinorchard.github.io/gonglaoping--/
echo.
pause
