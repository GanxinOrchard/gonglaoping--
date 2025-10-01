@echo off
echo ========================================
echo   Complete Upload
echo ========================================
echo.

echo Uploading all updates...
git add .
git commit -m "Complete: mobile optimization, spec selection, news and knowledge pages"
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
echo Completed Features:
echo - Mobile optimization
echo - Product spec selection (23A/25A/27A/30A)
echo - Season timeline with orange emoji
echo - News page (news.html)
echo - Knowledge page (knowledge.html)
echo - About page (about.html)
echo - Backend code (backend-code.gs)
echo - Orange cart background
echo - Sales count display
echo - 100 reviews system
echo - All responsive design
echo.
echo Website: https://ganxinorchard.github.io/gonglaoping--/
echo.
echo Backend file: backend-code.gs
echo (Please copy to Google Apps Script manually)
echo.
pause
