# =============================================================================
# deploy-phase9.ps1 — SirajOne Phase 9 Deploy Script
# Run from the project root: .\deploy-phase9.ps1
# =============================================================================
# BEFORE RUNNING:
#   1. Make sure you are logged into Firebase CLI:  firebase login
#   2. Link the Firebase project (once only):       firebase use --add sirajone-786
#   3. Run the build on Windows:                    npm run build
# =============================================================================

Set-Location $PSScriptRoot
Write-Host "`n=== SirajOne Phase 9 Deploy ===" -ForegroundColor Cyan

# ---------------------------------------------------------------------------
# STEP 1: Delete 13 unused *Page.jsx files
# ---------------------------------------------------------------------------
Write-Host "`n[1/5] Deleting unused *Page.jsx files..." -ForegroundColor Yellow

$filesToDelete = @(
  "src\pages\AdminDashboardPage.jsx",
  "src\pages\ContactPage.jsx",
  "src\pages\DashboardPage.jsx",
  "src\pages\EnrollPage.jsx",
  "src\pages\GuidePage.jsx",
  "src\pages\HomePage.jsx",
  "src\pages\LearnPage.jsx",
  "src\pages\LibraryPage.jsx",
  "src\pages\MessagesPage.jsx",
  "src\pages\ProgramsPage.jsx",
  "src\pages\RulesPage.jsx",
  "src\pages\SupportPage.jsx",
  "src\pages\TeachersPage.jsx"
)

foreach ($file in $filesToDelete) {
  $fullPath = Join-Path $PSScriptRoot $file
  if (Test-Path $fullPath) {
    Remove-Item $fullPath -Force
    Write-Host "  Deleted: $file" -ForegroundColor DarkGray
  } else {
    Write-Host "  Skipped (not found): $file" -ForegroundColor DarkGray
  }
}

Write-Host "  Done." -ForegroundColor Green

# ---------------------------------------------------------------------------
# STEP 2: Stage all changes
# ---------------------------------------------------------------------------
Write-Host "`n[2/5] Staging all changes (git add)..." -ForegroundColor Yellow
git add .
if ($LASTEXITCODE -ne 0) { Write-Host "ERROR: git add failed" -ForegroundColor Red; exit 1 }
Write-Host "  Done." -ForegroundColor Green

# ---------------------------------------------------------------------------
# STEP 3: Commit
# ---------------------------------------------------------------------------
Write-Host "`n[3/5] Committing..." -ForegroundColor Yellow
git commit -m "feat(phase9): legal pages, security fixes, counselling portal, updated dashboards

- Add PrivacyPolicy.jsx (POPIA-compliant, 12 sections)
- Add TermsOfService.jsx (14 sections, South African law)
- Add CounsellingDisclaimer.jsx (SADAG crisis resources included)
- Wire /privacy, /terms, /counselling-disclaimer as public routes in App.jsx
- Add legal links to Footer.jsx
- Fix storage.rules: counselling files restricted to admin + owning counsellor
- Update letterAudioMap.js: switch from .mp3 to .m4a (29 recorded files)
- Add CounsellorPortal.jsx (professional case management)
- Add CounsellingClientDashboard.jsx (9-section client portal)
- Add AdminDashboard.jsx (full admin command centre)
- Update Firestore rules: comprehensive role-based access
- Delete 13 unused *Page.jsx stub files
- Fix AuthContext registration race condition (3s wait)
- Add StudentNotificationToast global component"

if ($LASTEXITCODE -ne 0) { Write-Host "ERROR: git commit failed" -ForegroundColor Red; exit 1 }
Write-Host "  Done." -ForegroundColor Green

# ---------------------------------------------------------------------------
# STEP 4: Push to GitHub (triggers Vercel deploy)
# ---------------------------------------------------------------------------
Write-Host "`n[4/5] Pushing to GitHub (main)..." -ForegroundColor Yellow
git push origin main
if ($LASTEXITCODE -ne 0) { Write-Host "ERROR: git push failed" -ForegroundColor Red; exit 1 }
Write-Host "  Pushed. Vercel will auto-deploy." -ForegroundColor Green

# ---------------------------------------------------------------------------
# STEP 5: Deploy Firebase rules only
# ---------------------------------------------------------------------------
Write-Host "`n[5/5] Deploying Firebase security rules..." -ForegroundColor Yellow
firebase deploy --only firestore:rules,storage
if ($LASTEXITCODE -ne 0) {
  Write-Host "ERROR: Firebase deploy failed." -ForegroundColor Red
  Write-Host "  If you see 'project not set', run: firebase use --add sirajone-786" -ForegroundColor Yellow
  exit 1
}
Write-Host "  Firebase rules deployed." -ForegroundColor Green

# ---------------------------------------------------------------------------
# Done
# ---------------------------------------------------------------------------
Write-Host "`n=== Phase 9 Complete ===" -ForegroundColor Cyan
Write-Host "  GitHub: https://github.com/sirajone-cmyk/sirajone" -ForegroundColor White
Write-Host "  Live site will update in 1-3 minutes via Vercel." -ForegroundColor White
Write-Host "  Firebase rules are live immediately." -ForegroundColor White
Write-Host ""
