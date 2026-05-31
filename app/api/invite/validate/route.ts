import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabaseService'

export async function POST(req: Request) {
  let token: string
  try {
    const body = await req.json()
    token = body?.token
  } catch {
    return NextResponse.json({ error: 'Corps invalide' }, { status: 400 })
  }

  if (!token || typeof token !== 'string') {
    return NextResponse.json({ error: 'Token manquant' }, { status: 400 })
  }

  const service = createServiceClient()
  const { data, error } = await service.rpc('get_invitation_by_token', { p_token: token })

  if (error) return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  if (!data) return NextResponse.json({ valid: false }, { status: 200 })

  return NextResponse.json({ valid: true, invitation: data }, { status: 200 })
}
