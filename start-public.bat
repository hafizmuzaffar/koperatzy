@echo off
echo ================================================
echo   KOPERASI APP - PUBLIC ACCESS VIA NGROK
echo ================================================
echo.

REM Cek lokasi ngrok
set NGROK_PATH=
where ngrok >nul 2>&1
if %errorlevel% == 0 (
    set NGROK_PATH=ngrok
) else if exist "C:\Users\IT\ngrok.exe" (
    set NGROK_PATH=C:\Users\IT\ngrok.exe
) else (
    echo [ERROR] ngrok tidak ditemukan!
    echo Letakkan ngrok.exe di folder: C:\Users\IT\
    pause
    exit /b 1
)

echo [1/3] Menjalankan Backend Server...
start "Backend - Koperasi" cmd /k "cd /d %~dp0backend && node server.js"
timeout /t 2 /nobreak >nul

echo [2/3] Menjalankan Frontend Server...
start "Frontend - Koperasi" cmd /k "cd /d %~dp0 && npm.cmd run dev"
timeout /t 3 /nobreak >nul

echo [3/3] Membuka Tunnel ngrok (port 5173)...
start "ngrok - Frontend" cmd /k "%NGROK_PATH% http --domain=ion-avid-cake.ngrok-free.dev 127.0.0.1:5173"

echo.
echo ================================================
echo Semua server dan tunnel sudah berjalan!
echo.
echo PENTING:
echo   - Buka browser dan kunjungi:
echo   - https://ion-avid-cake.ngrok-free.dev
echo ================================================
pause
