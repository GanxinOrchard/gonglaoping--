@echo off
chcp 65001 >nul
color 0A
echo ========================================
echo    徹底清除所有快取
echo ========================================
echo.

echo [1/4] 清除DNS快取...
ipconfig /flushdns
echo ✓ DNS快取已清除
echo.

echo [2/4] 清除Chrome瀏覽器快取...
echo 正在關閉Chrome...
taskkill /F /IM chrome.exe 2>nul
timeout /t 2 >nul

echo 清除快取資料夾...
rd /s /q "%LocalAppData%\Google\Chrome\User Data\Default\Cache" 2>nul
rd /s /q "%LocalAppData%\Google\Chrome\User Data\Default\Code Cache" 2>nul
echo ✓ Chrome快取已清除
echo.

echo [3/4] 清除Edge瀏覽器快取...
taskkill /F /IM msedge.exe 2>nul
timeout /t 2 >nul
rd /s /q "%LocalAppData%\Microsoft\Edge\User Data\Default\Cache" 2>nul
rd /s /q "%LocalAppData%\Microsoft\Edge\User Data\Default\Code Cache" 2>nul
echo ✓ Edge快取已清除
echo.

echo [4/4] 重置網路設定...
netsh winsock reset >nul
netsh int ip reset >nul
echo ✓ 網路設定已重置
echo.

echo ========================================
echo    清除完成！
echo ========================================
echo.
echo 請按照以下步驟：
echo 1. 重新啟動電腦（建議）
echo 2. 打開瀏覽器
echo 3. 使用無痕模式訪問：
echo    https://ganxinorchard.github.io/gonglaoping--/
echo.
echo 如果還是不行，請檢查GitHub Pages設置
echo （參考：检查GitHub设置.txt）
echo.
pause
