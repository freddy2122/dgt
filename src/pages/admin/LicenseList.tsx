import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, RefreshCw } from 'lucide-react'
import { supabase } from '../../lib/supabase'

type License = {
  id: string
  identifier: string
  document_number: string
  first_name: string
  last_name: string
  birth_date: string | null
  categories: string[]
  status: 'Activo' | 'Caducado' | 'Suspendido'
  points_balance: number
  expiry_date: string | null
  photo_url: string | null
}

export default function LicenseList() {
  const [licenses, setLicenses] = useState<License[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadLicenses() {
    setLoading(true)
    setError('')

    const { data, error: queryError } = await supabase
      .from('licenses')
      .select(
        'id, identifier, document_number, first_name, last_name, birth_date, categories, status, points_balance, expiry_date, photo_url',
      )
      .order('created_at', { ascending: false })

    if (queryError) {
      setError(queryError.message)
      setLicenses([])
    } else {
      setLicenses(data ?? [])
    }

    setLoading(false)
  }

  useEffect(() => {
    loadLicenses()
  }, [])

  async function deleteLicense(id: string) {
    const confirmed = window.confirm(
      'Supprimer cette donnée fictive de démonstration ?',
    )

    if (!confirmed) return

    const { error: deleteError } = await supabase
      .from('licenses')
      .delete()
      .eq('id', id)

    if (deleteError) {
      setError(deleteError.message)
      return
    }

    setLicenses((current) => current.filter((license) => license.id !== id))
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Enregistrements</h1>
          <p className="mt-1 text-sm text-slate-500">
            Données de démonstration — environnement de test.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void loadLicenses()}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw className="h-4 w-4" />
            Actualiser
          </button>
          <Link
            to="/admin/license/new"
            className="inline-flex items-center gap-2 rounded-xl bg-[#0b1220] px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            Nouveau
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-10 text-center text-sm text-slate-500">Chargement…</div>
        ) : licenses.length === 0 ? (
          <div className="p-14 text-center">
            <h2 className="text-lg font-semibold text-slate-900">Aucun enregistrement</h2>
            <p className="mt-2 text-sm text-slate-500">
              Crée un premier enregistrement fictif pour tester le CRUD.
            </p>
            <Link
              to="/admin/license/new"
              className="mt-5 inline-flex rounded-xl bg-[#0b1220] px-5 py-2.5 text-sm font-semibold text-white"
            >
              Créer un enregistrement
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead className="border-b border-slate-100 bg-slate-50">
                <tr>
                  {['Image', 'Identifiant', 'Nom', 'Naissance', 'Catégories', 'État', 'Points', 'Expiration', 'Actions'].map(
                    (label) => (
                      <th
                        key={label}
                        className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500"
                      >
                        {label}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {licenses.map((license) => (
                  <tr key={license.id} className="hover:bg-slate-50/80">
                    <td className="px-5 py-4">
                      {license.photo_url ? (
                        <img
                          src={license.photo_url}
                          alt=""
                          className="h-11 w-11 rounded-lg object-cover"
                        />
                      ) : (
                        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-[10px] text-slate-400">
                          —
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-900">{license.identifier}</div>
                      <div className="text-xs text-slate-500">{license.document_number}</div>
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-800">
                      {license.first_name} {license.last_name}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {license.birth_date || '—'}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {license.categories?.join(', ') || '—'}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          license.status === 'Activo'
                            ? 'bg-emerald-50 text-emerald-700'
                            : license.status === 'Caducado'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {license.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-900">
                      {license.points_balance}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {license.expiry_date || '—'}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <Link
                          to={`/admin/license/${license.id}/edit`}
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                          title="Modifier"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => void deleteLicense(license.id)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <Link
                          to={`/admin/license/${license.id}/manage`}
                          className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                        >
                          Points
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
