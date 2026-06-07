# Phase 2A — Complete Workspace Audit
**Date:** 7 June 2026 | **Status:** READ ONLY — No files moved | **Awaiting approval**

---

## EXECUTIVE SUMMARY

| Metric | Value |
|---|---|
| Total files scanned | 8,119 |
| Total size | 16,080 MB (16 GB) |
| Locations scanned | Documents, OneDrive, Desktop, Downloads, C:\Projects |
| Critical issues found | 4 |

### 4 Critical Issues
1. **Massive duplication** — Desktop BACKUP folder contains 3–4 copies of the same audio/nasheed files
2. **3,620 uncategorised images** — scattered with no structure (1.36 GB)
3. **1,105 uncategorised PDFs** — 7 GB of PDFs with no naming convention
4. **2,113 uncategorised Word docs** — 1.35 GB with no structure
5. **Term marksheets** — stored directly in OneDrive root, not in organised folders

---

## CATEGORY BREAKDOWN

### EXCEL FILES — 459 files | 41.5 MB

| Category | Files | Size | Current Locations |
|---|---|---|---|
| Term 1 Marksheets | 52 | 1.9 MB | OneDrive root, scattered |
| Term 2 Marksheets | 28 | 1.0 MB | OneDrive root, scattered |
| Term 3 Marksheets | 48 | 1.5 MB | OneDrive root, scattered |
| Term 4 Marksheets | 16 | 0.7 MB | OneDrive root, scattered |
| Finance (Fresha fees) | 8 | 0.03 MB | Desktop BACKUP (duplicated) |
| Other (Rosters, Tables, Timetables) | 307 | 37.4 MB | OneDrive root, Downloads |

**⚠️ Problem:** All term marksheets dumped directly in OneDrive root — no year/grade structure.

---

### WORD DOCUMENTS — 2,397 files | 1,444 MB

| Category | Files | Size | Notes |
|---|---|---|---|
| MTQ Resources | 138 | 58.6 MB | Scattered, needs consolidation |
| Teacher Resources | 54 | 26.7 MB | Multiple locations |
| Hijaama Resources | 36 | 4.4 MB | Mix of OneDrive & project folder |
| Student Resources | 20 | 0.6 MB | Scattered |
| Madrasa Resources | 18 | 0.5 MB | Scattered |
| Finance | 8 | 0.2 MB | No central location |
| Policy / Legal | 8 | 0.3 MB | No central location |
| Marketing | 2 | 0.03 MB | Scattered |
| **Uncategorised** | **2,113** | **1,353 MB** | ⚠️ No naming convention |

---

### PDF FILES — 1,285 files | 8,238 MB

| Category | Files | Size | Notes |
|---|---|---|---|
| MTQ Resources | 88 | 832.6 MB | Desktop BACKUP MTQ folder |
| Hijaama Resources | 26 | 370.5 MB | Mix of locations |
| Teacher Resources | 8 | 28.5 MB | Scattered |
| Marketing | 8 | 31.4 MB | Scattered |
| Finance | 32 | 7.6 MB | Scattered |
| Policy / Legal | 8 | 1.2 MB | Scattered |
| Reports / Assessments | 6 | 4.6 MB | Scattered |
| Student Resources | 2 | 0.2 MB | Scattered |
| Madrasa | 2 | 0.2 MB | Scattered |
| **Uncategorised** | **1,105** | **6,962 MB** | ⚠️ 7 GB unclassified |

---

### AUDIO FILES — 253 files | 1,991 MB

| Category | Files | Size | Notes |
|---|---|---|---|
| MTQ / Quran recordings | 24 | 820 MB | Desktop BACKUP — Surah recitations |
| Letter audio (Rahla app) | 58 | ~4 MB | 2 copies: letters-audio-renamed + original |
| Zoom class recordings | 6 | 143 MB | OneDrive\Documents\Zoom — Tajwid classes |
| Nasheeds & Islamic audio | 165+ | 1,024 MB | Desktop BACKUP — heavily duplicated |

**⚠️ Problem:** Nasheeds stored in 3–4 duplicate copies inside Desktop BACKUP subfolders.

---

### VIDEO FILES — 54 files | 2,591 MB

| Category | Files | Size | Notes |
|---|---|---|---|
| Uncategorised videos | 54 | 2,591 MB | Mix of MTQ, Hijaama, personal |

---

### IMAGES — 3,635 files | 1,386 MB

