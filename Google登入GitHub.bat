@echo off
echo ========================================
echo   Setup GitHub with Google Account
echo ========================================
echo.

echo Step 1: Clear old credentials...
git credential-manager erase https://github.com 2>nul
cmdkey /delete:LegacyGeneric:target=git:https://github.com 2>nul
echo Done!
echo.

echo Step 2: Configure Git...
git config --global credential.helper manager-core
echo Done!
echo.

echo ========================================
echo   Now uploading...
echo ========================================
echo.
echo A browser window will open.
echo Please login with your Google account:
echo s9000721@gmail.com
echo.
pause

git add index.html
git commit -m "Fix file paths" 2>nul
git push origin main

if %errorlevel% neq 0 (
    echo.
    echo ========================================
    echo   Login Required
    echo ========================================
    echo.
    echo Please follow these steps:
    echo.
    echo 1. Browser will open GitHub login page
    echo 2. Click "Sign in with Google"
    echo 3. Login with: s9000721@gmail.com
    echo 4. Authorize Git Credential Manager
    echo.
    echo Then this script will continue...
    echo.
    pause
    git push origin main
)

echo.
echo ========================================
echo   Success!
echo ========================================
echo.
echo Your website: https://ganxinorchard.github.io/gonglaoping--/
echo Wait 1 minute then refresh!
echo.
pause
