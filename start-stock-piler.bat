@echo off
cd /d "%~dp0"
echo Starting Stock Piler at http://localhost:5173/stock-piler.html
echo.
echo For phone access, use your laptop IP address on the same Wi-Fi:
echo http://YOUR-LAPTOP-IP:5173/stock-piler.html
echo.
start "Stock Piler Server" /min python stock_piler_server.py
timeout /t 2 /nobreak >nul
start "" "http://localhost:5173/stock-piler.html"
echo Stock Piler is running. Keep the server window open while using the dashboard.
