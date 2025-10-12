# 自動更新版本號腳本
# 每次修改後運行此腳本來自動更新所有靜態資源的版本號

# 獲取當前時間戳作為版本號
$timestamp = Get-Date -Format "yyyyMMddHHmm"
$version = "v$timestamp"

Write-Host "🔄 正在更新版本號到: $version" -ForegroundColor Green

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

# 更新每個文件
foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "📝 正在更新: $file" -ForegroundColor Yellow
        
        $content = Get-Content $file -Raw -Encoding UTF8
        $originalContent = $content
        
        # 應用所有模式替換
        foreach ($pattern in $patterns) {
            $content = $content -replace $pattern.pattern, $pattern.replacement
        }
        
        # 如果內容有變化，寫入文件
        if ($content -ne $originalContent) {
            Set-Content $file -Value $content -Encoding UTF8 -NoNewline
            Write-Host "✅ 已更新: $file" -ForegroundColor Green
        } else {
            Write-Host "ℹ️  無需更新: $file" -ForegroundColor Gray
        }
    } else {
        Write-Host "❌ 文件不存在: $file" -ForegroundColor Red
    }
}

Write-Host "🎉 版本號更新完成！新版本: $version" -ForegroundColor Green
Write-Host "💡 現在可以提交並推送更改了" -ForegroundColor Cyan
