import type { ReactNode } from 'react'

type Props = {
  title: string
  subtitle: string
  children: ReactNode
}

export default function AdminAuthLayout({ title, subtitle, children }: Props) {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-[#0b1220] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#3b82f6]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 left-10 h-64 w-64 rounded-full bg-[#6366f1]/20 blur-3xl" />
        <div className="relative">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#3b82f6] text-sm font-bold">
            BO
          </span>
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Environnement de test
          </p>
          <h1 className="mt-3 max-w-md text-4xl font-semibold leading-tight">
            Back-office de démonstration
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
            Accès réservé aux comptes administrateur. Les données gérées ici
            sont fictives.
          </p>
        </div>
        <p className="relative text-xs text-slate-500">
          Données fictives — ne pas confondre avec un service officiel.
        </p>
      </section>

      <section className="flex items-center justify-center bg-[#f1f5f9] px-4 py-12">
        <div className="w-full max-w-[420px]">
          <div className="mb-8 lg:hidden">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0b1220] text-xs font-bold text-white">
              BO
            </span>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#3b82f6]">
              Administration
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">{title}</h2>
            <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
            <div className="mt-8">{children}</div>
          </div>
        </div>
      </section>
    </main>
  )
}

export const fieldClass =
  'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#3b82f6] focus:bg-white focus:ring-4 focus:ring-[#3b82f6]/15'

export const labelClass = 'mb-1.5 block text-sm font-medium text-slate-700'

export const primaryBtnClass =
  'w-full rounded-xl bg-[#0b1220] px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60'
