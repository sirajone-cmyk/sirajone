# Project Migration Plan
Generated: 7 June 2026 — READ ONLY. No files moved. Awaiting approval.

---

## PROJECTS FOUND ON YOUR COMPUTER

---

### 1. RAHLA (Quran / Tajweed App)

| Field | Value |
|---|---|
| **Current location** | `C:\Users\User\Documents\Codex\2026-04-19-files-mentioned-by-the-user-rahla` |
| **Git remote** | https://github.com/sirajone-cmyk/sirajone.git ✅ |
| **Firebase project** | ⚠️ No `.firebaserc` found — not linked to a Firebase project via CLI |
| **firebase.json** | Present (Firestore rules + Storage rules only, no hosting config) |
| **Domain** | Unknown — no hosting target configured |
| **Deployment** | Firestore/Storage rules only. No web hosting deploy configured |
| **Last commit** | `feat: complete Letter Guide storage audio engine with automatic TTS fallback` |
| **Proposed folder** | `C:\Users\User\Documents\Projects\SirajOne` |

**⚠️ Orphaned copies found (no git, no Firebase — safe to delete after confirmation):**
- `C:\Users\User\OneDrive\Desktop\rahla`
- `C:\Users\User\OneDrive\Documents\Claude\Projects\SirajOne\Rahla`
- `C:\Projects\rahla\rahla`
- `C:\Users\User\Documents\Codex\sirajone-backfill`

---

### 2. HIJAAMA (Cupping Wellness Centre)

| Field | Value |
|---|---|
| **Current location** | `C:\Users\User\OneDrive\Documents\New project` |
| **Git remote** | https://github.com/sirajone-cmyk/Hijaama-New-project.git ✅ |
| **Firebase project** | `hijaama-cupping-wellness` ✅ |
| **Domain** | Unknown — check Firebase Console for custom domain |
| **Deployment** | Firebase hosting configured ✅ |
| **⚠️ Critical issue** | Folder name is "New project" — not descriptive |
| **⚠️ Critical issue** | OUR_LEGACY_APP is nested INSIDE this folder — wrong structure |
| **Proposed folder** | `C:\Users\User\Documents\Projects\Hijaama` |

---

### 3. OUR LEGACY APP

| Field | Value |
|---|---|
| **Current location** | `C:\Users\User\OneDrive\Documents\New project\OUR_LEGACY_APP` ⚠️ NESTED inside Hijaama |
| **Git remote** | https://github.com/sirajone-cmyk/our-legacy-app.git ✅ |
| **Firebase project** | `sirajone-786` ✅ |
| **Domain** | Unknown — check Firebase Console |
| **Deployment** | Firebase hosting configured ✅ |
| **⚠️ Critical issue** | Nested inside Hijaama "New project" folder — two unrelated apps sharing a parent |
| **Proposed folder** | `C:\Users\User\Documents\Projects\OurLegacy` |

---

### 4. SIRAJONE (as standalone app)

| Field | Value |
|---|---|
| **Status** | ❌ NOT FOUND as a standalone project |
| **Note** | GitHub org is `sirajone-cmyk` — this is your organisation, not a separate app |
| **Proposed folder** | `C:\Users\User\Documents\Projects\SirajOne` (for Rahla, which lives under this org) |

---

### 5. HAYATI

| Field | Value |
|---|---|
| **Status** | ❌ NOT FOUND on this computer |
| **Note** | No package.json, no git repo found anywhere under Documents, OneDrive, or Desktop |
| **Proposed folder** | `C:\Users\User\Documents\Projects\Hayati` (to be created when project starts) |

---

## PROPOSED CLEAN STRUCTURE

```
C:\Users\User\Documents\Projects\
├── SirajOne\          ← Rahla app (move from Codex folder, link .firebaserc)
├── Hijaama\           ← Hijaama app (move from "New project", rename)
├── OurLegacy\         ← Our Legacy app (extract from inside Hijaama folder)
├── Hayati\            ← New — empty, ready when project starts
├── Transport\         ← New — empty, ready when project starts
└── Archive\           ← Old/orphaned copies go here before deletion
```

---

## MIGRATION STEPS (awaiting your approval before any action)

### Step 1 — Create Projects folder
```
New-Item -ItemType Directory -Force "$env:USERPROFILE\Documents\Projects\SirajOne"
New-Item -ItemType Directory -Force "$env:USERPROFILE\Documents\Projects\Hijaama"
New-Item -ItemType Directory -Force "$env:USERPROFILE\Documents\Projects\OurLegacy"
New-Item -ItemType Directory -Force "$env:USERPROFILE\Documents\Projects\Hayati"
New-Item -ItemType Directory -Force "$env:USERPROFILE\Documents\Projects\Transport"
New-Item -ItemType Directory -Force "$env:USERPROFILE\Documents\Projects\Archive"
```

### Step 2 — Move OUR_LEGACY_APP out of Hijaama folder first
(Must do this before moving Hijaama, otherwise it gets moved with it)
```
Move-Item "C:\Users\User\OneDrive\Documents\New project\OUR_LEGACY_APP" `
          "C:\Users\User\Documents\Projects\OurLegacy"
```

### Step 3 — Move Hijaama
```
Move-Item "C:\Users\User\OneDrive\Documents\New project" `
          "C:\Users\User\Documents\Projects\Hijaama"
```

### Step 4 — Move Rahla (active copy)
```
Move-Item "C:\Users\User\Documents\Codex\2026-04-19-files-mentioned-by-the-user-rahla" `
          "C:\Users\User\Documents\Projects\SirajOne"
```

### Step 5 — Archive orphaned Rahla copies (review before deleting)
```
Move-Item "C:\Users\User\OneDrive\Desktop\rahla"  "C:\Users\User\Documents\Projects\Archive\rahla-desktop-copy"
Move-Item "C:\Projects\rahla\rahla"               "C:\Users\User\Documents\Projects\Archive\rahla-cprojects-copy"
Move-Item "C:\Users\User\Documents\Codex\sirajone-backfill" "C:\Users\User\Documents\Projects\Archive\sirajone-backfill"
```
(The Claude\Projects copy can stay — it is in OneDrive and doesn't affect anything)

### Step 6 — Re-open projects in VS Code from new locations
Each project: File → Open Folder → point to new path

---

## RISKS

| Risk | Impact | Mitigation |
|---|---|---|
| VS Code loses folder reference | Low — just re-open | Always re-open from new path |
| Git remotes break | None — remotes are on GitHub, paths don't matter | None needed |
| Firebase CLI loses project link | Low | Re-run `firebase use <project>` in new folder |
| OurLegacy nested git inside Hijaama git | Medium — confusing | Step 2 extracts it first |
| Rahla has no .firebaserc | Medium — can't deploy via CLI | Add .firebaserc after move |

---

## QUESTIONS BEFORE APPROVAL

1. **Rahla Firebase project**: What is the Firebase project ID for Rahla? (Check Firebase Console — needed to create `.firebaserc`)
2. **Hayati**: Is this a future project or does it exist somewhere else (e.g. another PC)?
3. **OurLegacy move**: Confirm it is safe to extract OUR_LEGACY_APP out of the "New project" folder — it has its own git repo so this is clean.

---

**⛔ NO FILES HAVE BEEN MOVED. This is a plan only. Reply "APPROVE" to proceed.**
