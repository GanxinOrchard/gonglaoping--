@echo off
chcp 65001 >nul
echo ==========================================
echo   圖片壓縮工具
echo ==========================================
echo.

REM 檢查 Node.js
where node >nul 2>&1
if errorlevel 1 (
    echo ❌ 找不到 Node.js
    echo 請先安裝 Node.js
    pause
    exit /b 1
)

echo ✓ Node.js 已安裝
echo.

REM 檢查 sharp 是否已安裝
echo 正在檢查 sharp 套件...
node -e "require('sharp')" >nul 2>&1
if errorlevel 1 (
    echo.
    echo ⚠️  Sharp 套件尚未安裝
    echo.
    echo 是否要安裝 Sharp？這可能需要幾分鐘...
    echo 按任意鍵繼續，或關閉視窗取消
    pause >nul
    
    echo.
    echo 正在安裝 sharp...
    call npm install sharp
    
    if errorlevel 1 (
        echo.
        echo ❌ 安裝失敗
        echo 請手動執行：npm install sharp
        pause
        exit /b 1
    )
    
    echo.
    echo ✓ Sharp 安裝完成！
)

echo.
echo ==========================================
echo   開始壓縮圖片
echo ==========================================
echo.
echo ⚠️  警告：
echo   - 原始圖片會被壓縮版本取代
echo   - 原始檔案會備份到 backup 資料夾
echo   - 壓縮品質設為 80%%
echo   - 圖片會縮小到最大 1920x1920
echo.
echo 按任意鍵開始，或關閉視窗取消
pause >nul

echo.
node compress-images-with-sharp.js

echo.
echo ==========================================
echo   完成！
echo ==========================================
echo.
pause
