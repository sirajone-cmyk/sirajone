# SirajOne — Counselling Ecosystem Architecture
**Version 1.0 | Senior Architect Review | June 2026**

> Grounded in: existing `firestore.rules`, `roles.js`, `App.jsx`, `CounsellorPortal.jsx`, `CounsellingClientDashboard.jsx`

---

## 1. HONEST LAUNCH READINESS AUDIT (READ THIS FIRST)

### What is already built (do not rebuild)
| Item | Status |
|------|--------|
| Role system: counsellingClient, Counsellor | ✅ Done |
| Firestore rules: counsellingRequests, counsellingSessions, counsellingMessages, counsellingResources | ✅ Done |
| Assignment system (student→counsellor requests) | ✅ Done |
| App routing: /counsellor, /counselling-client | ✅ Done |
| PendingApproval role-aware messaging | ✅ Done |
| Basic CounsellingClientDashboard (skeleton) | ⚠️ Needs complete redesign |
| Basic CounsellorPortal (skeleton) | ⚠️ Needs complete redesign |
| storage.rules | ❌ MISSING — critical security gap |
| counselling_programmes collection | ❌ Not yet created |
| community_events collection | ❌ Not yet created |
| Session reminder notifications | ❌ Not yet built |
| Admin counselling controls | ❌ Not yet built |

### Build before launch (non-negotiable)
1. Redesigned CounsellingClientDashboard — Support Journey, Services, Pre-Marital Programme interest, Sessions, Messages, Resources
2. Redesigned CounsellorPortal — Client management, session notes, messaging, follow-ups
3. `community_events` collection + Admin publisher UI
4. `counselling_programmes` + interest/waitlist registration (Pre-Marital Programme)
5. Session reminder notifications (in-app, architecture for email/SMS)
6. `storage.rules` — currently zero protection on Firebase Storage
7. Admin tab: Counselling Management (approve clients, view sessions, manage programmes)

### Can wait until after launch
- Video/audio calling integration (Jitsi, Daily.co, Zoom SDK)
- Email automation (SendGrid or Firebase Extensions)
- SMS integration (Twilio)
- Payment for programmes (PayFast already exists — wire it in post-launch)
- Group session management UI
- Advanced analytics dashboard
- Automated waitlist confirmation emails

### Unnecessary complexity right now — do not build
- Custom end-to-end encryption for session notes (Firebase security rules are sufficient at this stage; E2E adds months of engineering)
- AI-assisted session note summarization
- In-app calendar sync (Google/Apple Calendar)
- Multi-language support (Arabic/Urdu interface)
- Risk assessment scoring engine
- Custom video calling (use an embed)

---

## 2. DESIGN PRINCIPLES

The counselling platform must feel completely separate from the learning platform. Key differences:

| Learning Platform | Counselling Platform |
|-------------------|---------------------|
| Dark green `#0b1a12` base | Deep navy/indigo `#0a0f1e` base |
| Emerald accent | Teal/soft gold accent |
| Progress-focused language | Healing/journey-focused language |
| Letters, recordings, workbooks | Sessions, notes, resources, growth |
| Teacher → Student | Counsellor ↔ Client (collaborative) |

Both platforms share: SirajOne Navbar, role-based routing, Firestore backend, security architecture, Lucide icons, Tailwind CSS.

**Islamic tone throughout:** Every section should reflect Qur'an, Sunnah, and compassion. Language should be warm, non-clinical, non-stigmatizing. Replace "patient" with "client" or "seeker." Replace "disorder" with "challenge" or "difficulty."

---

## 3. DATABASE ARCHITECTURE

### 3A. Existing collections (already in Firestore rules — keep as-is)

