@echo off
title FinesseOdds Mobile - Screen Mirror
echo Starting FinesseOdds live window...
cd /d "C:\Users\atfso\AppData\Local\Microsoft\WinGet\Packages\Genymobile.scrcpy_Microsoft.Winget.Source_8wekyb3d8bbwe\scrcpy-win64-v4.1"
scrcpy.exe -s emulator-5554 --window-title "FinesseOdds Mobile App (Pixel 7)" --stay-awake --always-on-top
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Scrcpy exited with error code %ERRORLEVEL%.
    pause
)
