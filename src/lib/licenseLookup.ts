import { categoryList, type LicenseRecord } from '../components/LicenseResult'
import { supabase } from './supabase'

export const CATEGORIAS = ['AM', 'A1', 'A2', 'A', 'B', 'B+E', 'C1', 'C', 'D1', 'D']

export function pad2(n: number) {
  return String(n).padStart(2, '0')
}

export function formatDateInput(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
}

export function displayToIso(value: string) {
  const s = value.trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s

  const match = s.match(/^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{4})$/)
  if (!match) return ''

  const day = Number(match[1])
  const month = Number(match[2])
  const year = Number(match[3])
  const iso = `${year}-${pad2(month)}-${pad2(day)}`
  const parsed = new Date(`${iso}T12:00:00`)
  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.getFullYear() !== year ||
    parsed.getMonth() + 1 !== month ||
    parsed.getDate() !== day
  ) {
    return ''
  }
  return iso
}

export function isoToDisplay(iso: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return ''
  const [year, month, day] = iso.split('-')
  return `${day}/${month}/${year}`
}

function dayKeys(value: string | null | undefined) {
  const keys = new Set<string>()
  if (!value) return keys
  const s = String(value).trim()
  const prefix = s.match(/^(\d{4}-\d{2}-\d{2})/)
  if (prefix) keys.add(prefix[1])

  const parsed = new Date(/T/.test(s) ? s : `${s}T12:00:00`)
  if (!Number.isNaN(parsed.getTime())) {
    keys.add(`${parsed.getFullYear()}-${pad2(parsed.getMonth() + 1)}-${pad2(parsed.getDate())}`)
    keys.add(
      `${parsed.getUTCFullYear()}-${pad2(parsed.getUTCMonth() + 1)}-${pad2(parsed.getUTCDate())}`,
    )
  }
  return keys
}

function sameCalendarDay(a: string | null | undefined, b: string | null | undefined) {
  const right = dayKeys(b)
  return [...dayKeys(a)].some((day) => right.has(day))
}

function hasCategory(categories: LicenseRecord['categories'], wanted: string) {
  const list = categoryList(categories)
  if (list.length === 0) return true
  return list.some((item) => item.toUpperCase() === wanted.toUpperCase())
}

async function fetchByField(field: 'identifier' | 'document_number', value: string) {
  const select =
    'id, identifier, document_number, first_name, last_name, birth_date, categories, status, points_balance, issue_date, expiry_date, photo_url'

  const exact = await supabase.from('licenses').select(select).eq(field, value).maybeSingle()
  if (exact.error) throw new Error(exact.error.message)
  if (exact.data) return exact.data as LicenseRecord

  const loose = await supabase.from('licenses').select(select).ilike(field, value).maybeSingle()
  if (loose.error) throw new Error(loose.error.message)
  return (loose.data as LicenseRecord | null) ?? null
}

export async function findLicense(query: string, birthDate: string, category: string) {
  const value = query.trim()
  const row =
    (await fetchByField('identifier', value)) ?? (await fetchByField('document_number', value))

  if (!row) {
    return { row: null, reason: 'not_found' as const }
  }
  if (!sameCalendarDay(row.birth_date, birthDate)) {
    return { row: null, reason: 'birth' as const }
  }
  if (!hasCategory(row.categories, category)) {
    return { row: null, reason: 'category' as const }
  }
  return { row, reason: 'ok' as const }
}
