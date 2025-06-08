#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('\n🏥 SkinHealth Website Startup Script');
console.log('=====================================\n');

// Check if required files exist
const requiredFiles = [
    'package.json',
    'backend/app.py',
    'backend/requirements.txt'
];

for (const file of requiredFiles) {
    if (!fs.existsSync(file)) {
        console.error(`❌ Required file not found: ${file}`);
        process.exit(1);
    }
}

console.log('✅ All required files found');

// Function to run command and return promise
function runCommand(command, cwd = process.cwd()) {
    return new Promise((resolve, reject) => {
        console.log(`🔧 Running: ${command}`);
        const child = spawn(command, { 
            shell: true, 
            cwd,
            stdio: 'inherit'
        });
        
        child.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Command failed with code ${code}`));
            }
        });
    });
}

// Function to start server in background
function startServer(command, cwd, name) {
    console.log(`🚀 Starting ${name}...`);
    const child = spawn(command, {
        shell: true,
        cwd,
        detached: true,
        stdio: 'ignore'
    });
    
    child.unref();
    return child;
}

// Function to wait for server to be ready
function waitForServer(url, timeout = 30000) {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        
        function check() {
            const http = require('http');
            const urlObj = new URL(url);
            
            const req = http.request({
                hostname: urlObj.hostname,
                port: urlObj.port,
                path: urlObj.pathname,
                timeout: 2000
            }, (res) => {
                resolve();
            });
            
            req.on('error', () => {
                if (Date.now() - startTime > timeout) {
                    reject(new Error(`Server at ${url} did not start within ${timeout}ms`));
                } else {
                    setTimeout(check, 1000);
                }
            });
            
            req.end();
        }
        
        check();
    });
}

// Main startup function
async function startWebsite() {
    try {
        // Install frontend dependencies
        console.log('\n📦 Installing frontend dependencies...');
        await runCommand('npm install');
        
        // Install backend dependencies
        console.log('\n📦 Installing backend dependencies...');
        await runCommand('pip install -r requirements.txt', path.join(process.cwd(), 'backend'));
        
        console.log('\n✅ All dependencies installed!');
        
        // Start backend server
        console.log('\n🔧 Starting Flask backend...');
        startServer('python app.py', path.join(process.cwd(), 'backend'), 'Backend');
        
        // Wait for backend to be ready
        console.log('⏳ Waiting for backend to start...');
        await waitForServer('http://localhost:5000/api/health');
        console.log('✅ Backend is ready!');
        
        // Start frontend server
        console.log('\n🎨 Starting React frontend...');
        startServer('npm run dev', process.cwd(), 'Frontend');
        
        // Wait for frontend to be ready
        console.log('⏳ Waiting for frontend to start...');
        await waitForServer('http://localhost:5173');
        console.log('✅ Frontend is ready!');
        
        // Open browser
        console.log('\n🌐 Opening website in browser...');
        const open = require('child_process').exec;
        const url = 'http://localhost:5173';
        
        // Cross-platform browser opening
        const platform = process.platform;
        if (platform === 'win32') {
            open(`start ${url}`);
        } else if (platform === 'darwin') {
            open(`open ${url}`);
        } else {
            open(`xdg-open ${url}`);
        }
        
        console.log('\n🎉 SkinHealth Website is now running!');
        console.log('=====================================');
        console.log('🌐 Frontend:    http://localhost:5173');
        console.log('🔧 Backend:     http://localhost:5000');
        console.log('🧪 API Health:  http://localhost:5000/api/health');
        console.log('🧪 Test Page:   http://localhost:5173/../test-chatbot-integration.html');
        console.log('\n📱 Available Features:');
        console.log('   • Disease Classifier - Upload skin images for AI analysis');
        console.log('   • Hospital Finder - Find nearby medical facilities');
        console.log('   • Medical Chatbot - Get answers from our medical assistant');
        console.log('\n🤖 To test Medical Chatbot:');
        console.log('   1. Go to http://localhost:5173');
        console.log('   2. Navigate to Dashboard → Medical Chatbot');
        console.log('   3. Ask questions about skin conditions or health');
        console.log('\n🛑 Press Ctrl+C to stop all servers');
        
        // Keep the script running
        process.stdin.resume();
        
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
}

// Handle Ctrl+C
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down servers...');
    process.exit(0);
});

// Start the website
startWebsite();
