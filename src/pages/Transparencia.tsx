import PageHero from '../components/PageHero'

const bloques = [
  {
    title: 'Información Institucional',
    text: 'Estructura, funciones y marco normativo de la DGT',
  },
  {
    title: 'Información Económica y Presupuestaria',
    text: 'Presupuestos, contratos y información económica pública',
  },
  {
    title: 'Estadísticas y Datos Abiertos',
    text: 'Datos estadísticos sobre tráfico, vehículos y siniestralidad',
  },
  {
    title: 'Participación Ciudadana',
    text: 'Consultas públicas y procesos participativos',
  },
]

export default function Transparencia() {
  return (
    <PageHero kicker="Portal" title="Transparencia" crumbs={[{ label: 'Transparencia' }]}>
      <p className="max-w-3xl text-lg text-dgt-gray-dark mb-10">
        Accede a la información pública, presupuestos, estadísticas y canales de participación.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {bloques.map((b) => (
          <div key={b.title} className="dgt-card p-6">
            <h2 className="text-xl font-semibold text-dgt-blue mb-2">{b.title}</h2>
            <p className="text-dgt-gray-dark">{b.text}</p>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-dgt-blue/20 bg-dgt-blue/5 p-6">
        <h3 className="font-semibold text-dgt-blue mb-2">Consulta: Nuevo reglamento de VTC</h3>
        <p className="text-sm text-dgt-gray-dark mb-2">
          Proceso de consulta pública sobre la regulación de vehículos de transporte con conductor.
        </p>
        <p className="text-xs text-dgt-gray-dark">Hasta el 28/02/2024</p>
      </div>
    </PageHero>
  )
}
