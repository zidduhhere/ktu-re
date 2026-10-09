# KTU Student Portal Redesign — Design Spec

**Date:** 2026-10-09  
**Status:** Approved  
**Scope:** Login, Home, Results, Exams, Notifications pages. Profile page is out of scope.

---

## 1. Intent & Success Criteria

The existing KTU portal is designed around edge cases (anti-ragging, fee details, Suraksha) rather than the daily use case. The redesign's core principle is:

> **Get the student in, get what they need, get them out fast.**

Success looks like:
- A student can check their latest SGPA and next exam in under 5 seconds from login.
- The UI carries zero noise — no feature that serves less than ~50% of daily visits.
- The portal feels like a modern SaaS product, not a government webpage.

---

## 2. Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Frontend | Next.js 16 (App Router) + TypeScript | Already scaffolded |
| UI Components | ShadCN UI + Tailwind CSS v4 | Already installed; compound components, accessible |
| Backend | Next.js API Routes (`app/api/`) | Same process, zero extra server |
| ORM | Prisma | Typed schema, migrations, easy SQLite->Postgres swap |
| Database | SQLite (file-based) | Zero setup, local dev |
| Auth | `iron-session` | Signed/encrypted cookie, no DB session table |
| Icons | Lucide React | SVG only, no emoji |
| Fonts | Inter (Google Fonts) | Clean sans-serif matching reference aesthetic |

---

## 3. Project Structure

```
ktu/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx
│   ├── (portal)/
│   │   ├── layout.tsx          # Sidebar + session guard
│   │   ├── home/
│   │   │   └── page.tsx
│   │   ├── results/
│   │   │   └── page.tsx
│   │   ├── exams/
│   │   │   └── page.tsx
│   │   └── notifications/
│   │       └── page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   └── logout/route.ts
│   │   ├── results/route.ts
│   │   ├── exams/route.ts
│   │   └── notifications/
│   │       ├── route.ts
│   │       ├── [id]/read/route.ts
│   │       └── read-all/route.ts
│   ├── globals.css
│   └── layout.tsx
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── lib/
│   ├── db.ts                   # Prisma client singleton
│   ├── auth.ts                 # iron-session config + helpers
│   └── types.ts                # Shared TypeScript types
└── components/
    ├── ui/                     # ShadCN generated components
    ├── sidebar/
    │   └── AppSidebar.tsx
    ├── home/
    │   ├── StatCard.tsx
    │   ├── SgpaTrendChart.tsx
    │   ├── CalendarWidget.tsx
    │   ├── GradeTable.tsx
    │   └── NotificationStrip.tsx
    ├── results/
    │   ├── SemesterTabs.tsx
    │   └── ResultTable.tsx
    ├── exams/
    │   ├── ExamTypeFilter.tsx
    │   └── ExamCard.tsx
    └── notifications/
        └── NotificationList.tsx
```

---

## 4. Data Model (Prisma Schema)

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Student {
  id            String         @id       // e.g. "TVE22CS001"
  name          String
  branch        String
  semester      Int                      // current active semester
  college       String
  phone         String
  passwordHash  String
  results       Result[]
  exams         Exam[]
  notifications Notification[]
}

model Result {
  id          Int     @id @default(autoincrement())
  studentId   String
  semester    Int
  examType    String                     // "regular" | "supply"
  subject     String
  subjectCode String
  grade       String                     // S, A+, A, B+, B, C, D, F, FE, AB
  credits     Float
  student     Student @relation(fields: [studentId], references: [id])

  @@unique([studentId, semester, examType, subjectCode])
}

// SGPA = Sum(gradePoint x credits) / Sum(credits) per semester
// CGPA = Sum(gradePoint x credits across all sems) / Sum(all credits)
// Both computed in API layer, never stored.

model Exam {
  id          Int      @id @default(autoincrement())
  studentId   String
  semester    Int
  type        String                     // "ese" | "minor" | "major" | "supply"
  subject     String
  subjectCode String
  date        DateTime
  time        String
  venue       String
  hallTicket  String?
  student     Student  @relation(fields: [studentId], references: [id])
}

