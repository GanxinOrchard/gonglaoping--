@echo off
echo ============================================
echo 清除瀏覽器快取和DNS快取
echo ============================================
echo.

echo 步驟1: 清除DNS快取...
ipconfig /flushdns
echo DNS快取已清除！
echo.

echo 步驟2: 清除Chrome瀏覽器快取...
echo 請手動執行以下步驟：
echo 1. 按 Ctrl + Shift + Delete
echo 2. 選擇「所有時間」
echo 3. 勾選：
echo    - 瀏覽記錄
echo    - Cookie和其他網站資料
echo    - 快取圖片和檔案
echo 4. 點擊「清除資料」
echo.

echo 步驟3: 關閉所有Chrome視窗後重新開啟
echo.

echo 完成後，請執行「打開網站.bat」測試
echo.
pause
