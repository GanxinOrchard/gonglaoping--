# Add menu enhancement to all HTML pages
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

$cssLink = '    <link rel="stylesheet" href="./css/menu-enhancement.css?v=20250110">'
$jsScript = '    <script src="./js/menu-enhancement.js?v=20250110" defer></script>'

foreach ($file in $htmlFiles) {
    if (Test-Path $file) {
        Write-Host "Processing: $file"
        
        $content = Get-Content $file -Raw -Encoding UTF8
        
        # Check if menu enhancement already exists
        if ($content -notmatch "menu-enhancement\.css") {
            # Find the position to insert (after content-protection.js or before main.js)
            if ($content -match "(\s*<script src=.*content-protection\.js.*?>\s*</script>)") {
                $replacement = $matches[1] + "`n" + $cssLink + "`n" + $jsScript
                $content = $content -replace [regex]::Escape($matches[1]), $replacement
                
                Set-Content $file -Value $content -Encoding UTF8
                Write-Host "Added menu enhancement to: $file"
            } elseif ($content -match "(\s*<script src=.*main\.js.*?>\s*</script>)") {
                $replacement = $cssLink + "`n" + $jsScript + "`n" + $matches[1]
                $content = $content -replace [regex]::Escape($matches[1]), $replacement
                
                Set-Content $file -Value $content -Encoding UTF8
                Write-Host "Added menu enhancement to: $file"
            } else {
                Write-Host "No suitable insertion point found in: $file"
            }
        } else {
            Write-Host "Menu enhancement already exists in: $file"
        }
    } else {
        Write-Host "File not found: $file"
    }
}

Write-Host "Menu enhancement added successfully!"

