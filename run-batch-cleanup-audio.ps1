# ============================================================
# AUDIO CLEANUP — Delete all audio EXCEPT original letter recordings
# Targets: Desktop BACKUP, Downloads audio, letters-audio-renamed
# KEEPS:   rahla letters-audio 2026-04-19 (original recordings)
#          Zoom class recordings (teaching sessions)
# ============================================================

$keepFolder   = "$env:USERPROFILE\Documents\Codex\2026-04-19-files-mentioned-by-the-user-rahla\rahla letters-audio 2026-04-19"
$deleteTargets = @(
    "$env:USERPROFILE\OneDrive\Desktop\DESKTOP BACKUP",
    "$env:USERPROFILE\Downloads",
    "$env:USERPROFILE\Documents\Codex\2026-04-19-files-mentioned-by-the-user-rahla\letters-audio-renamed"
)
$audioExts = @("*.mp3","*.m4a","*.wav","*.ogg","*.aac")

# ============================================================
# STEP 1 — DRY RUN: Show what will be deleted
# ============================================================
Write-Host ""
Write-Host "=============================="
Write-Host "DRY RUN — Files to be deleted"
Write-Host "=============================="
Write-Host "KEEPING: $keepFolder"
Write-Host ""

$toDelete = @()

foreach ($root in $deleteTargets) {
    if (-not (Test-Path $root)) { continue }
    foreach ($ext in $audioExts) {
        $files = Get-ChildItem $root -Recurse -Filter $ext -File -ErrorAction SilentlyContinue |
            Where-Object { $_.FullName -notmatch [regex]::Escape($keepFolder) }
        foreach ($f in $files) {
            $toDelete += $f
            Write-Host "  DELETE: $($f.FullName)  [$([math]::Round($f.Length/1MB,2)) MB]"
        }
    }
}

$totalMB = [math]::Round(($toDelete | Measure-Object Length -Sum).Sum / 1MB, 1)
Write-Host ""
Write-Host "=============================="
Write-Host "Total files to delete: $($toDelete.Count)"
Write-Host "Total size to free:    $totalMB MB"
Write-Host "=============================="
Write-Host ""
Write-Host "Letter recordings that will be KEPT:"
Get-ChildItem $keepFolder -File -ErrorAction SilentlyContinue | ForEach-Object { Write-Host "  KEEP: $($_.Name)" }
Write-Host ""

# ============================================================
# STEP 2 — Confirmation required
# ============================================================
Write-Host "----------------------------------------------"
Write-Host "Type  YES  and press Enter to permanently delete these $($toDelete.Count) files."
Write-Host "Type anything else to CANCEL."
Write-Host "----------------------------------------------"
$confirm = Read-Host "Confirm"

if ($confirm -ne "YES") {
    Write-Host ""
    Write-Host "CANCELLED — No files deleted."
    exit
}

# ============================================================
# STEP 3 — Delete
# ============================================================
Write-Host ""
Write-Host "Deleting..."
$deleted = 0
$failed  = 0
$log     = @()

foreach ($f in $toDelete) {
    try {
        Remove-Item $f.FullName -Force -ErrorAction Stop
        $deleted++
        $log += "DELETED: $($f.FullName)"
    } catch {
        $failed++
        $log += "FAILED:  $($f.FullName) — $($_.Exception.Message)"
        Write-Host "  FAILED: $($f.Name)"
    }
}

# Save deletion log
$logPath = "$env:USERPROFILE\Documents\Codex\2026-04-19-files-mentioned-by-the-user-rahla\audio-cleanup-log.txt"
$log | Out-File -FilePath $logPath -Encoding utf8

Write-Host ""
Write-Host "=============================="
Write-Host "CLEANUP COMPLETE"
Write-Host "Deleted: $deleted files ($totalMB MB freed)"
if ($failed -gt 0) { Write-Host "Failed:  $failed files (check log)" }
Write-Host "Log saved: $logPath"
Write-Host ""
Write-Host "Original letter recordings kept at:"
Write-Host "  $keepFolder"
Write-Host "=============================="
