'use client'

type Props = {
  id: string
  value: string
  saving: string | null
  onChange: (value: string) => void
  onSave: () => void
  onClose: () => void
}

export default function NoteModal({ id, value, saving, onChange, onSave, onClose }: Props) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: '10px', padding: '24px', width: '400px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', marginBottom: '12px' }}>Note interne</div>
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          rows={4}
          placeholder="Ajouter une note interne…"
          style={{ width: '100%', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '8px 10px', fontSize: '13px', color: '#0F172A', resize: 'vertical', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
        />
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '7px 16px', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '13px', background: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>Annuler</button>
          <button onClick={onSave} disabled={saving === id} style={{ padding: '7px 16px', border: 'none', borderRadius: '6px', fontSize: '13px', background: '#1D4ED8', color: '#fff', cursor: 'pointer', fontFamily: 'inherit', opacity: saving === id ? 0.6 : 1 }}>Enregistrer</button>
        </div>
      </div>
    </div>
  )
}
