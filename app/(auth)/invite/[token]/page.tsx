'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

const cls = "w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg bg-white text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:border-[#1D4ED8] focus:ring-1 focus:ring-[#1D4ED8] transition-colors"

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-[#64748B]">{label}</label>
      {children}
    </div>
  )
}

type InvitationInfo = {
  email: string
  firm_name: string
  customer_name: string | null
  expires_at: string
}

export default function InvitePage() {
  const { token } = useParams<{ token: string }>()
  const router = useRouter()

  const [inv, setInv]             = useState<InvitationInfo | null>(null)
  const [loading, setLoading]     = useState(true)
  const [invalid, setInvalid]     = useState(false)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName]   = useState('')
  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [showPwd, setShowPwd]     = useState(false)
  const [showCfm, setShowCfm]     = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]         = useState('')

  useEffect(() => {
    supabase.rpc('get_invitation_by_token', { p_token: token })
      .then(({ data }) => {
        if (!data) { setInvalid(true) }
        else { setInv(data as InvitationInfo) }
        setLoading(false)
      })
  }, [token])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) { setError('Les mots de passe ne correspondent pas.'); return }
    setError(''); setSubmitting(true)

    const res = await fetch('/api/invite/accept', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, firstName, lastName, password }),
    })

    const json = await res.json()
    if (!res.ok) { setError(json.error ?? 'Erreur inattendue.'); setSubmitting(false); return }

    // Connexion automatique
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: inv!.email,
      password,
    })
    if (signInError) {
      router.push('/login?activated=1')
    } else {
      router.push('/mes-documents')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <span className="text-sm text-[#94A3B8]">Vérification…</span>
      </div>
    )
  }

  if (invalid) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-8 w-full max-w-sm shadow-sm text-center">
          <div className="flex items-center gap-2 justify-center mb-6">
            <span className="w-2 h-2 rounded-full bg-[#1D4ED8]" />
            <span className="text-lg font-bold text-[#0F172A] tracking-tight">
              Flux<span className="text-[#1D4ED8]">IA</span>
            </span>
          </div>
          <p className="text-sm font-semibold text-[#0F172A] mb-2">Lien invalide ou expiré</p>
          <p className="text-sm text-[#64748B] mb-6">
            Ce lien d&apos;invitation n&apos;est plus valide. Contactez votre cabinet pour recevoir un nouveau lien.
          </p>
          <Link href="/login" className="text-sm text-[#1D4ED8] font-medium hover:underline">
            Se connecter
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 py-10">
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-8 w-full max-w-md shadow-sm">

        <div className="flex items-center gap-2 mb-8">
          <span className="w-2 h-2 rounded-full bg-[#1D4ED8]" />
          <span className="text-lg font-bold text-[#0F172A] tracking-tight">
            Flux<span className="text-[#1D4ED8]">IA</span>
          </span>
        </div>

        <h1 className="text-base font-semibold text-[#0F172A] mb-1">Créer votre accès portail</h1>
        <p className="text-sm text-[#94A3B8] mb-1">
          Invitation de <span className="font-medium text-[#64748B]">{inv!.firm_name}</span>
        </p>
        {inv!.customer_name && (
          <p className="text-sm text-[#94A3B8] mb-6">
            Compte client : <span className="font-medium text-[#64748B]">{inv!.customer_name}</span>
          </p>
        )}
        {!inv!.customer_name && <div className="mb-6" />}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <div className="grid grid-cols-2 gap-3">
            <Field label="Prénom">
              <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)}
                required maxLength={60} placeholder="Jean" className={cls} />
            </Field>
            <Field label="Nom">
              <input type="text" value={lastName} onChange={e => setLastName(e.target.value)}
                required maxLength={60} placeholder="Dupont" className={cls} />
            </Field>
          </div>

          <Field label="Email">
            <input type="email" value={inv!.email} readOnly
              className={`${cls} bg-[#F8FAFC] text-[#64748B] cursor-default`} />
          </Field>

          <Field label="Mot de passe">
            <div className="relative">
              <input type={showPwd ? 'text' : 'password'} value={password}
                onChange={e => setPassword(e.target.value)}
                required minLength={8} placeholder="8 caractères minimum"
                className={`${cls} pr-9`} />
              <button type="button" onClick={() => setShowPwd(v => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B] transition-colors">
                {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </Field>

          <Field label="Confirmer le mot de passe">
            <div className="relative">
              <input type={showCfm ? 'text' : 'password'} value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required minLength={8} placeholder="Répétez le mot de passe"
                className={`${cls} pr-9 ${confirm && confirm !== password ? 'border-[#FCA5A5] focus:border-[#DC2626] focus:ring-[#DC2626]' : ''}`} />
              <button type="button" onClick={() => setShowCfm(v => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B] transition-colors">
                {showCfm ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </Field>

          {error && (
            <div className="px-3 py-2.5 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-xs text-[#DC2626]">
              {error}
            </div>
          )}

          <button type="submit" disabled={submitting}
            className="w-full py-2.5 bg-[#1D4ED8] text-white text-sm font-medium rounded-lg hover:bg-[#1e40af] disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-1">
            {submitting ? 'Activation en cours…' : 'Créer mon accès'}
          </button>
        </form>

        <p className="text-xs text-[#94A3B8] text-center mt-5">
          Déjà un compte ?{' '}
          <Link href="/login" className="text-[#1D4ED8] font-medium hover:underline">Se connecter</Link>
        </p>
      </div>
    </div>
  )
}
