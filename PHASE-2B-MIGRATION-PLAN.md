# Phase 2B — Final Migration Plan
**Date:** 7 June 2026 | **Status:** APPROVED — Awaiting batch-by-batch execution
**Rule:** Each batch requires your "RUN BATCH X" approval before execution.
**No files will be deleted** — only moved. Archive folder holds everything uncertain.

---

## EXECUTION ORDER — 8 Batches (Low risk → High risk)

| Batch | Action | Files | Risk | Status |
|---|---|---|---|---|
| BATCH 1 | Create full folder structure | 0 (folders only) | 🟢 None | Pending |
| BATCH 2 | Move MTQ Resources | ~250 | 🟢 Low | Pending |
| BATCH 3 | Move Teaching Resources | ~100 | 🟢 Low | Pending |
| BATCH 4 | Move Hijaama Resources | ~70 | 🟢 Low | Pending |
| BATCH 5 | Move Business Admin files | ~65 | 🟢 Low | Pending |
| BATCH 6 | Move Term Marksheets | ~144 | 🟡 Medium | Pending |
| BATCH 7 | Move Media Assets (logos, marketing) | ~20 | 🟢 Low | Pending |
| BATCH 8 | Archive Desktop BACKUP duplicates | ~400 | 🟡 Medium | Pending |

**Not touched (manual review required):**
- 2,113 uncategorised Word docs
- 1,105 uncategorised PDFs
- 3,620 uncategorised images
- 54 videos

---

## BATCH 1 — Create Folder Structure
**Risk:** 🟢 None | **Action:** mkdir only, no files moved

```powershell
$base = "$env:USERPROFILE\Documents"
$folders = @(
    "01 - MADRASA TAHSEEN UL QURAN\Academic Records\2023-2024\Term 1",
    "01 - MADRASA TAHSEEN UL QURAN\Academic Records\2023-2024\Term 2",
    "01 - MADRASA TAHSEEN UL QURAN\Academic Records\2023-2024\Term 3",
    "01 - MADRASA TAHSEEN UL QURAN\Academic Records\2023-2024\Term 4",
    "01 - MADRASA TAHSEEN UL QURAN\Academic Records\2024-2025\Term 1",
    "01 - MADRASA TAHSEEN UL QURAN\Academic Records\2024-2025\Term 2",
    "01 - MADRASA TAHSEEN UL QURAN\Academic Records\2024-2025\Term 3",
    "01 - MADRASA TAHSEEN UL QURAN\Academic Records\2024-2025\Term 4",
    "01 - MADRASA TAHSEEN UL QURAN\Academic Records\2025-2026\Term 1",
    "01 - MADRASA TAHSEEN UL QURAN\Academic Records\2025-2026\Term 2",
    "01 - MADRASA TAHSEEN UL QURAN\Academic Records\2025-2026\Term 3",
    "01 - MADRASA TAHSEEN UL QURAN\Academic Records\2025-2026\Term 4",
    "01 - MADRASA TAHSEEN UL QURAN\Assessments",
    "01 - MADRASA TAHSEEN UL QURAN\Attendance",
    "01 - MADRASA TAHSEEN UL QURAN\Reports",
    "01 - MADRASA TAHSEEN UL QURAN\Admin",
    "02 - MTQ RESOURCES\Audio\Quran Recitations",
    "02 - MTQ RESOURCES\Audio\Class Recordings",
    "02 - MTQ RESOURCES\Audio\Nasheeds",
    "02 - MTQ RESOURCES\Audio\Letter Audio",
    "02 - MTQ RESOURCES\Video\Lessons",
    "02 - MTQ RESOURCES\Video\Fiqh",
    "02 - MTQ RESOURCES\PDFs\Tajweed Materials",
    "02 - MTQ RESOURCES\PDFs\Fiqh of Fasting",
    "02 - MTQ RESOURCES\Word Docs",
    "02 - MTQ RESOURCES\Presentations",
    "03 - TEACHING RESOURCES\Teacher Materials",
    "03 - TEACHING RESOURCES\Student Handouts",
    "03 - TEACHING RESOURCES\Lesson Plans",
    "03 - TEACHING RESOURCES\Schemes of Work",
    "04 - HIJAAMA\Client Resources",
    "04 - HIJAAMA\Marketing",
    "04 - HIJAAMA\Finance",
    "04 - HIJAAMA\Policies",
    "04 - HIJAAMA\Images",
    "05 - BUSINESS ADMIN\Finance\Invoices",
    "05 - BUSINESS ADMIN\Finance\Fees",
    "05 - BUSINESS ADMIN\Finance\Budgets",
    "05 - BUSINESS ADMIN\Policies and Legal",
    "05 - BUSINESS ADMIN\Marketing",
    "05 - BUSINESS ADMIN\Admin Documents",
    "06 - COUNSELLING\Resources",
    "06 - COUNSELLING\Policies",
    "06 - COUNSELLING\Templates",
    "07 - MEDIA ASSETS\Logos",
    "07 - MEDIA ASSETS\Brand Images",
    "07 - MEDIA ASSETS\Marketing Materials",
    "07 - MEDIA ASSETS\Videos",
    "09 - ARCHIVE\Desktop Backup",
    "09 - ARCHIVE\Old Files"
)
foreach ($f in $folders) {
    New-Item -ItemType Directory -Force -Path "$base\$f" | Out-Null
}
Write-Host "BATCH 1 COMPLETE — All folders created"
explorer "$base"
```

