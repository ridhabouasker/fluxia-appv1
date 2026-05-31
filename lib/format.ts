export const MONTHS_FR = ['','Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc']

export function formatPeriod(year: number, months: number[] | null): string {
  if (!months || months.length === 0) return String(year)
  if (months.length === 1) return `${MONTHS_FR[months[0]]} ${year}`
  return `${MONTHS_FR[months[0]]}–${MONTHS_FR[months[months.length - 1]]} ${year}`
}

export function formatSize(kb: number | null): string {
  if (!kb) return ''
  return kb < 1024 ? `${kb} Ko` : `${(kb / 1024).toFixed(1)} Mo`
}

export function formatExt(filename: string | null): string {
  if (!filename) return ''
  return (filename.split('.').pop() ?? '').toUpperCase()
}

export const EXT_COLORS: Record<string, { bg: string; text: string }> = {
  PDF:  { bg: '#FEF2F2', text: '#991B1B' },
  CSV:  { bg: '#F0FDF4', text: '#166534' },
  XLSX: { bg: '#F0FDF4', text: '#166534' },
  XLS:  { bg: '#F0FDF4', text: '#166534' },
  DOCX: { bg: '#EFF6FF', text: '#1D4ED8' },
  DOC:  { bg: '#EFF6FF', text: '#1D4ED8' },
  JPG:  { bg: '#F5F3FF', text: '#5B21B6' },
  JPEG: { bg: '#F5F3FF', text: '#5B21B6' },
  PNG:  { bg: '#F5F3FF', text: '#5B21B6' },
  WEBP: { bg: '#F5F3FF', text: '#5B21B6' },
  GIF:  { bg: '#F5F3FF', text: '#5B21B6' },
}

export function timeAgo(iso: string): string {
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
