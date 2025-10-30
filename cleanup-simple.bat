@echo off
echo ==========================================
echo   Project Cleanup Tool
echo ==========================================
echo.

REM Create folders
if not exist docs-archive mkdir docs-archive
if not exist scripts-temp mkdir scripts-temp
if not exist backups mkdir backups

echo Moving temporary markdown files...

REM Move specific markdown files
for %%f in (about-html*.md) do move "%%f" "docs-archive\" 2>nul
for %%f in (*style*.md) do move "%%f" "docs-archive\" 2>nul
for %%f in (*-*.md) do move "%%f" "docs-archive\" 2>nul
for %%f in (*about*.md) do move "%%f" "docs-archive\" 2>nul
for %%f in (*about*.txt) do move "%%f" "docs-archive\" 2>nul

REM Move scripts
echo Moving scripts...
for %%f in (*.ps1) do move "%%f" "scripts-temp\" 2>nul
for %%f in (*.py) do move "%%f" "scripts-temp\" 2>nul
for %%f in (*.js) do move "%%f" "scripts-temp\" 2>nul

REM Move backup files
echo Moving backups...
for %%f in (*.backup) do move "%%f" "backups\" 2>nul
for %%f in (*.old) do move "%%f" "backups\" 2>nul

echo.
echo ==========================================
echo   Cleanup Complete!
echo ==========================================
echo.
echo Created folders:
echo   - docs-archive\  (temporary docs)
echo   - scripts-temp\  (temporary scripts)
echo   - backups\       (backup files)
echo.
echo Keep these important files:
echo   - README.md
echo   - CSS files in css\ folder
echo   - JS files in js\ folder
echo   - Templates in templates\ folder
echo.
echo Press any key to exit...
pause >nul
