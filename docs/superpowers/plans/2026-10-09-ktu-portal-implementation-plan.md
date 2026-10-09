# KTU Student Portal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a redesigned KTU student portal with Login, Home, Results, Exams, and Notifications pages backed by Next.js 16 API Routes + Prisma + SQLite.

**Architecture:** Next.js 16 App Router with route groups — `(auth)` for public routes, `(portal)` for session-guarded routes. Auth uses `jose` JWT signed into an HttpOnly cookie via `next/headers` cookies API (Next.js 16 native pattern, no iron-session). Prisma with SQLite as local DB, ShadCN UI components throughout.

**Tech Stack:** Next.js 16, React 19, TypeScript, Prisma, SQLite, jose, bcryptjs, ShadCN UI, Tailwind CSS v4, Lucide React, Inter (Google Fonts)

**Spec:** `docs/superpowers/specs/2026-10-09-ktu-student-portal-design.md`

## Global Constraints

- Next.js 16 App Router only — no Pages Router
- `'use server'` on all Server Actions; `'use client'` only where state/interactivity is required
- Session via `jose` JWT in HttpOnly cookie named `ktu-session`; payload: `{ studentId: string, name: string }`
- All protected routes/actions verify session; return/redirect to `/login` if absent
- Primary colour: `#0720FF` — used as CSS variable `--color-primary`
- All icons: Lucide React SVG — no emoji anywhere
- ShadCN compound component pattern: `<Card><CardHeader><CardContent>`
- `DATABASE_URL="file:./dev.db"` in `.env`
- `SESSION_SECRET` env var — 32+ char random string for JWT signing
- Seed student: ID `TVE22CS001`, password `student123` (bcrypt hashed)
- TypeScript strict mode throughout

## Review Focus

1. **Wrong password shows no error** — login Server Action must return `{ error: 'Invalid credentials' }` and the form must render it inline; redirect must not happen on failure
2. **Unauthenticated direct navigation to `/home`** — portal layout must read cookie server-side and call `redirect('/login')` before rendering any child
3. **Supply result for same subject/semester as regular** — ResultTable must show both rows with the supply badge; the `@@unique` constraint allows this via `examType` field
4. **No exams in a semester** — ExamCard grid must render the empty state component, not an empty grid
5. **SGPA with zero-credit subjects** — SGPA computation in `/api/results` must guard against division by zero when all credits are 0

---

## Task 1: Foundation — Prisma Schema, Env, Dependencies, Seed

**Files:**
- Create: `prisma/schema.prisma`
- Create: `prisma/seed.ts`
- Modify: `package.json` (add seed script)
- Create: `.env` (DATABASE_URL + SESSION_SECRET)
- Create: `lib/db.ts`
- Create: `lib/types.ts`

**Interfaces:**
- Produces:
  - `db` — Prisma client singleton from `lib/db.ts`
  - Types: `SessionPayload`, `ResultWithComputed`, `ExamRow`, `NotificationRow` from `lib/types.ts`
  - Grade point helper: `gradeToPoints(grade: string): number` in `lib/types.ts`

- [ ] **Step 1: Install dependencies**

```bash
npm install prisma @prisma/client bcryptjs jose
npm install -D @types/bcryptjs
npx prisma init --datasource-provider sqlite
```

- [ ] **Step 2: Install ShadCN and Lucide**

```bash
npx shadcn@latest init --defaults
npx shadcn@latest add card table tabs badge button input label
npm install lucide-react
```

- [ ] **Step 3: Write `prisma/schema.prisma`**

Copy the schema verbatim from spec Section 4. Datasource: sqlite, `url = env("DATABASE_URL")`.

- [ ] **Step 4: Set up `.env`**

```
DATABASE_URL="file:./dev.db"
SESSION_SECRET="ktu-portal-local-dev-secret-32chars!!"
```

- [ ] **Step 5: Write `lib/db.ts`**

Prisma singleton pattern — check `globalThis.prisma` before instantiating to avoid connection leak in Next.js dev hot-reload.

Produces: `export const db: PrismaClient`

- [ ] **Step 6: Write `lib/types.ts`**

