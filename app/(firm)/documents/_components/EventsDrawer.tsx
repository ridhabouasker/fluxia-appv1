'use client'

import { X } from 'lucide-react'
import { STATUS_CFG, DocRow, EventRow, EVENT_LABELS, Status } from './types'

type Props = {
  doc: DocRow
  events: EventRow[]
  loading: boolean
  onClose: () => void
}

export default function EventsDrawer({ doc, events, loading, onClose }: Props) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 50, display: 'flex', justifyContent: 'flex-end' }}>
      <div style={{ width: '360px', background: '#fff', height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '-4px 0 24px rgba(0,0,0,0.1)' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>Historique</div>
            <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.filename ?? '—'}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '2px', flexShrink: 0 }}>
            <X size={16} />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {loading && <div style={{ textAlign: 'center', padding: '24px', color: '#94A3B8', fontSize: '12px' }}>Chargement…</div>}
          {!loading && events.length === 0 && (
            <div style={{ textAlign: 'center', padding: '24px', color: '#CBD5E1', fontSize: '12px' }}>Aucun événement</div>
          )}
          {!loading && events.map(e => (
            <div key={e.id} style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#CBD5E1', marginTop: '5px', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '12px', fontWeight: 500, color: '#374151' }}>
                  {EVENT_LABELS[e.event_type] ?? e.event_type}
                  {e.event_type === 'status_changed' && e.new_status && (
                    <span style={{ marginLeft: '6px', fontSize: '11px', color: '#64748B' }}>→ {STATUS_CFG[e.new_status as Status]?.label ?? e.new_status}</span>
                  )}
                </div>
                <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '1px' }}>
                  {e.user ? `${e.user.first_name} ${e.user.last_name}` : '—'}
                  {' · '}
                  {new Date(e.created_at).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </div>
                {e.comment && <div style={{ fontSize: '11px', color: '#64748B', marginTop: '3px', fontStyle: 'italic' }}>{e.comment}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
