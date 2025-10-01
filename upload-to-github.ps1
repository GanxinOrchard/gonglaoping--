# 柑心果園 - GitHub 上傳腳本
# 執行前請確保已安裝 Git

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  柑心果園 - GitHub 上傳工具" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 檢查 Git 是否已安裝
try {
    $gitVersion = git --version
    Write-Host "✓ Git 已安裝: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ 錯誤: 未安裝 Git" -ForegroundColor Red
    Write-Host "請先安裝 Git: https://git-scm.com/download/win" -ForegroundColor Yellow
    pause
    exit
}

Write-Host ""
Write-Host "請選擇操作：" -ForegroundColor Yellow
Write-Host "1. 建立新的 GitHub Repository 並上傳"
Write-Host "2. 上傳到現有的 GitHub Repository"
Write-Host ""

$choice = Read-Host "請輸入選項 (1 或 2)"

if ($choice -eq "1") {
    Write-Host ""
    Write-Host "=== 建立新的 Repository ===" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "步驟 1: 請先到 GitHub 建立新的 Repository" -ForegroundColor Yellow
    Write-Host "網址: https://github.com/new" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "建議設定：" -ForegroundColor Yellow
    Write-Host "  - Repository name: ganxin-orchard" -ForegroundColor White
    Write-Host "  - Description: 柑心果園農產品電商平台" -ForegroundColor White
    Write-Host "  - Public 或 Private (依需求選擇)" -ForegroundColor White
    Write-Host "  - 不要勾選 'Add a README file'" -ForegroundColor White
    Write-Host ""
    
    $continue = Read-Host "已在 GitHub 建立好 Repository 了嗎? (y/n)"
    
    if ($continue -ne "y") {
        Write-Host "請先建立 Repository 後再執行此腳本" -ForegroundColor Yellow
        pause
        exit
    }
}

Write-Host ""
$repoUrl = Read-Host "請輸入你的 GitHub Repository URL (例如: https://github.com/username/ganxin-orchard.git)"

if ([string]::IsNullOrWhiteSpace($repoUrl)) {
    Write-Host "✗ 錯誤: Repository URL 不能為空" -ForegroundColor Red
    pause
    exit
}

Write-Host ""
Write-Host "=== 開始上傳到 GitHub ===" -ForegroundColor Cyan
Write-Host ""

# 初始化 Git (如果尚未初始化)
if (-not (Test-Path ".git")) {
    Write-Host "→ 初始化 Git Repository..." -ForegroundColor Yellow
    git init
    Write-Host "✓ Git Repository 已初始化" -ForegroundColor Green
} else {
    Write-Host "✓ Git Repository 已存在" -ForegroundColor Green
}

# 建立 .gitignore
Write-Host ""
Write-Host "→ 建立 .gitignore 檔案..." -ForegroundColor Yellow
$gitignore = @"
# 系統檔案
.DS_Store
Thumbs.db
desktop.ini

# 編輯器
.vscode/
.idea/
*.swp
*.swo
*~

# 暫存檔
*.tmp
*.bak
*.log

# Node modules (如果未來需要)
node_modules/
package-lock.json

# 環境變數
.env
.env.local
"@

$gitignore | Out-File -FilePath ".gitignore" -Encoding UTF8
Write-Host "✓ .gitignore 已建立" -ForegroundColor Green

# 加入所有檔案
Write-Host ""
Write-Host "→ 加入所有檔案到 Git..." -ForegroundColor Yellow
git add .
Write-Host "✓ 檔案已加入" -ForegroundColor Green

# 提交
Write-Host ""
Write-Host "→ 提交變更..." -ForegroundColor Yellow
git commit -m "Initial commit: 柑心果園電商平台

- 完整的響應式網頁設計
- 購物車功能
- 折扣碼系統
- Google Sheets 後端整合
- LINE Pay 支付功能架構
- 橘色品牌主題設計"

Write-Host "✓ 變更已提交" -ForegroundColor Green

# 設定遠端 Repository
Write-Host ""
Write-Host "→ 設定遠端 Repository..." -ForegroundColor Yellow

# 檢查是否已有 origin
$hasOrigin = git remote | Select-String "origin"

if ($hasOrigin) {
    Write-Host "  移除舊的 origin..." -ForegroundColor Yellow
    git remote remove origin
}

git remote add origin $repoUrl
Write-Host "✓ 遠端 Repository 已設定" -ForegroundColor Green

# 推送到 GitHub
Write-Host ""
Write-Host "→ 推送到 GitHub..." -ForegroundColor Yellow
Write-Host "  (如果需要登入，請在彈出的視窗中輸入 GitHub 帳號密碼)" -ForegroundColor Cyan
Write-Host ""

try {
    git branch -M main
    git push -u origin main
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  ✓ 上傳成功！" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "你的專案已成功上傳到 GitHub！" -ForegroundColor Green
    Write-Host ""
    Write-Host "Repository URL:" -ForegroundColor Cyan
    Write-Host $repoUrl -ForegroundColor White
    Write-Host ""
    Write-Host "下一步建議：" -ForegroundColor Yellow
    Write-Host "1. 到 GitHub 查看你的專案" -ForegroundColor White
    Write-Host "2. 啟用 GitHub Pages 來免費託管網站" -ForegroundColor White
    Write-Host "3. 設定 Google Sheets API" -ForegroundColor White
    Write-Host ""
    
} catch {
    Write-Host ""
    Write-Host "✗ 上傳失敗" -ForegroundColor Red
    Write-Host "錯誤訊息: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "可能的原因：" -ForegroundColor Yellow
    Write-Host "1. Repository URL 不正確" -ForegroundColor White
    Write-Host "2. 沒有權限存取此 Repository" -ForegroundColor White
    Write-Host "3. 需要先登入 GitHub" -ForegroundColor White
    Write-Host ""
    Write-Host "請檢查後重新執行此腳本" -ForegroundColor Yellow
}

Write-Host ""
pause
