#!/bin/bash

# VCET Alumni Hub - Quick Start Script for macOS/Linux

echo ""
echo "========================================"
echo "  VCET Alumni Hub - Starting Server"
echo "========================================"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "[!] Dependencies not installed"
    echo "[*] Installing dependencies..."
    npm install
    echo ""
fi

# Check if .env exists
if [ ! -f .env ]; then
    echo "[!] .env file not found"
    if [ -f .env.example ]; then
        echo "[*] Creating .env from .env.example..."
        cp .env.example .env
        echo "[√] .env file created"
        echo "[!] Please edit .env with your database credentials"
        echo ""
        exit 1
    else
        echo "[!] ERROR: No .env.example found"
        echo "[!] Please create .env manually"
        exit 1
    fi
fi

echo "[*] Starting development server..."
echo "[*] Server will be available at: http://localhost:3000"
echo "[*] Press Ctrl+C to stop the server"
echo ""

npm run dev
