@echo off
cd /d "%~dp0"
echo Deploying Firestore and Storage security rules...
firebase deploy --only firestore:rules,storage
echo.
echo Done. Press any key to close.
pause > nul
