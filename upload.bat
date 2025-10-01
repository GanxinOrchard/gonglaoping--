@echo off
echo ========================================
echo   Upload to GitHub
echo ========================================
echo.

echo [1/6] Preparing files...
copy /Y index-github.html index.html >nul 2>&1
echo Done
echo.

echo [2/6] Checking Git...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Git not installed!
    echo Please install Git from: https://git-scm.com/download/win
    pause
    exit /b 1
)
echo Git OK
echo.

echo [3/6] Initializing Git...
if not exist ".git" (
    git init
    echo Git initialized
) else (
    echo Git already initialized
)
echo.

echo [4/6] Setting up repository
echo.
echo Please enter your GitHub Repository URL
echo Example: https://github.com/GanxinOrchard/ganxin-orchard.git
echo.
set /p REPO_URL="URL: "

if "%REPO_URL%"=="" (
    echo URL cannot be empty!
    pause
    exit /b 1
)

git remote remove origin >nul 2>&1
git remote add origin %REPO_URL%
echo Repository set
echo.

echo [5/6] Adding files...
git add .
echo Files added
echo.

echo [6/6] Committing and pushing...
git commit -m "Ganxin Orchard E-commerce Platform"
git branch -M main
git push -u origin main

if %errorlevel% neq 0 (
    echo.
    echo Upload failed!
    echo Please check your URL and permissions
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Upload Success!
echo ========================================
echo.
echo Your website will be online in 1-2 minutes
echo.
echo Next steps:
echo 1. Go to GitHub Repository
echo 2. Click Settings - Pages
echo 3. Select main branch
echo 4. Save and wait
echo.
pause