```typescript
export type SessionPayload = {
  studentId: string
  name: string
  expiresAt: Date
}

// Grade → point mapping per KTU spec
export function gradeToPoints(grade: string): number // S=10, A+=9, A=8.5, B+=8, B=7, C=6, D=5, else 0

export type ResultWithComputed = {
  // mirrors Prisma Result fields + computed gradePoint
  id: number; studentId: string; semester: number; examType: string
  subject: string; subjectCode: string; grade: string; credits: number
  gradePoint: number // = gradeToPoints(grade)
}
```

- [ ] **Step 7: Run migration**

```bash
npx prisma migrate dev --name init
```

Expected: `dev.db` created, migration applied.

- [ ] **Step 8: Write `prisma/seed.ts`**

Create student `TVE22CS001` (bcrypt hash of `student123`, saltRounds=10).
Seed:
- Results: S1–S5, 6 subjects each, realistic KTU grades, 1 supply row in S3 for `CS300` with grade `B+`
- Exams: S5 ESE (6 subjects, dates in Nov–Dec 2026), 2 minor exams in next 7 days
- Notifications: 5 entries (2 result, 2 exam, 1 general), 3 with `read: false`

- [ ] **Step 9: Add seed script to `package.json`**

```json
"prisma": { "seed": "ts-node --compiler-options '{\"module\":\"CommonJS\"}' prisma/seed.ts" }
```

- [ ] **Step 10: Run seed**

```bash
npx prisma db seed
```

Expected: "Seeding complete" logged, no errors.

- [ ] **Step 11: Commit**

```bash
git add prisma/ lib/ .env package.json
git commit -m "feat: prisma schema, seed data, db singleton, types"
```

---

## Task 2: Authentication — Session Helpers, Login Action, Guard, Logout

**Files:**
- Create: `lib/auth.ts`
- Create: `app/actions/auth.ts`
- Create: `app/(auth)/login/page.tsx`
- Create: `app/(auth)/login/LoginForm.tsx` (Client Component)
- Create: `app/api/auth/logout/route.ts`

**Interfaces:**
- Consumes: `db` from `lib/db.ts`, `SessionPayload` from `lib/types.ts`
- Produces:
  - `createSession(payload: SessionPayload): Promise<void>` in `lib/auth.ts`
  - `getSession(): Promise<SessionPayload | null>` in `lib/auth.ts`
  - `deleteSession(): Promise<void>` in `lib/auth.ts`
  - Server Action: `login(state, formData): Promise<{ error?: string }>` in `app/actions/auth.ts`

- [ ] **Step 1: Write failing test for `gradeToPoints`**

```typescript
// lib/__tests__/types.test.ts
import { gradeToPoints } from '../types'
it('S = 10', () => expect(gradeToPoints('S')).toBe(10))
it('A+ = 9', () => expect(gradeToPoints('A+')).toBe(9))
it('F = 0', () => expect(gradeToPoints('F')).toBe(0))
it('AB = 0', () => expect(gradeToPoints('AB')).toBe(0))
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx jest lib/__tests__/types.test.ts
```

Expected: FAIL — `gradeToPoints` not implemented.

- [ ] **Step 3: Implement `gradeToPoints` in `lib/types.ts`**

Map `{ S:10, 'A+':9, A:8.5, 'B+':8, B:7, C:6, D:5 }`, default `0`.

- [ ] **Step 4: Run test to verify it passes**

```bash
npx jest lib/__tests__/types.test.ts
```

Expected: PASS (4 tests).

- [ ] **Step 5: Write `lib/auth.ts`**

Use `jose` `SignJWT` / `jwtVerify` with `SESSION_SECRET` env var (encoded via `TextEncoder`).
`createSession`: signs payload, sets cookie `ktu-session` — `httpOnly: true`, `secure: false` (local dev), `sameSite: 'lax'`, `path: '/'`, expires 7 days.
`getSession`: reads `ktu-session` cookie via `cookies()` from `next/headers`, decrypts, returns `SessionPayload | null`.
`deleteSession`: clears the cookie.

- [ ] **Step 6: Write Server Action `app/actions/auth.ts`**

```typescript
'use server'
export async function login(
  state: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }>
```

