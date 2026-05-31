'use client'

import DocCard from './DocCard'
import { CardHandlers, DocRow, Status, STATUS_CFG } from './types'

type ColDef = { key: Status; label: string; docs: DocRow[] }

export default function KanbanView({ columns, ...handlers }: { columns: ColDef[] } & CardHandlers) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', alignItems: 'start' }}>
      {columns.map(col => {
        const cfg = STATUS_CFG[col.key]
        return (
          <div key={col.key} style={{ background: '#F8FAFC', borderRadius: '10px', padding: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}` }}>{cfg.label}</span>
              <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500 }}>{col.docs.length}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {col.docs.length === 0 && (
                <div style={{ padding: '24px', textAlign: 'center', fontSize: '12px', color: '#CBD5E1' }}>Aucun document</div>
              )}
              {col.docs.map(d => (
                <DocCard key={d.id} doc={d} {...handlers} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
