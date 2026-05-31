'use client'

import { formatExt, EXT_COLORS } from '@/lib/format'

export default function ExtBadge({ filename }: { filename: string | null }) {
  const ext = formatExt(filename)
  if (!ext) return null
  const c = EXT_COLORS[ext] ?? { bg: '#F8FAFC', text: '#64748B' }
  return (
    <span style={{ padding: '1px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, background: c.bg, color: c.text, letterSpacing: '0.02em' }}>
      {ext}
    </span>
  )
}
