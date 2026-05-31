'use client'

import { Search } from 'lucide-react'
import ClientAutosuggest from '@/components/shared/ClientAutosuggest'
import { CustomerFilter, StatusFilter } from './types'

const SEL = "text-sm border border-[#E2E8F0] rounded-lg px-3 py-1.5 bg-white text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#1D4ED8]"

type Props = {
  availableYears: number[]
  draftYear: number
  draftStatus: StatusFilter
  draftCust: string
  customers: CustomerFilter[]
  onYearChange: (year: number) => void
  onStatusChange: (status: StatusFilter) => void
  onCustChange: (cust: string) => void
  onSearch: () => void
}

export default function DocumentFilters({
  availableYears,
  draftYear,
  draftStatus,
  draftCust,
  customers,
  onYearChange,
  onStatusChange,
  onCustChange,
  onSearch,
}: Props) {
  return (
    <div className="flex items-center gap-2 mb-5 flex-wrap">
      <select
        value={draftYear}
        onChange={e => onYearChange(Number(e.target.value))}
        className={SEL}
      >
        {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
      </select>

      <select
        value={draftStatus}
        onChange={e => onStatusChange(e.target.value as StatusFilter)}
        className={SEL}
      >
        <option value="unprocessed">Non traité</option>
        <option value="all">Tous les statuts</option>
        <option value="pending">En attente</option>
        <option value="processed">Traité</option>
        <option value="rejected">Rejeté</option>
      </select>

      <ClientAutosuggest options={customers} value={draftCust} onChange={onCustChange} />

      <button
        onClick={onSearch}
        className="px-4 py-1.5 text-sm font-medium bg-[#1D4ED8] text-white rounded-lg hover:bg-[#1e40af] transition-colors flex items-center gap-1.5"
      >
        <Search size={13} />
        Rechercher
      </button>
    </div>
  )
}
