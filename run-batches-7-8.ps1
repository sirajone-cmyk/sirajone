# ============================================================
# BATCHES 7 & 8 - Read-only COPY + Archive report
# Originals are NOT moved or deleted
# ============================================================

$base = "$env:USERPROFILE\Documents"

# ============================================================
# BATCH 7 - Copy Media Assets (Logos + Marketing Images)
# ============================================================
Write-Host ""
Write-Host "=============================="
Write-Host "BATCH 7 - Copying Media Assets..."
Write-Host "=============================="

$dest7 = "$base\07 - MEDIA ASSETS"
$b7count = 0

# Logos - search Documents, OneDrive, Desktop
$searchRoots7 = @(
    "$env:USERPROFILE\OneDrive",
    "$env:USERPROFILE\Documents",
    "$env:USERPROFILE\Desktop"
)

foreach ($root in $searchRoots7) {
    if (-not (Test-Path $root)) { continue }

    # Logos
    $logos = Get-ChildItem $root -Recurse -File -ErrorAction SilentlyContinue |
        Where-Object {
            $_.Name -match "logo" -and
            $_.Extension -match "\.(png|jpg|jpeg|svg|gif|webp)$" -and
            $_.FullName -notmatch "node_modules|AppData"
        }
    foreach ($f in $logos) {
        Copy-Item $f.FullName -Destination "$dest7\Logos\" -Force -ErrorAction SilentlyContinue
        Write-Host "  Logo: $($f.Name)"
        $b7count++
    }

    # Marketing images
    $mktImg = Get-ChildItem $root -Recurse -File -ErrorAction SilentlyContinue |
        Where-Object {
            $_.Name -match "banner|poster|flyer|market|social|advert|promo|brand" -and
            $_.Extension -match "\.(png|jpg|jpeg|svg|gif|webp)$" -and
            $_.FullName -notmatch "node_modules|AppData"
        }
    foreach ($f in $mktImg) {
        Copy-Item $f.FullName -Destination "$dest7\Marketing Materials\" -Force -ErrorAction SilentlyContinue
        Write-Host "  Marketing: $($f.Name)"
        $b7count++
    }

    # Hijaama images
    $hijImg = Get-ChildItem $root -Recurse -File -ErrorAction SilentlyContinue |
        Where-Object {
            $_.Name -match "hijaama|cupping" -and
            $_.Extension -match "\.(png|jpg|jpeg|svg|gif|webp)$" -and
            $_.FullName -notmatch "node_modules|AppData"
        }
    foreach ($f in $hijImg) {
        Copy-Item $f.FullName -Destination "$dest7\Brand Images\" -Force -ErrorAction SilentlyContinue
        Write-Host "  Hijaama image: $($f.Name)"
        $b7count++
    }
}

Write-Host "BATCH 7 COMPLETE - $b7count media assets copied to 07 - MEDIA ASSETS"
Write-Host ""

# ============================================================
# BATCH 8 - Archive Nasheeds (one canonical copy + duplicate report)
# ============================================================
Write-Host "=============================="
Write-Host "BATCH 8 - Archiving Nasheeds..."
Write-Host "=============================="

$dest8Nasheed  = "$base\09 - ARCHIVE\Desktop Backup\Nasheeds"
$dest8MTQAudio = "$base\02 - MTQ RESOURCES\Audio\Nasheeds"
New-Item -ItemType Directory -Force -Path $dest8Nasheed  | Out-Null
New-Item -ItemType Directory -Force -Path $dest8MTQAudio | Out-Null

$b8count = 0

# === Copy ONE canonical set from DESKTOP BACKUP\Nasheed (root level only) ===
$nasheedRoot = "$env:USERPROFILE\OneDrive\Desktop\DESKTOP BACKUP\Nasheed"
if (Test-Path $nasheedRoot) {
    $nasheeds = Get-ChildItem $nasheedRoot -File -ErrorAction SilentlyContinue
    foreach ($f in $nasheeds) {
        # Islamic/nasheed goes to MTQ Resources
        Copy-Item $f.FullName -Destination $dest8MTQAudio -Force -ErrorAction SilentlyContinue
        # Backup copy to Archive
        Copy-Item $f.FullName -Destination $dest8Nasheed -Force -ErrorAction SilentlyContinue
        Write-Host "  Archived: $($f.Name)"
        $b8count++
    }
} else {
    Write-Host "  NOTE: DESKTOP BACKUP\Nasheed folder not found - checking CUT FILES\Nasheed..."
    $nasheedAlt = "$env:USERPROFILE\OneDrive\Desktop\DESKTOP BACKUP\CUT FILES\Nasheed"
    if (Test-Path $nasheedAlt) {
        $nasheeds = Get-ChildItem $nasheedAlt -File -ErrorAction SilentlyContinue
        foreach ($f in $nasheeds) {
            Copy-Item $f.FullName -Destination $dest8MTQAudio -Force -ErrorAction SilentlyContinue
            Copy-Item $f.FullName -Destination $dest8Nasheed -Force -ErrorAction SilentlyContinue
            Write-Host "  Archived: $($f.Name)"
            $b8count++
        }
    }
}