| Category | Files | Size | Notes |
|---|---|---|---|
| Logos | 6 | 2.7 MB | Scattered |
| Marketing images | 5 | 15.3 MB | Scattered |
| Hijaama images | 2 | 3.3 MB | Scattered |
| MTQ / Madrasa images | 2 | 0.2 MB | Scattered |
| **Uncategorised images** | **3,620** | **1,365 MB** | ⚠️ Phone photos, screenshots, misc |

---

### PRESENTATIONS — 36 files | 387 MB

| Category | Files | Size | Notes |
|---|---|---|---|
| Other (MTQ, teaching, misc) | 36 | 387 MB | Scattered across OneDrive |

---

## RECOMMENDED PROFESSIONAL FOLDER STRUCTURE

```
C:\Users\User\Documents\
├── 01 - MADRASA TAHSEEN UL QURAN\
│   ├── Academic Records\
│   │   ├── 2023-2024\
│   │   │   ├── Term 1\
│   │   │   ├── Term 2\
│   │   │   ├── Term 3\
│   │   │   └── Term 4\
│   │   ├── 2024-2025\
│   │   │   ├── Term 1\
│   │   │   ├── Term 2\
│   │   │   ├── Term 3\
│   │   │   └── Term 4\
│   │   └── 2025-2026\
│   │       ├── Term 1\
│   │       ├── Term 2\
│   │       ├── Term 3\
│   │       └── Term 4\
│   ├── Assessments\
│   ├── Attendance\
│   ├── Reports\
│   └── Admin\
│
├── 02 - MTQ RESOURCES\
│   ├── Audio\
│   │   ├── Quran Recitations\
│   │   ├── Class Recordings (Zoom)\
│   │   └── Nasheeds\
│   ├── Video\
│   │   ├── Lessons\
│   │   └── Fiqh\
│   ├── PDFs\
│   │   ├── Tajweed Materials\
│   │   └── Fiqh of Fasting\
│   ├── Word Docs\
│   └── Presentations\
│
├── 03 - TEACHING RESOURCES\
│   ├── Teacher Materials\
│   ├── Student Handouts\
│   ├── Lesson Plans\
│   └── Schemes of Work\
│
├── 04 - HIJAAMA\
│   ├── Client Resources\
│   ├── Marketing\
│   ├── Finance\
│   ├── Policies\
│   └── Images\
│
├── 05 - BUSINESS ADMIN\
│   ├── Finance\
│   │   ├── Invoices\
│   │   ├── Fees\
│   │   └── Budgets\
│   ├── Policies & Legal\
│   ├── Marketing\
│   └── Admin Documents\
│
├── 06 - COUNSELLING\
│   ├── Resources\
│   ├── Policies\
│   └── Templates\
│
├── 07 - MEDIA ASSETS\
│   ├── Logos\
│   ├── Brand Images\
│   ├── Marketing Materials\
│   └── Videos\
│
├── 08 - PROJECTS (Code)\  ← From Phase 1 migration
│   ├── SirajOne\
│   ├── Hijaama\
│   ├── OurLegacy\
│   ├── Hayati\
│   ├── Transport\
│   └── Archive\
│
└── 09 - ARCHIVE\
    ├── Desktop Backup (deduplicated)\
    └── Old Files\
```

---

## AUDIT TABLE — Current vs Proposed

