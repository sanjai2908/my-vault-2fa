@echo off
REM Quick Start Script for File Vault Application (Windows)

echo.
echo ========================================================================
echo        File Vault Application - Quick Start Guide (Windows)
echo ========================================================================
echo.
echo This script will help you start the application.
echo.

REM Check if we're in the right directory
if not exist "server.js" (
    echo Error: Please run this from the root 'My Vault' directory
    pause
    exit /b 1
)

echo Prerequisites Checklist:
echo   [✓] Node.js installed
echo   [✓] MongoDB running (local or Atlas)
echo   [✓] .env file configured
echo.

echo Choose what to start:
echo.
echo   1) Backend only (Port 5000)
echo   2) Frontend only (Port 3000)
echo   3) Show manual startup commands
echo.

set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" (
    echo.
    echo Starting Backend...
    npm run dev
    pause
) else if "%choice%"=="2" (
    echo.
    echo Starting Frontend...
    cd client
    npm start
    pause
) else if "%choice%"=="3" (
    echo.
    echo ========================================================================
    echo MANUAL STARTUP - USE TWO TERMINALS
    echo ========================================================================
    echo.
    echo Terminal 1 (Backend):
    echo   cd "d:\My Vault"
    echo   npm run dev
    echo.
    echo Terminal 2 (Frontend):
    echo   cd "d:\My Vault\client"
    echo   npm start
    echo.
    echo ========================================================================
    echo.
    echo When both are running:
    echo   - Backend API: http://localhost:5000
    echo   - Frontend App: http://localhost:3000
    echo.
    pause
) else (
    echo Invalid choice. Exiting.
    pause
    exit /b 1
)
