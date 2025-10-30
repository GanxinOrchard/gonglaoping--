@echo off
chcp 65001 >nul
echo ==========================================
echo   柑心果園 - 網站部署工具
echo ==========================================
echo.

REM 檢查 Node.js
where node >nul 2>&1
if errorlevel 1 (
    echo ❌ 找不到 Node.js
    echo 請先安裝 Node.js: https://nodejs.org/
    pause
    exit /b 1
)

echo ✓ Node.js 已安裝
echo.

REM 檢查 Netlify CLI
netlify --version >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Netlify CLI 尚未安裝
    echo.
    echo 正在安裝 Netlify CLI...
    echo 這可能需要幾分鐘...
    echo.
    
    call npm install -g netlify-cli
    
    if errorlevel 1 (
        echo.
        echo ❌ 安裝失敗
        echo.
        echo 請手動執行以下命令：
        echo npm install -g netlify-cli
        echo.
        pause
        exit /b 1
    )
    
    echo.
    echo ✓ Netlify CLI 安裝完成！
)

echo.
echo ==========================================
echo   開始部署
echo ==========================================
echo.
echo 📝 部署資訊：
echo   - 網站名稱: 柑心果園
echo   - 框架: 靜態網站
echo   - 發布目錄: . (當前目錄)
echo.

REM 首次部署需要登入
echo 🔐 步驟 1/2：登入 Netlify
echo.
echo 瀏覽器將會開啟登入頁面...
echo 請在瀏覽器中授權後返回此處
echo.
pause

call netlify login

if errorlevel 1 (
    echo.
    echo ❌ 登入失敗
    pause
    exit /b 1
)

echo.
echo ✓ 登入成功！
echo.

REM 部署網站
echo 🚀 步驟 2/2：部署網站
echo.
echo 正在上傳檔案...
echo.

call netlify deploy --prod --dir=. --site-name=ganxin-orchard

if errorlevel 1 (
    echo.
    echo ⚠️  使用預設網站名稱可能已被使用
    echo 嘗試自動生成網站名稱...
    echo.
    
    call netlify deploy --prod --dir=.
)

echo.
echo ==========================================
echo   部署完成！
echo ==========================================
echo.
echo 🎉 您的網站已成功上線！
echo.
echo 📋 下次更新網站時：
echo    直接執行此批次檔即可快速部署
echo.
echo 🌐 查看網站：
call netlify open:site
echo.
pause
