@echo off
chcp 65001 >nul
echo ========================================
echo   柑心果園 - 一鍵上傳到 GitHub
echo ========================================
echo.

REM 先複製修正版的 index.html
echo [1/6] 準備檔案...
copy /Y index-github.html index.html >nul 2>&1
echo ✓ 檔案已準備完成
echo.

REM 檢查 Git 是否安裝
echo [2/6] 檢查 Git...
git --version >nul 2>&1
if errorlevel 1 (
    echo ✗ 尚未安裝 Git
    echo.
    echo 請先安裝 Git:
    echo 1. 前往 https://git-scm.com/download/win
    echo 2. 下載並安裝（全部選預設選項）
    echo 3. 安裝完成後重新執行此腳本
    echo.
    pause
    exit /b 1
)
echo ✓ Git 已安裝
echo.

REM 初始化 Git（如果需要）
echo [3/6] 初始化 Git Repository...
if not exist ".git" (
    git init
    echo ✓ Git Repository 已初始化
) else (
    echo ✓ Git Repository 已存在
)
echo.

REM 詢問 Repository URL
echo [4/6] 設定 GitHub Repository
echo.
echo 請輸入你的 GitHub Repository URL
echo 格式範例: https://github.com/GanxinOrchard/ganxin-orchard.git
echo.
set /p REPO_URL="請貼上 URL: "

if "%REPO_URL%"=="" (
    echo ✗ URL 不能為空
    pause
    exit /b 1
)

REM 移除舊的 origin（如果存在）
git remote remove origin >nul 2>&1

REM 設定新的 origin
git remote add origin %REPO_URL%
echo ✓ Repository 已設定
echo.

REM 加入所有檔案
echo [5/6] 加入檔案...
git add .
echo ✓ 檔案已加入
echo.

REM 提交
echo [6/6] 提交並上傳...
git commit -m "柑心果園電商平台 - 完整版本"
git branch -M main
git push -u origin main

if errorlevel 1 (
    echo.
    echo ✗ 上傳失敗
    echo.
    echo 可能原因：
    echo 1. Repository URL 不正確
    echo 2. 需要登入 GitHub
    echo 3. 沒有權限
    echo.
    echo 請檢查後重新執行
    pause
    exit /b 1
)

echo.
echo ========================================
echo   ✓ 上傳成功！
echo ========================================
echo.
echo 你的網站將在 1-2 分鐘後上線
echo.
echo 如果 Repository 名稱是 ganxin-orchard
echo 網址會是: https://ganxinorchard.github.io/ganxin-orchard/
echo.
echo 接下來請：
echo 1. 前往 GitHub Repository
echo 2. 點選 Settings → Pages
echo 3. Source 選擇 main 分支
echo 4. 儲存後等待網站上線
echo.
pause