model Notification {
  id        Int      @id @default(autoincrement())
  studentId String
  title     String
  body      String
  type      String                       // "result" | "exam" | "general"
  read      Boolean  @default(false)
  createdAt DateTime @default(now())
  student   Student  @relation(fields: [studentId], references: [id])
}
```

**KTU Grade Point Table:**

| Grade | Points |
|---|---|
| S | 10 |
| A+ | 9 |
| A | 8.5 |
| B+ | 8 |
| B | 7 |
| C | 6 |
| D | 5 |
| F / FE / AB | 0 |

---

## 5. Authentication

- **Login:** `POST /api/auth/login` validates student ID + bcrypt password, sets `iron-session` cookie, redirects to `/home`
- **Session payload:** `{ studentId: string, name: string }`
- **Guard:** `(portal)/layout.tsx` reads session server-side; redirects to `/login` if absent
- **Logout:** `POST /api/auth/logout` destroys session, redirects to `/login`
- **No registration flow** — students created via seed script only

---

## 6. API Routes

| Route | Method | Auth | Description |
|---|---|---|---|
| `/api/auth/login` | POST | — | Validate credentials, set session |
| `/api/auth/logout` | POST | Yes | Destroy session |
| `/api/results` | GET | Yes | All results; optional `?semester=N` filter |
| `/api/exams` | GET | Yes | All exams; optional `?semester=N&type=ese` filters |
| `/api/notifications` | GET | Yes | All notifications, `createdAt` desc |
| `/api/notifications/[id]/read` | PATCH | Yes | Mark single notification read |
| `/api/notifications/read-all` | PATCH | Yes | Mark all notifications read |

All protected routes return `401` if session cookie is absent.

---

## 7. Design System

### Colours

| Token | Hex | Usage |
|---|---|---|
| `--color-primary` | `#0720FF` | Sidebar active pill, chart bars, badges, CTAs, metric numbers |
| `--color-primary-light` | `#EEF1FF` | Card tints, hover backgrounds, table header row |
| `--color-bg` | `#FFFFFF` | Page background |
| `--color-surface` | `#F5F8FF` | Content area background (subtle blue tint behind cards) |
| `--color-card` | `#FFFFFF` | All cards |
| `--color-border` | `#E8EEFF` | Hairline borders |
| `--color-text` | `#0D0D0D` | Primary text |
| `--color-muted` | `#9CA3AF` | Labels, secondary text, timestamps |
| `--color-destructive` | `#DC2626` | Error states, F/FE/AB grade cells |

### Typography

- **Font:** Inter, loaded from Google Fonts
- **Metric numbers:** `font-bold text-3xl` — `#0720FF`
- **Card titles:** `font-semibold text-sm` — `#0D0D0D`
- **Labels/captions:** `font-normal text-xs` — `#9CA3AF`
- **Body text:** `font-normal text-sm` — `#0D0D0D`

### Spacing & Radius

| Token | Value | Usage |
|---|---|---|
| Card radius | `rounded-2xl` | All cards |
| Button/input radius | `rounded-xl` | Buttons, inputs, filter pills |
| Sidebar pill | `rounded-full` | Active sidebar indicator |
| Card padding | `p-5` or `p-6` | Internal card spacing |
| Grid gap | `gap-4` | Between cards |

### Motion

- **Card entrance:** stagger on load — `opacity 0→1`, `y 12px→0`, 300–400ms, `ease: back.out(1.4)`
- **Card hover:** `scale(1.01)` + shadow lift, `150ms ease`
- **Sidebar transition:** `200ms ease`
- **`prefers-reduced-motion`:** skip all animations, render final state immediately

### Logo

- Monochrome SVG, tinted `#0720FF`
- Shown at top of sidebar

---

## 8. Pages

### 8.1 Login (`/login`)

- Centered card, white background
- KTU monochrome logo (top center)
- Fields: Student ID, Password
- CTA: "Sign in" — `#0720FF` fill, `rounded-xl`
- Inline error on invalid credentials (no page reload, no toast)
- No forgot password, no register

---

### 8.2 Portal Layout — Sidebar

- **Width:** 64px fixed, full viewport height
- **Background:** `#FFFFFF` with `border-r` `#E8EEFF`
- **Top items:** Home (house), Results (bar chart), Exams (calendar), Notifications (bell)
- **Bottom items:** Logout (log-out icon)
- **Active:** `#0720FF` filled `rounded-full` pill, white Lucide icon
- **Inactive:** `#9CA3AF` icon, transparent bg
- **Hover tooltip:** page name appears as floating label to the right

---

### 8.3 Home (`/home`)

**Grid layout:**
```
[Greeting + subtitle]                      [Search] [Bell + badge]
[SGPA card]  [Next Exam card]  [Notification count card]
[SGPA Trend chart (60%)]     |  [Calendar widget (40%)]
[Current Semester Grade Table — full width]
[Notification Strip — last 3 unread]
```

