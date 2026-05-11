Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Write-Host "Services RESTOMASTER arretes." -ForegroundColor Yellow
