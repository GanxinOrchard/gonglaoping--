@echo off
echo 開始修復所有分頁...

REM 修復 news.html
if exist "news.html" (
    echo 修復 news.html...
    powershell -Command "(Get-Content 'news.html' -Raw) -replace 'href=\"\./css/menu-enhancement\.css[^\"]*\"', 'href=\"./css/navigation-clean.css?v=20250110\"' | Out-File 'news.html' -Encoding UTF8"
    powershell -Command "(Get-Content 'news.html' -Raw) -replace 'src=\"\./js/menu-enhancement\.js[^\"]*\"', '' | Out-File 'news.html' -Encoding UTF8"
    powershell -Command "(Get-Content 'news.html' -Raw) -replace 'src=\"js/mobile-menu-fix\.js[^\"]*\"', 'src=\"./js/mobile-menu-simple.js?v=20250110\"' | Out-File 'news.html' -Encoding UTF8"
    powershell -Command "(Get-Content 'news.html' -Raw) -replace 'href=\"css/mobile-menu-fix\.css[^\"]*\"', '' | Out-File 'news.html' -Encoding UTF8"
    echo ✅ news.html 修復完成
)

REM 修復 knowledge.html
if exist "knowledge.html" (
    echo 修復 knowledge.html...
    powershell -Command "(Get-Content 'knowledge.html' -Raw) -replace 'href=\"\./css/menu-enhancement\.css[^\"]*\"', 'href=\"./css/navigation-clean.css?v=20250110\"' | Out-File 'knowledge.html' -Encoding UTF8"
    powershell -Command "(Get-Content 'knowledge.html' -Raw) -replace 'src=\"\./js/menu-enhancement\.js[^\"]*\"', '' | Out-File 'knowledge.html' -Encoding UTF8"
    powershell -Command "(Get-Content 'knowledge.html' -Raw) -replace 'src=\"js/mobile-menu-fix\.js[^\"]*\"', 'src=\"./js/mobile-menu-simple.js?v=20250110\"' | Out-File 'knowledge.html' -Encoding UTF8"
    powershell -Command "(Get-Content 'knowledge.html' -Raw) -replace 'href=\"css/mobile-menu-fix\.css[^\"]*\"', '' | Out-File 'knowledge.html' -Encoding UTF8"
    echo ✅ knowledge.html 修復完成
)

REM 修復 contact.html
if exist "contact.html" (
    echo 修復 contact.html...
    powershell -Command "(Get-Content 'contact.html' -Raw) -replace 'href=\"\./css/menu-enhancement\.css[^\"]*\"', 'href=\"./css/navigation-clean.css?v=20250110\"' | Out-File 'contact.html' -Encoding UTF8"
    powershell -Command "(Get-Content 'contact.html' -Raw) -replace 'src=\"\./js/menu-enhancement\.js[^\"]*\"', '' | Out-File 'contact.html' -Encoding UTF8"
    powershell -Command "(Get-Content 'contact.html' -Raw) -replace 'src=\"js/mobile-menu-fix\.js[^\"]*\"', 'src=\"./js/mobile-menu-simple.js?v=20250110\"' | Out-File 'contact.html' -Encoding UTF8"
    powershell -Command "(Get-Content 'contact.html' -Raw) -replace 'href=\"css/mobile-menu-fix\.css[^\"]*\"', '' | Out-File 'contact.html' -Encoding UTF8"
    echo ✅ contact.html 修復完成
)

REM 修復 season.html
if exist "season.html" (
    echo 修復 season.html...
    powershell -Command "(Get-Content 'season.html' -Raw) -replace 'href=\"\./css/menu-enhancement\.css[^\"]*\"', 'href=\"./css/navigation-clean.css?v=20250110\"' | Out-File 'season.html' -Encoding UTF8"
    powershell -Command "(Get-Content 'season.html' -Raw) -replace 'src=\"\./js/menu-enhancement\.js[^\"]*\"', '' | Out-File 'season.html' -Encoding UTF8"
    powershell -Command "(Get-Content 'season.html' -Raw) -replace 'src=\"js/mobile-menu-fix\.js[^\"]*\"', 'src=\"./js/mobile-menu-simple.js?v=20250110\"' | Out-File 'season.html' -Encoding UTF8"
    powershell -Command "(Get-Content 'season.html' -Raw) -replace 'href=\"css/mobile-menu-fix\.css[^\"]*\"', '' | Out-File 'season.html' -Encoding UTF8"
    echo ✅ season.html 修復完成
)

REM 修復 farming.html
if exist "farming.html" (
    echo 修復 farming.html...
    powershell -Command "(Get-Content 'farming.html' -Raw) -replace 'href=\"\./css/menu-enhancement\.css[^\"]*\"', 'href=\"./css/navigation-clean.css?v=20250110\"' | Out-File 'farming.html' -Encoding UTF8"
    powershell -Command "(Get-Content 'farming.html' -Raw) -replace 'src=\"\./js/menu-enhancement\.js[^\"]*\"', '' | Out-File 'farming.html' -Encoding UTF8"
    powershell -Command "(Get-Content 'farming.html' -Raw) -replace 'src=\"js/mobile-menu-fix\.js[^\"]*\"', 'src=\"./js/mobile-menu-simple.js?v=20250110\"' | Out-File 'farming.html' -Encoding UTF8"
    powershell -Command "(Get-Content 'farming.html' -Raw) -replace 'href=\"css/mobile-menu-fix\.css[^\"]*\"', '' | Out-File 'farming.html' -Encoding UTF8"
    echo ✅ farming.html 修復完成
)

