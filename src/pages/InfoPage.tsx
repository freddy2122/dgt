import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'

type Props = {
  title: string
  kicker?: string
  text: string
  image?: string
  crumbs?: { label: string; href?: string }[]
}

const related = [
  { label: 'Sede Electrónica', href: '/sede-electronica' },
  { label: 'Cita previa', href: '/cita-previa' },
  { label: 'Pagar multas', href: '/pagar-multas' },
  { label: 'Consultar puntos', href: '/consultar-puntos' },
  { label: 'Renovar permiso', href: '/renovar-permiso' },
  { label: 'Cambio de domicilio', href: '/cambio-domicilio' },
  { label: 'Descargar certificados', href: '/certificados' },
]

export default function InfoPage({ title, kicker, text, image, crumbs }: Props) {
  return (
    <PageHero
      kicker={kicker}
      title={title}
      crumbs={crumbs ?? [{ label: kicker ?? 'Servicios', href: '/sede-electronica' }, { label: title }]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          {image && (
            <img src={image} alt="" className="mb-8 w-full max-h-[360px] object-cover" />
          )}
          <p className="text-lg text-dgt-gray-dark leading-relaxed mb-8">{text}</p>
          <Link
            to="/sede-electronica"
            className="inline-flex bg-dgt-blue px-6 py-3 font-semibold text-white hover:bg-dgt-blue-dark"
          >
            Accede a la Sede Electrónica
          </Link>
        </div>
        <aside className="lg:col-span-4">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-dgt-blue">
            Trámites relacionados
          </h2>
          <ul className="divide-y border bg-white">
            {related.map((r) => (
              <li key={r.href}>
                <Link
                  to={r.href}
                  className="block px-4 py-3 text-sm text-dgt-gray-dark hover:bg-dgt-gray hover:text-dgt-blue"
                >
                  {r.label}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </PageHero>
  )
}
