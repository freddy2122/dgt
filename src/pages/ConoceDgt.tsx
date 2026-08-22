import PageHero from '../components/PageHero'
import { cifras } from '../data/content'

const bloques = [
  {
    title: 'Quiénes somos',
    text: 'La Dirección General de Tráfico es el organismo encargado de la gestión del tráfico y la seguridad vial en España.',
  },
  {
    title: 'Funciones',
    text: 'Gestión de permisos de conducir y vehículos, control del tráfico en tiempo real e investigación de accidentes.',
  },
  {
    title: 'Organigrama',
    text: 'Estructura, funciones y marco normativo de la DGT.',
  },
  {
    title: 'Cooperación',
    text: 'Cooperación internacional en materia de tráfico y seguridad vial.',
  },
]

export default function ConoceDgt() {
  return (
    <PageHero kicker="Institución" title="Conoce la DGT" crumbs={[{ label: 'Conoce la DGT' }]}>
      <p className="max-w-3xl text-lg text-dgt-gray-dark mb-10">
        Estructura, funciones y marco normativo de la Dirección General de Tráfico.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {bloques.map((b) => (
          <div key={b.title} className="dgt-card p-6 border-l-4 border-l-dgt-blue">
            <h2 className="text-xl font-semibold text-dgt-blue mb-2">{b.title}</h2>
            <p className="text-dgt-gray-dark">{b.text}</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-dgt-blue mb-8">DGT en cifras</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {cifras.map((c) => (
          <div key={c.label} className="dgt-card text-center p-6">
            <p className="text-3xl font-bold text-dgt-blue">{c.value}</p>
            <p className="mt-2 text-sm text-dgt-gray-dark">{c.label}</p>
          </div>
        ))}
      </div>
    </PageHero>
  )
}
