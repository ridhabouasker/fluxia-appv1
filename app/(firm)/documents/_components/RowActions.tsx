'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, Clock, Download, Eye, Mail, MoreHorizontal, Pencil, RotateCcw, Trash2, X } from 'lucide-react'
import ActionBtn from './ActionBtn'
import { CardHandlers, DocRow } from './types'

function MenuItem({ icon, label, onClick, danger }: {
  icon: React.ReactNode; label: string; onClick: () => void; danger?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors hover:bg-[#F8FAFC] ${
        danger ? 'text-[#DC2626]' : 'text-[#0F172A]'
      }`}
    >
      <span className={`shrink-0 ${danger ? 'text-[#DC2626]' : 'text-[#64748B]'}`}>{icon}</span>
      {label}
    </button>
  )
}

export default function RowActions({ doc: d, saving, acting, onStatusChange, onEditNote, onView, onDownload, onEvents, onMessages, onDelete }: { doc: DocRow } & CardHandlers) {
  const busy    = saving === d.id || acting === d.id
  const [open, setOpen] = useState(false)
  const [pos,  setPos]  = useState<{ top: number; right: number } | null>(null)
  const btnRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function close(e: MouseEvent) {
      const target = e.target as Node
      // Fermer si le clic est en dehors du menu (fixed, pas de ref sur lui)
      const menu = document.getElementById('row-actions-menu')
      if (menu && !menu.contains(target) && !btnRef.current?.contains(target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  function handleOpen() {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect()
      setPos({ top: r.bottom + 4, right: window.innerWidth - r.right })
    }
    setOpen(o => !o)
  }

  function run(fn: () => void) { setOpen(false); fn() }

  return (
    <div style={{ display: 'flex', gap: '3px', alignItems: 'center', flexShrink: 0 }}>

      {d.status === 'pending' && (
        <>
          <ActionBtn title="Marquer traité" color="#059669" loading={busy} onClick={() => onStatusChange(d.id, 'processed')}>
            <Check size={11} strokeWidth={2.5} />
          </ActionBtn>
          <ActionBtn title="Rejeter" color="#DC2626" loading={busy} onClick={() => onStatusChange(d.id, 'rejected')}>
            <X size={11} strokeWidth={2.5} />
          </ActionBtn>
        </>
      )}
      {(d.status === 'processed' || d.status === 'rejected') && (
        <ActionBtn title="Remettre en attente" color="#D97706" loading={busy} onClick={() => onStatusChange(d.id, 'pending')}>
          <RotateCcw size={11} strokeWidth={2} />
        </ActionBtn>
      )}

      <div ref={btnRef}>
        <ActionBtn title="Actions" color="#64748B" onClick={handleOpen}>
          <MoreHorizontal size={13} strokeWidth={2} />
        </ActionBtn>
      </div>

      {open && pos && (
        <div
          id="row-actions-menu"
          style={{
            position: 'fixed', top: pos.top, right: pos.right, zIndex: 9999,
            background: '#fff', border: '1px solid #E2E8F0', borderRadius: '10px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.10)', minWidth: '190px', overflow: 'hidden',
          }}
        >
          {d.storage_path && <MenuItem icon={<Eye size={14} />}      label="Visualiser"        onClick={() => run(() => onView(d))} />}
          {d.storage_path && <MenuItem icon={<Download size={14} />}  label="Télécharger"       onClick={() => run(() => onDownload(d))} />}
          <MenuItem icon={<Mail size={14} />}   label="Envoyer un message" onClick={() => run(() => onMessages?.(d))} />
          <MenuItem icon={<Pencil size={14} />} label="Écrire une note"    onClick={() => run(() => onEditNote(d))} />
          <MenuItem icon={<Clock size={14} />}  label="Voir l'historique"  onClick={() => run(() => onEvents(d))} />
          {onDelete && (
            <>
              <div style={{ borderTop: '1px solid #F1F5F9', margin: '2px 0' }} />
              <MenuItem icon={<Trash2 size={14} />} label="Supprimer" onClick={() => run(() => onDelete(d))} danger />
            </>
          )}
        </div>
      )}
    </div>
  )
}
