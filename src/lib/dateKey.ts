/** Local calendar day as `YYYY-MM-DD` */
export function localDateKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function localDateKeyFromParts(
  year: number,
  monthIndex: number,
  day: number,
): string {
  const m = String(monthIndex + 1).padStart(2, '0')
  const dd = String(day).padStart(2, '0')
  return `${year}-${m}-${dd}`
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const

export function formatMonthYear(year: number, monthIndex: number): string {
  return `${MONTH_NAMES[monthIndex]} ${year}`
}

export function parseDateKey(dateKey: string): {
  year: number
  monthIndex: number
  day: number
} | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey)
  if (!m) return null
  const year = Number(m[1])
  const monthIndex = Number(m[2]) - 1
  const day = Number(m[3])
  if (
    monthIndex < 0 ||
    monthIndex > 11 ||
    day < 1 ||
    day > 31
  ) {
    return null
  }
  return { year, monthIndex, day }
}
