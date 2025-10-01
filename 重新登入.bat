@echo off
echo ========================================
echo   Clear Git Credentials
echo ========================================
echo.

echo Clearing saved credentials...
git credential-manager erase https://github.com
cmdkey /delete:LegacyGeneric:target=git:https://github.com

echo.
echo Done! Now run upload again.
echo You will be asked to login with GanxinOrchard account.
echo.
pause
