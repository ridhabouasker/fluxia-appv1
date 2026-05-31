'use client'

import { Pencil } from 'lucide-react'
import { formatPeriod, MONTHS_FR } from '@/lib/format'
import SizeCell from './SizeCell'
import ExtBadge from './ExtBadge'
import RowActions from './RowActions'
import { CardHandlers, DocRow } from './types'

const YEARS = [2026, 2025, 2024, 2023, 2022]

export default function ListView({ docs, editQual, setEditQual, onSaveQual, docTypes = [], saving, savedDoc, ...handlers }: { docs: DocRow[] } & CardHandlers) {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
      <style>{`.edit-cell-icon { opacity: 0.6; transition: opacity 0.15s; } .edit-cell-btn:hover .edit-cell-icon { opacity: 1; } .edit-cell-btn:hover { background: #F8FAFC !important; }`}</style>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
            {['Client','Type','Fichier','Format','Poids','Période','Date','Actions'].map(h => (
              <th key={h} className="px-3 py-3 text-left text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {docs.length === 0 && (
            <tr><td colSpan={8}>
              <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>📁</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#64748B', marginBottom: '4px' }}>Aucun livrable</div>
                <div style={{ fontSize: '12px', color: '#94A3B8' }}>Modifiez les critères et relancez la recherche</div>
              </div>
            </td></tr>
          )}
          {docs.map(d => {
            const isEditing = editQual?.id === d.id
            const eq        = editQual
            const openEdit  = () => setEditQual?.({ id: d.id, typeId: d.type?.id ?? '', year: d.year, month: d.months?.[0]?.toString() ?? '' })

            return (
              <tr key={d.id} className={`border-b border-[#F1F5F9] last:border-0 transition-colors ${isEditing ? 'bg-[#EFF6FF]' : 'hover:bg-[#F8FAFC]'}`}>
                <td className="px-3 py-3 text-xs font-medium text-[#0F172A] max-w-[100px] truncate">{d.customer?.name ?? '—'}</td>
                <td className="px-3 py-2 max-w-[150px]">
                  {isEditing && eq ? (
                    <select value={eq.typeId} onChange={e => {
                      const val = e.target.value
                      setEditQual?.({ ...eq, typeId: val })
                      onSaveQual?.(eq.id, val, eq.year, eq.month)
                    }}
                      style={{ fontSize: '12px', border: '1px solid #BFDBFE', borderRadius: '5px', padding: '3px 6px', background: '#fff', outline: 'none', maxWidth: '130px' }}>
                      <option value="">— Aucun —</option>
                      {docTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  ) : (
                    <button onClick={openEdit} className="edit-cell-btn" style={{ background: 'none', border: 'none', padding: '2px 4px', cursor: 'pointer', textAlign: 'left', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {d.type
                        ? <span className="text-xs text-[#64748B]">{d.type.name}</span>
                        : <span style={{ fontSize: '11px', fontWeight: 600, padding: '1px 6px', borderRadius: '4px', background: '#FFFBEB', color: '#92400E', border: '1px solid #FDE68A' }}>Non qualifié</span>
                      }
                      <Pencil size={10} className="edit-cell-icon" style={{ color: '#CBD5E1', flexShrink: 0 }} />
                    </button>
                  )}
                </td>
                <td className="px-3 py-3 text-xs text-[#64748B] max-w-[140px] truncate" title={d.filename ?? undefined}>{d.filename ?? '—'}</td>
                <td className="px-3 py-3"><ExtBadge filename={d.filename} /></td>
                <td className="px-3 py-3 whitespace-nowrap"><SizeCell kb={d.size_kb} /></td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {isEditing && eq ? (
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <select value={eq.year} onChange={e => {
                        const val = Number(e.target.value)
                        setEditQual?.({ ...eq, year: val })
                        onSaveQual?.(eq.id, eq.typeId, val, eq.month)
                      }}
                        style={{ fontSize: '12px', border: '1px solid #BFDBFE', borderRadius: '5px', padding: '3px 4px', background: '#fff', outline: 'none' }}>
                        {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                      <select value={eq.month} onChange={e => {
                        const val = e.target.value
                        setEditQual?.({ ...eq, month: val })
                        onSaveQual?.(eq.id, eq.typeId, eq.year, val)
                      }}
                        style={{ fontSize: '12px', border: '1px solid #BFDBFE', borderRadius: '5px', padding: '3px 4px', background: '#fff', outline: 'none' }}>
                        <option value="">Tous</option>
                        {MONTHS_FR.slice(1).map((m, i) => <option key={i+1} value={String(i+1)}>{m}</option>)}
                      </select>
                      {savedDoc === d.id && (
                        <span style={{ fontSize: '11px', fontWeight: 600, color: '#059669', flexShrink: 0 }}>✓</span>
                      )}
                      <button onClick={() => setEditQual?.(null)}
                        style={{ width: '22px', height: '22px', borderRadius: '4px', border: '1px solid #E2E8F0', background: '#fff', color: '#94A3B8', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                        title="Annuler">✕</button>
                    </div>
                  ) : (
                    <button onClick={openEdit} className="edit-cell-btn" style={{ background: 'none', border: 'none', padding: '2px 4px', cursor: 'pointer', fontSize: '12px', color: '#64748B', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {formatPeriod(d.year, d.months)}
                      <Pencil size={10} className="edit-cell-icon" style={{ color: '#CBD5E1', flexShrink: 0 }} />
                    </button>
                  )}
                </td>
                <td className="px-3 py-3 text-xs text-[#94A3B8] whitespace-nowrap">{new Date(d.created_at).toLocaleDateString('fr-FR')}</td>
                <td className="px-3 py-3"><RowActions doc={d} saving={saving} {...handlers} /></td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
