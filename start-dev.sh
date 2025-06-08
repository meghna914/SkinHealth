#!/bin/bash

echo "Starting SkinHealth Hospital Finder Development Environment..."
echo

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python 3 is required but not installed. Please install Python 3 and try again."
    exit 1
fi

# Check if Node.js is installed
if ! command -v npm &> /dev/null; then
    echo "Node.js and npm are required but not installed. Please install Node.js and try again."
    exit 1
fi

echo "Starting Flask Backend..."
cd backend
python3 app.py &
BACKEND_PID=$!
cd ..

echo "Waiting for backend to start..."
sleep 3

echo "Starting React Frontend..."
npm run dev &
FRONTEND_PID=$!

echo
echo "Development servers are starting..."
echo "Frontend: http://localhost:5173"
echo "Backend API: http://localhost:5000"
echo
echo "Press Ctrl+C to stop all servers..."

# Function to cleanup processes on exit
cleanup() {
    echo
    echo "Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "Servers stopped."
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait
