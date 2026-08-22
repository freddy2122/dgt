import PageHero from '../components/PageHero'
import { educacion } from '../data/content'

const campanas = [
  {
    title: 'Miras el móvil para no perderte nada y terminas perdiéndolo todo',
    image: '/images/vitesse.jpg',
  },
  {
    title: 'En un siniestro de tráfico puedes morir o perder tu vida',
    image: '/images/zero.jpg',
  },
  {
    title: 'Cinturón y sistemas de retención infantil',
    image: '/images/sri.jpg',
  },
  {
    title: 'Objetivo Cero',
    image: '/images/Carril-Emergencias-Listado.jpg',
  },
]

export default function Seguridad() {
  return (
    <PageHero
      kicker="Muévete con seguridad"
      title="Seguridad vial"
      crumbs={[{ label: 'Muévete con seguridad' }]}
    >
      <p className="max-w-3xl text-lg text-dgt-gray-dark mb-10">
        Educación vial, campañas de concienciación y consejos para circular de forma segura.
      </p>

      <h2 className="text-2xl font-bold text-dgt-blue mb-6">Campañas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {campanas.map((c) => (
          <article key={c.title} className="dgt-card overflow-hidden">
            <img src={c.image} alt="" className="h-40 w-full object-cover" />
            <div className="p-4">
              <h3 className="font-medium text-dgt-blue">{c.title}</h3>
            </div>
          </article>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-dgt-blue mb-6">Recursos de educación vial</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {educacion.map((e) => (
          <div key={e.title} className="overflow-hidden rounded-lg">
            <img src={e.image} alt={e.title} className="w-full object-cover" />
            <p className="mt-2 text-center font-medium text-dgt-blue">{e.title}</p>
          </div>
        ))}
      </div>
    </PageHero>
  )
}
