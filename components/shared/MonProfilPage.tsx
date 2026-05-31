'use client'

import { useEffect, useRef, useState } from 'react'
import { Camera } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

function Field({ label, value, onChange, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; type?: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider">{label}</span>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="text-sm px-2.5 py-1.5 border border-[#E2E8F0] rounded-lg bg-white text-[#0F172A] outline-none focus:border-[#1D4ED8] focus:ring-1 focus:ring-[#1D4ED8] transition-colors"
      />
    </div>
  )
}

function Label({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider">{label}</span>
      <span className="text-sm text-[#64748B] break-all">{value || '—'}</span>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
      <p className="text-sm font-semibold text-[#0F172A] mb-4">{title}</p>
      <div className="grid grid-cols-3 gap-x-8 gap-y-5">{children}</div>
    </div>
  )
}

const ROLE_LABELS: Record<string, string> = {
  firm:     'Collaborateur cabinet',
  customer: 'Client',
  master:   'Master',
}

function fmt(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function MonProfilPage() {
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Editable
  const [firstName, setFirstName] = useState('')
  const [lastName,  setLastName]  = useState('')
  const [phone,     setPhone]     = useState('')

  // Read-only
  const [id,               setId]               = useState('')
  const [email,            setEmail]            = useState('')
  const [role,             setRole]             = useState('')
  const [admin,            setAdmin]            = useState(false)
  const [active,           setActive]           = useState(true)
  const [createdAt,        setCreatedAt]        = useState<string | null>(null)
  const [updatedAt,        setUpdatedAt]        = useState<string | null>(null)
  const [lastSignIn,       setLastSignIn]       = useState<string | null>(null)
  const [emailConfirmedAt, setEmailConfirmedAt] = useState<string | null>(null)
  const [avatarUrl,        setAvatarUrl]        = useState<string | null>(null)

  const [loading,         setLoading]         = useState(true)
  const [saving,          setSaving]          = useState(false)
  const [saved,           setSaved]           = useState(false)
  const [saveError,       setSaveError]       = useState<string | null>(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [avatarError,     setAvatarError]     = useState<string | null>(null)

  async function getToken() {
    const { data: { session } } = await supabase.auth.getSession()
    return session?.access_token ?? null
  }

  useEffect(() => {
    async function load() {
      const t = await getToken()
      if (!t) return
      const res = await fetch('/api/profile', { headers: { Authorization: `Bearer ${t}` } })
      if (res.ok) {
        const d = await res.json()
        setId(               d.id               ?? '')
        setFirstName(        d.first_name        ?? '')
        setLastName(         d.last_name         ?? '')
        setPhone(            d.phone             ?? '')
        setEmail(            d.email             ?? '')
        setRole(             d.role              ?? '')
        setAdmin(            d.admin             ?? false)
        setActive(           d.active            ?? true)
        setCreatedAt(        d.created_at        ?? null)
        setUpdatedAt(        d.updated_at        ?? null)
        setLastSignIn(       d.last_sign_in_at   ?? null)
        setEmailConfirmedAt( d.email_confirmed_at ?? null)
        setAvatarUrl(        d.avatar_url        ?? null)
      }
      setLoading(false)
    }
    load()
  }, [])

  async function handleSave() {
    setSaving(true); setSaved(false); setSaveError(null)
    const t = await getToken()
    if (!t) { setSaving(false); return }
    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` },
      body: JSON.stringify({ firstName, lastName, phone }),
    })
    const json = await res.json()
    if (!res.ok) setSaveError(json.error ?? 'Erreur')
    else setSaved(true)
    setSaving(false)
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingAvatar(true); setAvatarError(null)
    const t = await getToken()
    if (!t) { setUploadingAvatar(false); return }
    const form = new FormData()
    form.append('avatar', file)
    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: { Authorization: `Bearer ${t}` },
      body: form,
    })
    const json = await res.json()
    if (!res.ok) setAvatarError(json.error ?? 'Erreur upload')
    else setAvatarUrl(json.avatar_url)
    setUploadingAvatar(false)
    e.target.value = ''
  }

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || '?'

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-5 h-5 border-2 border-[#1D4ED8] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl flex flex-col gap-5">

      <h1 className="text-xl font-semibold text-[#0F172A]">Mon profil</h1>

      {/* Photo */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 flex items-center gap-6">
        <div className="relative" style={{ width: '72px', height: '72px', flexShrink: 0 }}>
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #E2E8F0' }} />
          ) : (
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#EFF6FF', border: '2px solid #BFDBFE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '22px', fontWeight: 700, color: '#1D4ED8' }}>{initials}</span>
            </div>
          )}
          {uploadingAvatar && (
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="w-4 h-4 border-2 border-[#1D4ED8] border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-[#0F172A] mb-1">{firstName} {lastName}</p>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingAvatar}
            className="flex items-center gap-1.5 text-xs text-[#1D4ED8] hover:underline disabled:opacity-50"
          >
            <Camera size={12} />
            {uploadingAvatar ? 'Téléchargement…' : 'Changer la photo'}
          </button>
          <p className="text-[10px] text-[#94A3B8] mt-1">JPG, PNG, WEBP · max 5 Mo</p>
          {avatarError && <p className="text-[11px] text-[#DC2626] mt-1">{avatarError}</p>}
        </div>
      </div>

      {/* Identité — champs éditables */}
      <Section title="Identité">
        <Field label="Prénom"    value={firstName} onChange={v => { setFirstName(v); setSaved(false) }} />
        <Field label="Nom"       value={lastName}  onChange={v => { setLastName(v);  setSaved(false) }} />
        <Field label="Téléphone" value={phone}     onChange={v => { setPhone(v);     setSaved(false) }} type="tel" />
      </Section>

      {/* Compte — champs user_data en lecture seule */}
      <Section title="Compte">
        <Label label="Email"   value={email} />
        <Label label="Rôle"    value={ROLE_LABELS[role] ?? role} />
        <Label label="Admin"   value={admin ? 'Oui' : 'Non'} />
        <Label label="Statut"  value={active ? 'Actif' : 'Inactif'} />
        <Label label="Créé le"    value={fmt(createdAt)} />
        <Label label="Modifié le" value={fmt(updatedAt)} />
      </Section>

      {/* Connexion — champs auth.users */}
      <Section title="Connexion">
        <Label label="Dernière connexion"  value={fmt(lastSignIn)} />
        <Label label="Email confirmé le"   value={fmt(emailConfirmedAt)} />
        <Label label="ID utilisateur"      value={id} />
      </Section>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2 bg-[#1D4ED8] text-white text-sm font-medium rounded-lg hover:bg-[#1e40af] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? 'Enregistrement…' : 'Enregistrer'}
        </button>
        {saved     && <span className="text-sm text-[#059669]">Modifications enregistrées</span>}
        {saveError && <span className="text-sm text-[#DC2626]">{saveError}</span>}
      </div>
    </div>
  )
}