Steps inside: get `studentId` + `password` from formData → query `db.student.findUnique` → if not found, return `{ error: 'Invalid credentials' }` → `bcrypt.compare` → if fail, return `{ error: 'Invalid credentials' }` → `createSession({ studentId, name, expiresAt })` → `redirect('/home')`.

- [ ] **Step 7: Write `app/(auth)/login/LoginForm.tsx`**

`'use client'` component. Use `useActionState(login, undefined)`. Render:
- Student ID input (`id="student-id"`, `name="studentId"`)
- Password input (`id="password"`, `name="password"`, `type="password"`)
- Submit button (disabled while pending)
- `{state?.error && <p className="text-destructive text-sm">{state.error}</p>}`

- [ ] **Step 8: Write `app/(auth)/login/page.tsx`**

Server Component. Import `LoginForm`. Center on white background, show KTU monochrome logo (placeholder `<div>` with text "KTU" for now — logo SVG added in Task 3).

- [ ] **Step 9: Write `app/api/auth/logout/route.ts`**

`POST` handler: call `deleteSession()`, return `redirect('/login')`.

- [ ] **Step 10: Commit**

```bash
git add lib/auth.ts app/actions/ app/\(auth\)/ app/api/auth/
git commit -m "feat: auth — session helpers, login action, login page, logout"
```

---

## Task 3: Design System, Global CSS, Sidebar & Portal Layout

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Create: `components/sidebar/AppSidebar.tsx`
- Create: `app/(portal)/layout.tsx`

**Interfaces:**
- Consumes: `getSession()` from `lib/auth.ts`
- Produces: `<AppSidebar activePath: string />` component

- [ ] **Step 1: Update `app/globals.css`**

Add Google Fonts import for Inter. Define CSS custom properties:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

:root {
  --color-primary: #0720FF;
  --color-primary-light: #EEF1FF;
  --color-bg: #FFFFFF;
  --color-surface: #F5F8FF;
  --color-card: #FFFFFF;
  --color-border: #E8EEFF;
  --color-text: #0D0D0D;
  --color-muted: #9CA3AF;
  --color-destructive: #DC2626;
  --radius-card: 1rem;        /* rounded-2xl */
  --radius-btn: 0.75rem;      /* rounded-xl */
  --radius-pill: 9999px;      /* rounded-full */
}

body { font-family: 'Inter', sans-serif; background: var(--color-bg); color: var(--color-text); }
```

Also add: `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }`

- [ ] **Step 2: Update `app/layout.tsx`**

Set `<html lang="en">`, `<body>` with Inter class. Keep existing structure.

- [ ] **Step 3: Write `components/sidebar/AppSidebar.tsx`**

`'use client'` component. Props: `activePath: string`.

Sidebar: `fixed left-0 top-0 h-screen w-16 flex flex-col items-center py-4 border-r border-[var(--color-border)] bg-white z-50`.

Nav items array:
```typescript
const NAV = [
  { href: '/home', icon: House, label: 'Home' },
  { href: '/results', icon: BarChart2, label: 'Results' },
  { href: '/exams', icon: CalendarDays, label: 'Exams' },
  { href: '/notifications', icon: Bell, label: 'Notifications' },
]
```

Each item: `<Link>` with `title={label}` (tooltip via native title). Active: wrap icon in `<span className="rounded-full p-2 bg-[var(--color-primary)]">` with white icon. Inactive: icon in `#9CA3AF`.

Bottom: Logout form — `<form action={logoutAction}>` with a submit button showing `LogOut` icon.

- [ ] **Step 4: Write `app/(portal)/layout.tsx`**

Server Component. Call `getSession()`. If null, `redirect('/login')`. Render:
```tsx
<div className="flex min-h-screen">
  <AppSidebar activePath={/* from headers or pathname */} />
  <main className="ml-16 flex-1 bg-[var(--color-surface)] p-6">
    {children}
  </main>
</div>
```

Note: `activePath` — pass `headers().get('x-pathname')` or use a Client wrapper that reads `usePathname()`. Use a thin `'use client'` `<PortalLayout>` wrapper so `usePathname` is available.

- [ ] **Step 5: Verify layout renders**

```bash
npm run dev
```

