@echo off
echo ================================================
echo   MEMBUKA DATABASE KOPERASI (PRISMA STUDIO)
echo ================================================
echo.
echo Mohon tunggu sebentar, sedang menyiapkan antarmuka database...
echo Browser akan otomatis terbuka.
echo.
cd /d %~dp0backend
npx.cmd prisma studio
