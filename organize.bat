@echo off
echo ========================================
echo   Organizing Files
echo ========================================
echo.

echo Creating folders...
if not exist "css" mkdir css
if not exist "js" mkdir js
echo Done!
echo.

echo Downloading from your GitHub...
powershell -Command "Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/GanxinOrchard/gonglaoping--/main/style.css' -OutFile 'css\style.css'"
powershell -Command "Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/GanxinOrchard/gonglaoping--/main/products.js' -OutFile 'js\products.js'"
powershell -Command "Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/GanxinOrchard/gonglaoping--/main/cart.js' -OutFile 'js\cart.js'"
powershell -Command "Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/GanxinOrchard/gonglaoping--/main/checkout.js' -OutFile 'js\checkout.js'"
powershell -Command "Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/GanxinOrchard/gonglaoping--/main/main.js' -OutFile 'js\main.js'"

echo.
echo Done! Check your folders:
echo - css\style.css
echo - js\products.js
echo - js\cart.js
echo - js\checkout.js
echo - js\main.js
echo.

echo Now run: rebuild.bat
pause
