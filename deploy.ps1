# deploy.ps1 — SirajOne full deploy script (Windows PowerShell)
# Usage: .\deploy.ps1 [-RulesOnly]
# Requires: git, firebase CLI, vercel CLI (all logged in)

param(
    [switch]$RulesOnly
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "╔══════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║    SirajOne Deploy Script            ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# ── 1. Deploy Firestore rules ──────────────────────────────────────────────────
Write-Host "▶ Deploying Firestore rules..." -ForegroundColor Yellow
firebase deploy --only firestore:rules
Write-Host "  ✓ Firestore rules deployed" -ForegroundColor Green

# ── 2. Deploy Firestore indexes ────────────────────────────────────────────────
Write-Host "▶ Deploying Firestore indexes..." -ForegroundColor Yellow
firebase deploy --only firestore:indexes
Write-Host "  ✓ Firestore indexes deployed" -ForegroundColor Green

if ($RulesOnly) {
    Write-Host ""
    Write-Host "✅ Rules-only deploy complete." -ForegroundColor Green
    exit 0
}

# ── 3. Git: stage, commit, push ────────────────────────────────────────────────
Write-Host ""
Write-Host "▶ Git status:" -ForegroundColor Yellow
git status --short

Write-Host ""
$msg = Read-Host "Enter commit message (or press Enter to skip git push)"

if ($msg -ne "") {
    git add -A
    git commit -m $msg
    git push origin main
    Write-Host "  ✓ Pushed to main" -ForegroundColor Green
} else {
    Write-Host "  ⚠ Skipped git commit (no message provided)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ Deploy complete — check Vercel dashboard for build status." -ForegroundColor Green
Write-Host "   https://vercel.com/dashboard" -ForegroundColor Cyan
Write-Host ""