Navigate to `http://localhost:3000/home` — expected: redirect to `/login`. Log in with `TVE22CS001` / `student123` — expected: redirect to `/home`, sidebar visible with 4 icons.

- [ ] **Step 6: Commit**

```bash
git add app/globals.css app/layout.tsx components/sidebar/ app/\(portal\)/layout.tsx
git commit -m "feat: design system tokens, sidebar, portal layout with session guard"
```

---

## Task 4: Home Page

**Files:**
- Create: `app/(portal)/home/page.tsx`
- Create: `components/home/StatCard.tsx`
- Create: `components/home/SgpaTrendChart.tsx`
- Create: `components/home/CalendarWidget.tsx`
- Create: `components/home/GradeTable.tsx`
- Create: `components/home/NotificationStrip.tsx`

**Interfaces:**
- Consumes: `getSession()`, `db`, `gradeToPoints`, `ResultWithComputed`, `ExamRow`, `NotificationRow`
- Produces: Home page at `/home` with all 5 widget rows

- [ ] **Step 1: Write `components/home/StatCard.tsx`**

Props: `{ title: string, value: string | number, sub?: string, accent?: boolean }`.
Render: ShadCN `<Card>` + `<CardContent>`. Value in `text-3xl font-bold` — `text-[var(--color-primary)]` when `accent`. Sub in `text-xs text-[var(--color-muted)]`.
Add hover: `transition-transform duration-150 hover:scale-[1.01]`.

- [ ] **Step 2: Write `components/home/SgpaTrendChart.tsx`**

Props: `{ data: { semester: number, sgpa: number }[], currentSem: number }`.

Pure CSS/SVG bar chart — no external library.
- SVG `viewBox="0 0 {bars * 40} 120"`, one `<rect>` per semester
- Bar height = `(sgpa / 10) * 100`, y = `100 - height`
- Current semester bar: `fill="var(--color-primary)"`, others: `fill="var(--color-primary)"` at `opacity="0.45"`
- X-axis `<text>` labels: `S1`, `S2`, …
- Y dashed gridlines at 0, 50%, 100% heights

- [ ] **Step 3: Write `components/home/CalendarWidget.tsx`**

`'use client'` component. Props: `{ exams: { date: string, subject: string, type: string, time: string }[] }`.

State: `currentMonth: Date`. Navigation: `<` `>` buttons update month.
Render a 7-column grid of day cells. Exam dates: `#0720FF` dot below number. Today: `#0720FF` filled circle, white number.
On hover over exam date, show `<div>` tooltip (absolute positioned) with subject + type + time.

- [ ] **Step 4: Write `components/home/GradeTable.tsx`**

Props: `{ results: ResultWithComputed[] }`.
ShadCN `<Table>`. Columns: Subject Code | Subject | Exam Type | Grade | Credits | Grade Point.
Header: `bg-[var(--color-primary-light)]`.
Grade cell: `text-[var(--color-primary)]` for S/A+, `text-[var(--color-destructive)]` for F/FE/AB, else default.
Supply rows: inline `<Badge variant="outline">SUPPLY</Badge>`.

- [ ] **Step 5: Write `components/home/NotificationStrip.tsx`**

Props: `{ notifications: NotificationRow[] }`.
Render max 3. Each: Lucide icon (by type) + title (bold if unread) + relative time.
Footer: `<Link href="/notifications">View all notifications →</Link>` in `text-[var(--color-primary)]`.

- [ ] **Step 6: Write `app/(portal)/home/page.tsx`**

Server Component. Fetch all data server-side:
- `getSession()` → `studentId`, `name`
- `db.student.findUnique` → branch, college, semester
- `db.result.findMany({ where: { studentId, semester: student.semester } })` → current sem results, compute `gradePoint` per row
- Compute current SGPA: `Σ(gradePoint × credits) / Σ(credits)` for current semester
- SGPA per past semester: aggregate per semester number
- `db.exam.findMany({ where: { studentId }, orderBy: { date: 'asc' } })` → next exam = first future exam
- `db.notification.findMany({ where: { studentId }, orderBy: { createdAt: 'desc' }, take: 3 })` — unread only for strip
- Unread count: `db.notification.count({ where: { studentId, read: false } })`

