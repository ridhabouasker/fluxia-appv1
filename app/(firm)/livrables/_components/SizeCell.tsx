'use client'

import { formatSize } from '@/lib/format'

export default function SizeCell({ kb }: { kb: number | null }) {
  if (!kb) return <span className="text-xs text-[#94A3B8]">—</span>
  const label = formatSize(kb)
  if (kb > 10 * 1024) return <span style={{ fontSize: '11px', fontWeight: 600, color: '#DC2626' }}>{label}</span>
  if (kb > 5 * 1024)  return <span style={{ fontSize: '11px', fontWeight: 600, color: '#D97706' }}>{label}</span>
  return <span className="text-xs text-[#94A3B8]">{label}</span>
}