| Category | Files | Size | Current Location | Proposed Location | Risk |
|---|---|---|---|---|---|
| Excel - Term 1 | 52 | 1.9 MB | OneDrive root (scattered) | 01-MADRASA\Academic Records\[Year]\Term 1 | 🟡 Medium — need year sorting |
| Excel - Term 2 | 28 | 1.0 MB | OneDrive root (scattered) | 01-MADRASA\Academic Records\[Year]\Term 2 | 🟡 Medium |
| Excel - Term 3 | 48 | 1.5 MB | OneDrive root (scattered) | 01-MADRASA\Academic Records\[Year]\Term 3 | 🟡 Medium |
| Excel - Term 4 | 16 | 0.7 MB | OneDrive root (scattered) | 01-MADRASA\Academic Records\[Year]\Term 4 | 🟡 Medium |
| Excel - Finance | 8 | 0.03 MB | Desktop BACKUP (duplicated) | 05-BUSINESS ADMIN\Finance\Fees | 🟢 Low |
| Excel - Other | 307 | 37.4 MB | OneDrive root, Downloads | Review manually — sort by purpose | 🔴 High — needs manual review |
| Word - MTQ | 138 | 58.6 MB | Scattered | 02-MTQ RESOURCES\Word Docs | 🟢 Low |
| Word - Teacher | 54 | 26.7 MB | Scattered | 03-TEACHING RESOURCES\Teacher Materials | 🟢 Low |
| Word - Hijaama | 36 | 4.4 MB | Scattered | 04-HIJAAMA\Client Resources | 🟢 Low |
| Word - Student | 20 | 0.6 MB | Scattered | 03-TEACHING RESOURCES\Student Handouts | 🟢 Low |
| Word - Madrasa | 18 | 0.5 MB | Scattered | 01-MADRASA\Admin | 🟢 Low |
| Word - Finance | 8 | 0.2 MB | Scattered | 05-BUSINESS ADMIN\Finance | 🟢 Low |
| Word - Policy/Legal | 8 | 0.3 MB | Scattered | 05-BUSINESS ADMIN\Policies & Legal | 🟢 Low |
| Word - Other | 2,113 | 1,353 MB | Scattered | ⚠️ Manual review required | 🔴 High |
| PDF - MTQ | 88 | 832.6 MB | Desktop BACKUP\MTQ | 02-MTQ RESOURCES\PDFs | 🟢 Low |
| PDF - Hijaama | 26 | 370.5 MB | Scattered | 04-HIJAAMA | 🟢 Low |
| PDF - Teacher | 8 | 28.5 MB | Scattered | 03-TEACHING RESOURCES\Teacher Materials | 🟢 Low |
| PDF - Finance | 32 | 7.6 MB | Scattered | 05-BUSINESS ADMIN\Finance | 🟢 Low |
| PDF - Marketing | 8 | 31.4 MB | Scattered | 05-BUSINESS ADMIN\Marketing | 🟢 Low |
| PDF - Policy/Legal | 8 | 1.2 MB | Scattered | 05-BUSINESS ADMIN\Policies & Legal | 🟢 Low |
| PDF - Other | 1,105 | 6,962 MB | Scattered | ⚠️ Manual review — 7 GB | 🔴 High |
| Audio - MTQ/Quran | 24 | 820 MB | Desktop BACKUP (duplicated) | 02-MTQ RESOURCES\Audio\Quran Recitations | 🟡 Medium — deduplicate first |
| Zoom Recordings | 6 | 143 MB | OneDrive\Zoom | 02-MTQ RESOURCES\Audio\Class Recordings | 🟢 Low |
| Nasheeds | 165+ | 1,024 MB | Desktop BACKUP (3–4 copies each) | 02-MTQ RESOURCES\Audio\Nasheeds (1 copy) | 🟡 Medium — deduplicate |
| Letter Audio (Rahla) | 58 | 4 MB | Codex folder (2 copies) | 08-PROJECTS\SirajOne (keep 1 copy) | 🟢 Low |
| Videos | 54 | 2,591 MB | Scattered | 07-MEDIA ASSETS\Videos | 🔴 High — large, needs sorting |
| Images - Logos | 6 | 2.7 MB | Scattered | 07-MEDIA ASSETS\Logos | 🟢 Low |
| Images - Marketing | 5 | 15.3 MB | Scattered | 07-MEDIA ASSETS\Marketing Materials | 🟢 Low |
| Images - Other | 3,620 | 1,365 MB | Scattered | ⚠️ Manual review — phone photos? | 🔴 High |
| Presentations | 36 | 387 MB | Scattered | 02-MTQ or 03-TEACHING (sort by content) | 🟡 Medium |

---

## KEY OBSERVATIONS

1. **Duplication is your biggest problem.** Desktop BACKUP has the same nasheeds in 3–4 subfolders. This alone wastes ~600–800 MB.
2. **Term marksheets need a year/grade system.** Files like `3RD TERM Mk.Gr 6-2025 copy.xlsx` are in OneDrive root — hard to find, easy to lose.
3. **MTQ folder exists** in Desktop BACKUP — it has structure already. This should become the master MTQ folder.
4. **Zoom class recordings** are a goldmine — 6 Tajwid class recordings. These should be archived properly under MTQ.
5. **7 GB of unclassified PDFs** — this is the biggest unknown. Many may be personal/unrelated.
6. **Hijaama resources** are split between the project code folder and personal documents — needs separation.

---

## NEXT STEP

Reply **"APPROVE PHASE 2B"** and I will generate the final step-by-step migration commands — no files will be moved until you approve each batch.

**Report saved to:**
- `C:\Users\User\Documents\Codex\2026-04-19-files-mentioned-by-the-user-rahla\PHASE-2A-WORKSPACE-AUDIT.md`
- `C:\Users\User\Documents\Codex\2026-04-19-files-mentioned-by-the-user-rahla\workspace-audit-raw.txt`
- `C:\Users\User\Documents\Codex\2026-04-19-files-mentioned-by-the-user-rahla\workspace-audit.csv`
