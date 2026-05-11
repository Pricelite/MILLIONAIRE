$ErrorActionPreference = "Stop"

Write-Host "[RESTOMASTER] Demarrage des services..." -ForegroundColor Cyan

$api = Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "cd C:\dev\MILLIONAIRE; pnpm.cmd --filter @restomaster/api dev" -PassThru
$web = Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "cd C:\dev\MILLIONAIRE; pnpm.cmd --filter @restomaster/web dev" -PassThru

Write-Host "API PID: $($api.Id)" -ForegroundColor Yellow
Write-Host "WEB PID: $($web.Id)" -ForegroundColor Yellow
Write-Host "URL WEB: http://localhost:3000/login" -ForegroundColor Green
Write-Host "Compte: antoniwelh@gmail.com / Anthony45" -ForegroundColor Green
