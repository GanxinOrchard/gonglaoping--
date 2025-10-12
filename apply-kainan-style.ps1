# Apply Kainan Style to Index Page
$ErrorActionPreference = "Stop"

$indexPath = "index.html"
$backupPath = "index.html.backup-kainan"

# Backup original file
Copy-Item $indexPath $backupPath -Force
Write-Host "Backup created: $backupPath"

# Read file
$content = Get-Content $indexPath -Raw -Encoding UTF8

# Add CSS link if not exists
if ($content -notmatch 'kainan-style.css') {
    $content = $content -replace '(<link rel="stylesheet" href="\./css/style\.css\?v=\d+">)', "`$1`n    <link rel=`"stylesheet`" href=`"./css/kainan-style.css?v=20251013`">"
    Write-Host "Added kainan-style.css link"
}

# Save file
$content | Out-File $indexPath -Encoding UTF8 -NoNewline

Write-Host "Done! Please check index.html" -ForegroundColor Green
