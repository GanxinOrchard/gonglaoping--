@echo off
echo ========================================
echo   Fix and Upload
echo ========================================
echo.

echo Copying fixed index.html...
copy /Y index-fixed.html index.html
echo Done!
echo.

echo Uploading to GitHub...
git add index.html
git commit -m "Fix file paths"
git push origin main

echo.
echo ========================================
echo   Complete!
echo ========================================
echo.
echo Wait 1 minute, then check:
echo https://ganxinorchard.github.io/gonglaoping--/
echo.
pause
