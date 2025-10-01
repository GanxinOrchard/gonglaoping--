@echo off
echo ========================================
echo   Complete All Updates
echo ========================================
echo.

echo Uploading...
git add .
git commit -m "All features: orange timeline, about page, mobile menu, knowledge button, 3 categories"
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
echo All Updates:
echo - Orange emoji timeline (green to orange)
echo - About page created
echo - Mobile hamburger menu fixed
echo - Knowledge button added to menu
echo - Categories: fruit, vegetable, frozen
echo - All responsive
echo.
echo Website: https://ganxinorchard.github.io/gonglaoping--/
echo About page: https://ganxinorchard.github.io/gonglaoping--/about.html
echo.
pause
