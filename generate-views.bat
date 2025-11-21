@echo off
REM Windows Batch Script to Generate All EJS View Templates

echo Generating all EJS view templates...
node create-all-views.js

if %errorlevel% equ 0 (
    echo.
    echo ✓ View templates created successfully
) else (
    echo.
    echo × Error creating view templates
)

pause
