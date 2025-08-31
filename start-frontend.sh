#!/bin/bash

# Campaign Web3 Frontend Startup Script

echo "🚀 Starting Campaign Web3 Frontend..."
echo "📁 Navigating to frontend directory..."

cd frontend

echo "📦 Installing dependencies (if needed)..."
npm install

echo "🔥 Starting development server..."
echo "🌐 The application will be available at http://localhost:3000"

npm run dev
