import { useState } from 'react'
import { ChevronLeft, ChevronRight, User } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

export type LicenseRecord = {
  id: string
  identifier: string
  document_number: string
  first_name: string
  last_name: string
  birth_date: string | null
  categories: string[] | string | null
  status: string | null
  points_balance: number | null
  issue_date: string | null
  expiry_date: string | null
  photo_url: string | null
}

export type PointRow = {
  created_at: string
  points: number
  type: string | null
  description: string | null
  balance_after: number | null
}

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

export function isoDay(value: string | null | undefined) {
  if (!value) return ''
  const s = String(value).trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s

  const parsed = new Date(s)
  if (Number.isNaN(parsed.getTime())) {
    const m = s.match(/^(\d{4}-\d{2}-\d{2})/)
    return m ? m[1] : ''
  }

  if (/T00:00:00/.test(s)) return s.slice(0, 10)

  return `${parsed.getFullYear()}-${pad2(parsed.getMonth() + 1)}-${pad2(parsed.getDate())}`
}

export function formatDate(iso: string) {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-')
  return `${d}-${m}-${y}`
}

export function shiftIsoYears(iso: string, years: number) {
  const day = isoDay(iso)
  if (!day) return ''
  const date = new Date(`${day}T12:00:00`)
  date.setFullYear(date.getFullYear() + years)
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`
}

export function categoryList(categories: LicenseRecord['categories']) {
  if (Array.isArray(categories)) return categories.map((item) => String(item).trim())
  if (typeof categories === 'string') {
    return categories
      .replace(/[{}]/g, '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }
  return []
}

export function VerifyInfoBox() {
  return (
    <div className="rounded-lg border border-[#d8dee8] bg-[#f4f6f9] p-5 md:p-6">
      <h2 className="mb-3 font-bold text-[#004587]">Información importante</h2>
      <ul className="list-disc space-y-1.5 pl-5 text-sm text-[#4a4a4a]">
        <li>Esta verificación confirma la validez actual del permiso</li>
        <li>Los datos mostrados corresponden al último estado registrado</li>
        <li>Para consultas sobre puntos, utilice el servicio específico</li>
        <li>En caso de discrepancias, contacte con su Jefatura de Tráfico</li>
      </ul>
    </div>
  )
}

export function licenseQrUrl(id: string) {
  return `${window.location.origin}/license/${id}/view`
}

type Props = {
  license: LicenseRecord
  history: PointRow[]
  fechaExamen?: string
  fechaNacimiento?: string
  categoria?: string
}

const DISPLAY_POINTS = 12

function isActivo(status: string | null | undefined) {
  return (status || '').trim().toLowerCase() === 'activo'
}

export default function LicenseResult({
  license,
  history,
  fechaExamen = '',
  fechaNacimiento = '',
  categoria = '',
}: Props) {
  const [face, setFace] = useState(0)
  const [showRate, setShowRate] = useState(false)
  const [showUnpaid, setShowUnpaid] = useState(false)
  const qrValue = licenseQrUrl(license.id)
  const showPoints = isActivo(license.status)
  const pointPrice = 86
  const requiredTotal = DISPLAY_POINTS * 82

  const expiryIso = isoDay(license.expiry_date)
  const issueIso =
    isoDay(license.issue_date) ||
    (expiryIso ? shiftIsoYears(expiryIso, -10) : isoDay(fechaExamen))
  const expiryShown = expiryIso || (issueIso ? shiftIsoYears(issueIso, 10) : '')

  const fields = [
    { n: '1.', v: (license.last_name || '').toUpperCase() },
    { n: '2.', v: (license.first_name || '').toUpperCase() },
    { n: '3.', v: formatDate(isoDay(license.birth_date) || fechaNacimiento) },
    { n: '4a.', v: formatDate(issueIso) },
    { n: '4b.', v: formatDate(expiryShown) },
    { n: '4c.', v: 'ESPAÑA' },
    { n: '5.', v: license.document_number || license.identifier },
    { n: '6.', v: categoryList(license.categories).join(' ') || categoria },
  ]

  function goToPoints() {
    setFace(1)
  }

  function goToLicense() {
    setFace(0)
  }

  function toggleFace() {
    setFace((f) => (f === 0 ? 1 : 0))
  }

  return (
    <div className="bg-white py-10 md:py-14">
      <div className="mx-auto max-w-[640px] px-4">
        {face === 0 ? (
          <div className="mx-auto max-w-[420px] rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-[64px] shrink-0 sm:w-[76px]">
                <div className="aspect-[3/4] overflow-hidden bg-[#e8e8e8]">
                  {license.photo_url ? (
                    <img src={license.photo_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <User className="h-8 w-8 text-[#9aa3ad]" strokeWidth={1.25} />
                    </div>
                  )}
                </div>
              </div>
              <div className="w-px shrink-0 self-stretch bg-gray-200" />
              <ol className="min-w-0 flex-1 space-y-1.5 text-[13px] leading-relaxed text-black sm:space-y-2 sm:text-[15px]">
                {fields.map((f) => (
                  <li key={f.n} className="flex items-start gap-2">
                    <span className="w-7 shrink-0 font-medium sm:w-8">{f.n}</span>
                    <span className="min-w-0 whitespace-normal break-words uppercase">
                      {f.n === '1.'
                        ? f.v.split(/\s+/).map((part, i) => (
                            <span key={`${part}-${i}`} className={i > 0 ? 'block' : undefined}>
                              {part}
                            </span>
                          ))
                        : f.v}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ) : (
          <div>
            <div className="mx-auto w-fit rounded-md bg-white px-10 py-5 text-center shadow-[0_1px_4px_rgba(0,0,0,0.12)]">
              <p className="text-4xl font-bold leading-none text-black">
                {showPoints ? DISPLAY_POINTS : 0}
              </p>
              <p className="mt-1 text-sm text-black">puntos</p>
            </div>
            <div className="mt-4 flex flex-col items-center gap-3 text-center">
              {!showRate ? (
                <button
                  type="button"
                  onClick={() => setShowRate(true)}
                  className="rounded-md bg-[#003d82] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#002f66]"
                >
                  Aumentar su punto
                </button>
              ) : (
                <>
                  <p className="text-sm text-[#555]">1 punto = {pointPrice} €</p>
                  <p className="text-sm text-[#555]">
                    Se requieren 12 puntos para obtener el permiso.
                  </p>
                  <p className="text-sm font-medium text-black">
                    {DISPLAY_POINTS} × 82 € = {requiredTotal} €
                  </p>
                  {!showUnpaid ? (
                    <button
                      type="button"
                      onClick={() => setShowUnpaid(true)}
                      className="rounded-md bg-[#003d82] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#002f66]"
                    >
                      Activar
                    </button>
                  ) : (
                    <p className="max-w-xs text-sm font-medium text-red-700">
                      Saldo impagado, contacte a su proveedor de permiso
                    </p>
                  )}
                </>
              )}
            </div>
            <h2 className="mt-8 mb-3 text-[17px] font-medium text-[#004080]">
              Historial de puntos
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="bg-[#ececec] text-[#555]">
                    <th className="px-3 py-2.5 font-medium">Fecha</th>
                    <th className="px-3 py-2.5 font-medium">Puntos</th>
                    <th className="px-3 py-2.5 font-medium">Movimiento</th>
                    <th className="px-3 py-2.5 font-medium">Saldo final</th>
                    <th className="px-3 py-2.5 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {!showPoints || history.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-3 py-6 text-[#888]">
                        Sin datos
                      </td>
                    </tr>
                  ) : (
                    history.map((row) => (
                      <tr key={row.created_at + String(row.points)}>
                        <td className="px-3 py-2.5">{formatDate(isoDay(row.created_at))}</td>
                        <td className="px-3 py-2.5">{DISPLAY_POINTS}</td>
                        <td className="px-3 py-2.5">{row.description || row.type || '—'}</td>
                        <td className="px-3 py-2.5">{DISPLAY_POINTS}</td>
                        <td className="px-3 py-2.5">Activo</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-center">
          {face === 0 ? (
            <button
              type="button"
              onClick={goToPoints}
              className="rounded-md bg-[#003d82] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#002f66]"
            >
              Ver puntos
            </button>
          ) : (
            <button
              type="button"
              onClick={goToLicense}
              className="rounded-md bg-[#003d82] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#002f66]"
            >
              Ver permiso
            </button>
          )}
        </div>

        <div className="relative mt-10 flex items-center justify-center">
          <button
            type="button"
            aria-label="Anterior"
            onClick={toggleFace}
            className="absolute left-0 p-2 text-black hover:opacity-60"
          >
            <ChevronLeft className="h-8 w-8" strokeWidth={1.5} />
          </button>
          <a
            href={qrValue}
            aria-label="Abrir ficha pública del permiso"
            className="flex h-36 w-36 items-center justify-center rounded-full bg-[#003d82] p-5"
          >
            <div className="pointer-events-none flex h-full w-full items-center justify-center bg-white p-1.5">
              <QRCodeSVG value={qrValue} size={112} level="M" marginSize={0} />
            </div>
          </a>
          <button
            type="button"
            aria-label="Siguiente"
            onClick={toggleFace}
            className="absolute right-0 p-2 text-black hover:opacity-60"
          >
            <ChevronRight className="h-8 w-8" strokeWidth={1.5} />
          </button>
        </div>

        <div className="mt-14">
          <VerifyInfoBox />
        </div>
      </div>
    </div>
  )
}
