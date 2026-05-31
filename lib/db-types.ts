// Centralized query-result types for Supabase joins.
// Supabase-js cannot infer join shapes from .select() strings, so these types
// are declared manually and cast at the data boundary with `as unknown as T[]`.
// The generated types in types/database.ts validate the base column shapes.

export type DocStatus = 'draft' | 'pending' | 'processed' | 'rejected'

// document + joins used in firm/documents and firm/livrables
export type FirmDocRow = {
  id: string
  filename: string | null
  storage_path: string | null
  year: number
  months: number[] | null
  status: DocStatus
  notes: string | null
  size_kb: number | null
  mime_type: string | null
  source?: string
  created_at: string
  type: { id: string; name: string; customer: boolean } | null
  customer: { id: string; name: string } | null
}

// document + joins used in customer/mes-documents
export type CustomerDocRow = {
  id: string
  filename: string | null
  storage_path: string | null
  year: number
  months: number[] | null
  status: DocStatus
  notes: string | null
  size_kb: number | null
  mime_type: string | null
  created_at: string
  type: { id: string; name: string; customer: boolean } | null
}

// document + joins used in customer/mes-livrables
export type CustomerLivrableRow = {
  id: string
  filename: string | null
  storage_path: string | null
  year: number
  months: number[] | null
  notes: string | null
  size_kb: number | null
  mime_type: string | null
  created_at: string
  type: { name: string } | null
}

// document_event + user join
export type DocEventRow = {
  id: string
  event_type: string
  old_status: string | null
  new_status: string | null
  comment: string | null
  created_at: string
  user: { first_name: string; last_name: string } | null
}

// dashboard — raw rows from Supabase before mapping
export type RawDepositRow = {
  id: string
  created_at: string
  filename: string | null
  year: number
  months: number[] | null
  customer: { name: string } | null
  type: { name: string } | null
}

export type RawLateTaskRow = {
  month: number
  year: number
  task: { name: string } | null
  customer: { name: string } | null
}

// ma-societe — user_customer with nested user_data
export type UserCustomerRow = {
  admin: boolean
  created_at: string
  user_data: { id: string; first_name: string; last_name: string; active: boolean }
}