```
counsellingRequests/{id}
  clientId: string           // uid of the client
  studentId: string          // legacy alias for clientId (keep for compat)
  counsellorId: string       // uid of assigned counsellor
  status: 'pending' | 'assessed' | 'active' | 'closed' | 'on_hold'
  serviceType: string        // e.g. 'Marriage Counselling'
  categories: string[]       // from COUNSELLOR_CATEGORIES
  preferredContact: string
  note: string               // client's initial message
  counsellorNote: string     // counsellor's private note
  followUpPending: bool
  followUpStatus: string
  lastSessionAt: Timestamp
  lastMessageAt: Timestamp
  createdAt: Timestamp
  updatedAt: Timestamp

counsellingSessions/{id}
  clientId: string
  counsellorId: string
  sessionDate: Timestamp
  sessionType: 'Online' | 'In-Person' | 'Phone' | 'WhatsApp' | 'Group Session'
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
  sessionNumber: number      // 1, 2, 3... per client
  joinUrl: string | null     // future video call link
  reminderSent: bool
  createdAt: Timestamp
  updatedAt: Timestamp

counsellingMessages/{id}
  senderId: string
  recipientId: string        // specific client or counsellor uid
  clientId: string
  counsellorId: string
  body: string
  type: 'direct' | 'broadcast' | 'announcement' | 'resource'
  isRead: bool
  readAt: Timestamp | null
  attachmentUrl: string | null
  attachmentType: 'pdf' | 'video' | 'audio' | 'worksheet' | null
  createdAt: Timestamp

counsellingResources/{id}
  counsellorId: string
  clientId: string | null    // null = broadcast to all my clients
  title: string
  description: string
  resourceType: 'pdf' | 'video' | 'audio' | 'worksheet' | 'reflection'
  url: string
  storageRef: string | null
  createdAt: Timestamp
```

### 3B. New collections to create

```
counselling_programmes/{id}
  title: string              // '6 Week Pre-Marital Preparation Programme'
  slug: string               // 'pre-marital-6-week'
  description: string
  modules: [                 // ordered array
    { title: string, description: string, weekNumber: number }
  ]
  targetAudience: 'male' | 'female' | 'couple' | 'all'
  duration: string           // '6 weeks'
  status: 'draft' | 'open' | 'upcoming' | 'in_progress' | 'closed'
  maxParticipants: number | null
  startDate: Timestamp | null
  endDate: Timestamp | null
  registrationDeadline: Timestamp | null
  price: number              // 0 = free; future PayFast integration
  currency: 'ZAR'
  facilitatorId: string | null  // counsellor uid
  createdBy: string          // admin uid
  createdAt: Timestamp
  updatedAt: Timestamp

programme_registrations/{id}
  programmeId: string
  clientId: string
  clientName: string
  clientEmail: string
  registrationType: 'enrolled' | 'waitlist' | 'interest'
  status: 'pending' | 'confirmed' | 'cancelled'
  note: string | null        // client's reason/message
  createdAt: Timestamp
  updatedAt: Timestamp

community_events/{id}
  title: string
  description: string
  eventType: 'gathering' | 'workshop' | 'programme' | 'announcement' | 'guest_speaker'
  format: 'online' | 'in_person' | 'hybrid'
  date: Timestamp | null     // null = TBC
  time: string | null        // '19:00' — store separately for flexible display
  location: string | null    // physical address or null
  joinUrl: string | null     // Zoom/Google Meet link (future)
  audience: 'all' | 'clients' | 'public'
  isRecurring: bool
  recurringPattern: string | null  // 'weekly_saturday' etc
  featuredImageUrl: string | null
  createdBy: string          // admin uid
  createdAt: Timestamp
  updatedAt: Timestamp

event_reservations/{id}
  eventId: string
  userId: string
  userName: string
  userEmail: string
  status: 'reserved' | 'attended' | 'cancelled'
  createdAt: Timestamp

client_assessments/{id}
  clientId: string
  counsellorId: string
  assessmentDate: Timestamp
  presentingConcerns: string[]
  recommendedServiceType: string
  sessionFrequency: string   // 'weekly' | 'bi-weekly' | 'monthly'
  notes: string              // counsellor private — secured by rules
  createdAt: Timestamp
  updatedAt: Timestamp

session_notes/{id}
  sessionId: string          // links to counsellingSessions/{id}
  clientId: string
  counsellorId: string
  content: string            // private counsellor notes
  followUpRequired: bool
  followUpDate: Timestamp | null
  followUpNote: string | null
  createdAt: Timestamp
  updatedAt: Timestamp
```

### 3C. Subcollections

