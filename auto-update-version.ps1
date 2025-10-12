# 智能版本號更新腳本
# 檢測文件變化並自動更新版本號

param(
    [switch]$Force,  # 強制更新，即使沒有變化
    [string]$Message = "自動更新版本號：清除瀏覽器快取"
)

# 獲取當前時間戳作為版本號
$timestamp = Get-Date -Format "yyyyMMddHHmm"
$version = "v$timestamp"

Write-Host "🤖 智能版本號更新器" -ForegroundColor Cyan
Write-Host "版本號: $version" -ForegroundColor Green

# 檢查是否有未提交的更改
$gitStatus = git status --porcelain
if ($gitStatus -and -not $Force) {
    Write-Host "📝 檢測到未提交的更改，正在更新版本號..." -ForegroundColor Yellow
} elseif (-not $gitStatus -and -not $Force) {
    Write-Host "ℹ️  沒有檢測到更改，使用 -Force 參數強制更新" -ForegroundColor Gray
    exit 0
}

# 要更新的文件列表
$files = @(
    "index.html",
    "products.html", 
    "knowledge.html",
    "news.html",
    "cart.html",
    "checkout.html"
)

# 要替換的資源模式
$patterns = @(
    @{
        pattern = 'css/style\.css\?v=\d+'
        replacement = "css/style.css?v=$version"
    },
    @{
        pattern = 'css/mobile-menu-fix\.css\?v=\d+'
        replacement = "css/mobile-menu-fix.css?v=$version"
    },
    @{
        pattern = 'js/main\.js\?v=\d+'
        replacement = "js/main.js?v=$version"
    },
    @{
        pattern = 'js/products\.js\?v=\d+'
        replacement = "js/products.js?v=$version"
    },
    @{
        pattern = 'js/cart\.js\?v=\d+'
        replacement = "js/cart.js?v=$version"
    },
    @{
        pattern = 'js/mobile-menu-fix\.js\?v=\d+'
        replacement = "js/mobile-menu-fix.js?v=$version"
    },
    @{
        pattern = 'js/dropdown-menu\.js\?v=\d+'
        replacement = "js/dropdown-menu.js?v=$version"
    },
    @{
        pattern = 'js/orange-animation\.js\?v=\d+'
        replacement = "js/orange-animation.js?v=$version"
    },
    @{
        pattern = 'js/auto-sales\.js\?v=\d+'
        replacement = "js/auto-sales.js?v=$version"
    },
    @{
        pattern = 'js/checkout-new\.js\?v=\d+'
        replacement = "js/checkout-new.js?v=$version"
    }
)

$updatedFiles = @()

# 更新每個文件
foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw -Encoding UTF8
        $originalContent = $content
        
        # 應用所有模式替換
        foreach ($pattern in $patterns) {
            $content = $content -replace $pattern.pattern, $pattern.replacement
        }
        
        # 如果內容有變化，寫入文件
        if ($content -ne $originalContent) {
            Set-Content $file -Value $content -Encoding UTF8 -NoNewline
            $updatedFiles += $file
            Write-Host "✅ 已更新: $file" -ForegroundColor Green
        }
    }
}

if ($updatedFiles.Count -gt 0) {
    Write-Host "📦 正在提交更改..." -ForegroundColor Yellow
    git add .
    git commit -m $Message
    
    Write-Host "🚀 正在推送到 GitHub..." -ForegroundColor Yellow
    git push origin main
    
    Write-Host "🎉 完成！已更新 $($updatedFiles.Count) 個文件，版本號: $version" -ForegroundColor Green
} else {
    Write-Host "ℹ️  沒有文件需要更新" -ForegroundColor Gray
}
