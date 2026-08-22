import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import { noticias } from '../data/content'

export default function Comunicacion() {
  return (
    <PageHero kicker="Notas de prensa" title="Comunicación" crumbs={[{ label: 'Comunicación' }]}>
      <p className="max-w-3xl text-lg text-dgt-gray-dark mb-10">
        Consulta las últimas notas de prensa, campañas y actualidad de la DGT.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {noticias.map((n) => (
          <article key={n.title} className="dgt-card p-6">
            <p className="text-xs text-dgt-gray-dark mb-2">{n.date}</p>
            <h2 className="text-lg font-semibold text-dgt-blue mb-2">{n.title}</h2>
            <p className="text-sm text-dgt-gray-dark mb-4">{n.text}</p>
            <Link to="/comunicacion" className="text-sm font-medium text-dgt-blue">
              Leer más →
            </Link>
          </article>
        ))}
      </div>
    </PageHero>
  )
}
