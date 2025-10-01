@echo off
echo ========================================
echo   Ganxin Orchard - Quick Upload
echo ========================================
echo.

echo [1/5] Preparing files...
copy /Y index-github.html index.html >nul 2>&1
echo Done
echo.

echo [2/5] Checking Git...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Git not installed!
    pause
    exit /b 1
)
echo Git OK
echo.

echo [3/5] Initializing Git...
if not exist ".git" (
    git init
    echo Git initialized
) else (
    echo Git already initialized
)
echo.

echo [4/5] Setting up repository...
git remote remove origin >nul 2>&1
git remote add origin https://github.com/GanxinOrchard/gonglaoping.git
echo Repository: https://github.com/GanxinOrchard/gonglaoping
echo.

echo [5/5] Uploading to GitHub...
git add .
git commit -m "Ganxin Orchard E-commerce Platform - Complete Version"
git branch -M main
git push -u origin main --force

if %errorlevel% neq 0 (
    echo.
    echo Upload failed!
    echo Please check your GitHub login
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Upload Success!
echo ========================================
echo.
echo Your website: https://ganxinorchard.github.io/gonglaoping/
echo.
echo Next steps:
echo 1. Go to: https://github.com/GanxinOrchard/gonglaoping
echo 2. Click Settings - Pages
echo 3. Source: select main branch
echo 4. Save and wait 1-2 minutes
echo.
pause
