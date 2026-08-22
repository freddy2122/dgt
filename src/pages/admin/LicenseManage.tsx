import { useEffect, useState, type SubmitEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { fieldClass, labelClass } from '../../components/admin/AdminAuthLayout'

type Movement = {
  id: string
  type: string
  points: number
  description: string | null
  created_at: string
}

export default function LicenseManage() {
  const { id } = useParams()
  const [identifier, setIdentifier] = useState('')
  const [balance, setBalance] = useState(0)
  const [history, setHistory] = useState<Movement[]>([])
  const [points, setPoints] = useState('1')
  const [description, setDescription] = useState('Bonificación de puntos')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  async function load() {
    if (!id) return
    setError('')

    const licenseRes = await supabase
      .from('licenses')
      .select('identifier, points_balance')
      .eq('id', id)
      .maybeSingle()

    if (licenseRes.error) {
      setError(licenseRes.error.message)
      setLoading(false)
      return
    }

    if (!licenseRes.data) {
      setError('Enregistrement introuvable.')
      setLoading(false)
      return
    }

    setIdentifier(licenseRes.data.identifier)
    setBalance(licenseRes.data.points_balance ?? 0)

    const histRes = await supabase
      .from('points_history')
      .select('id, type, points, description, created_at')
      .eq('license_id', id)
      .order('created_at', { ascending: false })

    setHistory(histRes.data ?? [])
    if (histRes.error) setError(histRes.error.message)
    setLoading(false)
  }

  useEffect(() => {
    void load()
  }, [id])

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!id) return

    const delta = Number(points)

    if (!Number.isInteger(delta) || delta <= 0) {
      setError('Indique un nombre entier de points supérieur à 0.')
      return
    }

    const next = balance + delta

    setSaving(true)
    setError('')

    const { error: updateError } = await supabase
      .from('licenses')
      .update({
        points_balance: next,
      })
      .eq('id', id)

    if (updateError) {
      setSaving(false)
      setError(updateError.message)
      return
    }

    const { error: insertError } = await supabase.from('points_history').insert({
      license_id: id,
      type: 'Bonificación de puntos',
      points: delta,
      description: description.trim() || 'Bonificación de puntos',
      balance_after: next,
    })

    if (insertError) {
      setSaving(false)
      setError(insertError.message)
      return
    }

    setPoints('1')
    setSaving(false)

    await load()
  }

  if (loading) {
    return <p className="text-sm text-slate-500">Chargement…</p>
  }

  return (
    <div className="max-w-3xl">
      <Link to="/admin/licenses" className="text-sm font-medium text-slate-500 hover:text-slate-800">
        ← Enregistrements
      </Link>
      <h1 className="mt-3 text-2xl font-semibold text-slate-900">Mouvements de points</h1>
      <p className="mt-1 text-sm text-slate-500">
        {identifier || 'Enregistrement'} — solde actuel <strong>{balance}</strong>
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h2 className="text-base font-semibold text-slate-900">Ajouter un mouvement</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="points" className={labelClass}>
              Points (+ ou −)
            </label>
            <input
              id="points"
              type="number"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              className={fieldClass}
              required
            />
          </div>
          <div>
            <label htmlFor="description" className={labelClass}>
              Description
            </label>
            <input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={fieldClass}
            />
          </div>
        </div>
        {error && (
          <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}
        <button
          type="submit"
          disabled={saving}
          className="mt-5 rounded-xl bg-[#0b1220] px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {saving ? 'Ajout…' : 'Sumar puntos'}
        </button>
      </form>

      <div className="mt-6 min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {history.length === 0 ? (
          <p className="p-8 text-center text-sm text-slate-500">Aucun mouvement.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50">
              <tr>
                <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">Date</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">Type</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">Points</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.map((row) => (
                <tr key={row.id}>
                  <td className="px-5 py-3 text-slate-600">
                    {new Date(row.created_at).toLocaleString()}
                  </td>
                  <td className="px-5 py-3">{row.type}</td>
                  <td className="px-5 py-3 font-semibold">{row.points}</td>
                  <td className="px-5 py-3 text-slate-500">{row.description || '—'}</td>
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
