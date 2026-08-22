import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Smartphone } from 'lucide-react'
import {
  cifras,
  educacion,
  noticias,
  sidebarNews,
  slides,
  stats2030,
  trafficCards,
} from '../data/content'

export default function Home() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 7000)
    return () => clearInterval(id)
  }, [])

  const slide = slides[index]

  return (
    <div>
      <div className="bg-dgt-yellow text-black">
        <div className="container flex items-center justify-between gap-3 py-2 text-sm font-medium">
          <Link to="/trafico" className="hover:underline">
            Consulta las carreteras afectadas por incendios.
          </Link>
          <Link to="/trafico" className="shrink-0 text-xs font-semibold">
            Ver más →
          </Link>
        </div>
      </div>

      <section className="relative h-[320px] overflow-hidden bg-dgt-blue-dark md:h-[500px]">
        {slides.map((s, i) => (
          <img
            key={s.image}
            src={s.image}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              i === index ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
        <div className="container relative z-10 flex h-full items-end pb-14 md:pb-16">
          <div className="max-w-3xl text-white" key={slide.kicker}>
            <p className="mb-2 text-sm font-semibold text-white/90">{slide.kicker}</p>
            <h2 className="text-2xl md:text-4xl font-bold leading-snug">{slide.title}</h2>
            <Link
              to={slide.href}
              className="mt-4 inline-flex items-center text-sm font-semibold hover:underline"
            >
              Ver más →
            </Link>
          </div>
        </div>
        <button
          type="button"
          aria-label="Slide anterior"
          onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
          className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          type="button"
          aria-label="Siguiente slide"
          onClick={() => setIndex((i) => (i + 1) % slides.length)}
          className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-2 w-2 rounded-full ${i === index ? 'bg-white' : 'bg-white/50'}`}
              aria-label={`Ir al slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      <section className="bg-dgt-gray py-10 md:py-14">
        <div className="container grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8 flex gap-6 items-start">
            <img
              src="/images/icono_sede.svg"
              alt=""
              className="hidden md:block h-28 w-auto shrink-0"
            />
            <div>
              <h2 className="text-2xl font-bold text-dgt-blue mb-4">
                Gestiona tus trámites en la Sede Electrónica
              </h2>
              <p className="text-dgt-gray-dark mb-3 leading-relaxed">
                ¿Quieres pedir una cita previa para hacer tus trámites? ¿Necesitas pagar una multa?
                o ¿Quieres pagar tus tasas de tráfico?
              </p>
              <p className="text-dgt-gray-dark mb-6 leading-relaxed">
                Accede a la sede Electrónica y realiza los trámites de forma sencilla, desde el
                salón de tu casa.
              </p>
              <Link
                to="/sede-electronica"
                className="inline-flex w-full items-center justify-center bg-dgt-blue px-6 py-3.5 font-semibold text-white hover:bg-dgt-blue-dark md:w-auto"
              >
                Accede a la Sede Electrónica
              </Link>
            </div>
          </div>
          <aside className="lg:col-span-4">
            <div className="flex items-end justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wide text-dgt-blue">
                Te puede interesar
              </h3>
              <Link to="/comunicacion" className="text-xs text-dgt-gray-dark hover:text-dgt-blue">
                Accede a más información de interés
              </Link>
            </div>
            <ul className="divide-y bg-white border">
              {sidebarNews.map((n, i) => (
                <li key={n.title}>
                  <Link
                    to="/comunicacion"
                    className={`block px-4 py-3.5 hover:bg-dgt-gray ${
                      i === 0 ? 'border-l-4 border-l-dgt-blue bg-dgt-blue/5' : ''
                    }`}
                  >
                    <p className="font-medium text-dgt-blue leading-snug">{n.title}</p>
                    <p className="mt-1 text-xs text-dgt-gray-dark">{n.date}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="container grid grid-cols-1 gap-10 lg:grid-cols-12 items-center">
          <div className="lg:col-span-5 flex gap-5 items-start">
            <img
              src="/images/icono_seguridad.svg"
              alt=""
              className="hidden md:block h-24 w-24 object-contain shrink-0"
            />
            <div>
              <h2 className="text-2xl font-bold text-dgt-blue mb-4">Seguridad Vial 2030</h2>
              <p className="text-dgt-gray-dark mb-3 leading-relaxed">
                ¿Quieres saber más información sobre políticas y estrategias de seguridad vial?
              </p>
              <p className="text-dgt-gray-dark mb-6 leading-relaxed">
                Accede a la web de Seguridad Vial 2030 e infórmate de todo.
              </p>
              <Link
                to="/seguridad"
                className="inline-flex bg-dgt-blue px-6 py-3 font-semibold text-white hover:bg-dgt-blue-dark"
              >
                Accede a Seguridad Vial 2030
              </Link>
            </div>
          </div>
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats2030.map((s) => (
              <div key={s.value} className="bg-gray-100 p-5 text-center">
                <p className="font-bold text-3xl md:text-4xl text-dgt-blue mb-2">{s.value}</p>
                <p className="text-sm font-semibold text-dgt-blue leading-snug">{s.label}</p>
                <p className="mt-2 text-xs text-dgt-gray-dark">{s.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-dgt-gray py-10 md:py-14">
        <div className="container">
          <h2 className="text-2xl font-bold text-dgt-blue mb-8">Información de tráfico</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trafficCards.map((c) => (
              <Link key={c.title} to={c.href} className="group bg-white">
                <div className="overflow-hidden">
                  <img
                    src={c.image}
                    alt=""
                    className="h-[160px] w-full object-cover transition group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-dgt-blue mb-2">{c.title}</h3>
                  <p className="text-sm text-dgt-gray-dark leading-relaxed">{c.text}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="container">
          <h2 className="text-2xl font-bold text-dgt-blue mb-8">DGT en cifras</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {cifras.map((c) => (
              <div key={c.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-dgt-blue">{c.value}</p>
                <p className="mt-2 text-sm text-dgt-gray-dark">{c.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-dgt-blue text-white py-12">
        <div className="container grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 uppercase tracking-wide">
              Conocimiento e investigación
            </h2>
            <p className="text-white/85 mb-6 max-w-lg leading-relaxed">
              Explora nuestras investigaciones y estudios relacionados con la seguridad vial
            </p>
            <Link
              to="/conoce-dgt"
              className="inline-flex bg-white px-6 py-3 font-semibold text-dgt-blue hover:bg-white/90"
            >
              Accede a las publicaciones
            </Link>
          </div>
          <img
            src="/images/Icono_Conocimiento.svg"
            alt=""
            className="mx-auto h-36 w-auto brightness-0 invert"
          />
        </div>
      </section>

      <section className="bg-dgt-blue pb-12">
        <div className="container">
          <h2 className="text-2xl font-bold text-white mb-8 uppercase tracking-wide">
            Recursos de educación vial
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {educacion.map((e) => (
              <Link key={e.title} to="/seguridad" className="group relative overflow-hidden">
                <img
                  src={e.image}
                  alt={e.title}
                  className="h-52 md:h-64 w-full object-cover transition group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-black/55 px-3 py-3">
                  <p className="text-center font-semibold text-white">{e.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="container grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-dgt-blue mb-4">
              Descubre la APP de miDGT
            </h2>
            <p className="text-dgt-gray-dark mb-4 leading-relaxed">
              Centraliza toda tu información y gestiones con la DGT en tu teléfono. Aplicación
              disponible para su descarga de manera gratuita en la App Store de Apple y Google Play
              para Android.
            </p>
            <p className="text-dgt-gray-dark mb-6 leading-relaxed">
              El acceso podrás realizarlo con tu certificado digital, credenciales cl@ve o con tus
              datos personales y una clave que te mandaremos vía SMS al móvil que tengamos
              registrado a tu nombre.
            </p>
            <ul className="space-y-2 mb-6">
              {[
                'Trámites 24 horas, 365 días al año',
                'Sin colas ni esperas',
                'Certificados digitales válidos',
              ].map((t) => (
                <li key={t} className="flex items-center gap-3 text-dgt-gray-dark">
                  <span className="h-1.5 w-1.5 bg-dgt-blue rounded-full" />
                  {t}
                </li>
              ))}
            </ul>
            <Link
              to="/dgt-digital"
              className="inline-flex bg-dgt-blue px-6 py-3 font-semibold text-white hover:bg-dgt-blue-dark"
            >
              Descarga la app DGT
            </Link>
          </div>
          <div className="bg-dgt-gray p-10 text-center">
            <Smartphone className="mx-auto mb-4 h-16 w-16 text-dgt-blue" />
            <h3 className="text-xl font-semibold text-dgt-blue mb-2">App miDGT</h3>
            <p className="text-dgt-gray-dark">La aplicación oficial de la DGT para tu móvil</p>
          </div>
        </div>
      </section>

      <section className="bg-dgt-gray py-10 md:py-14">
        <div className="container">
          <h2 className="text-2xl font-bold text-dgt-blue mb-8">Últimas noticias</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {noticias.map((n) => (
              <Link key={n.title} to={n.href} className="group bg-white p-6">
                <p className="text-xs text-dgt-gray-dark mb-2">{n.date}</p>
                <h3 className="text-lg text-dgt-blue font-semibold mb-2 group-hover:underline">
                  {n.title}
                </h3>
                <p className="text-sm text-dgt-gray-dark mb-4 leading-relaxed">{n.text}</p>
                <span className="text-sm font-semibold text-dgt-blue">Leer más →</span>
              </Link>
            ))}
          </div>
          <div className="mt-8">
            <Link to="/comunicacion" className="font-semibold text-dgt-blue hover:underline">
              Ver todas las noticias
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