Render layout (grid):
```
Row 1: greeting div + search+bell icons (bell shows unread badge)
Row 2: 3 × <StatCard>
Row 3: <SgpaTrendChart> (col-span-3) + <CalendarWidget> (col-span-2), 5-col grid
Row 4: <GradeTable> full width
Row 5: <NotificationStrip>
```

- [ ] **Step 7: Verify home page renders all widgets**

```bash
npm run dev
```

Navigate to `/home` after login. Verify: greeting shows name, SGPA stat card shows a value, chart renders bars, calendar shows current month with exam dots, grade table has S5 subjects, notification strip shows 3 items.

- [ ] **Step 8: Commit**

```bash
git add app/\(portal\)/home/ components/home/
git commit -m "feat: home page — stat cards, SGPA chart, calendar, grade table, notification strip"
```

---

## Task 5: Results Page

**Files:**
- Create: `app/(portal)/results/page.tsx`
- Create: `components/results/SemesterTabs.tsx`
- Create: `components/results/ResultTable.tsx`
- Create: `app/api/results/route.ts`

**Interfaces:**
- Consumes: `db`, `gradeToPoints`, `ResultWithComputed`, session
- Produces:
  - `GET /api/results?semester=N` → `{ results: ResultWithComputed[], sgpa: number, cgpa: number }`
  - Results page at `/results`

- [ ] **Step 1: Write failing test for SGPA computation**

