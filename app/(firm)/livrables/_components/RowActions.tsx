'use client'

import { Clock, Download, Eye, Pencil, Trash2 } from 'lucide-react'
import ActionBtn from './ActionBtn'
import { CardHandlers, DocRow } from './types'

export default function RowActions({ doc: d, saving, acting, onEditNote, onView, onDownload, onEvents, onDelete }: { doc: DocRow } & CardHandlers) {
  const busy = saving === d.id || acting === d.id
  return (
    <div style={{ display: 'flex', gap: '3px', alignItems: 'center', flexShrink: 0 }}>
      {d.storage_path && <ActionBtn title="Visualiser" color="#1D4ED8" loading={busy} onClick={() => onView(d)}><Eye size={11} strokeWidth={2} /></ActionBtn>}
      {d.storage_path && <ActionBtn title="Télécharger" color="#64748B" loading={busy} onClick={() => onDownload(d)}><Download size={11} strokeWidth={2} /></ActionBtn>}
      <ActionBtn title={d.notes ? 'Modifier note' : 'Ajouter note'} color="#94A3B8" onClick={() => onEditNote(d)}><Pencil size={11} strokeWidth={2} /></ActionBtn>
      <ActionBtn title="Historique" color="#94A3B8" onClick={() => onEvents(d)}><Clock size={11} strokeWidth={2} /></ActionBtn>
      {onDelete && (
        <ActionBtn title="Supprimer" color="#DC2626" loading={busy} onClick={() => onDelete(d)}>
          <Trash2 size={11} strokeWidth={2} />
        </ActionBtn>
      )}
    </div>
  )
}
