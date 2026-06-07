@echo off
cd /d "%~dp0"
echo ================================================
echo   SirajOne Full Deployment
echo ================================================
echo.

echo [1/4] Checking Firebase login...
firebase projects:list > nul 2>&1
if errorlevel 1 (
  echo Not logged in. Running firebase login...
  firebase login
)

echo.
echo [2/4] Deploying Firebase security rules...
firebase deploy --only firestore:rules,storage
if errorlevel 1 (
  echo ERROR: Firebase deploy failed. Check above for details.
  pause
  exit /b 1
)

echo.
echo [3/4] Staging all changes for git...
git add .
git status

echo.
echo [4/4] Committing and pushing to Vercel...
git commit -m "feat: counselling ecosystem architecture, storage rules, firestore rules update"
git push

echo.
echo ================================================
echo   Deployment complete!
echo   - Firebase rules: LIVE
echo   - Vercel build: triggered (check vercel.com)
echo ================================================
echo.
pause
