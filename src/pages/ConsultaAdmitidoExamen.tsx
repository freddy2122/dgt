import { useState, type SubmitEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import DateTextField from '../components/DateTextField'
import { CATEGORIAS, displayToIso, findLicense } from '../lib/licenseLookup'

const fieldClass =
  'w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-[#004080] focus:ring-1 focus:ring-[#004080]'
const labelClass = 'mb-1.5 block text-sm font-medium text-[#004080]'

export default function ConsultaAdmitidoExamen() {
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

      const found = await findLicense(identifier.trim(), birthIso, categoria)
      if (!found.row) {
        navigate('/resultado-notas-examen')
        return
      }

      navigate(`/resultado-notas-examen/${found.row.id}`)
    } catch {
      setError('No se ha podido consultar. Inténtelo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#f7f8fa] py-10 md:py-14">
      <div className="mx-auto max-w-[560px] px-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <h1 className="text-xl font-bold text-[#004080]">Consultar admisión al examen</h1>
          <p className="mt-1 mb-6 text-sm text-[#5b7aa8]">
            Rellene los datos del formulario y pulse Buscar.
          </p>

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label htmlFor="nif" className={labelClass}>
                NIF / NIE *
              </label>
              <input
                id="nif"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value.toUpperCase())}
                placeholder="EJ: 12345678Z"
                className={fieldClass}
              />
            </div>

            <div>
              <label htmlFor="fecha-examen" className={labelClass}>
                Fecha de examen *
              </label>
              <DateTextField id="fecha-examen" value={fechaExamen} onChange={setFechaExamen} />
            </div>

            <div>
              <label htmlFor="clase-permiso" className={labelClass}>
                Clase de permiso *
              </label>
              <select
                id="clase-permiso"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className={`${fieldClass} bg-white`}
              >
                {CATEGORIAS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="fecha-nacimiento" className={labelClass}>
                Fecha de nacimiento *
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
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
