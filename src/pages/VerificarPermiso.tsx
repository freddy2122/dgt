import { useState, type SubmitEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import DateTextField from '../components/DateTextField'
import { VerifyInfoBox } from '../components/LicenseResult'
import { CATEGORIAS, displayToIso, findLicense } from '../lib/licenseLookup'

export default function VerificarPermiso() {
  const navigate = useNavigate()
  const [identifier, setIdentifier] = useState('')
  const [fechaExamen, setFechaExamen] = useState('')
  const [categoria, setCategoria] = useState('B')
  const [fechaNacimiento, setFechaNacimiento] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const birthIso = displayToIso(fechaNacimiento)
      const examIso = displayToIso(fechaExamen)
      if (!examIso || !birthIso) {
        setError('Introduzca las fechas con el formato dd/mm/aaaa.')
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
        return
      }

      navigate(`/license/${result.row.id}/view`)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Error en la verificación. Intente nuevamente.',
      )
    } finally {
      setLoading(false)
    }
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
