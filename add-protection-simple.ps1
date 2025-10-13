# Add content protection to HTML files
$htmlFiles = @(
    "index.html", "about.html", "cart.html", "checkout.html", "confirm.html",
    "contact.html", "farming.html", "grading.html", "guide.html", "knowledge.html",
    "knowledge-detail.html", "linepay.html", "linepay-confirm.html", "news.html",
    "news-detail.html", "order-complete.html", "order-tracking.html", "policies.html",
    "product-detail.html", "products.html", "season.html", "404.html", "force-update.html",
    "grading-murcott.html", "grading-ponkan.html", "grading-taro.html", "grading-water-chestnut.html",
    "guide-murcott.html", "guide-ponkan.html", "guide-taro.html", "guide-water-chestnut.html",
    "season-murcott.html", "season-ponkan.html", "season-recommend.html", "season-taro.html", "season-water-chestnut.html"
)

$protectionScript = '    <script src="./js/content-protection.js?v=20250110" defer></script>'

foreach ($file in $htmlFiles) {
    if (Test-Path $file) {
        Write-Host "Processing: $file"
        
        $content = Get-Content $file -Raw -Encoding UTF8
        
        if ($content -notmatch "content-protection\.js") {
            if ($content -match "(\s*<script src=.*main\.js.*?>\s*</script>)") {
                $replacement = $protectionScript + "`n" + $matches[1]
                $content = $content -replace [regex]::Escape($matches[1]), $replacement
                
                Set-Content $file -Value $content -Encoding UTF8
                Write-Host "Added protection to: $file"
            } else {
                Write-Host "No main.js found in: $file"
            }
        } else {
            Write-Host "Protection already exists in: $file"
        }
    } else {
        Write-Host "File not found: $file"
    }
}

Write-Host "Content protection added successfully!"