---

## BATCH 2 — MTQ Resources
**Risk:** 🟢 Low | **Moves:** MTQ PDFs, Word docs, Zoom class recordings, Quran audio

```powershell
$dest = "$env:USERPROFILE\Documents\02 - MTQ RESOURCES"

# MTQ PDFs from Desktop BACKUP
$mtqPdfs = Get-ChildItem "$env:USERPROFILE\OneDrive\Desktop\DESKTOP BACKUP\MTQ" -Recurse -Filter "*.pdf" -ErrorAction SilentlyContinue
foreach ($f in $mtqPdfs) { Copy-Item $f.FullName -Destination "$dest\PDFs\Tajweed Materials\" -Force }

# MTQ Word docs (named with mtq/quran/tajweed/makhraj)
$mtqDocs = Get-ChildItem "$env:USERPROFILE\OneDrive" -Recurse -Filter "*.docx" -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -match "mtq|quran|tajweed|makhraj" -and $_.FullName -notmatch "node_modules" }
foreach ($f in $mtqDocs) { Copy-Item $f.FullName -Destination "$dest\Word Docs\" -Force }

# Zoom class recordings
$zoom = Get-ChildItem "$env:USERPROFILE\OneDrive\Documents\Zoom" -Recurse -File -ErrorAction SilentlyContinue
foreach ($f in $zoom) { Copy-Item $f.FullName -Destination "$dest\Audio\Class Recordings\" -Force }

# Quran recitation MP3s (one copy only — from DESKTOP BACKUP root, not subfolders)
$quranAudio = Get-ChildItem "$env:USERPROFILE\OneDrive\Desktop\DESKTOP BACKUP" -MaxDepth 1 -Filter "*.mp3" -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -match "Surah|Quran|Recitation|Baqarah|Qamar|Naba|Naziat|Najm" }
foreach ($f in $quranAudio) { Copy-Item $f.FullName -Destination "$dest\Audio\Quran Recitations\" -Force }

Write-Host "BATCH 2 COMPLETE"
```

---

## BATCH 3 — Teaching Resources
**Risk:** 🟢 Low | **Moves:** Teacher and student Word docs/PDFs

