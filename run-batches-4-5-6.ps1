# ============================================================
# BATCHES 4, 5, 6 - Read-only COPY operations
# Originals are NOT moved or deleted
# ============================================================

$base = "$env:USERPROFILE\Documents"

# ============================================================
# BATCH 4 - Copy Hijaama Resources
# ============================================================
Write-Host ""
Write-Host "=============================="
Write-Host "BATCH 4 - Copying Hijaama resources..."
Write-Host "=============================="

$dest4 = "$base\04 - HIJAAMA"
$b4count = 0

$hijaama = Get-ChildItem "$env:USERPROFILE\OneDrive" -Recurse -File -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -match "hijaama|cupping" -and $_.FullName -notmatch "node_modules|AppData" }

foreach ($f in $hijaama) {
    $ext = $f.Extension.ToLower()
    $subDest = switch -Regex ($ext) {
        "\.docx?$|\.txt$|\.rtf$" { "$dest4\Client Resources" }
        "\.pdf$"                  { "$dest4\Client Resources" }
        "\.png$|\.jpg$|\.jpeg$|\.svg$|\.gif$|\.webp$" { "$dest4\Images" }
        "\.xlsx?$|\.xlsm$"       { "$dest4\Finance" }
        default                   { "$dest4\Client Resources" }
    }
    Copy-Item $f.FullName -Destination $subDest -Force -ErrorAction SilentlyContinue
    Write-Host "  Copied: $($f.Name) -> $subDest"
    $b4count++
}

Write-Host "BATCH 4 COMPLETE - $b4count files copied to 04 - HIJAAMA"
Write-Host ""

# ============================================================
# BATCH 5 - Copy Business Admin Files
# ============================================================
Write-Host "=============================="
Write-Host "BATCH 5 - Copying Business Admin files..."
Write-Host "=============================="

$dest5 = "$base\05 - BUSINESS ADMIN"
$b5count = 0

# Finance - Fresha fee activity files
$financeFiles = Get-ChildItem "$env:USERPROFILE\OneDrive\Desktop\DESKTOP BACKUP" -Recurse -File -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -match "fresha|fee_activity" }
foreach ($f in $financeFiles) {
    Copy-Item $f.FullName -Destination "$dest5\Finance\Fees\" -Force -ErrorAction SilentlyContinue
    Write-Host "  Copied (Finance): $($f.Name)"
    $b5count++
}

# Finance Word/PDF docs from OneDrive
$financeDoc = Get-ChildItem "$env:USERPROFILE\OneDrive" -Recurse -File -ErrorAction SilentlyContinue |
    Where-Object {
        $_.Name -match "financ|invoice|receipt|payment|budget" -and
        $_.Extension -match "\.(docx?|pdf|xlsx?)$" -and
        $_.FullName -notmatch "node_modules|AppData|BACKUP"
    }
foreach ($f in $financeDoc) {
    $subDest = if ($f.Extension -match "\.xlsx?$") { "$dest5\Finance\Budgets" } else { "$dest5\Finance\Invoices" }
    Copy-Item $f.FullName -Destination $subDest -Force -ErrorAction SilentlyContinue
    Write-Host "  Copied (Finance Doc): $($f.Name)"
    $b5count++
}

# Policy / Legal docs
$policyFiles = Get-ChildItem "$env:USERPROFILE\OneDrive" -Recurse -File -ErrorAction SilentlyContinue |
    Where-Object {
        $_.Name -match "policy|legal|contract|terms|gdpr|safeguard" -and
        $_.Extension -match "\.(docx?|pdf)$" -and
        $_.FullName -notmatch "node_modules|AppData"
    }
foreach ($f in $policyFiles) {
    Copy-Item $f.FullName -Destination "$dest5\Policies and Legal\" -Force -ErrorAction SilentlyContinue
    Write-Host "  Copied (Policy): $($f.Name)"
    $b5count++
}

