@echo off
echo Starting SNPSU Nexus Server...
echo.
echo Make sure you're in the correct directory:
cd /d "C:\Users\DELL\OneDrive\Desktop\Project final\Project final"
echo Current directory: %CD%
echo.
echo Starting server on http://localhost:3000
echo Press Ctrl+C to stop the server
echo.
node server.js
pause
