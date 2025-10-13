@echo off
chcp 65001 >nul
echo 開始修復所有分頁...

REM 修復 news.html
echo 修復 news.html...
powershell -Command "(Get-Content 'news.html' -Raw) -replace 'href=\"\./css/menu-enhancement\.css[^\"]*\"', 'href=\"./css/navigation-clean.css?v=20250110\"' | Set-Content 'news.html' -Encoding UTF8"
powershell -Command "(Get-Content 'news.html' -Raw) -replace 'src=\"\./js/menu-enhancement\.js[^\"]*\"', '' | Set-Content 'news.html' -Encoding UTF8"
powershell -Command "(Get-Content 'news.html' -Raw) -replace 'src=\"js/mobile-menu-fix\.js[^\"]*\"', 'src=\"./js/mobile-menu-simple.js?v=20250110\"' | Set-Content 'news.html' -Encoding UTF8"
powershell -Command "(Get-Content 'news.html' -Raw) -replace 'href=\"css/mobile-menu-fix\.css[^\"]*\"', '' | Set-Content 'news.html' -Encoding UTF8"

REM 修復 knowledge.html
echo 修復 knowledge.html...
powershell -Command "(Get-Content 'knowledge.html' -Raw) -replace 'href=\"\./css/menu-enhancement\.css[^\"]*\"', 'href=\"./css/navigation-clean.css?v=20250110\"' | Set-Content 'knowledge.html' -Encoding UTF8"
powershell -Command "(Get-Content 'knowledge.html' -Raw) -replace 'src=\"\./js/menu-enhancement\.js[^\"]*\"', '' | Set-Content 'knowledge.html' -Encoding UTF8"
powershell -Command "(Get-Content 'knowledge.html' -Raw) -replace 'src=\"js/mobile-menu-fix\.js[^\"]*\"', 'src=\"./js/mobile-menu-simple.js?v=20250110\"' | Set-Content 'knowledge.html' -Encoding UTF8"
powershell -Command "(Get-Content 'knowledge.html' -Raw) -replace 'href=\"css/mobile-menu-fix\.css[^\"]*\"', '' | Set-Content 'knowledge.html' -Encoding UTF8"

REM 修復 contact.html
echo 修復 contact.html...
powershell -Command "(Get-Content 'contact.html' -Raw) -replace 'href=\"\./css/menu-enhancement\.css[^\"]*\"', 'href=\"./css/navigation-clean.css?v=20250110\"' | Set-Content 'contact.html' -Encoding UTF8"
powershell -Command "(Get-Content 'contact.html' -Raw) -replace 'src=\"\./js/menu-enhancement\.js[^\"]*\"', '' | Set-Content 'contact.html' -Encoding UTF8"
powershell -Command "(Get-Content 'contact.html' -Raw) -replace 'src=\"js/mobile-menu-fix\.js[^\"]*\"', 'src=\"./js/mobile-menu-simple.js?v=20250110\"' | Set-Content 'contact.html' -Encoding UTF8"
powershell -Command "(Get-Content 'contact.html' -Raw) -replace 'href=\"css/mobile-menu-fix\.css[^\"]*\"', '' | Set-Content 'contact.html' -Encoding UTF8"

echo 修復完成！
pause
