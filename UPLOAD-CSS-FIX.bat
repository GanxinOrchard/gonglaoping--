@echo off
chcp 65001 >nul
echo ========================================
echo    柑心果園 - CSS 重構上傳
echo ========================================
echo.

echo [1/4] 檢查 Git 狀態...
git status
echo.

echo [2/4] 加入 CSS 檔案...
git add css/style.css
git add CSS-REFACTOR-COMPLETE.md
git add CSS-TEST.html
echo ✓ 檔案已加入
echo.

echo [3/4] 提交變更...
git commit -m "CSS重構完成：合併所有手機版樣式，解決樣式失效問題"
echo ✓ 提交完成
echo.

echo [4/4] 推送到 GitHub...
git push
echo ✓ 推送完成
echo.

echo ========================================
echo    CSS 重構上傳完成！
echo ========================================
echo.
echo 📋 已上傳檔案:
echo    - css/style.css (重構後的CSS)
echo    - CSS-REFACTOR-COMPLETE.md (重構報告)
echo    - CSS-TEST.html (測試頁面)
echo.
echo 🧪 測試網址:
echo    https://你的網址/CSS-TEST.html
echo.
echo 📝 重構內容:
echo    ✓ 移除 3 個重複的 @media 區塊
echo    ✓ 合併所有手機版樣式到統一區塊
echo    ✓ 修正樣式失效問題
echo    ✓ 優化 CSS 結構
echo.

pause
