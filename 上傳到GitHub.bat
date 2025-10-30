@echo off
chcp 65001 >nul
echo ==========================================
echo   柑心果園 - GitHub 上傳工具
echo ==========================================
echo.

REM 檢查 Git
where git >nul 2>&1
if errorlevel 1 (
    echo ❌ 找不到 Git
    echo 請先安裝 Git: https://git-scm.com/
    pause
    exit /b 1
)

echo ✓ Git 已安裝
echo.

echo ==========================================
echo   步驟 1/4：添加檔案
echo ==========================================
echo.
echo 正在添加所有檔案到 Git...

git add .

if errorlevel 1 (
    echo ❌ 添加檔案失敗
    pause
    exit /b 1
)

echo ✓ 檔案已添加
echo.

echo ==========================================
echo   步驟 2/4：提交更改
echo ==========================================
echo.

REM 檢查是否有更改
git diff --cached --quiet
if not errorlevel 1 (
    echo ⚠️  沒有新的更改需要提交
    echo 所有檔案都是最新的
) else (
    echo 請輸入提交訊息（例如：更新網站內容）：
    set /p commit_msg=

    if "%commit_msg%"=="" (
        set commit_msg=更新網站
    )

    git commit -m "%commit_msg%"

    if errorlevel 1 (
        echo ❌ 提交失敗
        pause
        exit /b 1
    )

    echo ✓ 提交成功
)

echo.

echo ==========================================
echo   步驟 3/4：設定遠端儲存庫
echo ==========================================
echo.

REM 檢查是否已設定遠端
git remote -v | findstr origin >nul 2>&1
if errorlevel 1 (
    echo ⚠️  尚未設定 GitHub 遠端儲存庫
    echo.
    echo 📝 請先在 GitHub 建立新的 repository：
    echo    1. 前往 https://github.com/new
    echo    2. Repository 名稱：ganxin-orchard
    echo    3. 設為 Public（公開）
    echo    4. 不要勾選任何初始化選項
    echo    5. 點擊 Create repository
    echo.
    echo 建立完成後，請輸入 GitHub repository 的網址：
    echo 格式：https://github.com/你的帳號/ganxin-orchard.git
    echo.
    set /p repo_url=

    if "%repo_url%"=="" (
        echo ❌ 未輸入網址
        pause
        exit /b 1
    )

    git remote add origin %repo_url%

    if errorlevel 1 (
        echo ❌ 設定遠端失敗
        pause
        exit /b 1
    )

    echo ✓ 遠端儲存庫已設定
) else (
    echo ✓ 遠端儲存庫已設定
    git remote -v
)

echo.

echo ==========================================
echo   步驟 4/4：推送到 GitHub
echo ==========================================
echo.
echo 正在推送到 GitHub...
echo.

REM 設定預設分支名稱為 main
git branch -M main

REM 推送到 GitHub
git push -u origin main

if errorlevel 1 (
    echo.
    echo ⚠️  推送失敗，可能需要身份驗證
    echo.
    echo 請確認：
    echo 1. GitHub 帳號密碼正確
    echo 2. 已設定 Personal Access Token
    echo.
    echo 如需設定 Token：
    echo 1. 前往 https://github.com/settings/tokens
    echo 2. Generate new token（classic）
    echo 3. 勾選 repo 權限
    echo 4. 複製 token
    echo 5. 推送時用 token 作為密碼
    echo.
    pause
    exit /b 1
)

echo.
echo ==========================================
echo   ✅ 上傳完成！
echo ==========================================
echo.
echo 🎉 您的網站已成功上傳到 GitHub！
echo.
echo 🌐 查看您的 repository：
git remote get-url origin
echo.
echo 📋 後續更新步驟：
echo    1. 修改檔案
echo    2. 執行此批次檔
echo    3. 輸入提交訊息
echo    4. 自動上傳
echo.
echo 🚀 啟用 GitHub Pages（讓網站上線）：
echo    1. 前往 repository 設定頁面
echo    2. 點擊 Settings → Pages
echo    3. Source 選擇 main branch
echo    4. 儲存後等待幾分鐘
echo    5. 網站網址：https://你的帳號.github.io/ganxin-orchard
echo.
pause
