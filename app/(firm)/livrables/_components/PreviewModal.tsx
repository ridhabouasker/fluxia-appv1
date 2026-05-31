'use client'

import { X } from 'lucide-react'

type Props = {
  url: string
  filename: string | null
  mime: string | null
  onClose: () => void
}

export default function PreviewModal({ url, filename, mime, onClose }: Props) {
  const isImage = mime?.startsWith('image/') ?? false
  const isPdf   = mime === 'application/pdf' || filename?.toLowerCase().endsWith('.pdf')

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '12px', width: '90vw', height: '90vh', maxWidth: '1100px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.3)' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <span style={{ fontSize: '13px', fontWeight: 500, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 'calc(100% - 40px)' }}>{filename ?? 'Document'}</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '4px', display: 'flex', flexShrink: 0 }}><X size={18} /></button>
        </div>
        <div style={{ flex: 1, overflow: 'hidden', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {isPdf && <iframe src={url} style={{ width: '100%', height: '100%', border: 'none' }} title={filename ?? 'Document'} />}
          {isImage && <img src={url} alt={filename ?? 'Document'} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />}
          {!isPdf && !isImage && (
            <div style={{ textAlign: 'center', color: '#94A3B8' }}>
              <div style={{ fontSize: '13px', marginBottom: '12px' }}>Aperçu non disponible pour ce format</div>
              <a href={url} download={filename ?? 'document'} style={{ fontSize: '13px', color: '#1D4ED8', textDecoration: 'underline' }}>Télécharger le fichier</a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
