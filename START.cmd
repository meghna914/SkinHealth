@echo off
echo 🏥 Starting SkinHealth Hospital Finder...
echo.

REM Quick dependency check
where node >nul 2>nul || (echo ❌ Node.js required - install from nodejs.org && pause && exit)
where python >nul 2>nul || (echo ❌ Python required - install from python.org && pause && exit)

echo ✅ Dependencies found
echo 📦 Installing packages...

REM Install packages silently
npm install --silent >nul 2>nul
cd backend && pip install Flask Flask-CORS requests --quiet >nul 2>nul && cd ..

echo 🔧 Starting servers...

REM Start backend
start /min "Backend" cmd /c "cd backend && python app.py"

REM Wait and start frontend
timeout /t 5 /nobreak >nul
start /min "Frontend" cmd /c "npm run dev"

REM Wait and open browser
timeout /t 8 /nobreak >nul
start http://localhost:5173

echo.
echo 🎉 SkinHealth is running!
echo 🌐 Website: http://localhost:5173
echo 📱 Go to Dashboard → Hospital Finder
echo.
echo Press any key to close this window...
pause >nul
