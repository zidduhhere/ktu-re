export const RAGGING_CATEGORIES = [
  { id: 'verbal', label: 'Verbal abuse or humiliation' },
  { id: 'physical', label: 'Physical harm or forced activity' },
  { id: 'extortion', label: 'Money or belongings demanded' },
  { id: 'online', label: 'Online harassment' },
  { id: 'other', label: 'Something else' },
] as const

/** National anti-ragging helpline (UGC), free and open 24 hours. */
export const HELPLINE = {
  display: '1800 180 5522',
  tel: 'tel:18001805522',
  email: 'helpline@antiragging.in',
} as const

export type ReportField = 'category' | 'incidentDate' | 'location' | 'description' | 'peopleInvolved'

export type ReportState =
  | {
      ok?: false
      errors: Partial<Record<ReportField, string>>
      values: Record<string, string>
    }
  | { ok: true; reference: string; anonymous: boolean }
  | undefined