```typescript
// lib/__tests__/sgpa.test.ts
import { gradeToPoints } from '../types'

function computeSgpa(rows: { grade: string, credits: number }[]): number {
  const total = rows.reduce((s, r) => s + r.credits, 0)
  if (total === 0) return 0
  return rows.reduce((s, r) => s + gradeToPoints(r.grade) * r.credits, 0) / total
}

it('computes SGPA correctly', () => {
  const rows = [{ grade: 'S', credits: 4 }, { grade: 'B', credits: 3 }]
  // (10*4 + 7*3) / 7 = 61/7 ≈ 8.71
  expect(computeSgpa(rows)).toBeCloseTo(8.71, 1)
})

it('returns 0 for zero credits', () => {
  expect(computeSgpa([])).toBe(0)
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx jest lib/__tests__/sgpa.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Move `computeSgpa` into `lib/types.ts` and export it**

Signature: `export function computeSgpa(rows: { grade: string, credits: number }[]): number`

- [ ] **Step 4: Run test passing `computeSgpa` from `lib/types`**

```bash
npx jest lib/__tests__/sgpa.test.ts
```

Expected: PASS.

- [ ] **Step 5: Write `app/api/results/route.ts`**

`GET` handler: read session (401 if absent). Read `?semester` query param. Query `db.result.findMany` filtered by studentId (+ semester if provided). Compute SGPA per semester (or selected), CGPA across all. Return JSON.

- [ ] **Step 6: Write `components/results/SemesterTabs.tsx`**

`'use client'`. Props: `{ semesters: number[], activeSem: number, onChange: (n: number) => void }`.
ShadCN `<Tabs>` component — one `<TabsTrigger>` per semester (`S1`…`Sn`).

- [ ] **Step 7: Write `components/results/ResultTable.tsx`**

Props: `{ results: ResultWithComputed[], sgpa: number }`.
Same column structure as `GradeTable` from Task 4 — reuse or extend.
Add: SGPA display above table as large `text-3xl font-bold text-[var(--color-primary)]`.
Analytics panel (collapsible `<details>`):
- Grade distribution: `<div>` bars per grade, width proportional to count, `bg-[var(--color-primary)]`
- Best/worst subject callout

- [ ] **Step 8: Write `app/(portal)/results/page.tsx`**

`'use client'` (needs tab state). Fetch all results client-side from `/api/results` on mount and on tab change. Render:
- `<SemesterTabs>` 
- CGPA sticky footer: `fixed bottom-0` bar with `CGPA: X.XX`
- `<ResultTable>` for selected semester
- Download button: `window.print()` — add `@media print` CSS to hide sidebar and show clean table

- [ ] **Step 9: Commit**

```bash
git add app/\(portal\)/results/ components/results/ app/api/results/ lib/types.ts lib/__tests__/
git commit -m "feat: results page — semester tabs, result table, SGPA/CGPA, analytics, print"
```

---

## Task 6: Exams Page

**Files:**
- Create: `app/(portal)/exams/page.tsx`
- Create: `components/exams/ExamTypeFilter.tsx`
- Create: `components/exams/ExamCard.tsx`
- Create: `app/api/exams/route.ts`

**Interfaces:**
- Consumes: `db`, session, `ExamRow`
- Produces:
  - `GET /api/exams?semester=N&type=ese` → `{ exams: ExamRow[] }`
  - Exams page at `/exams`

- [ ] **Step 1: Write `app/api/exams/route.ts`**

`GET` handler: read session (401 if absent). Accept `?semester` and `?type` query params. Filter `db.exam.findMany` accordingly. Return JSON.

- [ ] **Step 2: Write `components/exams/ExamTypeFilter.tsx`**

`'use client'`. Props: `{ active: string, onChange: (t: string) => void }`.
Filter options: `['all', 'ese', 'minor', 'major', 'supply']`.
Render as pill buttons — active pill: `bg-[var(--color-primary)] text-white`, inactive: `bg-[var(--color-primary-light)] text-[var(--color-primary)]`.

- [ ] **Step 3: Write `components/exams/ExamCard.tsx`**

Props: `{ exam: ExamRow }`.
ShadCN `<Card>` with `rounded-2xl`.
- Left border accent `border-l-4 border-[var(--color-primary)]` when exam date is within 7 days of now
- Row 1: subject name (bold) + `<Badge>` for type (ESE/Minor/Major/Supply)
- Row 2: `<CalendarDays size={14}>` + formatted date, `<Clock size={14}>` + time
- Row 4 (if `hallTicket`): dimmed text with hall ticket number

- [ ] **Step 4: Write `app/(portal)/exams/page.tsx`**

`'use client'`. Fetch `/api/exams`. State: `activeSem`, `activeType`.
Render: `<SemesterTabs>` (reuse from results) + `<ExamTypeFilter>` + grid of `<ExamCard>`.
Empty state: when filtered results are empty, render centered `<CalendarDays size={48}>` + "No exams scheduled for this view."

- [ ] **Step 5: Verify exam filtering**

```bash
npm run dev
```

Navigate to `/exams`. Verify: ESE filter shows only ESE exams; Minor shows only minors; exams within 7 days have blue left border.

- [ ] **Step 6: Commit**

```bash
git add app/\(portal\)/exams/ components/exams/ app/api/exams/
git commit -m "feat: exams page — type filter, exam cards, 7-day highlight, empty state"
```

---

## Task 7: Notifications Page & Mark-Read API

**Files:**
- Create: `app/(portal)/notifications/page.tsx`
- Create: `components/notifications/NotificationList.tsx`
- Create: `app/api/notifications/route.ts`
- Create: `app/api/notifications/[id]/read/route.ts`
- Create: `app/api/notifications/read-all/route.ts`

**Interfaces:**
- Consumes: `db`, session, `NotificationRow`
- Produces:
  - `GET /api/notifications` → `{ notifications: NotificationRow[] }`
  - `PATCH /api/notifications/[id]/read` → `{ ok: true }`
  - `PATCH /api/notifications/read-all` → `{ ok: true }`
  - Notifications page at `/notifications`

- [ ] **Step 1: Write `app/api/notifications/route.ts`**

`GET`: read session (401 if absent). Return `db.notification.findMany({ where: { studentId }, orderBy: { createdAt: 'desc' } })`.

- [ ] **Step 2: Write `app/api/notifications/[id]/read/route.ts`**

`PATCH`: read session (401 if absent). `db.notification.update({ where: { id: Number(params.id) }, data: { read: true } })`. Return `{ ok: true }`.

- [ ] **Step 3: Write `app/api/notifications/read-all/route.ts`**

`PATCH`: read session. `db.notification.updateMany({ where: { studentId, read: false }, data: { read: true } })`. Return `{ ok: true }`.

- [ ] **Step 4: Write `components/notifications/NotificationList.tsx`**

`'use client'`. Props: `{ initialNotifications: NotificationRow[] }`.
State: local copy of notifications (optimistic update on read).
Each item: `<div>` with conditional `bg-white`/`bg-[var(--color-surface)]`, Lucide icon by type, bold title if unread, `#0720FF` left dot if unread, relative timestamp.
onClick: call `PATCH /api/notifications/[id]/read`, update local state.
"Mark all as read" button: call `PATCH /api/notifications/read-all`, mark all local as read.
Empty state: `<Bell size={48}>` + "You're all caught up".

