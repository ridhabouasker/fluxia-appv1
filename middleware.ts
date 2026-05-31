import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Sliding-window in-memory rate limiter (per IP, Edge runtime)
// Resets on edge restarts — provides basic DoS protection, not a hard guarantee
const store = new Map<string, number[]>()

const WINDOW_MS   = 15 * 60 * 1000 // 15 minutes
const MAX_UPLOADS = 50              // 50 uploads per window per IP

function checkRateLimit(ip: string): boolean {
  const now   = Date.now()
  const since = now - WINDOW_MS
  const hits  = (store.get(ip) ?? []).filter(t => t > since)

  if (hits.length >= MAX_UPLOADS) return false

  hits.push(now)
  store.set(ip, hits)

  // Prune store when it grows too large
  if (store.size > 5000) {
    for (const [key, ts] of store) {
      if (ts.every(t => t < since)) store.delete(key)
    }
  }

  return true
}

export function middleware(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Trop de requêtes. Réessayez dans quelques minutes.' },
      { status: 429 }
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/firm/documents/upload',
    '/api/customer/documents/submit',
  ],
}
