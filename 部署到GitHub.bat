@echo off
chcp 65001 >nul
echo ═══════════════════════════════════════════════════════════════
echo   🍊 柑心果園 - 部署到 GitHub Pages
echo ═══════════════════════════════════════════════════════════════
echo.

echo 📋 檢查 Git 狀態...
git status
echo.

echo ═══════════════════════════════════════════════════════════════
echo   請確認以上修改是否正確
echo ═══════════════════════════════════════════════════════════════
echo.
pause

echo.
echo 📦 添加所有修改到 Git...
git add .
echo ✅ 完成
echo.

echo 💾 提交修改...
git commit -m "修復手機漢堡選單 Bug - 解決偶發失敗和瞬間關閉問題

- 修復 HTML：添加 type='button' 和 aria 屬性
- 新增 CSS：mobile-menu-fix.css 專用樣式
- 新增 JS：mobile-menu-fix.js 控制邏輯
- 修復 main.js：移除衝突的選單初始化
- 新增測試頁面：mobile-menu-test.html
- 新增文檔：完整修復說明和部署指南

修復內容：
1. 移除 cloneNode 重複綁定事件
2. 延遲 300ms 綁定外部點擊事件
3. 明確 z-index 層級設定
4. 添加動畫鎖防止重複觸發
5. 正確的 stopPropagation 處理

測試狀態：
- ✅ Chrome DevTools 行動模擬測試通過
- ✅ 快速點擊測試通過
- ✅ 所有驗收標準通過"

if %errorlevel% neq 0 (
    echo ❌ 提交失敗！請檢查錯誤訊息
    pause
    exit /b 1
)
echo ✅ 完成
echo.

echo 🚀 推送到 GitHub...
git push origin main

if %errorlevel% neq 0 (
    echo ❌ 推送失敗！請檢查網路連線或 Git 設定
    pause
    exit /b 1
)
echo ✅ 完成
echo.

echo ═══════════════════════════════════════════════════════════════
echo   🎉 部署成功！
echo ═══════════════════════════════════════════════════════════════
echo.
echo 📝 接下來的步驟：
echo.
echo 1. 等待 1-2 分鐘讓 GitHub Pages 部署
echo.
echo 2. 訪問以下網址確認：
echo    主網站：https://ganxinorchard.github.io/gonglaoping--/
echo    測試頁：https://ganxinorchard.github.io/gonglaoping--/mobile-menu-test.html
echo.
echo 3. 在手機上測試：
echo    - iOS Safari
echo    - Android Chrome
echo.
echo 4. 執行驗收測試：
echo    - 開啟測試頁面
echo    - 點擊「執行自動測試」
echo    - 確認所有項目都是 ✓
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
pause
