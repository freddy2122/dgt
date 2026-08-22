import { Link } from 'react-router-dom'
import { FileText, KeyRound, Shield, Smartphone } from 'lucide-react'
import PageHero from '../components/PageHero'
import { sedeServicios } from '../data/content'

const accesos = [
  { title: 'Certificado digital', text: 'Certificado digital de persona física válido' },
  { title: 'DNI electrónico', text: 'DNI electrónico con lector de tarjetas' },
  { title: 'Cl@ve PIN', text: 'Sistema de identificación Cl@ve PIN' },
]

const ventajas = [
  'Disponible 24 horas, 365 días al año',
  'Sin colas ni desplazamientos',
  'Trámites más rápidos y eficientes',
  'Certificados con validez legal',
  'Historial de todos tus trámites',
  'Notificaciones automáticas',
]

export default function SedeElectronica() {
  return (
    <PageHero
      kicker="Nuestros servicios"
      title="Sede Electrónica"
      crumbs={[{ label: 'Nuestros servicios', href: '/sede-electronica' }, { label: 'Sede Electrónica' }]}
    >
      <p className="max-w-3xl text-lg text-dgt-gray-dark mb-10">
        Realiza todos tus trámites de tráfico desde casa, de forma rápida, segura y disponible 24
        horas al día.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {sedeServicios.map((s) => (
          <Link key={s.title} to={s.href} className="dgt-card group overflow-hidden">
            <img src={s.image} alt="" className="h-36 w-full object-cover" />
            <div className="p-4">
              <h3 className="font-semibold text-dgt-blue mb-2">{s.title}</h3>
              <p className="text-sm text-dgt-gray-dark">{s.text}</p>
            </div>
          </Link>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-dgt-blue mb-6">Cómo acceder</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {accesos.map((a, i) => (
          <div key={a.title} className="dgt-card p-6 border-l-4 border-l-dgt-blue">
            {i === 0 && <Shield className="mb-3 h-8 w-8 text-dgt-blue" />}
            {i === 1 && <FileText className="mb-3 h-8 w-8 text-dgt-blue" />}
            {i === 2 && <KeyRound className="mb-3 h-8 w-8 text-dgt-blue" />}
            <h3 className="font-semibold text-dgt-blue mb-2">{a.title}</h3>
            <p className="text-sm text-dgt-gray-dark">{a.text}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-dgt-gray p-8">
        <div>
          <h2 className="text-2xl font-bold text-dgt-blue mb-4">Ventajas de la Sede Electrónica</h2>
          <ul className="space-y-3">
            {ventajas.map((v) => (
              <li key={v} className="flex items-center gap-3 text-dgt-gray-dark">
                <span className="h-2 w-2 rounded-full bg-dgt-blue" />
                {v}
              </li>
            ))}
          </ul>
        </div>
        <div className="text-center">
          <Smartphone className="mx-auto mb-4 h-16 w-16 text-dgt-blue" />
          <p className="mb-4 text-dgt-gray-dark">
            Accede ahora a la Sede Electrónica y realiza tus trámites en minutos
          </p>
          <Link
            to="/sede-electronica"
            className="inline-flex bg-dgt-blue px-6 py-3 font-semibold text-white hover:bg-dgt-blue-dark"
          >
            Acceder con Certificado Digital
          </Link>
        </div>
      </div>
    </PageHero>
  )
}
