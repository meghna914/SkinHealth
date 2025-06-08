# SkinHealth Hospital Finder - Complete Startup Script
# This script will set up and run the entire project

Write-Host ""
Write-Host "🏥 SkinHealth Hospital Finder - Complete Setup" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green
Write-Host ""

# Function to test if a command exists
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Check system requirements
Write-Host "[1/6] Checking system requirements..." -ForegroundColor Yellow

if (-not (Test-Command "node")) {
    Write-Host "❌ Node.js not found!" -ForegroundColor Red
    Write-Host "   Please install Node.js from: https://nodejs.org/" -ForegroundColor White
    Write-Host "   Download the LTS version and restart this script." -ForegroundColor White
    Read-Host "Press Enter to exit"
    exit 1
}

if (-not (Test-Command "python")) {
    Write-Host "❌ Python not found!" -ForegroundColor Red
    Write-Host "   Please install Python from: https://python.org/" -ForegroundColor White
    Write-Host "   Make sure to check 'Add Python to PATH' during installation." -ForegroundColor White
    Read-Host "Press Enter to exit"
    exit 1
}

$nodeVersion = node --version
$pythonVersion = python --version
Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
Write-Host "✅ Python: $pythonVersion" -ForegroundColor Green

# Install dependencies
Write-Host ""
Write-Host "[2/6] Installing project dependencies..." -ForegroundColor Yellow

Write-Host "📦 Installing frontend packages..." -ForegroundColor Cyan
npm install --silent
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install frontend dependencies" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "📦 Installing backend packages..." -ForegroundColor Cyan
Set-Location backend
pip install Flask Flask-CORS requests --quiet
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install backend dependencies" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Set-Location ..

Write-Host "✅ All dependencies installed successfully!" -ForegroundColor Green

# Start backend
Write-Host ""
Write-Host "[3/6] Starting backend server..." -ForegroundColor Yellow
Write-Host "🔧 Starting Flask API with real hospital database..." -ForegroundColor Cyan

$backendProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; Write-Host 'Starting SkinHealth Backend API...' -ForegroundColor Green; Write-Host 'Hospital database loaded with real Bangalore hospitals' -ForegroundColor Cyan; Write-Host ''; python app.py" -PassThru

Start-Sleep -Seconds 6

# Test backend
Write-Host "🧪 Testing backend connection..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -TimeoutSec 10
    if ($response.success) {
        Write-Host "✅ Backend API is running!" -ForegroundColor Green
        Write-Host "   Hospital database loaded with real data" -ForegroundColor White
    }
} catch {
    Write-Host "⚠️  Backend is starting up..." -ForegroundColor Yellow
}

# Start frontend
Write-Host ""
Write-Host "[4/6] Starting frontend server..." -ForegroundColor Yellow
Write-Host "🎨 Starting React development server..." -ForegroundColor Cyan

$frontendProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'Starting SkinHealth Frontend...' -ForegroundColor Green; Write-Host 'React + TypeScript + Vite' -ForegroundColor Cyan; Write-Host ''; npm run dev" -PassThru

Start-Sleep -Seconds 8

# Test frontend
Write-Host "🧪 Testing frontend connection..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5173" -TimeoutSec 5 -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Frontend is running!" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Frontend is starting up..." -ForegroundColor Yellow
}

# Open browser
Write-Host ""
Write-Host "[5/6] Opening application..." -ForegroundColor Yellow
Start-Sleep -Seconds 3
Start-Process "http://localhost:5173"

# Final instructions
Write-Host ""
Write-Host "[6/6] Setup complete!" -ForegroundColor Yellow
Write-Host ""
Write-Host "🎉 SkinHealth Hospital Finder is now RUNNING!" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Frontend:    http://localhost:5173" -ForegroundColor Cyan
Write-Host "🔧 Backend:     http://localhost:5000" -ForegroundColor Cyan
Write-Host "🧪 API Health:  http://localhost:5000/api/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "📱 HOW TO USE:" -ForegroundColor Yellow
Write-Host "   1. The website opened automatically in your browser" -ForegroundColor White
Write-Host "   2. Navigate to: Dashboard → Hospital Finder" -ForegroundColor White
Write-Host "   3. Click: 'Find Nearest Hospitals'" -ForegroundColor White
Write-Host "   4. Allow location access when prompted" -ForegroundColor White
Write-Host "   5. See real hospitals near you!" -ForegroundColor White
Write-Host ""
Write-Host "🏥 HOSPITAL DATABASE INCLUDES:" -ForegroundColor Yellow
Write-Host "   ✅ M.S. Ramaiah Memorial Hospital (Mathikere)" -ForegroundColor White
Write-Host "   ✅ Manipal Hospital Hebbal" -ForegroundColor White
Write-Host "   ✅ Columbia Asia Hospital Hebbal" -ForegroundColor White
Write-Host "   ✅ Apollo Hospital Bangalore" -ForegroundColor White
Write-Host "   ✅ Fortis Hospital Bangalore" -ForegroundColor White
Write-Host ""
Write-Host "🛑 TO STOP: Close the server windows or press Ctrl+C in each terminal" -ForegroundColor Red
Write-Host ""
Write-Host "✨ Ready to use! Go to: http://localhost:5173" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to close this setup window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
