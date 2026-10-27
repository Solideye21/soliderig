@echo off
title SolidRig local server
cd /d "%~dp0site"

echo.
echo   SolidRig - local preview
echo   ---------------------------------
echo   Serving:  %CD%
echo   Open:     http://localhost:8080
echo.
echo   Press Ctrl+C to stop the server.
echo.

start "" http://localhost:8080
python -m http.server 8080

echo.
echo Server stopped.
pause
