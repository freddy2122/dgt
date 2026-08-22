import { CloudRain, Construction, MapPin, Video } from 'lucide-react'
import PageHero from '../components/PageHero'
import { trafficCards } from '../data/content'
import { Link } from 'react-router-dom'

const incidencias = [
  { via: 'A-1', km: 'Km 47', estado: 'Retención', nivel: 'Naranja' },
  { via: 'A-2', km: 'Km 18', estado: 'Obras', nivel: 'Amarillo' },
  { via: 'AP-7', km: 'Km 112', estado: 'Circulación lenta', nivel: 'Amarillo' },
  { via: 'A-3', km: 'Km 62', estado: 'Accidente', nivel: 'Rojo' },
]

export default function Trafico() {
  return (
    <PageHero
      kicker="Información en tiempo real"
      title="Estado del tráfico"
      crumbs={[{ label: 'Estado del tráfico' }]}
    >
      <p className="max-w-3xl text-lg text-dgt-gray-dark mb-10">
        Consulta el estado del tráfico y de las incidencias de circulación actuales.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {trafficCards.map((c) => (
          <div key={c.title} className="dgt-card overflow-hidden">
            <img src={c.image} alt="" className="h-36 w-full object-cover" />
            <div className="p-4">
              <h3 className="font-semibold text-dgt-blue mb-2">{c.title}</h3>
              <p className="text-sm text-dgt-gray-dark">{c.text}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-dgt-blue mb-6">Incidencias destacadas</h2>
      <div className="overflow-x-auto mb-12">
        <table className="min-w-full border bg-white text-sm">
          <thead className="bg-dgt-gray text-dgt-blue">
            <tr>
              <th className="px-4 py-3 text-left">Vía</th>
              <th className="px-4 py-3 text-left">Punto</th>
              <th className="px-4 py-3 text-left">Estado</th>
              <th className="px-4 py-3 text-left">Nivel</th>
            </tr>
          </thead>
          <tbody>
            {incidencias.map((i) => (
              <tr key={i.via + i.km} className="border-t">
                <td className="px-4 py-3 font-medium">{i.via}</td>
                <td className="px-4 py-3">{i.km}</td>
                <td className="px-4 py-3">{i.estado}</td>
                <td className="px-4 py-3">{i.nivel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { Icon: MapPin, label: 'Carreteras cortadas' },
          { Icon: Construction, label: 'Obras' },
          { Icon: CloudRain, label: 'Meteorología' },
          { Icon: Video, label: 'Webcams' },
        ].map(({ Icon, label }) => (
          <Link
            key={label}
            to="/todas-camaras"
            className="dgt-card flex items-center gap-3 p-4 hover:border-dgt-blue"
          >
            <Icon className="h-6 w-6 text-dgt-blue" />
            <span className="font-medium text-dgt-blue">{label}</span>
          </Link>
        ))}
      </div>
    </PageHero>
  )
}