```powershell
$dest3t = "$env:USERPROFILE\Documents\03 - TEACHING RESOURCES\Teacher Materials"
$dest3s = "$env:USERPROFILE\Documents\03 - TEACHING RESOURCES\Student Handouts"

# Teacher docs
$teacherDocs = Get-ChildItem "$env:USERPROFILE\OneDrive" -Recurse -File -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -match "teacher|lesson|scheme|plan" -and $_.FullName -notmatch "node_modules|BACKUP" -and $_.Extension -match "docx|doc|pdf" }
foreach ($f in $teacherDocs) { Copy-Item $f.FullName -Destination $dest3t -Force }

# Student docs
$studentDocs = Get-ChildItem "$env:USERPROFILE\OneDrive" -Recurse -File -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -match "student|pupil|handout|worksheet" -and $_.FullName -notmatch "node_modules|BACKUP" -and $_.Extension -match "docx|doc|pdf" }
foreach ($f in $studentDocs) { Copy-Item $f.FullName -Destination $dest3s -Force }

Write-Host "BATCH 3 COMPLETE"
```

---

## BATCH 4 — Hijaama Resources
**Risk:** 🟢 Low | **Moves:** Hijaama Word docs, PDFs, images

```powershell
$dest4 = "$env:USERPROFILE\Documents\04 - HIJAAMA"

$hijaama = Get-ChildItem "$env:USERPROFILE\OneDrive" -Recurse -File -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -match "hijaama|cupping" -and $_.FullName -notmatch "node_modules" }
foreach ($f in $hijaama) {
    $subDest = switch -Regex ($f.Extension) {
        "docx|doc|txt|rtf" { "$dest4\Client Resources" }
        "pdf"              { "$dest4\Client Resources" }
        "png|jpg|jpeg|svg|gif|webp" { "$dest4\Images" }
        default            { "$dest4\Client Resources" }
    }
    Copy-Item $f.FullName -Destination $subDest -Force
}

Write-Host "BATCH 4 COMPLETE"
```

---

## BATCH 5 — Business Admin
**Risk:** 🟢 Low | **Moves:** Finance, policy, marketing files

```powershell
$dest5 = "$env:USERPROFILE\Documents\05 - BUSINESS ADMIN"

# Finance files (Fresha fees)
$finance = Get-ChildItem "$env:USERPROFILE\OneDrive\Desktop\DESKTOP BACKUP" -Recurse -File -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -match "fresha|fee_activity" }
foreach ($f in $finance) { Copy-Item $f.FullName -Destination "$dest5\Finance\Fees\" -Force }

# Policy/Legal Word docs
$policy = Get-ChildItem "$env:USERPROFILE\OneDrive" -Recurse -File -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -match "policy|legal|contract|terms|gdpr|safeguard" -and $_.FullName -notmatch "node_modules" }
foreach ($f in $policy) { Copy-Item $f.FullName -Destination "$dest5\Policies and Legal\" -Force }

# Marketing Word/PDF
$marketing = Get-ChildItem "$env:USERPROFILE\OneDrive" -Recurse -File -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -match "market|flyer|poster|brochure" -and $_.FullName -notmatch "node_modules" -and $_.Extension -match "docx|doc|pdf" }
foreach ($f in $marketing) { Copy-Item $f.FullName -Destination "$dest5\Marketing\" -Force }

Write-Host "BATCH 5 COMPLETE"
```

---

## BATCH 6 — Term Marksheets (Excel)
**Risk:** 🟡 Medium | **Moves:** 144 Excel marksheets → sorted by year/term

```powershell
$base6 = "$env:USERPROFILE\Documents\01 - MADRASA TAHSEEN UL QURAN\Academic Records"

$marksheets = Get-ChildItem "$env:USERPROFILE\OneDrive" -Recurse -Filter "*.xlsx" -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -notmatch "node_modules|BACKUP|Codex" }

foreach ($f in $marksheets) {
    $n = $f.BaseName.ToLower()
    # Detect year
    $year = if ($n -match "2026") { "2025-2026" } elseif ($n -match "2025") { "2025-2026" } elseif ($n -match "2024") { "2024-2025" } elseif ($n -match "2023") { "2023-2024" } else { "2025-2026" }
    # Detect term
    $term = if ($n -match "1st|term.?1|t1|first") { "Term 1" } elseif ($n -match "2nd|term.?2|t2|second") { "Term 2" } elseif ($n -match "3rd|term.?3|t3|third") { "Term 3" } elseif ($n -match "4th|term.?4|t4|fourth") { "Term 4" } else { "Term 1" }
    $targetDir = "$base6\$year\$term"
    Copy-Item $f.FullName -Destination $targetDir -Force
}

Write-Host "BATCH 6 COMPLETE"
```

