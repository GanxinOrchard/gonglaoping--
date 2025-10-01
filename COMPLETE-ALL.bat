@echo off
echo ========================================
echo   Complete Upload
echo ========================================
echo.

echo Uploading all updates...
git add .
git commit -m "Final: 3 water chestnut products added, SEO optimized, Facebook linked, complete"
git push origin main

if %errorlevel% neq 0 (
    echo.
    echo Upload failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Success!
echo ========================================
echo.
echo Completed Features:
echo - NEW: 3 Water chestnut products (Bulk/Single/Per Jin)
echo - NEW: SEO optimized (keywords: ponkan, gonglaoping, etc)
echo - NEW: Facebook link added (removed email)
echo - Shipping rules by type (Normal 150 / Cold 180 / Frozen 200)
echo - Mobile menu FIXED (hamburger works now)
echo - Free shipping over 1800 (all types)
echo - Checkout button FIXED
echo - All pages have full navigation
echo - Product spec selection (23A/25A/27A/30A)
echo - Orange cart background
echo - Sales count display
echo - 100 reviews system
echo - All responsive design
echo.
echo Products:
echo 1. Gonglaoping Ponkan (4 sizes)
echo 2. Dongshi Murcott (4 sizes)
echo 3. Water Chestnut Bulk (3kg x 4 packs) - $3500
echo 4. Water Chestnut Single (3kg) - $990
echo 5. Water Chestnut Per Jin (600g) - $240
echo.
echo Website: https://ganxinorchard.github.io/gonglaoping--/
echo.
echo Backend file: backend-code.gs
echo (Please copy to Google Apps Script manually)
echo.
pause
