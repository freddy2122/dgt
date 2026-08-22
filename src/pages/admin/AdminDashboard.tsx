import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { List, ShieldCheck, ShieldAlert, ShieldOff } from 'lucide-react'
import { supabase } from '../../lib/supabase'

type Stats = {
  total: number
  active: number
  expired: number
  suspended: number
}

const cards = [
  { key: 'total' as const, label: 'Enregistrements', icon: List, tint: 'bg-slate-100 text-slate-700' },
  { key: 'active' as const, label: 'Actifs', icon: ShieldCheck, tint: 'bg-emerald-50 text-emerald-700' },
  { key: 'expired' as const, label: 'Expirés', icon: ShieldAlert, tint: 'bg-amber-50 text-amber-700' },
  { key: 'suspended' as const, label: 'Suspendus', icon: ShieldOff, tint: 'bg-rose-50 text-rose-700' },
]

export default function AdminDashboard() {
  const [email, setEmail] = useState<string | null>(null)
  const [stats, setStats] = useState<Stats>({ total: 0, active: 0, expired: 0, suspended: 0 })

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      setEmail(data.session?.user.email ?? null)
    })

    void supabase
      .from('licenses')
      .select('status')
      .then(({ data }) => {
        const rows = data ?? []
        setStats({
          total: rows.length,
          active: rows.filter((r) => r.status === 'Activo').length,
          expired: rows.filter((r) => r.status === 'Caducado').length,
          suspended: rows.filter((r) => r.status === 'Suspendido').length,
        })
      })
  }, [])

  return (
    <div>
      <p className="text-sm text-slate-500">Bonjour{email ? `, ${email}` : ''}</p>
      <h1 className="mt-1 text-2xl font-semibold text-slate-900">Tableau de bord</h1>
      <p className="mt-1 text-sm text-slate-500">Aperçu des enregistrements de démonstration.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ key, label, icon: Icon, tint }) => (
          <div
            key={key}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className={`inline-flex rounded-xl p-2 ${tint}`}>
              <Icon className="h-4 w-4" />
            </div>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{stats[key]}</p>
            <p className="mt-1 text-sm text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Raccourcis</h2>
        <p className="mt-1 text-sm text-slate-500">
          Accède à la liste pour consulter ou supprimer des enregistrements de test.
        </p>
        <Link
          to="/admin/licenses"
          className="mt-5 inline-flex rounded-xl bg-[#0b1220] px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Voir les enregistrements
        </Link>
      </div>
    </div>
  )
}
