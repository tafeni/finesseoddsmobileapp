@echo off
title Android Studio Emulator - Pixel 7 API 34
echo ============================================================
echo   Starting Pixel 7 API 34 Emulator with FinesseOdds
echo ============================================================
cd /d "C:\Users\atfso\AppData\Local\Android\Sdk\emulator"
emulator.exe -avd Pixel_7_API_34 -gpu host
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Emulator exited with code %ERRORLEVEL%.
    pause
)
