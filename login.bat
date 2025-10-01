@echo off
echo ========================================
echo   Clear and Re-login
echo ========================================
echo.

echo Clearing credentials...
git credential-manager erase https://github.com 2>nul
cmdkey /delete:LegacyGeneric:target=git:https://github.com 2>nul
echo Done!
echo.

echo Configuring Git...
git config --global credential.helper manager-core
echo Done!
echo.

echo ========================================
echo   Now run: rebuild.bat
echo ========================================
echo.
echo Browser will open for login
echo Use Google account: s9000721@gmail.com
echo.
pause
