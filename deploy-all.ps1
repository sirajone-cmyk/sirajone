Set-Location $PSScriptRoot
Write-Host "=== SirajOne Full Deploy ===" -ForegroundColor Cyan

Write-Host "[1/4] Building app..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) { Write-Host "Build failed." -ForegroundColor Red; pause; exit 1 }

Write-Host "[2/4] Deploying Firebase rules..." -ForegroundColor Yellow
firebase deploy --only firestore:rules,storage
if ($LASTEXITCODE -ne 0) { Write-Host "Firebase failed. Run: firebase login" -ForegroundColor Red; pause; exit 1 }

Write-Host "[3/4] Committing changes..." -ForegroundColor Yellow
git add .
git commit -m "feat: counselling ecosystem and security rules"

Write-Host "[4/4] Pushing to Vercel..." -ForegroundColor Yellow
git push

Write-Host "=== Done! Firebase LIVE. Vercel building. ===" -ForegroundColor Green
pause
