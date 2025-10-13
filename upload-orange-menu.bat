@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   🍊 橘子風格選單 - 上傳到 GitHub
echo ========================================
echo.

echo [1/4] 檢查 Git 狀態...
git status
echo.

echo [2/4] 添加所有更改...
git add .
echo ✓ 文件已添加
echo.

echo [3/4] 提交更改...
git commit -m "🍊 Update: 橘子風格漢堡選單 - 移除傳統選單，改用創意橘子圖標"
echo ✓ 提交完成
echo.

echo [4/4] 推送到 GitHub...
git push origin main
echo.

if %errorlevel% equ 0 (
    echo ========================================
    echo   ✅ 上傳成功！
    echo ========================================
    echo.
    echo 📱 請等待 3-5 分鐘讓 GitHub Pages 部署
    echo 🌐 網站: https://ganxinorchard.github.io/gonglaoping--/
    echo 🧪 測試頁面: test-orange-menu.html
    echo.
) else (
    echo ========================================
    echo   ❌ 上傳失敗
    echo ========================================
    echo.
    echo 請檢查網路連線或 Git 設定
    echo.
)

pause