```
users/{uid}/notifications/{notificationId}
  type: 'session_reminder' | 'message' | 'resource_shared' |
        'programme_update' | 'event_reminder' | 'follow_up' | 'broadcast'
  title: string
  body: string
  linkTo: string             // '/counselling-client' or '/counsellor'
  dismissed: bool
  createdAt: Timestamp
  scheduledFor: Timestamp | null   // for future-dated reminders
  sentVia: string[]          // ['in_app'] — future: ['in_app', 'email', 'sms']
```

---

## 4. FIRESTORE SECURITY RULES — ADDITIONS REQUIRED

Add these functions and match blocks to `firestore.rules`:

```javascript
// New helper functions to add

function isCounsellorUser() {
  return myProfileExists()
    && myProfileData().status == 'approved'
    && myProfileData().role in ['Counsellor', 'Counselor'];
}

function isCounsellingClient() {
  return myProfileExists()
    && myProfileData().status == 'approved'
    && myProfileData().role == 'counsellingClient';
}

function ownsProgrammeRegistration(data) {
  return signedIn() && data.clientId == request.auth.uid;
}

function validProgrammeRegistration() {
  return isApprovedUser()
    && request.resource.data.clientId == request.auth.uid
    && request.resource.data.registrationType in ['enrolled', 'waitlist', 'interest']
    && request.resource.data.status == 'pending';
}

function ownsEventReservation(data) {
  return signedIn() && data.userId == request.auth.uid;
}

function validEventReservation() {
  return isApprovedUser()
    && request.resource.data.userId == request.auth.uid
    && request.resource.data.status == 'reserved';
}

function validSessionNoteCreate() {
  return isCounsellorUser()
    && request.resource.data.counsellorId == request.auth.uid;
}

function ownsSessionNote(data) {
  return signedIn() && data.counsellorId == request.auth.uid;
}

function validClientAssessmentCreate() {
  return isCounsellorUser()
    && request.resource.data.counsellorId == request.auth.uid;
}

// New match blocks to add

match /counselling_programmes/{programmeId} {
  allow read: if isApprovedUser() || isAdminUser();
  allow create, update, delete: if isAdminUser();
}

match /programme_registrations/{registrationId} {
  allow read: if isAdminUser()
    || isCounsellorUser()
    || ownsProgrammeRegistration(resource.data);
  allow create: if validProgrammeRegistration() || isAdminUser();
  allow update: if isAdminUser();
  allow delete: if isAdminUser()
    || ownsProgrammeRegistration(resource.data);
}

match /community_events/{eventId} {
  allow read: if true;   // public — events are community-facing
  allow create, update, delete: if isAdminUser();
}

match /event_reservations/{reservationId} {
  allow read: if isAdminUser()
    || ownsEventReservation(resource.data);
  allow create: if validEventReservation() || isAdminUser();
  allow update: if isAdminUser()
    || (signedIn() && resource.data.userId == request.auth.uid
      && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['status', 'updatedAt'])
      && request.resource.data.status == 'cancelled');
  allow delete: if isAdminUser();
}

match /client_assessments/{assessmentId} {
  allow read: if isAdminUser()
    || (isCounsellorUser() && resource.data.counsellorId == request.auth.uid);
  // Clients deliberately cannot read raw assessment notes — counsellor shares verbally
  allow create: if validClientAssessmentCreate() || isAdminUser();
  allow update: if isAdminUser()
    || (isCounsellorUser() && resource.data.counsellorId == request.auth.uid);
  allow delete: if isAdminUser();
}

match /session_notes/{noteId} {
  allow read: if isAdminUser()
    || (isCounsellorUser() && resource.data.counsellorId == request.auth.uid);
  // Clients cannot read session notes — confidentiality
  allow create: if validSessionNoteCreate() || isAdminUser();
  allow update: if isAdminUser()
    || (isCounsellorUser() && resource.data.counsellorId == request.auth.uid);
  allow delete: if isAdminUser();
}

match /users/{userId}/notifications/{notificationId} {
  allow read, update: if isSelf(userId) || isAdminUser();
  allow create: if isAdminUser() || isCounsellorUser();
  allow delete: if isAdminUser();
}
```

