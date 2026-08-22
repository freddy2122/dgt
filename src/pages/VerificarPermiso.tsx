import { useState, type SubmitEvent } from 'react'
import { Calendar, Search } from 'lucide-react'
import { supabase } from '../lib/supabase'
import LicenseResult, {
  type LicenseRecord,
  type PointRow,
  categoryList,
  VerifyInfoBox,
} from '../components/LicenseResult'

const CATEGORIAS = ['AM', 'A1', 'A2', 'A', 'B', 'B+E', 'C1', 'C', 'D1', 'D']

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

function formatDateInput(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
}

function displayToIso(value: string) {
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

function isoToDisplay(iso: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return ''
  const [year, month, day] = iso.split('-')
  return `${day}/${month}/${year}`
}

function DateTextField({
  id,
  value,
  onChange,
}: {
  id: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="relative">
      <input
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        required
        placeholder="dd/mm/aaaa"
        value={value}
        onChange={(event) => onChange(formatDateInput(event.target.value))}
        className="w-full rounded-md border border-gray-300 px-3 py-2.5 pr-11 text-sm outline-none placeholder:text-gray-400 focus:border-[#004080] focus:ring-1 focus:ring-[#004080]"
      />
      <label className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center text-[#004080]">
        <Calendar className="h-4 w-4" strokeWidth={1.75} />
        <input
          type="date"
          aria-label="Abrir calendario"
          value={displayToIso(value)}
          onChange={(event) => onChange(isoToDisplay(event.target.value))}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
      </label>
    </div>
  )
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

async function findLicense(query: string, birthDate: string, category: string) {
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

export default function VerificarPermiso() {
  const [identifier, setIdentifier] = useState('')
  const [fechaExamen, setFechaExamen] = useState('')
  const [categoria, setCategoria] = useState('B')
  const [fechaNacimiento, setFechaNacimiento] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [license, setLicense] = useState<LicenseRecord | null>(null)
  const [history, setHistory] = useState<PointRow[]>([])

  async function onSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const birthIso = displayToIso(fechaNacimiento)
      const examIso = displayToIso(fechaExamen)
      if (!examIso || !birthIso) {
        setError('Introduzca las fechas con el formato dd/mm/aaaa.')
        setShowResult(false)
        return
      }

      const result = await findLicense(identifier.trim(), birthIso, categoria)
      if (!result.row) {
        const messages = {
          not_found:
            'No se han encontrado datos. Usa el identificador o la referencia del registro, con la misma fecha de nacimiento. Si el dato existe en admin, ejecuta supabase/public_verify_rls.sql.',
          birth: 'El documento existe, pero la fecha de nacimiento no coincide.',
          category: 'El documento existe, pero la categoría no coincide.',
        }
        setError(messages[result.reason])
        setShowResult(false)
        return
      }

      const found = result.row

      const hist = await supabase
        .from('points_history')
        .select('created_at, points, type, description, balance_after')
        .eq('license_id', found.id)
        .order('created_at', { ascending: false })

      setLicense(found)
      setHistory((hist.data as PointRow[]) ?? [])
      setShowResult(true)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Error en la verificación. Intente nuevamente.',
      )
      setShowResult(false)
    } finally {
      setLoading(false)
    }
  }

  if (showResult && license) {
    return (
      <LicenseResult
        license={license}
        history={history}
        fechaExamen={displayToIso(fechaExamen)}
        fechaNacimiento={displayToIso(fechaNacimiento)}
        categoria={categoria}
      />
    )
  }

  return (
    <div className="bg-[#f7f8fa] py-10 md:py-14">
      <div className="mx-auto max-w-[560px] px-4">
        <p className="mb-8 text-center text-[15px] leading-relaxed text-[#6b7280]">
          Verifique la validez de su permiso de conducir introduciendo los datos solicitados. Este
          servicio le permite comprobar el estado actual de su licencia.
        </p>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-6 flex items-start gap-3">
            <Search className="mt-0.5 h-6 w-6 shrink-0 text-[#004080]" strokeWidth={2} />
            <div>
              <h1 className="text-xl font-bold text-[#004080]">Datos del Permiso</h1>
              <p className="mt-1 text-sm text-[#5b7aa8]">
                Introduzca los datos exactos como aparecen en su permiso de conducir
              </p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label htmlFor="identifier" className="mb-1.5 block text-sm font-medium text-[#004080]">
                NIE / DNI <span className="text-[#004080]">*</span>
              </label>
              <input
                id="identifier"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value.toUpperCase())}
                placeholder="EJ: 12345678Z"
                className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-[#004080] focus:ring-1 focus:ring-[#004080]"
              />
            </div>

            <div>
              <label htmlFor="fecha-examen" className="mb-1.5 block text-sm font-medium text-[#004080]">
                Fecha examen <span className="text-[#004080]">*</span>
              </label>
              <DateTextField id="fecha-examen" value={fechaExamen} onChange={setFechaExamen} />
            </div>

            <div>
              <label htmlFor="categoria" className="mb-1.5 block text-sm font-medium text-[#004080]">
                Categorías
              </label>
              <select
                id="categoria"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#004080] focus:ring-1 focus:ring-[#004080]"
              >
                {CATEGORIAS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="fecha-nacimiento" className="mb-1.5 block text-sm font-medium text-[#004080]">
                Fecha de nacimiento <span className="text-[#004080]">*</span>
              </label>
              <DateTextField
                id="fecha-nacimiento"
                value={fechaNacimiento}
                onChange={setFechaNacimiento}
              />
            </div>

            {error && (
              <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-md bg-[#003d82] py-3 text-sm font-semibold text-white hover:bg-[#002a5c] disabled:opacity-60"
            >
              {loading ? 'Verificando...' : 'Verificar Permiso'}
            </button>
          </form>
        </div>

        <div className="mt-8">
          <VerifyInfoBox />
        </div>
      </div>
    </div>
  )
}
