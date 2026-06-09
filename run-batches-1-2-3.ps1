# ============================================================
# BATCHES 1, 2, 3 - Read-only COPY operations + folder creation
# Originals are NOT moved or deleted
# ============================================================

$base = "$env:USERPROFILE\Documents"

# ============================================================
# BATCH 1 - Create folder structure
# ============================================================
Write-Host ""
Write-Host "=============================="
Write-Host "BATCH 1 - Creating folders..."
Write-Host "=============================="

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

$created = 0
foreach ($f in $folders) {
    New-Item -ItemType Directory -Force -Path "$base\$f" | Out-Null
    $created++
}
Write-Host "BATCH 1 COMPLETE - $created folders created"
Write-Host ""

# ============================================================
# BATCH 2 - Copy MTQ Resources
# ============================================================
Write-Host "=============================="
Write-Host "BATCH 2 - Copying MTQ resources..."
Write-Host "=============================="

$mtqBase = "$base\02 - MTQ RESOURCES"
$b2count = 0

# MTQ PDFs from Desktop BACKUP\MTQ folder
$mtqPdfs = Get-ChildItem "$env:USERPROFILE\OneDrive\Desktop\DESKTOP BACKUP\MTQ" -Recurse -Filter "*.pdf" -File -ErrorAction SilentlyContinue
foreach ($f in $mtqPdfs) {
    $dest = if ($f.FullName -match "fiqh|fast|ramadan") { "$mtqBase\PDFs\Fiqh of Fasting" } else { "$mtqBase\PDFs\Tajweed Materials" }
    Copy-Item $f.FullName -Destination $dest -Force -ErrorAction SilentlyContinue
    $b2count++
}

# MTQ Word docs (named with mtq/quran/tajweed/makhraj) from OneDrive
$mtqDocs = Get-ChildItem "$env:USERPROFILE\OneDrive" -Recurse -File -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -match "mtq|tajweed|makhraj" -and $_.Extension -match "\.docx?$" -and $_.FullName -notmatch "node_modules|AppData" }
foreach ($f in $mtqDocs) {
    Copy-Item $f.FullName -Destination "$mtqBase\Word Docs\" -Force -ErrorAction SilentlyContinue
    $b2count++
}

# Zoom class recordings (all files from Zoom folder)
$zoom = Get-ChildItem "$env:USERPROFILE\OneDrive\Documents\Zoom" -Recurse -File -ErrorAction SilentlyContinue
foreach ($f in $zoom) {
    Copy-Item $f.FullName -Destination "$mtqBase\Audio\Class Recordings\" -Force -ErrorAction SilentlyContinue
    $b2count++
}

# Quran recitation MP3s - from root DESKTOP BACKUP only (avoid duplicates from subfolders)
$quranAudio = Get-ChildItem "$env:USERPROFILE\OneDrive\Desktop\DESKTOP BACKUP" -MaxDepth 1 -Filter "*.mp3" -File -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -match "Surah|Quran|Recitation|Baqarah|Qamar|Naba|Naziat|Najm|Sobhi|Hussary" }
foreach ($f in $quranAudio) {
    Copy-Item $f.FullName -Destination "$mtqBase\Audio\Quran Recitations\" -Force -ErrorAction SilentlyContinue
    $b2count++
}

# Letter audio (Rahla app - renamed copies)
$letterAudio = Get-ChildItem "$env:USERPROFILE\Documents\Codex\2026-04-19-files-mentioned-by-the-user-rahla\letters-audio-renamed" -File -ErrorAction SilentlyContinue
foreach ($f in $letterAudio) {
    Copy-Item $f.FullName -Destination "$mtqBase\Audio\Letter Audio\" -Force -ErrorAction SilentlyContinue
    $b2count++
}

Write-Host "BATCH 2 COMPLETE - $b2count files copied to 02 - MTQ RESOURCES"
Write-Host ""

# ============================================================
# BATCH 3 - Copy Teaching Resources
# ============================================================
Write-Host "=============================="
Write-Host "BATCH 3 - Copying teaching resources..."
Write-Host "=============================="

$b3count = 0

# Teacher docs/PDFs
$teacherFiles = Get-ChildItem "$env:USERPROFILE\OneDrive" -Recurse -File -ErrorAction SilentlyContinue |
    Where-Object {
        $_.Name -match "teacher|lesson|scheme|plan" -and
        $_.Extension -match "\.(docx?|pdf)$" -and
        $_.FullName -notmatch "node_modules|AppData|BACKUP"
    }
foreach ($f in $teacherFiles) {
    Copy-Item $f.FullName -Destination "$base\03 - TEACHING RESOURCES\Teacher Materials\" -Force -ErrorAction SilentlyContinue
    $b3count++
}

# Student docs/PDFs
$studentFiles = Get-ChildItem "$env:USERPROFILE\OneDrive" -Recurse -File -ErrorAction SilentlyContinue |
    Where-Object {
        $_.Name -match "student|pupil|handout|worksheet" -and
        $_.Extension -match "\.(docx?|pdf)$" -and
        $_.FullName -notmatch "node_modules|AppData|BACKUP"
    }
foreach ($f in $studentFiles) {
    Copy-Item $f.FullName -Destination "$base\03 - TEACHING RESOURCES\Student Handouts\" -Force -ErrorAction SilentlyContinue
    $b3count++
}

Write-Host "BATCH 3 COMPLETE - $b3count files copied to 03 - TEACHING RESOURCES"
Write-Host ""

# ============================================================
# SUMMARY
# ============================================================
Write-Host "=============================="
Write-Host "ALL 3 BATCHES COMPLETE"
Write-Host "Originals are untouched."
Write-Host "New structure is in: $base"
Write-Host "=============================="
explorer "$base"
