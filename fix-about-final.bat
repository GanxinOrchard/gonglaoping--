@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ═══════════════════════════════════════
echo   自動修正 about.html
echo ═══════════════════════════════════════
echo.

REM 備份原始檔案
echo [1/3] 備份原始檔案...
copy /Y about.html about.html.backup-auto >nul 2>&1
if errorlevel 1 (
    echo ❌ 備份失敗！
    pause
    exit /b 1
)
echo ✓ 已備份到 about.html.backup-auto

REM 使用 PowerShell 進行文字替換
echo.
echo [2/3] 修正檔案內容...

powershell -NoProfile -ExecutionPolicy Bypass -Command "$content = [System.IO.File]::ReadAllText('about.html', [System.Text.Encoding]::UTF8); $pattern = '(?s)(<body>\s*)<!-- 主要導覽列 -->.*?(?=<!-- 主要內容 -->)'; $replacement = '$1<!-- 統一頁頭 -->`r`n    <div id=\"header-container\"></div>`r`n    `r`n    <!-- 手機選單 -->`r`n    <div id=\"mobile-menu-container\"></div>`r`n`r`n    '; $newContent = $content -replace $pattern, $replacement; [System.IO.File]::WriteAllText('about.html', $newContent, [System.Text.Encoding]::UTF8)"

if errorlevel 1 (
    echo ❌ 修正失敗！
    echo 正在還原備份...
    copy /Y about.html.backup-auto about.html >nul 2>&1
    pause
    exit /b 1
)

echo ✓ 檔案已修正

REM 驗證修正
echo.
echo [3/3] 驗證修正結果...
findstr /C:"<div id=\"header-container\"></div>" about.html >nul 2>&1
if errorlevel 1 (
    echo ❌ 驗證失敗！檔案可能未正確修正
    echo 正在還原備份...
    copy /Y about.html.backup-auto about.html >nul 2>&1
    pause
    exit /b 1
)

echo ✓ 驗證通過

echo.
echo ═══════════════════════════════════════
echo   ✅ 修正完成！
echo ═══════════════════════════════════════
echo.
echo 已完成：
echo   • 刪除舊的 header 和選單內容
echo   • 添加統一頁頭容器
echo   • 添加手機選單容器
echo.
echo 備份位置：about.html.backup-auto
echo.
echo 請按 Ctrl + Shift + R 測試頁面！
echo.
pause
