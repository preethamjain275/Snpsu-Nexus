Write-Host "Starting SNPSU Nexus Server..." -ForegroundColor Green
Write-Host ""
Write-Host "Make sure you're in the project directory!" -ForegroundColor Yellow
Write-Host ""
try {
    node server.js
} catch {
    Write-Host "Error starting server: $_" -ForegroundColor Red
    Read-Host "Press Enter to continue"
}