# Marketing docs/PDFs
$marketingFiles = Get-ChildItem "$env:USERPROFILE\OneDrive" -Recurse -File -ErrorAction SilentlyContinue |
    Where-Object {
        $_.Name -match "market|flyer|poster|brochure|promo" -and
        $_.Extension -match "\.(docx?|pdf|pptx?)$" -and
        $_.FullName -notmatch "node_modules|AppData"
    }
foreach ($f in $marketingFiles) {
    Copy-Item $f.FullName -Destination "$dest5\Marketing\" -Force -ErrorAction SilentlyContinue
    Write-Host "  Copied (Marketing): $($f.Name)"
    $b5count++
}

Write-Host "BATCH 5 COMPLETE - $b5count files copied to 05 - BUSINESS ADMIN"
Write-Host ""

# ============================================================
# BATCH 6 - Copy Term Marksheets sorted by year/term
# ============================================================
Write-Host "=============================="
Write-Host "BATCH 6 - Sorting and copying Term Marksheets..."
Write-Host "=============================="

$dest6base = "$base\01 - MADRASA TAHSEEN UL QURAN\Academic Records"
$b6count = 0
$b6log = @()

$marksheets = Get-ChildItem "$env:USERPROFILE\OneDrive" -Recurse -File -ErrorAction SilentlyContinue |
    Where-Object {
        $_.Extension -match "\.(xlsx?|xlsm|csv)$" -and
        $_.FullName -notmatch "node_modules|AppData|BACKUP|Codex|New project" -and
        ($_.Name -match "mark|term|grade|gr[0-9]|tajweed|roster|attendance|prefect|timetable|marksheet|conversion|converted|TSA|score")
    }

foreach ($f in $marksheets) {
    $n = $f.BaseName.ToLower()

    # Detect academic year
    $year = "2025-2026"
    if ($n -match "2023") { $year = "2023-2024" }
    elseif ($n -match "2024") { $year = "2024-2025" }
    elseif ($n -match "2025") { $year = "2025-2026" }
    elseif ($n -match "2026") { $year = "2025-2026" }

    # Detect term
    $term = "Term 1"
    if ($n -match "1st|term.?1|\bt1\b|first") { $term = "Term 1" }
    elseif ($n -match "2nd|term.?2|\bt2\b|second") { $term = "Term 2" }
    elseif ($n -match "3rd|term.?3|\bt3\b|third") { $term = "Term 3" }
    elseif ($n -match "4th|term.?4|\bt4\b|fourth") { $term = "Term 4" }

    $targetDir = "$dest6base\$year\$term"
    New-Item -ItemType Directory -Force -Path $targetDir | Out-Null
    Copy-Item $f.FullName -Destination $targetDir -Force -ErrorAction SilentlyContinue

    $logLine = "$year | $term | $($f.Name)"
    $b6log += $logLine
    Write-Host "  $logLine"
    $b6count++
}

# Save a sort log so you can review what went where
$logPath = "$env:USERPROFILE\Documents\Codex\2026-04-19-files-mentioned-by-the-user-rahla\batch6-marksheet-log.txt"
$b6log | Out-File -FilePath $logPath -Encoding utf8
Write-Host ""
Write-Host "Sort log saved: $logPath"
Write-Host "BATCH 6 COMPLETE - $b6count marksheets copied and sorted"
Write-Host ""

# ============================================================
# SUMMARY
# ============================================================
Write-Host "=============================="
Write-Host "ALL 3 BATCHES (4, 5, 6) COMPLETE"
Write-Host "Originals are untouched."
Write-Host ""
Write-Host "04 - HIJAAMA           -> $base\04 - HIJAAMA"
Write-Host "05 - BUSINESS ADMIN    -> $base\05 - BUSINESS ADMIN"
Write-Host "01 - MADRASA (marks)   -> $dest6base"
Write-Host "=============================="
explorer "$base"
