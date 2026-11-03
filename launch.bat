@echo off
setlocal

set "PROJECT_DIR=C:\Users\khush\.gemini\antigravity\scratch\vastu-sutram"
cd /d "%PROJECT_DIR%"

:: Check if server is already responding on port 3000
powershell -NoProfile -Command "try { if ((Invoke-WebRequest -Uri 'http://127.0.0.1:3000/api/health' -UseBasicParsing -TimeoutSec 1).StatusCode -eq 200) { exit 0 } else { exit 1 } } catch { exit 1 }" >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo [VASTU SUTRAM] Server is already running on http://localhost:3000.
) else (
    echo [VASTU SUTRAM] Starting background server...
    wscript.exe "%PROJECT_DIR%\start-server.vbs"
    ping 127.0.0.1 -n 3 >nul
)

:: Launch in Google Chrome or default browser
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" "http://localhost:3000"
) else (
    start "" "http://localhost:3000"
)

exit /b 0
