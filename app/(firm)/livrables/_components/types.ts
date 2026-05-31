export const STATUS_CFG = {
  pending:   { label: 'En attente',  bg: '#fffbeb', text: '#92400e', border: '#fde68a' },
  processed: { label: 'Traité',      bg: '#f0fdf4', text: '#166534', border: '#86efac' },
  rejected:  { label: 'Rejeté',      bg: '#fef2f2', text: '#991b1b', border: '#fca5a5' },
} as const

export type Status = keyof typeof STATUS_CFG
export type StatusFilter = Status | 'all' | 'unprocessed'

export const EVENT_LABELS: Record<string, string> = {
  uploaded:       'Déposé',
  status_changed: 'Statut modifié',
  downloaded:     'Téléchargé',
  viewed:         'Consulté',
}

export type CustomerFilter = { id: string; name: string }
export type DocTypeOpt     = { id: string; name: string }

export type DocRow = {
  id: string
  filename: string | null
  storage_path: string | null
  year: number
  months: number[] | null
  status: Status
  notes: string | null
  size_kb: number | null
  mime_type: string | null
  created_at: string
  type: { id: string; name: string; customer: boolean } | null
  customer: { id: string; name: string } | null
}

export type { DocEventRow as EventRow } from '@/lib/db-types'

export type QualState = { id: string; typeId: string; year: number; month: string }

export type CardHandlers = {
  saving: string | null
  acting: string | null
  onStatusChange: (id: string, s: Status) => void
  onEditNote: (d: DocRow) => void
  onView: (d: DocRow) => void
  onDownload: (d: DocRow) => void
  onMessages?: (d: DocRow) => void
  onEvents: (d: DocRow) => void
  editQual?: QualState | null
  setEditQual?: (q: QualState | null) => void
  onSaveQual?: (id: string, typeId: string, year: number, month: string) => void
  docTypes?: DocTypeOpt[]
  savedDoc?: string | null
  onDelete?: (d: DocRow) => void
}
