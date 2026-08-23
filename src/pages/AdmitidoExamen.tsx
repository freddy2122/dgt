import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'

export default function AdmitidoExamen() {
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

        <Link
          to="/consulta-admitido-examen"
          className="inline-flex rounded-md bg-[#003d82] px-6 py-3 text-sm font-semibold text-white hover:bg-[#002a5c]"
        >
          Consultar ahora
        </Link>
      </div>
    </PageHero>
  )
}
