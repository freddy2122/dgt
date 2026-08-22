import { Link } from 'react-router-dom'

const servicios = [
  { label: 'Sede Electrónica de la DGT', href: '/sede-electronica' },
  { label: 'Pagar multas', href: '/pagar-multas' },
  { label: 'Consultar puntos', href: '/consultar-puntos' },
  { label: 'Cita previa', href: '/cita-previa' },
]

const sobre = [
  { label: 'Conoce la DGT', href: '/conoce-dgt' },
  { label: 'Transparencia', href: '/transparencia' },
  { label: 'Organigrama', href: '/organigrama' },
  { label: 'Contacto', href: '/contacto' },
]

const legal = [
  { label: 'Aviso legal', href: '/aviso-legal' },
  { label: 'Política de privacidad', href: '/politica-privacidad' },
  { label: 'Política de cookies', href: '/politica-cookies' },
  { label: 'Accesibilidad', href: '/accesibilidad' },
]

const social = [
  { label: 'Facebook', href: '/comunicacion', icon: FacebookIcon },
  { label: 'X', href: '/comunicacion', icon: XIcon },
  { label: 'YouTube', href: '/comunicacion', icon: YoutubeIcon },
  { label: 'Instagram', href: '/comunicacion', icon: InstagramIcon },
  { label: 'LinkedIn', href: '/comunicacion', icon: LinkedinIcon },
]

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
      <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h3l1-3h-4V10c0-.6.4-1 1-1z" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden>
      <path d="M18.2 3H21l-6.5 7.4L22 21h-6.2l-4.3-5.6L6.2 21H3.4l7-8L2 3h6.3l3.9 5.2L18.2 3zm-1.1 16.2h1.7L7 4.7H5.2l11.9 14.5z" />
    </svg>
  )
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
      <path d="M23 12.2s0-3.2-.4-4.6c-.2-.9-.9-1.6-1.8-1.8C18.9 5.4 12 5.4 12 5.4s-6.9 0-8.8.4c-.9.2-1.6.9-1.8 1.8C1 9 1 12.2 1 12.2s0 3.2.4 4.6c.2.9.9 1.6 1.8 1.8 1.9.4 8.8.4 8.8.4s6.9 0 8.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.4.4-4.6.4-4.6zM9.8 15.6V8.8l6.4 3.4-6.4 3.4z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
      <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm10 1.8H7A2.2 2.2 0 0 0 4.8 7v10A2.2 2.2 0 0 0 7 19.2h10a2.2 2.2 0 0 0 2.2-2.2V7A2.2 2.2 0 0 0 17 4.8zM12 8.2A3.8 3.8 0 1 1 8.2 12 3.8 3.8 0 0 1 12 8.2zm0 1.6A2.2 2.2 0 1 0 14.2 12 2.2 2.2 0 0 0 12 9.8zm4.7-2.9a.9.9 0 1 1-.9.9.9.9 0 0 1 .9-.9z" />
    </svg>
  )
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
      <path d="M6.5 9H4V20h2.5V9zM5.2 4A1.6 1.6 0 1 0 6.8 5.6 1.6 1.6 0 0 0 5.2 4zM20 20h-2.5v-5.6c0-1.6-.6-2.2-1.6-2.2s-1.7.8-1.7 2.3V20H12V9h2.4v1.5a2.8 2.8 0 0 1 2.5-1.7c2 0 3.1 1.3 3.1 4V20z" />
    </svg>
  )
}

function EuFlag() {
  return (
    <span className="inline-flex items-center gap-1.5" aria-hidden>
      <span className="inline-flex h-5 w-7 items-center justify-center rounded-[2px] bg-[#003399] text-[8px] font-bold tracking-wide text-[#FFCC00]">
        EU
      </span>
    </span>
  )
}

export default function Footer() {
  return (
    <footer className="mt-auto bg-[#00569e] text-white">
      <div className="container py-10 md:py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div>
            <img
              src="/Logotipo_Footer-DGT.svg"
              alt="Gobierno de España — Ministerio del Interior — DGT"
              className="h-11 w-auto max-w-full"
            />
            <div className="mt-5 flex items-center gap-2">
              {social.map(({ label, href, icon: Icon }) => (
                <Link
                  key={label}
                  to={href}
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30"
                >
                  <Icon />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-bold">Servicios principales</h3>
            <ul className="space-y-2.5 text-sm">
              {servicios.map((l) => (
                <li key={l.href}>
                  <Link to={l.href} className="hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-bold">Sobre la DGT</h3>
            <ul className="space-y-2.5 text-sm">
              {sobre.map((l) => (
                <li key={l.href}>
                  <Link to={l.href} className="hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-bold">Contacto</h3>
            <p className="text-sm leading-relaxed">
              C/ Josefa Valcárcel, 44
              <br />
              28027 Madrid
            </p>
            <p className="mt-3 text-sm">Teléfono: 060</p>
            <p className="text-sm text-white/80">(Información general de tráfico)</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/20">
        <div className="container flex flex-col gap-3 py-4 text-xs md:flex-row md:items-center md:justify-between">
          <nav className="flex flex-wrap items-center gap-x-0">
            {legal.map((l, i) => (
              <span key={l.href} className="flex items-center">
                {i > 0 && <span className="mx-2 text-white/50">|</span>}
                <Link to={l.href} className="hover:underline">
                  {l.label}
                </Link>
              </span>
            ))}
          </nav>
          <p className="text-white/90">
            © 2026 Dirección General de Tráfico. Todos los derechos reservados.
          </p>
        </div>
      </div>

      <div className="bg-[#1a1a1a]">
        <div className="container flex items-center justify-center gap-3 py-3 text-xs text-white/90">
          <span>Financiado por la Unión Europea</span>
          <EuFlag />
        </div>
      </div>
    </footer>
  )
}
