import { useState, type SubmitEvent } from 'react'
import DateTextField from '../components/DateTextField'
import PageHero from '../components/PageHero'
import { CATEGORIAS, displayToIso, findLicense } from '../lib/licenseLookup'

const fieldClass =
  'w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-[#004080] focus:ring-1 focus:ring-[#004080]'
const labelClass = 'mb-1.5 block text-sm font-medium text-[#004080]'

type AdmissionResult = {
  admitted: boolean
  name: string
  document: string
  category: string
  examDate: string
}

export default function AdmitidoExamen() {
  const [identifier, setIdentifier] = useState('')
  const [fechaExamen, setFechaExamen] = useState('')
  const [categoria, setCategoria] = useState('B')
  const [fechaNacimiento, setFechaNacimiento] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<AdmissionResult | null>(null)

  async function onSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setResult(null)
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
        setResult({
          admitted: false,
          name: '',
          document: identifier.trim().toUpperCase(),
          category: categoria,
          examDate: fechaExamen,
        })
        return
      }

      setResult({
        admitted: true,
        name: `${found.row.first_name} ${found.row.last_name}`.trim(),
        document: found.row.document_number || found.row.identifier,
        category: categoria,
        examDate: fechaExamen,
      })
    } catch {
      setError('No se ha podido consultar. Inténtelo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageHero
      kicker="Permisos de conducir"
      title="¿Estoy admitido al examen?"
      crumbs={[
        { label: 'Nuestros servicios', href: '/sede-electronica' },
        { label: '¿Estoy admitido al examen?' },
      ]}
    >
      <div className="max-w-3xl space-y-8 text-[15px] leading-relaxed text-[#4a4a4a]">
        <p>
          Si te has presentado a examen para obtener un permiso de conducir, puedes comprobar si
          constas como admitido en la convocatoria. Introduce tus datos personales, la fecha del
          examen y la clase de permiso.
        </p>

        <div>
          <h2 className="mb-3 text-xl font-bold text-[#004080]">¿Qué debes saber?</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Los resultados de los exámenes teóricos realizados en ordenador estarán disponibles la
              misma tarde del día del examen, a partir de las 17:00.
            </li>
            <li>
              Los resultados de los exámenes prácticos y las pruebas teóricas realizadas en papel
              estarán disponibles al día siguiente del examen, a partir de las 17:00.
            </li>
            <li>Las notas permanecen publicadas durante 15 días.</li>
          </ul>
        </div>

        <a
          href="#consulta"
          className="inline-flex rounded-md bg-[#003d82] px-6 py-3 text-sm font-semibold text-white hover:bg-[#002a5c]"
        >
          Consultar ahora
        </a>

        <section id="consulta" className="scroll-mt-24">
          <div className="max-w-[560px] rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-xl font-bold text-[#004080]">Consultar admisión al examen</h2>
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
        </section>

        {result && (
          <div
            className={`rounded-lg border px-5 py-4 ${
              result.admitted
                ? 'border-green-200 bg-green-50 text-green-900'
                : 'border-amber-200 bg-amber-50 text-amber-950'
            }`}
          >
            {result.admitted ? (
              <>
                <p className="text-lg font-bold">Admitido</p>
                <p className="mt-2">
                  Consta como admitido a la convocatoria del examen.
                </p>
                <ul className="mt-3 space-y-1 text-sm">
                  {result.name && (
                    <li>
                      <strong>Nombre:</strong> {result.name}
                    </li>
                  )}
                  <li>
                    <strong>Documento:</strong> {result.document}
                  </li>
                  <li>
                    <strong>Clase de permiso:</strong> {result.category}
                  </li>
                  <li>
                    <strong>Fecha de examen:</strong> {result.examDate}
                  </li>
                </ul>
              </>
            ) : (
              <>
                <p className="text-lg font-bold">No admitido</p>
                <p className="mt-2">
                  No constas como admitido a esta convocatoria. Comprueba el NIF/NIE, la fecha de
                  nacimiento, la clase de permiso y la fecha de examen, o consulta con tu
                  autoescuela.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </PageHero>
  )
}
