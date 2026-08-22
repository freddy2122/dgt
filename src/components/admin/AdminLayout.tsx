import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, List, LogOut, Menu, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const nav = [
  { to: '/admin', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
  { to: '/admin/licenses', label: 'Enregistrements', icon: List, end: false },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const [email, setEmail] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function guard() {
      const { data } = await supabase.auth.getSession()
      if (cancelled) return
      if (!data.session) {
        navigate('/admin-login', { replace: true })
        return
      }
      setEmail(data.session.user.email ?? null)
      setReady(true)
    }

    void guard()
    return () => {
      cancelled = true
    }
  }, [navigate])

  async function logout() {
    await supabase.auth.signOut()
    navigate('/admin-login')
  }

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#0b1220] text-sm text-slate-400">
        Chargement du back-office…
      </div>
    )
  }

  const links = (
    <nav className="flex flex-1 flex-col gap-1 px-3">
      {nav.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              isActive
                ? 'bg-white/10 text-white'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`
          }
        >
          <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
          {label}
        </NavLink>
      ))}
    </nav>
  )

  return (
    <div className="min-h-dvh overflow-x-hidden bg-[#f1f5f9]">
      {open && (
        <button
          type="button"
          aria-label="Fermer le menu"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[min(16rem,85vw)] flex-col bg-[#0b1220] text-white transition-transform duration-200 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-3 px-5 py-6">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#3b82f6] text-sm font-bold">
            BO
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold">Back-office</p>
            <p className="text-[11px] text-slate-400">Environnement de test</p>
          </div>
        </div>

        {links}

        <div className="mt-auto border-t border-white/10 p-4">
          <p className="truncate px-1 text-xs text-slate-400">{email}</p>
          <button
            type="button"
            onClick={() => void logout()}
            className="mt-3 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Déconnexion
          </button>
        </div>
      </aside>

      <div className="min-w-0 lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-slate-200 bg-white/90 px-3 py-3 backdrop-blur sm:px-6 md:px-8">
          <button
            type="button"
            className="shrink-0 rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Ouvrir le menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <p className="min-w-0 truncate text-sm font-medium text-slate-700">
            Console d’administration
          </p>
          <span className="ml-auto shrink-0 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-700 sm:px-3 sm:text-[11px]">
            Test
          </span>
        </header>

        <div className="min-w-0 px-3 py-5 sm:px-6 sm:py-8 md:px-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
