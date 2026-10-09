export type SessionKind = 'ese' | 'minor' | 'honours' | 'supply'

export type SessionAction =
  | 'courses'
  | 'eligibility'
  | 'revaluation-registration'
  | 'answer-script'
  | 'revaluation-status'
  | 'review'

export type ExamSession = {
  id: string
  title: string
  scheme: string
  kind: SessionKind
  year: string
  /** Semesters whose scheduled papers belong to this session. */
  semesters: number[]
  /** Exam types (as stored on each exam) that belong to this session. */
  examTypes: string[]
  actions: SessionAction[]
}

export const KIND_LABEL: Record<SessionKind, string> = {
  ese: 'End semester',
  minor: 'Minor exam',
  honours: 'Honours exam',
  supply: 'Supplementary',
}

/** Grouped by when a student needs them, rather than one long row. */
export const ACTION_GROUPS: { label: string; actions: SessionAction[] }[] = [
  { label: 'Before the exam', actions: ['courses', 'eligibility'] },
  { label: 'After results', actions: ['revaluation-registration', 'answer-script', 'revaluation-status', 'review'] },
]

export const ACTION_LABEL: Record<SessionAction, string> = {
  courses: 'View / register exam courses',
  eligibility: 'Eligibility',
  'revaluation-registration': 'Revaluation registration',
  'answer-script': 'Answer script copy request',
  'revaluation-status': 'Revaluation status',
  review: 'Request / view review',
}

const YEAR = '2025 - 2026'

export const EXAM_SESSIONS: ExamSession[] = [
  {
    id: 's6-ese',
    title: 'B.Tech S6 (R, S) Exam April 2026',
    scheme: '2019 Scheme',
    kind: 'ese',
    year: YEAR,
    semesters: [6],
    examTypes: ['ese'],
    actions: ['courses', 'eligibility', 'revaluation-registration', 'answer-script', 'revaluation-status', 'review'],
  },
  {
    id: 's6-minor',
    title: 'B.Tech S6 (Minor) Exam April 2026',
    scheme: '2023 Admn',
    kind: 'minor',
    year: YEAR,
    semesters: [6],
    examTypes: ['minor'],
    actions: ['courses', 'eligibility', 'review'],
  },
  {
    id: 's6-hons',
    title: 'B.Tech S6 (Hons.) Exam April 2026',
    scheme: '2023 Admn',
    kind: 'honours',
    year: YEAR,
    semesters: [6],
    examTypes: ['honours'],
    actions: ['courses', 'eligibility', 'review'],
  },
  {
    id: 's5-supply',
    title: 'B.Tech S5 (S, FE) Exam June 2026',
    scheme: '2019 Scheme',
    kind: 'supply',
    year: YEAR,
    semesters: [5],
    examTypes: ['supply'],
    actions: ['courses', 'eligibility', 'revaluation-registration', 'review'],
  },
  {
    id: 's4-ese',
    title: 'B.Tech S4 (S, FE) Exam May 2026',
    scheme: '2019 Scheme',
    kind: 'ese',
    year: YEAR,
    semesters: [4],
    examTypes: ['ese'],
    actions: ['courses', 'eligibility'],
  },
  {
    id: 's3-supply',
    title: 'B.Tech S3 (S, FE) Exam June 2026',
    scheme: '2019 Scheme',
    kind: 'supply',
    year: YEAR,
    semesters: [3],
    examTypes: ['supply'],
    actions: ['courses', 'eligibility', 'revaluation-registration', 'review'],
  },
  {
    id: 's1-s2-ese',
    title: 'B.Tech S1 (S, FE) S2 (S, FE) Exam May 2026',
    scheme: '2019 Scheme',
    kind: 'ese',
    year: YEAR,
    semesters: [1, 2],
    examTypes: ['ese'],
    actions: ['courses', 'eligibility', 'revaluation-registration', 'review'],
  },
]
