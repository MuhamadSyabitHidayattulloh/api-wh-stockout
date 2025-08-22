@echo off
echo ========================================
echo    SonarQube Analysis untuk api-wh-stockout
echo ========================================
echo.

echo Pilih metode analisis SonarQube:
echo 1. Menggunakan Docker (Recommended)
echo 2. Menggunakan SonarQube Scanner lokal
echo 3. Generate coverage report terlebih dahulu
echo 4. Keluar
echo.

set /p choice="Masukkan pilihan (1-4): "

if "%choice%"=="1" goto docker_analysis
if "%choice%"=="2" goto local_analysis  
if "%choice%"=="3" goto generate_coverage
if "%choice%"=="4" goto exit
goto invalid_choice

:docker_analysis
echo.
echo Menjalankan analisis dengan Docker...
echo Pastikan Docker sudah terinstall dan berjalan.
echo.
docker run --rm -v "%cd%":/usr/src sonarsource/sonar-scanner-cli
goto end

:local_analysis
echo.
echo Menjalankan analisis dengan SonarQube Scanner lokal...
echo Pastikan sonar-scanner sudah terinstall dan ada di PATH.
echo.
sonar-scanner
goto end

:generate_coverage
echo.
echo Generating test coverage report...
npm run test:coverage
echo.
echo Coverage report telah dibuat. Sekarang Anda bisa menjalankan analisis SonarQube.
goto end

:invalid_choice
echo.
echo Pilihan tidak valid. Silakan coba lagi.
pause
goto start

:end
echo.
echo Analisis selesai!
pause
goto exit

:exit
