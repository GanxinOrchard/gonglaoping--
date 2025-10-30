@echo off
chcp 65001 >nul
echo ═══════════════════════════════════════
echo   專案檔案整理工具
echo ═══════════════════════════════════════
echo.

REM 創建文檔資料夾
if not exist "docs-archive" mkdir "docs-archive"
if not exist "scripts-temp" mkdir "scripts-temp"

echo ✓ 正在移動臨時文檔...

REM 移動所有臨時 markdown 檔案
move "about-html改造步驟.md" "docs-archive\" 2>nul
move "about-html改造狀態.md" "docs-archive\" 2>nul
move "about-html透明頁頭完成.md" "docs-archive\" 2>nul
move "style.css清理完成報告.md" "docs-archive\" 2>nul
move "手動修正about-最後方案.md" "docs-archive\" 2>nul
move "手機版頁頭尺寸調整.md" "docs-archive\" 2>nul
move "手機選單修正-最終版.md" "docs-archive\" 2>nul
move "手機選單修正完成.md" "docs-archive\" 2>nul
move "立即修正-about.md" "docs-archive\" 2>nul
move "修復完成報告.md" "docs-archive\" 2>nul
move "修復狀態報告-最終.md" "docs-archive\" 2>nul
move "最終修復報告.md" "docs-archive\" 2>nul
move "最終修復指南-剩餘2檔案.md" "docs-archive\" 2>nul
move "最終修正-完整版.md" "docs-archive\" 2>nul
move "最終方案-使用指南.md" "docs-archive\" 2>nul
move "測試404-清除快取.md" "docs-archive\" 2>nul
move "統一化管理-修正完成.md" "docs-archive\" 2>nul
move "統一化管理-完成報告.md" "docs-archive\" 2>nul
move "統一化管理-最終修正.md" "docs-archive\" 2>nul
move "網站統一樣式修復報告.md" "docs-archive\" 2>nul
move "方案2執行完成-測試指南.md" "docs-archive\" 2>nul
move "封面統一管理建議.md" "docs-archive\" 2>nul
move "簡單3步驟修正about.txt" "docs-archive\" 2>nul
move "about改造完成版.html" "docs-archive\" 2>nul
move "頁頭跑版修正完成.md" "docs-archive\" 2>nul

REM 移動臨時腳本
for %%f in (*.ps1) do move "%%f" "scripts-temp\" 2>nul
for %%f in (*.py) do move "%%f" "scripts-temp\" 2>nul
for %%f in (*.js) do move "%%f" "scripts-temp\" 2>nul
if exist "convert-about.py" move "convert-about.py" "scripts-temp\" 2>nul

REM 移動備份檔案
if not exist "backups" mkdir "backups"
for %%f in (*.backup) do move "%%f" "backups\" 2>nul
for %%f in (*.old) do move "%%f" "backups\" 2>nul

echo.
echo ═══════════════════════════════════════
echo   整理完成！
echo ═══════════════════════════════════════
echo.
echo 已創建：
echo   • docs-archive\     - 臨時文檔
echo   • scripts-temp\     - 臨時腳本
echo   • backups\          - 備份檔案
echo.
echo 保留的重要檔案：
echo   • README.md
echo   • 網站全面重構計畫.md
echo   • 執行重構-完整指南.md
echo.
pause