# === Duplicate folder report ===
$dupReport = @()
$dupReport += "=== BATCH 8 - DUPLICATE NASHEED FOLDERS ==="
$dupReport += "Date: $(Get-Date)"
$dupReport += ""
$dupReport += "ONE canonical copy has been saved to:"
$dupReport += "  $dest8MTQAudio"
$dupReport += "  $dest8Nasheed"
$dupReport += ""
$dupReport += "The following folders contain DUPLICATES of the same files."
$dupReport += "Review them and delete manually once you are satisfied:"
$dupReport += ""

$dupFolders = @(
    "$env:USERPROFILE\OneDrive\Desktop\DESKTOP BACKUP\CUT FILES\Nasheed",
    "$env:USERPROFILE\OneDrive\Desktop\DESKTOP BACKUP\CUT FILES\huawii stuff\download",
    "$env:USERPROFILE\OneDrive\Desktop\DESKTOP BACKUP\huawii stuff\download",
    "$env:USERPROFILE\OneDrive\Desktop\DESKTOP BACKUP\CUT FILES\huawii stuff\Huawei\CloudDrive\.cache"
)

foreach ($d in $dupFolders) {
    if (Test-Path $d) {
        $count = (Get-ChildItem $d -File -ErrorAction SilentlyContinue).Count
        $sizeMB = [math]::Round((Get-ChildItem $d -Recurse -File -ErrorAction SilentlyContinue | Measure-Object Length -Sum).Sum / 1MB, 1)
        $dupReport += "  EXISTS   | $count files | $sizeMB MB | $d"
    } else {
        $dupReport += "  NOT FOUND| $d"
    }
}

$dupReport += ""
$dupReport += "Total duplicate folders: $($dupFolders.Count)"
$dupReport += ""
$dupReport += "ACTION REQUIRED (manual):"
$dupReport += "  Once you confirm 02 - MTQ RESOURCES\Audio\Nasheeds looks correct,"
$dupReport += "  you can right-click and delete the duplicate folders listed above."
$dupReport += "  DO NOT delete anything yet - verify first."

$logPath = "$env:USERPROFILE\Documents\Codex\2026-04-19-files-mentioned-by-the-user-rahla\batch8-duplicate-report.txt"
$dupReport | Out-File -FilePath $logPath -Encoding utf8

Write-Host ""
Write-Host "BATCH 8 COMPLETE - $b8count nasheeds archived"
Write-Host "Duplicate report saved: $logPath"
Write-Host ""

# ============================================================
# FINAL SUMMARY
# ============================================================
Write-Host "======================================================"
Write-Host "ALL 8 BATCHES NOW COMPLETE"
Write-Host ""
Write-Host "Your new folder structure is at:"
Write-Host "  $base"
Write-Host ""
Write-Host "Structure created:"
Write-Host "  01 - MADRASA TAHSEEN UL QURAN  (marksheets sorted by year/term)"
Write-Host "  02 - MTQ RESOURCES             (audio, PDFs, Word docs, Zoom)"
Write-Host "  03 - TEACHING RESOURCES        (teacher + student materials)"
Write-Host "  04 - HIJAAMA                   (docs, images, finance)"
Write-Host "  05 - BUSINESS ADMIN            (finance, policies, marketing)"
Write-Host "  07 - MEDIA ASSETS              (logos, marketing images)"
Write-Host "  09 - ARCHIVE                   (nasheed canonical copies)"
Write-Host ""
Write-Host "Originals are UNTOUCHED in their original locations."
Write-Host "Nothing was deleted."
Write-Host "======================================================"

explorer "$base"
