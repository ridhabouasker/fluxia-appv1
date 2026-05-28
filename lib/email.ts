import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

type NotifyDepositParams = {
  customerId:   string
  customerName: string
  firmId:       string
  firmName:     string
  fileNames:    string[]
  firmUrl:      string
}

type NotifyStatusParams = {
  customerId:  string
  firmName:    string
  fileName:    string
  status:      'processed' | 'rejected'
  clientUrl:   string
}

export async function notifyDeposit(p: NotifyDepositParams) {
  if (!process.env.RESEND_API_KEY) return

  const db = serviceClient()

  // Users firm assignés à ce client
  const { data: links } = await db
    .from('user_customer')
    .select('user:user_id(email, role)')
    .eq('customer_id', p.customerId)

  let emails = (links ?? [])
    .map(l => (l.user as unknown as { email: string; role: string } | null))
    .filter(u => u?.role === 'firm')
    .map(u => u!.email)

  // Fallback : tous les users firm du cabinet
  if (emails.length === 0) {
    const { data: users } = await db
      .from('user_data')
      .select('email')
      .eq('firm_id', p.firmId)
      .eq('role', 'firm')
    for (const u of users ?? []) if (u.email) emails.push(u.email)
  }

  if (emails.length === 0) return

  const n       = p.fileNames.length
  const plural  = n > 1
  const listHtml = p.fileNames.map(f => `<li style="margin-bottom:4px;">${esc(f)}</li>`).join('')

  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from:    'Fluxia <noreply@advences.com>',
    to:      emails,
    subject: `${esc(p.customerName)} a déposé ${n} document${plural ? 's' : ''}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:520px;margin:0 auto;padding:32px;background:#fff;">
        <div style="margin-bottom:24px;">
          <span style="font-size:16px;font-weight:700;color:#0F172A;">Fluxia</span>
        </div>
        <h1 style="font-size:20px;font-weight:600;color:#0F172A;margin:0 0 8px;">
          Nouveau${plural ? 'x' : ''} document${plural ? 's' : ''} reçu${plural ? 's' : ''}
        </h1>
        <p style="font-size:14px;color:#64748B;margin:0 0 16px;">
          Votre client <strong>${esc(p.customerName)}</strong> vient de déposer ${n} document${plural ? 's' : ''} :
        </p>
        <ul style="padding:0 0 0 20px;margin:0 0 24px;font-size:13px;color:#0F172A;">
          ${listHtml}
        </ul>
        <a href="${p.firmUrl}/documents" style="display:inline-block;padding:10px 24px;background:#1D4ED8;color:#fff;font-size:13px;font-weight:500;border-radius:6px;text-decoration:none;">
          Voir les documents
        </a>
        <p style="font-size:12px;color:#94A3B8;margin-top:24px;">
          Vous recevez cet email car vous gérez cet espace documentaire sur Fluxia.
        </p>
      </div>
    `,
  })
}

export async function notifyStatus(p: NotifyStatusParams) {
  if (!process.env.RESEND_API_KEY) return

  const db = serviceClient()

  const { data: links } = await db
    .from('user_customer')
    .select('user:user_id(email, role)')
    .eq('customer_id', p.customerId)

  const emails = (links ?? [])
    .map(l => (l.user as unknown as { email: string; role: string } | null))
    .filter(u => u?.role === 'customer')
    .map(u => u!.email)

  if (emails.length === 0) return

  const rejected  = p.status === 'rejected'
  const headline  = rejected ? 'Document rejeté' : 'Document traité'
  const message   = rejected
    ? `<strong>${esc(p.firmName)}</strong> a rejeté le document suivant. Veuillez en déposer une nouvelle version.`
    : `<strong>${esc(p.firmName)}</strong> a traité le document suivant.`
  const ctaColor  = rejected ? '#DC2626' : '#059669'
  const cta       = rejected ? 'Déposer un nouveau document' : 'Voir mes documents'

  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from:    'Fluxia <noreply@advences.com>',
    to:      emails,
    subject: rejected
      ? `${esc(p.firmName)} a rejeté un de vos documents`
      : `${esc(p.firmName)} a traité un de vos documents`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:520px;margin:0 auto;padding:32px;background:#fff;">
        <div style="margin-bottom:24px;">
          <span style="font-size:16px;font-weight:700;color:#0F172A;">Fluxia</span>
        </div>
        <h1 style="font-size:20px;font-weight:600;color:#0F172A;margin:0 0 8px;">${headline}</h1>
        <p style="font-size:14px;color:#64748B;margin:0 0 8px;">${message}</p>
        <p style="font-size:13px;color:#0F172A;background:#F8FAFC;padding:10px 14px;border-radius:6px;margin:0 0 24px;font-family:monospace;">
          ${esc(p.fileName)}
        </p>
        <a href="${p.clientUrl}/mes-documents" style="display:inline-block;padding:10px 24px;background:${ctaColor};color:#fff;font-size:13px;font-weight:500;border-radius:6px;text-decoration:none;">
          ${cta}
        </a>
        <p style="font-size:12px;color:#94A3B8;margin-top:24px;">
          Vous recevez cet email car vous disposez d&apos;un espace documentaire Fluxia.
        </p>
      </div>
    `,
  })
}
