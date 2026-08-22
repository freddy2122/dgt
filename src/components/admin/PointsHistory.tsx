import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

type HistoryItem = {
  id: string
  points: number
  movement: string
  balance_after: number
  status: string
  created_at: string
}

type Props = {
  licenseId: string
}

export default function PointsHistory({ licenseId }: Props) {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadHistory() {
    setLoading(true)
    setError('')

    const { data, error: queryError } = await supabase
      .from('points_history')
      .select(
        'id, points, movement, balance_after, status, created_at',
      )
      .eq('license_id', licenseId)
      .order('created_at', { ascending: false })

    if (queryError) {
      setError(queryError.message)
      setHistory([])
    } else {
      setHistory(data ?? [])
    }

    setLoading(false)
  }

  useEffect(() => {
    loadHistory()
  }, [licenseId])

  return (
    <div className="rounded-2xl bg-white shadow-sm">
      <div className="border-b px-6 py-5">
        <h2 className="text-xl font-bold text-[#172b4d]">
          Historial de puntos
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Historique des mouvements du dossier de test.
        </p>
      </div>

      {error && (
        <div className="m-6 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="p-8 text-center text-gray-500">
          Chargement...
        </div>
      ) : history.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          Aucun mouvement de points.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500">
                  Date
                </th>

                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500">
                  Points
                </th>

                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500">
                  Mouvement
                </th>

                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500">
                  Solde
                </th>

                <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500">
                  État
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">              {history.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(item.created_at).toLocaleString('fr-FR')}
                  </td>

                  <td className="px-6 py-4 font-bold">
                    {item.points > 0 ? '+' : ''}
                    {item.points}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-700">
                    {item.movement}
                  </td>

                  <td className="px-6 py-4 font-bold text-[#003d82]">
                    {item.balance_after}
                  </td>

                  <td className="px-6 py-4">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="border-t px-6 py-4 text-center text-xs font-semibold text-gray-500">
        DONNÉES FICTIVES — ENVIRONNEMENT DE TEST
      </div>
    </div>
  )
}
