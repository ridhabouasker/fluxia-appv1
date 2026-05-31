'use client'

import React from 'react'

type Props = {
  title: string
  color: string
  loading?: boolean
  onClick: () => void
  children: React.ReactNode
}

export default function ActionBtn({ title, color, loading, onClick, children }: Props) {
  return (
    <button title={title} disabled={loading} onClick={onClick}
      style={{ width: '24px', height: '24px', border: '1px solid #E2E8F0', borderRadius: '5px', background: '#fff', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color, opacity: loading ? 0.4 : 1, transition: 'opacity 0.1s' }}>
      {children}
    </button>
  )
}
