'use client'

import { useEffect, useRef, useState } from 'react'
import { Send, X } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

type MsgEntry = {
  id: string
  body: string
  created_at: string
  sender_id: string
  sender: { first_name: string; last_name: string; role: string } | null
}

type Props = {
  doc: {
    id: string
    filename: string | null
    firm_id: string
    customer_id: string
  }
  currentUserId: string
  onClose: () => void
}

export default function MessagesDrawer({ doc, currentUserId, onClose }: Props) {
  const [messages, setMessages]   = useState<MsgEntry[]>([])
  const [loading, setLoading]     = useState(true)
  const [draft, setDraft]         = useState('')
  const [sending, setSending]     = useState(false)
  const [error, setError]         = useState<string | null>(null)
  const bottomRef                 = useRef<HTMLDivElement>(null)

  async function fetchMessages() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    const res = await fetch(`/api/messages?objectType=document&objectId=${doc.id}`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
    if (!res.ok) return
    const json = await res.json()
    setMessages(json.messages ?? [])
    setLoading(false)
  }

  useEffect(() => {
    fetchMessages()
  }, [doc.id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend() {
    if (!draft.trim() || sending) return
    setSending(true)
    setError(null)

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { setSending(false); return }

    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        objectId:   doc.id,
        body:       draft.trim(),
        firmId:     doc.firm_id,
        customerId: doc.customer_id,
      }),
    })

    const json = await res.json()
    if (!res.ok) { setError(json.error ?? 'Erreur'); setSending(false); return }

    setMessages(prev => [...prev, json.message])
    setDraft('')
    setSending(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 50, display: 'flex', justifyContent: 'flex-end' }}>
      <div style={{ width: '380px', background: '#fff', height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '-4px 0 24px rgba(0,0,0,0.1)' }}>

        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>Messages</div>
            <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {doc.filename ?? '—'}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '2px', flexShrink: 0 }}>
            <X size={16} />
          </button>
        </div>

        {/* Messages list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {loading && (
            <div style={{ textAlign: 'center', padding: '24px', color: '#94A3B8', fontSize: '12px' }}>Chargement…</div>
          )}
          {!loading && messages.length === 0 && (
            <div style={{ textAlign: 'center', padding: '32px 0', color: '#CBD5E1', fontSize: '12px' }}>
              Aucun message — soyez le premier à écrire
            </div>
          )}
          {!loading && messages.map(m => {
            const isMine = m.sender_id === currentUserId
            const roleLabel = m.sender?.role === 'firm' ? 'Cabinet' : 'Client'
            return (
              <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isMine ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '80%',
                  padding: '8px 12px',
                  borderRadius: isMine ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  background: isMine ? '#1D4ED8' : '#F1F5F9',
                  color: isMine ? '#fff' : '#0F172A',
                  fontSize: '13px',
                  lineHeight: '1.5',
                  wordBreak: 'break-word',
                }}>
                  {m.body}
                </div>
                <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '3px' }}>
                  {m.sender ? `${m.sender.first_name} ${m.sender.last_name} · ${roleLabel}` : roleLabel}
                  {' · '}
                  {new Date(m.created_at).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid #E2E8F0' }}>
          {error && (
            <div style={{ fontSize: '11px', color: '#DC2626', marginBottom: '8px' }}>{error}</div>
          )}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
            <textarea
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Écrire un message… (Entrée pour envoyer)"
              rows={2}
              style={{
                flex: 1, fontSize: '13px', border: '1px solid #E2E8F0', borderRadius: '8px',
                padding: '8px 10px', resize: 'none', outline: 'none', lineHeight: '1.4',
                fontFamily: 'inherit', color: '#0F172A',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = '#1D4ED8' }}
              onBlur={e => { e.currentTarget.style.borderColor = '#E2E8F0' }}
            />
            <button
              onClick={handleSend}
              disabled={!draft.trim() || sending}
              style={{
                width: '36px', height: '36px', borderRadius: '8px', border: 'none',
                background: draft.trim() && !sending ? '#1D4ED8' : '#E2E8F0',
                color: draft.trim() && !sending ? '#fff' : '#94A3B8',
                cursor: draft.trim() && !sending ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, transition: 'background 0.15s',
              }}
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
