import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'

const requisitos = [
  'NIE / DNI',
  'Fecha de examen',
  'Categoría del permiso (AM, A1, B…)',
  'Fecha de nacimiento',
]

export default function AdmitidoExamen() {
  return (
    <PageHero
      kicker="Permisos de conducir"
      title="Consulta si estás admitido al examen"
      crumbs={[
        { label: 'Nuestros servicios', href: '/sede-electronica' },
        { label: 'Consulta si estás admitido al examen' },
      ]}
    >
      <div className="max-w-3xl space-y-6 text-[15px] leading-relaxed text-[#4a4a4a]">
        <p>
          En la DGT, este trámite está en <strong>Nuestros servicios → Permisos de conducir →
          Obtener un nuevo permiso → Consulta tu nota de examen</strong>. Sirve para comprobar si
          constas como admitido y consultar el resultado de las pruebas teóricas o prácticas.
        </p>
        <p>
          Las notas oficiales se publican durante 15 días. El teórico por ordenador suele estar
          disponible el mismo día a partir de las 17:00. El práctico y el teórico en papel, al día
          siguiente a partir de las 17:00.
        </p>
        <p>Para consultar, introduce los mismos datos que en tu convocatoria:</p>
        <ul className="list-disc space-y-1 pl-5">
          {requisitos.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <Link
          to="/verificar-permiso"
          className="inline-flex rounded-md bg-[#003d82] px-6 py-3 text-sm font-semibold text-white hover:bg-[#002a5c]"
        >
          Consultar ahora
        </Link>
      </div>
    </PageHero>
  )
}
