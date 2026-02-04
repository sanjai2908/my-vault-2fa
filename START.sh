#!/bin/bash
# Quick Start Script for File Vault Application

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║        File Vault Application - Quick Start Guide              ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "This guide will help you start the application quickly."
echo ""

# Check if we're in the right directory
if [ ! -f "server.js" ]; then
    echo "❌ Error: Please run this from the root 'My Vault' directory"
    exit 1
fi

echo "📋 Prerequisites Check:"
echo "  ✓ Node.js installed"
echo "  ✓ MongoDB running (local or Atlas connection string)"
echo "  ✓ .env file configured with:"
echo "    - MONGODB_URI"
echo "    - JWT_SECRET"
echo "    - EMAIL_* variables"
echo ""

echo "🚀 Starting File Vault Application..."
echo ""

# Function to start backend
start_backend() {
    echo "📦 Starting Backend (http://localhost:5000)..."
    npm run dev
}

# Function to start frontend
start_frontend() {
    echo "⚛️  Starting Frontend (http://localhost:3000)..."
    cd client
    npm start
}

# Check for command line arguments
if [ "$1" == "backend" ]; then
    start_backend
elif [ "$1" == "frontend" ]; then
    start_frontend
elif [ "$1" == "both" ]; then
    # Start both in background
    echo "🔄 Starting both backend and frontend..."
    npm run dev &
    cd client && npm start &
    wait
else
    echo "Usage: ./start.sh [backend|frontend|both]"
    echo ""
    echo "Examples:"
    echo "  ./start.sh backend   - Start only backend"
    echo "  ./start.sh frontend  - Start only frontend"
    echo "  ./start.sh both      - Start both (requires 2 terminals)"
    echo ""
    echo "Or manually in two terminals:"
    echo ""
    echo "Terminal 1 (Backend):"
    echo "  cd 'd:\\My Vault'"
    echo "  npm run dev"
    echo ""
    echo "Terminal 2 (Frontend):"
    echo "  cd 'd:\\My Vault\\client'"
    echo "  npm start"
    echo ""
fi
