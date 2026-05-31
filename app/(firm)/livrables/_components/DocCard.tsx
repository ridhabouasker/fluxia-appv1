'use client'

import { Check, RotateCcw, X } from 'lucide-react'
import { formatExt, formatPeriod } from '@/lib/format'
import SizeCell from './SizeCell'
import ExtBadge from './ExtBadge'
import RowActions from './RowActions'
import { CardHandlers, DocRow } from './types'

export default function DocCard({ doc: d, saving, acting, onStatusChange, onEditNote, onView, onDownload, onEvents }: { doc: DocRow } & CardHandlers) {
  return (
    <div style={{ background: '#fff', border: '1px solid #BFDBFE', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', marginBottom: '2px' }}>{d.customer?.name ?? '—'}</div>
          <div style={{ fontSize: '12px', fontWeight: 500, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={d.filename ?? undefined}>
            {d.filename ?? '—'}
          </div>
          <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            {d.type
              ? <span>{d.type.name}</span>
              : <span style={{ fontSize: '10px', fontWeight: 600, padding: '1px 6px', borderRadius: '4px', background: '#FFFBEB', color: '#92400E', border: '1px solid #FDE68A' }}>Non qualifié</span>
            }
            <span>·</span>
            <span>{formatPeriod(d.year, d.months)}</span>
            {d.size_kb && <><span>·</span><SizeCell kb={d.size_kb} /></>}
            {formatExt(d.filename) && <><span>·</span><ExtBadge filename={d.filename} /></>}
          </div>
        </div>
        <RowActions doc={d} saving={saving} acting={acting} onStatusChange={onStatusChange} onEditNote={onEditNote} onView={onView} onDownload={onDownload} onEvents={onEvents} />
      </div>
      {d.notes && (
        <div style={{ fontSize: '11px', color: '#64748B', background: '#F8FAFC', borderRadius: '4px', padding: '6px 8px', borderLeft: '2px solid #E2E8F0' }}>
          {d.notes}
        </div>
      )}
      <div style={{ fontSize: '10px', color: '#CBD5E1' }}>{new Date(d.created_at).toLocaleDateString('fr-FR')}</div>
      {d.status === 'pending' && (
        <div style={{ display: 'flex', gap: '6px', paddingTop: '4px', borderTop: '1px solid #F1F5F9' }}>
          <button disabled={saving === d.id} onClick={() => onStatusChange(d.id, 'processed')}
            style={{ flex: 1, padding: '5px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '5px', fontSize: '11px', fontWeight: 600, color: '#166534', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', opacity: saving === d.id ? 0.5 : 1 }}>
            <Check size={11} strokeWidth={2.5} /> Traiter
          </button>
          <button disabled={saving === d.id} onClick={() => onStatusChange(d.id, 'rejected')}
            style={{ flex: 1, padding: '5px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '5px', fontSize: '11px', fontWeight: 600, color: '#991b1b', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', opacity: saving === d.id ? 0.5 : 1 }}>
            <X size={11} strokeWidth={2.5} /> Rejeter
          </button>
        </div>
      )}
      {(d.status === 'processed' || d.status === 'rejected') && (
        <button disabled={saving === d.id} onClick={() => onStatusChange(d.id, 'pending')}
          style={{ width: '100%', padding: '5px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '5px', fontSize: '11px', fontWeight: 500, color: '#64748B', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', opacity: saving === d.id ? 0.5 : 1 }}>
          <RotateCcw size={10} /> Remettre en attente
        </button>
      )}
    </div>
  )
}