REM 修復 guide.html
if exist "guide.html" (
    echo 修復 guide.html...
    powershell -Command "(Get-Content 'guide.html' -Raw) -replace 'href=\"\./css/menu-enhancement\.css[^\"]*\"', 'href=\"./css/navigation-clean.css?v=20250110\"' | Out-File 'guide.html' -Encoding UTF8"
    powershell -Command "(Get-Content 'guide.html' -Raw) -replace 'src=\"\./js/menu-enhancement\.js[^\"]*\"', '' | Out-File 'guide.html' -Encoding UTF8"
    powershell -Command "(Get-Content 'guide.html' -Raw) -replace 'src=\"js/mobile-menu-fix\.js[^\"]*\"', 'src=\"./js/mobile-menu-simple.js?v=20250110\"' | Out-File 'guide.html' -Encoding UTF8"
    powershell -Command "(Get-Content 'guide.html' -Raw) -replace 'href=\"css/mobile-menu-fix\.css[^\"]*\"', '' | Out-File 'guide.html' -Encoding UTF8"
    echo ✅ guide.html 修復完成
)

REM 修復 grading.html
if exist "grading.html" (
    echo 修復 grading.html...
    powershell -Command "(Get-Content 'grading.html' -Raw) -replace 'href=\"\./css/menu-enhancement\.css[^\"]*\"', 'href=\"./css/navigation-clean.css?v=20250110\"' | Out-File 'grading.html' -Encoding UTF8"
    powershell -Command "(Get-Content 'grading.html' -Raw) -replace 'src=\"\./js/menu-enhancement\.js[^\"]*\"', '' | Out-File 'grading.html' -Encoding UTF8"
    powershell -Command "(Get-Content 'grading.html' -Raw) -replace 'src=\"js/mobile-menu-fix\.js[^\"]*\"', 'src=\"./js/mobile-menu-simple.js?v=20250110\"' | Out-File 'grading.html' -Encoding UTF8"
    powershell -Command "(Get-Content 'grading.html' -Raw) -replace 'href=\"css/mobile-menu-fix\.css[^\"]*\"', '' | Out-File 'grading.html' -Encoding UTF8"
    echo ✅ grading.html 修復完成
)

REM 修復 policies.html
if exist "policies.html" (
    echo 修復 policies.html...
    powershell -Command "(Get-Content 'policies.html' -Raw) -replace 'href=\"\./css/menu-enhancement\.css[^\"]*\"', 'href=\"./css/navigation-clean.css?v=20250110\"' | Out-File 'policies.html' -Encoding UTF8"
    powershell -Command "(Get-Content 'policies.html' -Raw) -replace 'src=\"\./js/menu-enhancement\.js[^\"]*\"', '' | Out-File 'policies.html' -Encoding UTF8"
    powershell -Command "(Get-Content 'policies.html' -Raw) -replace 'src=\"js/mobile-menu-fix\.js[^\"]*\"', 'src=\"./js/mobile-menu-simple.js?v=20250110\"' | Out-File 'policies.html' -Encoding UTF8"
    powershell -Command "(Get-Content 'policies.html' -Raw) -replace 'href=\"css/mobile-menu-fix\.css[^\"]*\"', '' | Out-File 'policies.html' -Encoding UTF8"
    echo ✅ policies.html 修復完成
)

REM 修復 cart.html
if exist "cart.html" (
    echo 修復 cart.html...
    powershell -Command "(Get-Content 'cart.html' -Raw) -replace 'href=\"\./css/menu-enhancement\.css[^\"]*\"', 'href=\"./css/navigation-clean.css?v=20250110\"' | Out-File 'cart.html' -Encoding UTF8"
    powershell -Command "(Get-Content 'cart.html' -Raw) -replace 'src=\"\./js/menu-enhancement\.js[^\"]*\"', '' | Out-File 'cart.html' -Encoding UTF8"
    powershell -Command "(Get-Content 'cart.html' -Raw) -replace 'src=\"js/mobile-menu-fix\.js[^\"]*\"', 'src=\"./js/mobile-menu-simple.js?v=20250110\"' | Out-File 'cart.html' -Encoding UTF8"
    powershell -Command "(Get-Content 'cart.html' -Raw) -replace 'href=\"css/mobile-menu-fix\.css[^\"]*\"', '' | Out-File 'cart.html' -Encoding UTF8"
    echo ✅ cart.html 修復完成
)

REM 修復 checkout.html
if exist "checkout.html" (
    echo 修復 checkout.html...
    powershell -Command "(Get-Content 'checkout.html' -Raw) -replace 'href=\"\./css/menu-enhancement\.css[^\"]*\"', 'href=\"./css/navigation-clean.css?v=20250110\"' | Out-File 'checkout.html' -Encoding UTF8"
    powershell -Command "(Get-Content 'checkout.html' -Raw) -replace 'src=\"\./js/menu-enhancement\.js[^\"]*\"', '' | Out-File 'checkout.html' -Encoding UTF8"
    powershell -Command "(Get-Content 'checkout.html' -Raw) -replace 'src=\"js/mobile-menu-fix\.js[^\"]*\"', 'src=\"./js/mobile-menu-simple.js?v=20250110\"' | Out-File 'checkout.html' -Encoding UTF8"
    powershell -Command "(Get-Content 'checkout.html' -Raw) -replace 'href=\"css/mobile-menu-fix\.css[^\"]*\"', '' | Out-File 'checkout.html' -Encoding UTF8"
    echo ✅ checkout.html 修復完成
)

echo.
echo 所有分頁修復完成！
pause
