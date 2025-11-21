@echo off
REM Windows Batch Script for Render Deployment Helper

echo.
echo ========================================
echo VCET Alumni Hub - Render Deployment Helper
echo ========================================
echo.

REM Check if git is initialized
if not exist .git (
    echo [*] Initializing Git repository...
    git init
    echo [√] Git initialized
) else (
    echo [√] Git already initialized
)

REM Create .gitignore if not exists
if not exist .gitignore (
    echo [*] Creating .gitignore...
    (
        echo node_modules/
        echo .env
        echo .DS_Store
        echo uploads/profiles/*
        echo !uploads/profiles/.gitkeep
        echo uploads/posts/*
        echo !uploads/posts/.gitkeep
        echo npm-debug.log*
        echo yarn-debug.log*
        echo yarn-error.log*
        echo *.log
        echo .vscode/
        echo .idea/
        echo database-export.sql
    ) > .gitignore
    echo [√] .gitignore created
)

REM Add all files
echo.
echo [*] Adding files to Git...
git add .

REM Commit
echo.
echo [*] Committing changes...
git commit -m "Prepare for Render deployment"
if %errorlevel% neq 0 (
    echo [!] No changes to commit
)

echo.
echo ========================================
echo [√] READY FOR DEPLOYMENT!
echo ========================================
echo.
echo NEXT STEPS:
echo.
echo 1. Create a GitHub repository
echo    - Go to: https://github.com/new
echo.
echo 2. Push your code:
echo    git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 3. Follow RENDER_DEPLOYMENT.md guide
echo    - Open: RENDER_DEPLOYMENT.md
echo.
echo 4. Deploy on Render:
echo    - Go to: https://dashboard.render.com
echo    - Click 'New +' -^> 'Web Service'
echo    - Connect your GitHub repo
echo.
echo Environment variables template: RENDER_ENV_VARIABLES.txt
echo Full guide: RENDER_DEPLOYMENT.md
echo.

pause
