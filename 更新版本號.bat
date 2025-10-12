@echo off
chcp 65001 >nul
echo 🔄 正在自動更新版本號並清除快取...
echo.

powershell -ExecutionPolicy Bypass -File "update-version.ps1"

echo.
echo 📦 正在提交更改...
git add .
git commit -m "自動更新版本號：清除瀏覽器快取"

echo.
echo 🚀 正在推送到 GitHub...
git push origin main

echo.
echo ✅ 完成！版本號已更新，快取已清除
pause
