@echo off
REM Start a local static server rooted at this script's folder (PortfolioV0).
REM Double-click this file, or run it from any shell — it always cds to the right folder first.

cd /d "%~dp0"
echo.
echo ================================================================
echo   Serving PortfolioV0 from:
echo     %CD%
echo.
echo   Open in your browser:
echo     http://localhost:8000/
echo     http://localhost:8000/#craft
echo.
echo   Press Ctrl+C to stop the server.
echo ================================================================
echo.

python -m http.server 8000 2>nul
if errorlevel 1 (
  py -m http.server 8000 2>nul
)
if errorlevel 1 (
  echo.
  echo [!] Neither "python" nor "py" worked. Try:
  echo     npx serve .
  pause
)
