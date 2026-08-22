import { useState, type FormEvent } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ChevronDown, Menu, Search, X } from 'lucide-react'
import { mainNav } from '../../data/content'

const utilityLinks = [
  { label: 'Transparencia', href: '/transparencia' },
  { label: 'DGT en cifras', href: '/transparencia' },
  { label: 'Selección y formación', href: '/transparencia' },
  { label: 'Trabaja con nosotros', href: '/transparencia' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  function onSearch(e: FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      setSearchOpen(false)
      navigate(`/sede-electronica?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="border-b border-gray-200 bg-[#f4f4f4]">
        <div className="container flex h-9 items-center justify-between text-[13px] text-[#666]">
          <span>
            <strong className="font-semibold text-[#333]">ES</strong>
            <span className="mx-1.5">|</span>
            Español
          </span>
          <nav className="hidden md:flex items-center gap-6">
            {utilityLinks.map((l) => (
              <Link key={l.label} to={l.href} className="hover:text-dgt-blue">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="border-b border-gray-200 bg-white">
        <div className="container flex items-center gap-2 py-2.5 lg:gap-8 lg:py-3">
          <button
            type="button"
            className="shrink-0 p-1.5 text-[#003d82] lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menú"
          >
            <Menu className="h-6 w-6" strokeWidth={2} />
          </button>

          <Link to="/" className="shrink-0">
            <img
              src="/logo.png"
              alt="DGT - Dirección General de Tráfico"
              className="h-10 w-auto md:h-14"
            />
          </Link>

          <nav className="hidden lg:flex flex-1 items-center justify-center gap-1 xl:gap-2">
            {mainNav.map((item) => (
              <div key={item.label} className="group relative">
                <NavLink
                  to={item.href}
                  className="flex items-center gap-1 px-2.5 py-2 text-[15px] font-semibold text-[#1a365d] hover:text-dgt-blue"
                >
                  {item.label}
                  <ChevronDown className="h-3.5 w-3.5 stroke-[2.5]" />
                </NavLink>
                {item.children && (
                  <div className="invisible absolute left-0 top-full z-50 min-w-[220px] border-t-2 border-t-dgt-blue bg-white py-2 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        to={child.href}
                        className="block px-4 py-2 text-sm text-[#555] hover:bg-[#f4f4f4] hover:text-dgt-blue"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="ml-auto flex min-w-0 items-center gap-1.5 sm:gap-3">
            <Link
              to="/verificar-permiso"
              className="inline-flex shrink-0 rounded-md bg-[#003d82] px-2.5 py-2 text-[11px] font-bold leading-tight text-white hover:bg-[#002a5c] sm:rounded-lg sm:px-4 sm:py-2.5 sm:text-sm"
            >
              Acceso a Mi DGT
            </Link>
            <button
              type="button"
              aria-label="Buscar"
              onClick={() => setSearchOpen((v) => !v)}
              className="shrink-0 p-1.5 text-[#003d82] hover:opacity-70"
            >
              <Search className="h-6 w-6" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      {searchOpen && (
        <div className="border-b bg-white">
          <form onSubmit={onSearch} className="container flex items-center gap-2 py-3">
            <Search className="h-5 w-5 shrink-0 text-[#003d82]" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar en DGT..."
              className="w-full border-0 py-2 text-sm outline-none"
            />
            <button
              type="submit"
              className="rounded-lg bg-[#003d82] px-4 py-2 text-sm font-semibold text-white"
            >
              Buscar
            </button>
          </form>
        </div>
      )}

      <div
        className={`fixed inset-0 z-[60] lg:hidden ${open ? '' : 'pointer-events-none'}`}
      >
        <button
          type="button"
          aria-label="Cerrar menú"
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setOpen(false)}
        />
        <aside
          className={`absolute right-0 top-0 flex h-full w-[80%] max-w-sm flex-col overflow-y-auto bg-white shadow-2xl transition-transform duration-300 ease-out ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between border-b px-4 py-3">
            <span className="text-sm font-semibold text-[#1a365d]">Menú</span>
            <button
              type="button"
              aria-label="Cerrar"
              className="p-1.5 text-[#003d82]"
              onClick={() => setOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="space-y-1 px-4 py-4">
            {mainNav.map((item) => (
              <div key={item.label}>
                <Link
                  to={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-2 font-semibold text-[#1a365d]"
                >
                  {item.label}
                </Link>
                {item.children?.map((child) => (
                  <Link
                    key={child.label}
                    to={child.href}
                    onClick={() => setOpen(false)}
                    className="block py-1 pl-4 text-sm text-[#666]"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ))}
            <div className="mt-3 space-y-2 border-t pt-3">
              {utilityLinks.map((l) => (
                <Link
                  key={l.label}
                  to={l.href}
                  onClick={() => setOpen(false)}
                  className="block text-sm text-[#666]"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                to="/verificar-permiso"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex rounded-lg bg-[#003d82] px-4 py-2 text-sm font-bold text-white"
              >
                Acceso a Mi DGT
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </header>
  )
}