**Greeting:** `Hello, {name}!`  
**Subtitle:** `S{n} · {branch} · {college}`

**Stat Cards:**
- *SGPA Card:* Current semester SGPA in large `#0720FF` text; delta vs previous sem (↑/↓)
- *Next Exam Card:* Subject, exam type badge, date + "in N days" countdown
- *Notifications Card:* Unread count in `#0720FF`; "notifications" label

**SGPA Trend Chart:**
- Vertical bar chart — one bar per completed semester
- All bars `#0720FF` at 60% opacity; current semester bar at full opacity
- Y-axis: 0–10, dashed gridlines, labels at 0/5/10
- X-axis: S1, S2, … Sn labels
- Built with CSS/SVG — no external chart library
- Tooltip on hover: semester label + SGPA value

**Calendar Widget:**
- Month grid view; `<` `>` nav for month
- Exam dates: `#0720FF` dot below date number
- Today: `#0720FF` filled circle on date number, white text
- Hover/click on exam date: tooltip with subject, type, time

**Current Semester Grade Table:**
- ShadCN `<Table>` component
- Columns: Subject Code | Subject | Exam Type | Grade | Credits | Grade Point
- Header row: `#EEF1FF` background
- Grade colour: `S/A+` → `#0720FF`; `F/FE/AB` → `#DC2626`; others → `#0D0D0D`
- Supply rows: inline `SUPPLY` badge

**Notification Strip:**
- Last 3 unread; type icon + title + relative time
- "View all notifications →" link

---

### 8.4 Results (`/results`)

- Semester tabs: S1 → S{current}, horizontal pill tabs
- SGPA for selected semester: large metric at top (`#0720FF`)
- CGPA: sticky footer bar across tab changes
- Subject table: same columns as home grade table
- Supply results inline with `SUPPLY` badge
- Download button: browser print dialog with print-optimised CSS (no jsPDF)
- Analytics panel (collapsible):
  - Grade distribution: horizontal bar per grade, `#0720FF` fill
  - Best subject / Worst subject callout cards

---

### 8.5 Exams (`/exams`)

- Semester tabs: same as Results
- Exam type filter pills: All | ESE | Minor | Major | Supply
- Exam cards grid, `rounded-2xl`:
  - Subject name (bold) + code (muted)
  - Exam type badge (coloured pill)
  - Date (CalendarDays icon), Time (Clock icon), Venue (MapPin icon)
  - Hall ticket number (dimmed, if available)
  - Exams within 7 days: `#0720FF` left border accent
- Empty state: "No exams scheduled" + CalendarDays icon

---

### 8.6 Notifications (`/notifications`)

- Full list, newest first
- Unread: white card, bold title, `#0720FF` left dot
- Read: `#F5F8FF` card, normal weight, no dot
- Type icons: `BarChart2` (result), `CalendarDays` (exam), `Bell` (general)
- Relative timestamp: "2 hours ago"
- Click to mark as read
- "Mark all as read" button (top right)
- Empty state: "You're all caught up" + Bell icon

---

## 9. Seed Data

`prisma/seed.ts` creates one student:

```
ID:       TVE22CS001
Password: student123 (bcrypt hashed)
Name:     Aleena Jaison
Branch:   Computer Science and Engineering
Semester: 5
College:  TKM College of Engineering, Kollam
Phone:    +91 9876543210
```

- **Results:** S1–S5, ~6 subjects each, realistic KTU grades, 1 supply entry in S3
- **Exams:** S5 ESE schedule (6 subjects, Nov–Dec), 2 minor exams upcoming
- **Notifications:** 5 entries — 2 result published, 2 exam reminder, 1 general; 3 unread

---

## 10. Out of Scope

- Profile page (student detail view/edit)
- Admin panel or data entry UI
- Real KTU API integration
- Dark mode
- Mobile/responsive layout (desktop-first)
- Password reset or student registration

---

## 11. Pre-Delivery Checklist

- [ ] `cursor-pointer` on all interactive elements
- [ ] Hover states with 150–300ms transitions
- [ ] Text contrast >= 4.5:1 against all backgrounds
- [ ] Keyboard navigation: sidebar, tabs, filter pills, table, calendar
- [ ] Focus rings visible on all focusable elements
- [ ] `prefers-reduced-motion`: skip stagger, show final state
- [ ] No emoji as icons — Lucide SVG only
- [ ] All protected API routes return `401` for missing session
- [ ] Prisma singleton in `lib/db.ts` (no connection leak)
- [ ] Seed runs cleanly with `npx prisma db seed`