**CRITICAL: Also add to `isBroadcastForMyRole` function:**
```javascript
|| (data.audience == 'Clients' && myProfileData().role == 'counsellingClient')
```

---

## 5. STORAGE RULES (storage.rules — MUST CREATE)

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    // Letter audio — public teaching content
    match /letters/audio/{filename} {
      allow read: if true;
      allow write: if false;
    }

    // Student Tajweed submissions — authenticated only
    match /submissions/{studentId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == studentId;
    }

    // Counselling resources — only the parties in the session
    match /counselling/{counsellorId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == counsellorId;
    }

    // Programme assets — authenticated users only
    match /programmes/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if false; // admin uploads via Firebase console only at this stage
    }

    // Default: deny everything
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

---

## 6. CLIENT DASHBOARD ARCHITECTURE

**Route:** `/counselling-client` → `CounsellingClientDashboard.jsx`  
**Base colour:** `#0a0f1e` (deep navy — distinct from learning platform's `#0b1a12`)  
**Accent:** Teal (`teal-300`, `teal-400`) + soft gold (`amber-300`)  
**Design language:** Calm, warm, hopeful — not clinical

### Layout (top → bottom)

```
[Navbar — shared, role-aware]

[Hero greeting: "As-salāmu ʿalaykum, [Name]. How can we support you today?"]
[Ayah of the day — Surah Az-Zumar 39:53 or similar — short, rotating]

[SECTION 1: Support Journey]       ← 5 stage cards, horizontal scroll on mobile
[SECTION 2: Counselling Services]  ← 12 service cards, 3-col grid
[SECTION 3: Pre-Marital Programme] ← Featured full-width card
[SECTION 4: Support Options]       ← 4 cards (Online / Voice / In-Person / Group)
[SECTION 5: Islamic Foundation]    ← 6 pillars, visual layout
[SECTION 6: My Sessions]           ← Upcoming + past sessions list
[SECTION 7: Messages]              ← Unread count badge, message list
[SECTION 8: My Resources]          ← Cards by type (PDF, video, audio, worksheet)
[SECTION 9: Community Development] ← Event cards from community_events
```

### Section 1 — Support Journey (5 stages)

Each stage is a clickable card. The client's current stage is highlighted.

| Stage | Icon | Status field | Action |
|-------|------|-------------|--------|
| 1. Request Support | HandHelping | request submitted | View request |
| 2. Initial Assessment | ClipboardCheck | assessment scheduled | View details |
| 3. Counselling Sessions | Calendar | active sessions | View sessions |
| 4. Ongoing Growth | TrendingUp | follow-up active | View follow-ups |
| 5. Community & Development | Users | programme enrolled | View programmes |

Stage is derived from `counsellingRequests[0].status`:
- `pending` → Stage 1 highlighted
- `assessed` → Stage 2 highlighted
- `active` → Stage 3 highlighted
- `on_hold` + follow-up → Stage 4 highlighted
- Programme enrolled → Stage 5 highlighted

### Section 2 — Counselling Services (12 cards)

Each card: icon, title, short description, "Learn More / Book" button.  
Clicking opens a drawer or modal with full service description + "Request This Service" button.  
Request button navigates to assignment flow (existing `assignments` collection).

Services:
1. Marriage Counselling
2. Pre-Marital Guidance
3. Family Counselling
4. Parenting Support
5. Teen Counselling
6. Youth Mentorship
7. Student Support
8. Adult Counselling
9. Islamic Spiritual Support
10. Personal Development
11. Grief & Bereavement Support
12. Lifestyle & Wellbeing Support

### Section 3 — Pre-Marital Programme (Featured)

Full-width card with green/gold gradient. Distinct from the service cards.

**Header:** "6 Week Pre-Marital Preparation Programme"  
**Subhead:** "Equipping hearts and homes — for brothers and sisters separately"

Modules displayed as a numbered timeline:
1. Foundations of Marriage — Islamic perspective on nikāḥ
2. Rights & Responsibilities — mutual obligations from Qur'an and Sunnah
3. Communication Skills — speaking, listening, understanding
4. Conflict Resolution — the sunnah of reconciliation
5. Financial Planning — money, trust, and transparency
6. Islamic Family Life — building a home upon taqwā

Three registration buttons:
- **Register Now** (status = 'open') → form → `programme_registrations` with `registrationType: 'enrolled'`
- **Join Waiting List** (status = 'upcoming' / full) → `registrationType: 'waitlist'`
- **Register Interest** (status = 'closed' / draft) → `registrationType: 'interest'`

Button shown is determined by `counselling_programmes[slug='pre-marital-6-week'].status` and `maxParticipants` vs current enrolled count.

Gender field in registration form: Male / Female. Admin creates separate cohorts.

### Section 4 — Support Options (4 cards)

| Option | Icon | Description |
|--------|------|-------------|
| Online Counselling | Monitor | Video or chat-based sessions |
| Voice Sessions | Phone | Private telephone counselling |
| In-Person Sessions | MapPin | At our centre (location from settings) |
| Group Workshops | Users | Community group sessions |

Clicking opens the same service request modal, pre-filled with session type.

### Section 5 — Islamic Foundation (6 pillars)

Displayed as a 2-col or 3-col grid of icon + title + 2-line description:

1. Qur'an & Sunnah — "Our foundation is divine guidance"
2. Islamic Psychology — "Understanding the nafs, heart, and soul"
3. Emotional Wellbeing — "Tending to the heart is an act of worship"
4. Character Development — "The Prophet ﷺ said: 'I was sent to perfect noble character'"
5. Family Strengthening — "Your family is your first community"
6. Personal Accountability — "Muḥāsabah: honest reflection with compassion"

### Section 6 — My Sessions

**Upcoming Sessions panel:**  
Query: `counsellingSessions` where `clientId == uid AND status == 'scheduled'` orderBy `sessionDate asc`

Each session card shows:
- Counsellor name (from `counsellorId` → lookup `counsellors/{id}`)
- Date and time (formatted en-ZA)
- Session type badge (Online / In-Person / Phone / Group)
- "Add Reminder" button → writes to `users/{uid}/notifications/` with `scheduledFor: sessionDate - 1 hour`
- "Join" button (disabled until video integration — shows "Session link will be shared soon")

**Past Sessions panel:**  
Query: `counsellingSessions` where `clientId == uid AND status == 'completed'` orderBy `sessionDate desc` limit 5

### Section 7 — Messages

Query: `counsellingMessages` where `clientId == uid` orderBy `createdAt desc`  
Unread badge: count where `recipientId == uid AND isRead == false`  
Opening the messages panel marks all as `isRead: true, readAt: serverTimestamp()`

Message types rendered differently:
- `direct` — standard message bubble
- `broadcast` / `announcement` — full-width card with teal border
- `resource` — shows attachment preview/link

### Section 8 — My Resources

Query: `counsellingResources` where `clientId == uid OR clientId == null AND counsellorId == myCounsellorId`

Filtered tabs: All | PDFs | Videos | Audio | Worksheets | Reflections

Each card: icon by type, title, description, "Open" button.

### Section 9 — Community Development

Query: `community_events` where `audience in ['all', 'clients']` orderBy `date asc`  
Events with `date == null` shown as "Date TBC"

Each event card:
- Title, description
- Date / Time / Location (or "Online" badge)
- Event type badge (Gathering / Workshop / Guest Speaker / etc.)
- "Reserve My Place" button → writes to `event_reservations`
- If already reserved: "Reserved ✓" (green) + "Cancel" link

---

## 7. COUNSELLOR PORTAL ARCHITECTURE

**Route:** `/counsellor` → `CounsellorPortal.jsx`  
**Base colour:** `#08121a` (deep slate — professional workspace feel)  
**Accent:** Sky blue (`sky-300`) for active states, amber for warnings, emerald for success

### Layout

```
[Navbar — shared]

[Command Bar: 6 stat cards in a row]
  Active Clients | New Requests | Sessions Today | Follow-Ups Due | Unread Messages | Total Sessions

[3-Column Layout]
  LEFT: Client Roster + New Requests
  CENTRE: Active Panel (context-aware: Client Profile / Session Notes / Messages / Resources)
  RIGHT: Quick Actions + Upcoming Schedule
```

### Stat Cards (6)

| Card | Query |
|------|-------|
| Active Clients | `counsellingRequests` where `counsellorId == uid AND status == 'active'` count |
| New Requests | `counsellingRequests` where `counsellorId == uid AND status == 'pending'` count |
| Sessions Today | `counsellingSessions` where `counsellorId == uid AND sessionDate > today_start AND sessionDate < today_end` count |
| Follow-Ups Due | `counsellingRequests` where `counsellorId == uid AND followUpPending == true` count |
| Unread Messages | `counsellingMessages` where `counsellorId == uid AND isRead == false` count |
| Total Sessions | `counsellingSessions` where `counsellorId == uid AND status == 'completed'` count |

### Client Management Panel

Clicking a client in the left roster loads their full profile in the centre panel.

**Client Profile tabs:**
1. **Overview** — name, contact, service type, status, assigned date, counsellor note
2. **Assessment** — `client_assessments` record for this client (counsellor-only)
3. **Sessions** — all `counsellingSessions` for this client, with "Add Session" button
4. **Session Notes** — `session_notes` linked to each session (counsellor-only, never shown to client)
5. **Follow-Ups** — follow-up notes, dates, outcomes
6. **Resources Shared** — `counsellingResources` sent to this client
7. **Messages** — `counsellingMessages` thread with this client
8. **Attendance** — session history: attended / cancelled / no-show

### Counsellor Tools (Quick Actions panel — right column)

| Action | Collection Written |
|--------|-------------------|
| Schedule Session | `counsellingSessions` + notification |
| Send Message | `counsellingMessages` |
| Send Broadcast | `counsellingMessages` (type: 'broadcast', clientId: null or array) |
| Upload Resource | Firebase Storage + `counsellingResources` |
| Write Session Note | `session_notes` |
| Create Follow-Up Reminder | `counsellingRequests` (followUpPending: true, followUpDate) + notification |
| Mark Assessment Complete | `client_assessments` |
| Close Case | `counsellingRequests` (status: 'closed') |

### Broadcast Messaging Architecture

The counsellor selects audience:
- **Individual** — one specific client
- **All My Clients** — everyone where `counsellorId == uid AND status == 'active'`
- **Programme Group** — all registered in a specific programme

Write to `counsellingMessages` with:
```js
{
  senderId: counsellorId,
  counsellorId: counsellorId,
  recipientId: null,           // null = broadcast
  clientId: null,              // null = all clients
  type: 'broadcast',
  audience: 'all_clients' | 'programme:{slug}' | clientId,
  body: string,
  isRead: false,
  createdAt: serverTimestamp()
}
```

Also write a `users/{clientId}/notifications/{id}` for each affected client.

---

## 8. NOTIFICATION ARCHITECTURE

**Design principle:** Notification delivery method is pluggable. Today: in-app only. Future: email, SMS.

### Notification writer (server-side logic in counsellor portal)

```
sendNotification(clientId, type, payload) {
  // Always write in-app notification
  setDoc(users/{clientId}/notifications/{auto-id}, {
    type,
    title: payload.title,
    body: payload.body,
    linkTo: '/counselling-client',
    dismissed: false,
    createdAt: serverTimestamp(),
    scheduledFor: payload.scheduledFor || null,
    sentVia: ['in_app']
  });

  // Future: if email enabled in settings → call Firebase Extension / Cloud Function
  // Future: if SMS enabled in settings → call Twilio Cloud Function
  // The sentVia array tracks what was used — never hard-code the channel
}
```

### Notification types and triggers

| Type | Trigger | Who receives |
|------|---------|-------------|
| `session_reminder` | 1 hour before session | Client |
| `session_scheduled` | Counsellor books session | Client |
| `session_cancelled` | Counsellor cancels | Client |
| `message` | Counsellor sends message | Client |
| `resource_shared` | Resource uploaded | Client |
| `follow_up` | Counsellor sets follow-up | Client |
| `programme_update` | Admin updates programme | Registered clients |
| `event_reminder` | 1 day before event | Reserved attendees |
| `broadcast` | Counsellor broadcasts | All affected clients |

### In-app delivery

The existing `useStudentNotifications` hook pattern is reused:
- Create `useCounsellingNotifications(userId)` hook
- Query `users/{userId}/notifications` where `dismissed == false`
- Display as toast (for urgent) or notification panel (for general)
- "Dismiss" writes `dismissed: true, dismissedAt: serverTimestamp()`

---

## 9. SESSION SCHEDULING ARCHITECTURE

```
counsellingSessions/{auto-id}
  clientId: string
  counsellorId: string
  sessionDate: Timestamp       // exact datetime
  sessionType: string
  status: 'scheduled'
  sessionNumber: number        // auto-increment per client
  joinUrl: null                // populated when video integration added
  reminderSent: false
  createdAt: Timestamp
  updatedAt: Timestamp

On create:
  → Write notification to client: type 'session_scheduled'
  → Write future notification: type 'session_reminder', scheduledFor: sessionDate - 1 hour
    (Today: in-app only. Future: Cloud Function checks scheduledFor and sends email/SMS)
```

**Video/audio counselling (future architecture — do not build now):**
- Embed Daily.co or Jitsi Meet inside an iframe within the session card
- `joinUrl` populated by counsellor before session
- Client sees "Join" button go active 15 minutes before session
- Recording (if ever needed) requires explicit consent flow — separate legal consideration

---

## 10. PROGRAMME MANAGEMENT ARCHITECTURE

### Admin creates a programme

```
counselling_programmes/{auto-id}
  title: '6 Week Pre-Marital Preparation Programme'
  slug: 'pre-marital-6-week'
  targetAudience: 'male'   // admin creates separate doc for female cohort
  status: 'open'
  maxParticipants: 12
  startDate: Timestamp
  modules: [
    { weekNumber: 1, title: 'Foundations of Marriage', description: '...' },
    { weekNumber: 2, title: 'Rights & Responsibilities', description: '...' },
    ...
  ]
```

### Client registers

```
programme_registrations/{auto-id}
  programmeId: '...'
  clientId: uid
  registrationType: 'enrolled' | 'waitlist' | 'interest'
  status: 'pending'   // admin confirms → 'confirmed'
```

### Status determination logic (client dashboard)

```js
const enrolledCount = registrations.filter(r => 
  r.programmeId === programme.id && r.registrationType === 'enrolled' && r.status === 'confirmed'
).length;

const isFull = programme.maxParticipants && enrolledCount >= programme.maxParticipants;
const isOpen = programme.status === 'open';
const isUpcoming = programme.status === 'upcoming';
const isClosed = programme.status === 'closed' || programme.status === 'draft';

// Button shown:
if (isOpen && !isFull) → 'Register Now'
if ((isUpcoming || isFull) && isOpen) → 'Join Waiting List'
if (isClosed) → 'Register Interest'
```

---

## 11. ADMIN COUNSELLING CONTROLS

Add a new tab to `AdminDashboard.jsx`: **"Counselling"**

Sub-sections:
1. **Client Approvals** — `users` where `role == 'counsellingClient' AND status == 'pending'` — Approve / Reject buttons
2. **Counsellor Management** — approve counsellors, view their client load
3. **Programme Manager** — CRUD for `counselling_programmes`; view registrations per programme
4. **Event Manager** — CRUD for `community_events`
5. **Broadcast Centre** — admin-level broadcast to all clients or all counsellors
6. **Allocation** — assign pending clients to specific counsellors (same pattern as existing teacher allocation)

---

## 12. FILE STRUCTURE TO CREATE

```
src/pages/
  CounsellingClientDashboard.jsx    ← REWRITE completely
  CounsellorPortal.jsx              ← REWRITE completely

src/hooks/
  useCounsellingNotifications.js    ← NEW
  useCounsellingMessages.js         ← NEW
  useCounsellingResources.js        ← NEW
  useSessions.js                    ← NEW
  useProgrammeRegistration.js       ← NEW
  useCommunityEvents.js             ← NEW

src/components/counselling/
  SupportJourney.jsx                ← NEW
  ServiceCard.jsx                   ← NEW
  PreMaritalProgramme.jsx           ← NEW (featured section)
  ProgrammeRegistrationModal.jsx    ← NEW
  SupportOptions.jsx                ← NEW
  IslamicFoundation.jsx             ← NEW
  SessionCard.jsx                   ← NEW
  CounsellingMessageThread.jsx      ← NEW
  ResourceCard.jsx                  ← NEW
  CommunityEventCard.jsx            ← NEW
  EventReservationButton.jsx        ← NEW
  ClientRoster.jsx                  ← NEW (counsellor side)
  ClientProfilePanel.jsx            ← NEW (counsellor side)
  SessionNotesForm.jsx              ← NEW (counsellor side)
  BroadcastPanel.jsx                ← NEW (counsellor side)
  CounsellingStatCard.jsx           ← NEW

src/data/
  counsellingServices.js            ← NEW (12 service definitions)
  islamicFoundationPillars.js       ← NEW (6 pillars content)

storage.rules                       ← CREATE (critical)
```

---

## 13. COMPOSITE FIRESTORE INDEXES REQUIRED

Deploy these in Firebase Console → Firestore → Indexes:

| Collection | Fields | Order |
|-----------|--------|-------|
| `counsellingSessions` | `clientId`, `sessionDate` | asc |
| `counsellingSessions` | `counsellorId`, `status`, `sessionDate` | asc |
| `counsellingMessages` | `clientId`, `createdAt` | desc |
| `counsellingMessages` | `counsellorId`, `isRead`, `createdAt` | desc |
| `counsellingResources` | `clientId`, `createdAt` | desc |
| `counsellingRequests` | `counsellorId`, `status`, `createdAt` | desc |
| `counsellingRequests` | `clientId`, `status`, `createdAt` | desc |
| `community_events` | `audience`, `date` | asc |
| `programme_registrations` | `programmeId`, `registrationType`, `status` | asc |
| `programme_registrations` | `clientId`, `status` | desc |
| `users/{uid}/notifications` | `dismissed`, `createdAt` | desc |

---

## 14. CONFIDENTIALITY MODEL

| Data | Client can read | Counsellor can read | Admin can read |
|------|----------------|---------------------|----------------|
| `counsellingRequests` | Own only | Assigned clients only | All |
| `counsellingSessions` | Own only | Assigned clients only | All |
| `counsellingMessages` | Own thread only | Assigned clients only | All |
| `counsellingResources` | Shared with them | Own uploads | All |
| `client_assessments` | ❌ Never | Own clients only | All |
| `session_notes` | ❌ Never | Own clients only | All |
| `counsellors/{uid}/private_data` | ❌ Never | Self only | All |

**Key principle:** Session notes and assessments are NEVER readable by clients. This is enforced at the Firestore rules level, not the UI level. Even if a bug shows the UI, the database will reject the read.

---

## 15. RECOMMENDED BUILD ORDER

Build in this sequence — each step unlocks the next:

**Week 1 (Foundation)**
1. Create `storage.rules` ← do this first, today
2. Add new Firestore rules (programme_registrations, community_events, session_notes, client_assessments, notifications)
3. Deploy both to Firebase

**Week 2 (Client Dashboard)**
4. Rewrite `CounsellingClientDashboard.jsx` — Support Journey + Services + Pre-Marital section
5. Build `PreMaritalProgramme.jsx` with registration modal
6. Build `CommunityEventCard.jsx` + admin event publisher

**Week 3 (Counsellor Portal)**
7. Rewrite `CounsellorPortal.jsx` — command centre layout + stat cards + client roster
8. Build `ClientProfilePanel.jsx` with all tabs
9. Build `SessionNotesForm.jsx` + `BroadcastPanel.jsx`

**Week 4 (Notifications + Admin)**
10. Build `useCounsellingNotifications.js` hook
11. Add Counselling tab to AdminDashboard — client approvals, programme manager, event manager
12. Build programme CRUD admin UI

**Post-launch (future)**
- Email notifications via Firebase Extension
- SMS via Twilio Cloud Function
- Video session embed
- Payment for programmes via PayFast

---

*End of Architecture Document — SirajOne Counselling Ecosystem v1.0*