---

## BATCH 7 — Media Assets (Logos & Marketing Images)
**Risk:** 🟢 Low | **Moves:** Logos, marketing images, branded assets

```powershell
$dest7 = "$env:USERPROFILE\Documents\07 - MEDIA ASSETS"

$logos = Get-ChildItem "$env:USERPROFILE\OneDrive" -Recurse -File -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -match "logo" -and $_.Extension -match "png|jpg|jpeg|svg|gif|webp" }
foreach ($f in $logos) { Copy-Item $f.FullName -Destination "$dest7\Logos\" -Force }

$marketingImg = Get-ChildItem "$env:USERPROFILE\OneDrive" -Recurse -File -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -match "banner|poster|flyer|market|social|advert" -and $_.Extension -match "png|jpg|jpeg|svg|gif|webp" }
foreach ($f in $marketingImg) { Copy-Item $f.FullName -Destination "$dest7\Marketing Materials\" -Force }

Write-Host "BATCH 7 COMPLETE"
```

---

## BATCH 8 — Archive Desktop BACKUP (Deduplicate Nasheeds)
**Risk:** 🟡 Medium | **Action:** Copy ONE copy of each nasheed to Archive, flag duplicates for deletion

```powershell
$dest8 = "$env:USERPROFILE\Documents\09 - ARCHIVE\Desktop Backup\Nasheeds"
New-Item -ItemType Directory -Force -Path $dest8 | Out-Null

# Copy only from root BACKUP\Nasheed folder (one canonical copy)
$nasheeds = Get-ChildItem "$env:USERPROFILE\OneDrive\Desktop\DESKTOP BACKUP\Nasheed" -File -ErrorAction SilentlyContinue
foreach ($f in $nasheeds) { Copy-Item $f.FullName -Destination $dest8 -Force }

# Report on duplicate folders (DO NOT DELETE — user must confirm)
Write-Host ""
Write-Host "=== DUPLICATE NASHEED FOLDERS (review before deleting) ==="
Write-Host "1. $env:USERPROFILE\OneDrive\Desktop\DESKTOP BACKUP\CUT FILES\Nasheed"
Write-Host "2. $env:USERPROFILE\OneDrive\Desktop\DESKTOP BACKUP\huawii stuff\download"
Write-Host "3. $env:USERPROFILE\OneDrive\Desktop\DESKTOP BACKUP\CUT FILES\huawii stuff\download"
Write-Host ""
Write-Host "These contain the same files. Once you confirm the Archive copy is correct,"
Write-Host "you can delete the duplicate folders manually."
Write-Host ""
Write-Host "BATCH 8 COMPLETE"
```

---

## WHAT IS NOT TOUCHED (Manual Review Required)

These require you to look at them personally before moving:

| Category | Files | Size | Why not automated |
|---|---|---|---|
| Uncategorised Word docs | 2,113 | 1,353 MB | Could be personal, school, or project related |
| Uncategorised PDFs | 1,105 | 6,962 MB | 7 GB — likely includes personal documents |
| Uncategorised images | 3,620 | 1,365 MB | Likely phone photos — needs human eye |
| Videos | 54 | 2,591 MB | Mix of personal and professional |

**Recommendation:** After all 8 batches are complete, open `09 - ARCHIVE\Old Files` and manually drag what remains.

---

## HOW TO PROCEED

Reply with the batch number to run:
- **"RUN BATCH 1"** — Create folder structure (safe, no files moved)
- **"RUN BATCH 2"** — MTQ Resources
- **"RUN BATCH 3"** — Teaching Resources
- etc.

You can run them in order or stop at any point. **All actions use Copy-Item** (not Move-Item) so originals remain until you confirm the copies are correct.

---

**Files saved to:**
`C:\Users\User\Documents\Codex\2026-04-19-files-mentioned-by-the-user-rahla\PHASE-2B-MIGRATION-PLAN.md`
