@echo off
chcp 65001 >nul
echo 🤖 智能版本號更新器
echo 正在檢測文件變化並自動更新版本號...
echo.

powershell -ExecutionPolicy Bypass -File "auto-update-version.ps1"

echo.
pause
