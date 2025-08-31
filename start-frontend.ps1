# Campaign Web3 Frontend Startup Script for Windows

Write-Host "🚀 Starting Campaign Web3 Frontend..." -ForegroundColor Green
Write-Host "📁 Navigating to frontend directory..." -ForegroundColor Yellow

Set-Location frontend

Write-Host "📦 Installing dependencies (if needed)..." -ForegroundColor Yellow
npm install

Write-Host "🔥 Starting development server..." -ForegroundColor Green
Write-Host "🌐 The application will be available at http://localhost:3000" -ForegroundColor Cyan

npm run dev
