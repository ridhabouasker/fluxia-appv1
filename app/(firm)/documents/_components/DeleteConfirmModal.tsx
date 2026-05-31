'use client'

import { DocRow } from './types'

type Props = {
  doc: DocRow
  deleting: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function DeleteConfirmModal({ doc, deleting, onConfirm, onCancel }: Props) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: '12px', padding: '28px', width: '380px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>Supprimer ce document ?</div>
        <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.filename ?? '—'}</div>
        <div style={{ fontSize: '12px', color: '#DC2626', marginBottom: '24px' }}>Cette action est définitive.</div>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button onClick={onCancel} disabled={deleting}
            style={{ padding: '8px 18px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', background: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>
            Annuler
          </button>
          <button onClick={onConfirm} disabled={deleting}
            style={{ padding: '8px 18px', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, background: '#DC2626', color: '#fff', cursor: deleting ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: deleting ? 0.6 : 1 }}>
            {deleting ? 'Suppression…' : 'Supprimer'}
          </button>
        </div>
      </div>
    </div>
  )
}
