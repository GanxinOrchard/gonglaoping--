# Simple script to remove components from all pages except index.html

Write-Host "Starting component removal..." -ForegroundColor Green

# Get all HTML files except index.html
$htmlFiles = Get-ChildItem -Path '.' -Filter '*.html' | Where-Object { 
    $_.Name -ne 'index.html' -and 
    $_.Name -ne 'template_components.html' -and
    $_.Name -ne 'footer-template.html' -and
    $_.Name -ne 'header-template.html' -and
    $_.Name -ne 'hero-template.html' -and
    $_.Name -ne 'js-template.html'
}

Write-Host "Found $($htmlFiles.Count) files to process" -ForegroundColor Yellow

foreach ($file in $htmlFiles) {
    Write-Host "Processing: $($file.Name)" -ForegroundColor Cyan
    
    try {
        $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
        $originalContent = $content
        
        # Remove header tags
        $content = $content -replace '(?s)<header[^>]*>.*?</header>', ''
        
        # Remove nav tags
        $content = $content -replace '(?s)<nav[^>]*>.*?</nav>', ''
        
        # Remove footer tags
        $content = $content -replace '(?s)<footer[^>]*>.*?</footer>', ''
        
        # Remove cart related elements
        $content = $content -replace '(?s)<div[^>]*class="[^"]*cart[^"]*"[^>]*>.*?</div>', ''
        $content = $content -replace '(?s)<a[^>]*href="[^"]*cart[^"]*"[^>]*>.*?</a>', ''
        
        # Remove back to top buttons
        $content = $content -replace '(?s)<div[^>]*class="[^"]*back-to-top[^"]*"[^>]*>.*?</div>', ''
        $content = $content -replace '(?s)<div[^>]*class="[^"]*scroll-top[^"]*"[^>]*>.*?</div>', ''
        $content = $content -replace '(?s)<div[^>]*class="[^"]*top-button[^"]*"[^>]*>.*?</div>', ''
        $content = $content -replace '(?s)<div[^>]*class="[^"]*go-top[^"]*"[^>]*>.*?</div>', ''
        $content = $content -replace '(?s)<button[^>]*class="[^"]*back-to-top[^"]*"[^>]*>.*?</button>', ''
        
        # Remove mobile menu elements
        $content = $content -replace '(?s)<div[^>]*class="[^"]*menu-overlay[^"]*"[^>]*>.*?</div>', ''
        $content = $content -replace '(?s)<div[^>]*class="[^"]*main-menu[^"]*"[^>]*>.*?</div>', ''
        $content = $content -replace '(?s)<div[^>]*class="[^"]*mobile-menu[^"]*"[^>]*>.*?</div>', ''
        
        # Remove menu buttons
        $content = $content -replace '(?s)<button[^>]*class="[^"]*menu-toggle[^"]*"[^>]*>.*?</button>', ''
        $content = $content -replace '(?s)<button[^>]*class="[^"]*menu-close[^"]*"[^>]*>.*?</button>', ''
        
        # Remove cart counters
        $content = $content -replace '(?s)<span[^>]*class="[^"]*cart-count[^"]*"[^>]*>.*?</span>', ''
        
        # Clean up extra blank lines
        $content = $content -replace '\r?\n\s*\r?\n\s*\r?\n', "`r`n`r`n"
        
        # Check if content changed
        if ($content -ne $originalContent) {
            Set-Content -Path $file.FullName -Value $content -Encoding UTF8
            Write-Host "  Successfully cleaned: $($file.Name)" -ForegroundColor Green
        } else {
            Write-Host "  No changes needed: $($file.Name)" -ForegroundColor Gray
        }
        
    } catch {
        Write-Host "  Error processing: $($file.Name) - $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`nComponent removal completed!" -ForegroundColor Green
Write-Host "Processed $($htmlFiles.Count) files" -ForegroundColor Yellow
