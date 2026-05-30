'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, Clock, FileCheck, Users } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

const MONTHS_FR = ['','Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc']

function formatPeriod(year: number, months: number[] | null): string {
  if (!months || months.length === 0) return String(year)
  if (months.length === 1) return `${MONTHS_FR[months[0]]} ${year}`
  return `${MONTHS_FR[months[0]]}–${MONTHS_FR[months[months.length - 1]]} ${year}`
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return "à l'instant"
  if (m < 60) return `il y a ${m} min`
  const h = Math.floor(m / 60)
  if (h < 24) return `il y a ${h}h`
  const d = Math.floor(h / 24)
  if (d < 7)  return `il y a ${d}j`
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

type KPIs = {
  pending:       number
  processedMonth: number
  clients:       number
  lateTasks:     number
}

type DepositRow = {
  id:            string
  created_at:    string
  filename:      string | null
  year:          number
  months:        number[] | null
  customer_name: string
  type_name:     string | null
}

type LateTaskRow = {
  month:         number
  year:          number
  task_name:     string
  customer_name: string
}

export default function DashboardPage() {
  const router   = useRouter()
  const [firmId, setFirmId]       = useState<string | null>(null)
  const [kpis, setKpis]           = useState<KPIs | null>(null)
  const [deposits, setDeposits]   = useState<DepositRow[]>([])
  const [lateTasks, setLateTasks] = useState<LateTaskRow[]>([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push('/login'); return }

      const { data: ud } = await supabase
        .from('user_data').select('firm_id').eq('id', session.user.id).single()
      if (!ud?.firm_id) return

      const fid        = ud.firm_id
      const now        = new Date()
      const year       = now.getFullYear()
      const month      = now.getMonth() + 1
      const monthStart = new Date(year, now.getMonth(), 1).toISOString()

      setFirmId(fid)

      const [
        { count: pending },
        { count: processedMonth },
        { count: clients },
        { count: lateCnt },
        { data: rawDeposits },
        { data: rawLate },
      ] = await Promise.all([
        supabase.from('document').select('id', { count: 'exact', head: true })
          .eq('firm_id', fid).eq('status', 'pending'),

        supabase.from('document').select('id', { count: 'exact', head: true })
          .eq('firm_id', fid).eq('status', 'processed').gte('updated_at', monthStart),

        supabase.from('customer').select('id', { count: 'exact', head: true })
          .eq('firm_id', fid).eq('active', true),

        supabase.from('recurring_task_status').select('id', { count: 'exact', head: true })
          .eq('firm_id', fid).eq('year', year).lt('month', month)
          .not('status', 'in', '("done","done_late")'),

        supabase.from('document')
          .select('id, created_at, filename, year, months, customer:customer_id(name), type:type_id(name)')
          .eq('firm_id', fid).eq('status', 'pending').eq('source', 'customer')
          .order('created_at', { ascending: false }).limit(10),

        supabase.from('recurring_task_status')
          .select('month, year, task:recurring_task_id(name), customer:customer_id(name)')
          .eq('firm_id', fid).eq('year', year).lt('month', month)
          .not('status', 'in', '("done","done_late")')
          .order('month', { ascending: true }).limit(8),
      ])

      setKpis({
        pending:        pending ?? 0,
        processedMonth: processedMonth ?? 0,
        clients:        clients ?? 0,
        lateTasks:      lateCnt ?? 0,
      })

      setDeposits((rawDeposits ?? []).map(d => ({
        id:            d.id,
        created_at:    d.created_at,
        filename:      d.filename,
        year:          d.year,
        months:        d.months,
        customer_name: (d.customer as unknown as { name: string } | null)?.name ?? '—',
        type_name:     (d.type as unknown as { name: string } | null)?.name ?? null,
      })))

      setLateTasks((rawLate ?? []).map(r => ({
        month:         r.month,
        year:          r.year,
        task_name:     (r.task as unknown as { name: string } | null)?.name ?? '—',
        customer_name: (r.customer as unknown as { name: string } | null)?.name ?? '—',
      })))

      setLoading(false)
    })
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-sm text-[#94A3B8]">Chargement…</span>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <KpiCard
          label="Documents en attente"
          value={kpis!.pending}
          icon={<Clock size={16} className="text-[#D97706]" />}
          accent="#D97706"
          onClick={() => router.push('/documents')}
          clickable
        />
        <KpiCard
          label="Traités ce mois"
          value={kpis!.processedMonth}
          icon={<FileCheck size={16} className="text-[#059669]" />}
          accent="#059669"
        />
        <KpiCard
          label="Clients actifs"
          value={kpis!.clients}
          icon={<Users size={16} className="text-[#1D4ED8]" />}
          accent="#1D4ED8"
          onClick={() => router.push('/clients')}
          clickable
        />
        <KpiCard
          label="Tâches en retard"
          value={kpis!.lateTasks}
          icon={<AlertTriangle size={16} className={kpis!.lateTasks > 0 ? 'text-[#DC2626]' : 'text-[#94A3B8]'} />}
          accent={kpis!.lateTasks > 0 ? '#DC2626' : '#94A3B8'}
          onClick={() => router.push('/taches')}
          clickable
        />
      </div>

      {/* Corps */}
      <div className="flex gap-5">

        {/* Derniers dépôts — 2/3 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-[#0F172A]">Derniers dépôts en attente</p>
            <button onClick={() => router.push('/documents')}
              className="text-xs text-[#1D4ED8] hover:underline">
              Voir tout
            </button>
          </div>

          {deposits.length === 0 ? (
            <div className="bg-white border border-[#E2E8F0] rounded-xl px-5 py-10 text-center text-sm text-[#94A3B8]">
              Aucun document en attente
            </div>
          ) : (
            <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
              {deposits.map((d, i) => (
                <div
                  key={d.id}
                  onClick={() => router.push('/documents')}
                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#F8FAFC] transition-colors${i < deposits.length - 1 ? ' border-b border-[#E2E8F0]' : ''}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium text-[#0F172A] truncate">{d.customer_name}</span>
                      {d.type_name && (
                        <span className="text-[10px] font-medium text-[#64748B] bg-[#F1F5F9] px-1.5 py-0.5 rounded shrink-0">
                          {d.type_name}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[#94A3B8]">
                      {d.filename ?? 'Message'} · {formatPeriod(d.year, d.months)}
                    </span>
                  </div>
                  <span className="text-xs text-[#94A3B8] shrink-0">{timeAgo(d.created_at)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tâches en retard — 1/3 */}
        <div className="w-72 shrink-0">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-[#0F172A]">Tâches en retard</p>
            <button onClick={() => router.push('/taches')}
              className="text-xs text-[#1D4ED8] hover:underline">
              Voir tout
            </button>
          </div>

          {lateTasks.length === 0 ? (
            <div className="bg-white border border-[#E2E8F0] rounded-xl px-4 py-10 text-center text-sm text-[#94A3B8]">
              Aucune tâche en retard
            </div>
          ) : (
            <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
              {lateTasks.map((t, i) => (
                <div
                  key={`${t.task_name}-${t.customer_name}-${t.month}`}
                  onClick={() => router.push('/taches')}
                  className={`flex items-start gap-2.5 px-4 py-3 cursor-pointer hover:bg-[#F8FAFC] transition-colors${i < lateTasks.length - 1 ? ' border-b border-[#E2E8F0]' : ''}`}
                >
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[#DC2626] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#0F172A] truncate">{t.task_name}</p>
                    <p className="text-xs text-[#94A3B8] truncate">{t.customer_name}</p>
                  </div>
                  <span className="text-xs text-[#DC2626] shrink-0 font-medium">
                    {MONTHS_FR[t.month]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

function KpiCard({ label, value, icon, accent, onClick, clickable }: {
  label:     string
  value:     number
  icon:      React.ReactNode
  accent:    string
  onClick?:  () => void
  clickable?: boolean
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-[#E2E8F0] rounded-xl p-5 flex flex-col gap-3${clickable ? ' cursor-pointer hover:border-[#CBD5E1] transition-colors' : ''}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[#64748B]">{label}</span>
        {icon}
      </div>
      <span className="text-2xl font-bold" style={{ color: accent }}>{value}</span>
    </div>
  )
}
