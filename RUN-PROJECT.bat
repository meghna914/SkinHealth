@echo off
title SkinHealth - Hospital Finder Project
color 0A
cls

echo.
echo  ███████╗██╗  ██╗██╗███╗   ██╗██╗  ██╗███████╗ █████╗ ██╗  ████████╗██╗  ██╗
echo  ██╔════╝██║ ██╔╝██║████╗  ██║██║  ██║██╔════╝██╔══██╗██║  ╚══██╔══╝██║  ██║
echo  ███████╗█████╔╝ ██║██╔██╗ ██║███████║█████╗  ███████║██║     ██║   ███████║
echo  ╚════██║██╔═██╗ ██║██║╚██╗██║██╔══██║██╔══╝  ██╔══██║██║     ██║   ██╔══██║
echo  ███████║██║  ██╗██║██║ ╚████║██║  ██║███████╗██║  ██║███████╗██║   ██║  ██║
echo  ╚══════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝╚═╝   ╚═╝  ╚═╝
echo.
echo                          🏥 Hospital Finder with Real Data 🏥
echo.
echo ================================================================================

echo [STEP 1/5] Checking system requirements...
echo.

REM Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js not found!
    echo    Please install Node.js from: https://nodejs.org/
    echo    Download the LTS version and restart this script.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js found: %NODE_VERSION%

REM Check Python
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Python not found!
    echo    Please install Python from: https://python.org/
    echo    Make sure to check "Add Python to PATH" during installation.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('python --version') do set PYTHON_VERSION=%%i
echo ✅ Python found: %PYTHON_VERSION%

echo.
echo [STEP 2/5] Installing dependencies...
echo.

echo 📦 Installing frontend packages (React, TypeScript, Vite)...
call npm install --silent
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    echo    Try running: npm install
    pause
    exit /b 1
)
echo ✅ Frontend packages installed successfully!

echo.
echo 📦 Installing backend packages (Flask, CORS, Requests)...
cd backend
call pip install Flask Flask-CORS requests --quiet
if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    echo    Try running: pip install Flask Flask-CORS requests
    pause
    exit /b 1
)
cd ..
echo ✅ Backend packages installed successfully!

echo.
echo [STEP 3/5] Starting backend server...
echo.

echo 🔧 Starting Flask API server with hospital database...
start "🏥 SkinHealth Backend - Hospital Finder API" cmd /k "cd backend && echo Starting Flask server with real hospital data... && echo. && python app.py"

echo ⏳ Waiting for backend to initialize...
timeout /t 6 /nobreak > nul

REM Test backend health
echo 🧪 Testing backend connection...
powershell -Command "try { $response = Invoke-RestMethod -Uri 'http://localhost:5000/api/health' -TimeoutSec 5; if ($response.success) { Write-Host '✅ Backend server is running!' -ForegroundColor Green } else { Write-Host '⚠️ Backend responded but may have issues' -ForegroundColor Yellow } } catch { Write-Host '⚠️ Backend still starting up...' -ForegroundColor Yellow }" 2>nul

echo.
echo [STEP 4/5] Starting frontend server...
echo.

echo 🎨 Starting React development server...
start "🌐 SkinHealth Frontend - React App" cmd /k "echo Starting React frontend with Vite... && echo. && npm run dev"

echo ⏳ Waiting for frontend to initialize...
timeout /t 8 /nobreak > nul

echo.
echo [STEP 5/5] Opening application...
echo.

echo 🌐 Opening SkinHealth in your default browser...
timeout /t 3 /nobreak > nul
start http://localhost:5173

echo.
echo ================================================================================
echo 🎉 SkinHealth Hospital Finder is now RUNNING!
echo ================================================================================
echo.
echo 🌐 FRONTEND:     http://localhost:5173
echo 🔧 BACKEND API:  http://localhost:5000
echo 🧪 API HEALTH:   http://localhost:5000/api/health
echo.
echo 📱 HOW TO USE THE HOSPITAL FINDER:
echo    1. The website should open automatically in your browser
echo    2. Navigate to: Dashboard → Hospital Finder
echo    3. Click: "Find Nearest Hospitals"
echo    4. Allow location access when prompted by your browser
echo    5. See real hospitals near you, sorted by distance!
echo.
echo 🏥 FEATURES:
echo    ✅ Real hospital data (M.S. Ramaiah, Manipal, Columbia Asia, etc.)
echo    ✅ Distance calculation from your location
echo    ✅ Contact information (phone, website)
echo    ✅ Ratings and reviews
echo    ✅ Direct actions (call, directions, website)
echo.
echo 🛑 TO STOP SERVERS:
echo    - Close the server windows (Backend and Frontend)
echo    - Or press Ctrl+C in each server terminal
echo.
echo 🔧 TROUBLESHOOTING:
echo    - If location doesn't work: Allow location access in browser
echo    - If no hospitals found: Make sure both servers are running
echo    - If website won't load: Check that frontend is on port 5173
echo.
echo ✨ The application is ready! Check your browser at: http://localhost:5173
echo.
echo Press any key to close this setup window...
pause >nul
