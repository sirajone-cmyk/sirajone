$out = "$env:USERPROFILE\Documents\Codex\2026-04-19-files-mentioned-by-the-user-rahla\workspace-audit-raw.txt"
$csv = "$env:USERPROFILE\Documents\Codex\2026-04-19-files-mentioned-by-the-user-rahla\workspace-audit.csv"

$searchRoots = @(
    "$env:USERPROFILE\Documents",
    "$env:USERPROFILE\OneDrive",
    "$env:USERPROFILE\Desktop",
    "$env:USERPROFILE\Downloads",
    "C:\Projects",
    "C:\Dev",
    "C:\Code"
)

$exts = @("*.xlsx","*.xls","*.xlsm","*.csv","*.docx","*.doc","*.pdf","*.mp3","*.m4a","*.wav","*.ogg","*.aac","*.mp4","*.mov","*.avi","*.mkv","*.webm","*.png","*.jpg","*.jpeg","*.svg","*.gif","*.webp","*.pptx","*.ppt","*.txt","*.rtf")

$excludeDirs = @("node_modules",".git","dist","build",".next","__pycache__","Recycle")

function Get-Category($name, $ext) {
    $n = $name.ToLower()
    if ($ext -match "xlsx|xls|xlsm|csv") {
        if ($n -match "term.?1|t1") { return "Excel - Term 1" }
        if ($n -match "term.?2|t2") { return "Excel - Term 2" }
        if ($n -match "term.?3|t3") { return "Excel - Term 3" }
        if ($n -match "term.?4|t4") { return "Excel - Term 4" }
        if ($n -match "assess") { return "Excel - Assessments" }
        if ($n -match "attend") { return "Excel - Attendance" }
        if ($n -match "report") { return "Excel - Reports" }
        if ($n -match "financ|budget|invoice|payment|fee") { return "Excel - Finance" }
        return "Excel - Other"
    }
    if ($ext -match "mp3|m4a|wav|ogg|aac") {
        if ($n -match "quran|letter|arabic|tajweed|mtq|makhraj") { return "Audio - MTQ/Quran" }
        if ($n -match "hijaama|cupping") { return "Audio - Hijaama" }
        return "Audio - Other"
    }
    if ($ext -match "mp4|mov|avi|mkv|webm") {
        if ($n -match "quran|letter|arabic|tajweed|mtq|makhraj|lesson") { return "Video - MTQ/Quran" }
        if ($n -match "hijaama|cupping") { return "Video - Hijaama" }
        if ($n -match "market|promo|advert|social") { return "Video - Marketing" }
        return "Video - Other"
    }
    if ($ext -match "png|jpg|jpeg|svg|gif|webp") {
        if ($n -match "logo") { return "Image - Logo" }
        if ($n -match "banner|poster|flyer|market|social|advert") { return "Image - Marketing" }
        if ($n -match "hijaama|cupping") { return "Image - Hijaama" }
        if ($n -match "quran|mtq|madrasa|rahla") { return "Image - MTQ/Madrasa" }
        return "Image - Other"
    }
    if ($ext -match "pdf") {
        if ($n -match "policy|legal|contract|terms|gdpr|safeguard") { return "PDF - Policy/Legal" }
        if ($n -match "counsel") { return "PDF - Counselling" }
        if ($n -match "hijaama|cupping") { return "PDF - Hijaama" }
        if ($n -match "mtq|quran|tajweed|makhraj") { return "PDF - MTQ" }
        if ($n -match "madrasa|rahla|school") { return "PDF - Madrasa" }
        if ($n -match "teacher|lesson|scheme|plan") { return "PDF - Teacher Resources" }
        if ($n -match "student|pupil|handout|worksheet") { return "PDF - Student Resources" }
        if ($n -match "market|flyer|poster|brochure") { return "PDF - Marketing" }
        if ($n -match "financ|invoice|receipt|payment") { return "PDF - Finance" }
        if ($n -match "report|assess") { return "PDF - Reports/Assessments" }
        return "PDF - Other"
    }
    if ($ext -match "docx|doc|rtf|txt") {
        if ($n -match "policy|legal|contract|terms|gdpr|safeguard") { return "Word - Policy/Legal" }
        if ($n -match "counsel") { return "Word - Counselling" }
        if ($n -match "hijaama|cupping") { return "Word - Hijaama" }
        if ($n -match "mtq|quran|tajweed|makhraj") { return "Word - MTQ" }
        if ($n -match "madrasa|rahla|school") { return "Word - Madrasa" }
        if ($n -match "teacher|lesson|scheme|plan") { return "Word - Teacher Resources" }
        if ($n -match "student|pupil|handout|worksheet") { return "Word - Student Resources" }
        if ($n -match "market|flyer|poster|brochure") { return "Word - Marketing" }
        if ($n -match "financ|invoice|receipt|payment") { return "Word - Finance" }
        return "Word - Other"
    }
    if ($ext -match "pptx|ppt") {
        if ($n -match "market|promo") { return "PPT - Marketing" }
        return "PPT - Other"
    }
    return "Other"
}

$results = @()
$report = @()
$report += "=== WORKSPACE AUDIT - $(Get-Date) ==="
$report += ""

foreach ($root in $searchRoots) {
    if (-not (Test-Path $root)) { continue }
    Write-Host "Scanning: $root"
    foreach ($pattern in $exts) {
        $files = Get-ChildItem -Path $root -Filter $pattern -Recurse -File -ErrorAction SilentlyContinue |
            Where-Object {
                $skip = $false
                foreach ($ex in $excludeDirs) {
                    if ($_.FullName -match [regex]::Escape($ex)) { $skip = $true; break }
                }
                -not $skip
            }
        foreach ($f in $files) {
            $ext = $f.Extension.TrimStart('.').ToLower()
            $cat = Get-Category $f.BaseName $ext
            $sizeMB = [math]::Round($f.Length / 1MB, 3)
            $results += [PSCustomObject]@{
                Category    = $cat
                FileName    = $f.Name
                SizeMB      = $sizeMB
                CurrentPath = $f.DirectoryName
                Extension   = $f.Extension
                Modified    = $f.LastWriteTime.ToString("yyyy-MM-dd")
            }
        }
    }
}

$report += ""
$grouped = $results | Group-Object Category | Sort-Object Name
foreach ($g in $grouped) {
    $totalMB = [math]::Round(($g.Group | Measure-Object SizeMB -Sum).Sum, 3)
    $report += "[$($g.Name)] --- $($g.Count) files --- $totalMB MB"
    foreach ($f in ($g.Group | Sort-Object CurrentPath)) {
        $report += "  $($f.CurrentPath)\$($f.FileName)  [$($f.SizeMB) MB]  [$($f.Modified)]"
    }
    $report += ""
}

$report += "=== TOTALS ==="
$report += "Total files: $($results.Count)"
$report += "Total size:  $([math]::Round(($results | Measure-Object SizeMB -Sum).Sum, 2)) MB"

$report | Out-File -FilePath $out -Encoding utf8
$results | Export-Csv -Path $csv -NoTypeInformation -Encoding utf8

Write-Host ""
Write-Host "=============================="
Write-Host "AUDIT COMPLETE"
Write-Host "Files found: $($results.Count)"
Write-Host "Total size:  $([math]::Round(($results | Measure-Object SizeMB -Sum).Sum, 2)) MB"
Write-Host "Report: $out"
Write-Host "CSV:    $csv"
Write-Host "=============================="
