@echo off
title SkinHealth Website Startup
color 0A

echo.
echo  ███████╗██╗  ██╗██╗███╗   ██╗██╗  ██╗███████╗ █████╗ ██╗  ████████╗██╗  ██╗
echo  ██╔════╝██║ ██╔╝██║████╗  ██║██║  ██║██╔════╝██╔══██╗██║  ╚══██╔══╝██║  ██║
echo  ███████╗█████╔╝ ██║██╔██╗ ██║███████║█████╗  ███████║██║     ██║   ███████║
echo  ╚════██║██╔═██╗ ██║██║╚██╗██║██╔══██║██╔══╝  ██╔══██║██║     ██║   ██╔══██║
echo  ███████║██║  ██╗██║██║ ╚████║██║  ██║███████╗██║  ██║███████╗██║   ██║  ██║
echo  ╚══════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝╚═╝   ╚═╝  ╚═╝
echo.
echo                          Hospital Finder with Google Places API
echo.
echo ================================================================================

echo [1/4] Checking dependencies...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js not found! Please install from https://nodejs.org/
    pause
    exit /b 1
)

where python >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Python not found! Please install from https://python.org/
    pause
    exit /b 1
)

echo ✅ Node.js and Python found!

echo.
echo [2/4] Installing dependencies...
echo Installing frontend packages...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)

echo Installing backend packages...
cd backend
call pip install Flask Flask-CORS requests
if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..

echo ✅ All dependencies installed!

echo.
echo [3/4] Starting servers...
echo Starting Flask Backend Server...
start "🔧 SkinHealth Backend (Flask + Google Places API)" cmd /k "cd backend && echo Backend starting... && python app.py"

echo Waiting for backend to initialize...
timeout /t 5 /nobreak > nul

echo Starting React Frontend Server...
start "🎨 SkinHealth Frontend (React + Vite)" cmd /k "echo Frontend starting... && npm run dev"

echo Waiting for frontend to initialize...
timeout /t 8 /nobreak > nul

echo.
echo [4/4] Opening website...
timeout /t 3 /nobreak > nul
start http://localhost:5173

echo.
echo ================================================================================
echo 🎉 SkinHealth Website is now running!
echo ================================================================================
echo.
echo 🌐 Frontend:     http://localhost:5173
echo 🔧 Backend API:  http://localhost:5000
echo 🧪 API Health:   http://localhost:5000/api/health
echo.
echo 📱 TO USE HOSPITAL FINDER:
echo    1. Go to http://localhost:5173
echo    2. Navigate to Dashboard → Hospital Finder
echo    3. Click "Test NYC" or "Use My Location"
echo.
echo 🛑 TO STOP: Close the server windows or press Ctrl+C in each terminal
echo.
echo ✨ The website should open automatically in your browser!
echo.
pause
