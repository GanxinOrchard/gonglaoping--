@echo off
chcp 65001 >nul
echo ========================================
echo 柑心果園 - 本地開發伺服器
echo ========================================
echo.
echo 正在啟動伺服器...
echo.

cd /d "%~dp0"

echo 伺服器網址：http://localhost:8080
echo.
echo 請在瀏覽器中開啟以下網址測試：
echo   - http://localhost:8080/test-template.html
echo   - http://localhost:8080/404.html
echo   - http://localhost:8080/index.html
echo.
echo 按 Ctrl + C 可停止伺服器
echo ========================================
echo.

python -m http.server 8080

pause