- [ ] **Step 5: Write `app/(portal)/notifications/page.tsx`**

Server Component. Fetch notifications from DB directly (not via API). Pass to `<NotificationList initialNotifications={...} />`.

- [ ] **Step 6: Verify mark-read flow**

```bash
npm run dev
```

Navigate to `/notifications`. Click a notification — verify it dims. Click "Mark all as read" — verify all dim. Refresh — verify state is persisted.

- [ ] **Step 7: Commit**

```bash
git add app/\(portal\)/notifications/ components/notifications/ app/api/notifications/
git commit -m "feat: notifications page, mark-read and mark-all-read API routes"
```

---

## Task 8: Polish — Animations, Accessibility, Pre-Delivery Checklist

**Files:**
- Modify: `app/globals.css`
- Modify: `components/home/StatCard.tsx`
- Modify: `app/(portal)/home/page.tsx`
- Modify: `components/sidebar/AppSidebar.tsx`

**Interfaces:**
- Consumes: all components from Tasks 3–7
- Produces: polished portal passing pre-delivery checklist

- [ ] **Step 1: Add stagger entrance animation to home widgets**

In `globals.css`:
```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-fade-up {
  animation: fadeUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
```

In `home/page.tsx`, add `animate-fade-up` + `style={{ animationDelay: `${i * 60}ms` }}` to each widget wrapper.

- [ ] **Step 2: Verify reduced-motion disables animation**

In browser DevTools → Rendering → Emulate CSS media: prefers-reduced-motion: reduce.
Verify: no animation plays, widgets render at final state immediately.

- [ ] **Step 3: Audit keyboard navigation**

Tab through login form → sidebar → home widgets → results tabs → exams filter pills → notifications list.
Verify: every interactive element receives visible focus ring. Fix any missing `focus-visible:ring-2 ring-[var(--color-primary)]` classes.

- [ ] **Step 4: Audit colour contrast**

Check: primary text `#0D0D0D` on `#FFFFFF` — ratio ~21:1 ✅. Primary `#0720FF` on white — ratio ~8.6:1 ✅. White on `#0720FF` sidebar pill — ratio ~8.6:1 ✅. Muted `#9CA3AF` on white — ratio ~2.85:1 ⚠️ — muted text is decorative/supplemental only; ensure no essential information is muted-only.

- [ ] **Step 5: Add `cursor-pointer` audit**

Verify all `<button>`, `<Link>`, clickable `<div>` elements have `cursor-pointer` class. Add where missing.

- [ ] **Step 6: Verify all API routes return 401 without session**

```bash
curl -X GET http://localhost:3000/api/results
```

Expected: `{ "error": "Unauthorized" }` with status 401.

```bash
curl -X GET http://localhost:3000/api/exams
curl -X GET http://localhost:3000/api/notifications
```

Both expected: 401.

- [ ] **Step 7: Final smoke test**

1. Open `http://localhost:3000` — redirects to `/login`
2. Login with wrong password — inline error shown, no redirect
3. Login with `TVE22CS001` / `student123` — redirects to `/home`
4. Home shows: name, SGPA stat, next exam, notification count, chart, calendar with dots, grade table, notification strip
5. Navigate Results → verify semester tabs work, CGPA footer visible, supply badge shows
6. Navigate Exams → verify type filter works, upcoming exam has blue border
7. Navigate Notifications → mark one read → mark all read
8. Logout → redirects to `/login`, session cleared

- [ ] **Step 8: Final commit**

```bash
git add -A
git commit -m "feat: polish — entrance animations, a11y, contrast audit, smoke test passed"
```
