@echo off
REM VCET Alumni Hub - Quick Start Script for Windows

echo.
echo ========================================
echo   VCET Alumni Hub - Starting Server
echo ========================================
echo.

REM Check if node_modules exists
if not exist node_modules (
    echo [!] Dependencies not installed
    echo [*] Installing dependencies...
    call npm install
    echo.
)

REM Check if .env exists
if not exist .env (
    echo [!] .env file not found
    if exist .env.example (
        echo [*] Creating .env from .env.example...
        copy .env.example .env
        echo [√] .env file created
        echo [!] Please edit .env with your database credentials
        echo.
        pause
        exit /b 1
    ) else (
        echo [!] ERROR: No .env.example found
        echo [!] Please create .env manually
        pause
        exit /b 1
    )
)

echo [*] Starting development server...
echo [*] Server will be available at: http://localhost:3000
echo [*] Press Ctrl+C to stop the server
echo.

npm run dev
