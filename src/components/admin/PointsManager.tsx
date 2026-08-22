import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { supabase } from '../../lib/supabase'

type Props = {
  licenseId: string
  currentBalance: number
  onBalanceChange: (balance: number) => void
}

export default function PointsManager({
  licenseId,
  currentBalance,
  onBalanceChange,
}: Props) {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function changePoints(delta: number) {
    const value = Number(amount)

    if (!Number.isInteger(value) || value <= 0) {
      setError('Indique un nombre entier de points supérieur à 0.')
      return
    }

    const newBalance = Math.max(0, currentBalance + delta * value)

    setLoading(true)
    setError('')

    const { error: historyError } = await supabase
      .from('points_history')
      .insert({
        license_id: licenseId,
        points: delta * value,
        moment:
          delta > 0
            ? 'Bonificación de puntos'
            : 'Ajuste de puntos',
        balance_after: newBalance,
        status: 'Activo',
      })

    if (historyError) {
      setError(historyError.message)
      setLoading(false)
      return
    }

    const { error: updateError } = await supabase
      .from('licenses')
      .update({
        points_balance: newBalance,
      })
      .eq('id', licenseId)

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    onBalanceChange(newBalance)
    setAmount('')
    setLoading(false)
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#003d82]">
          Gestión de puntos
        </p>

        <h2 className="mt-1 text-xl font-bold text-[#172b4d]">
          Solde actuel
        </h2>
      </div>

      <div className="mb-6 rounded-xl bg-gray-5p-6 text-center">
        <div className="text-4xl font-bold text-[#003d82]">
          {currentBalance}
        </div>

        <div className="mt-1 text-sm text-gray-500">
          puntos — données fictives
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="number"
          min="1"
          step="1"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="Nombre de points"
          className="flex-1 rounded-lg border border-gray-300 px-4 py-3 outline-none fs:border-[#003d82]"
        />

        <button
          type="button"
          disabled={loading}
          onClick={() => changePoints(1)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#003d82] px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          Sumar puntos
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={() => changePoints(-1)}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-5 py-3 text-sm font-bold text-gray-700 disabled:opacity-50"
        >
          <Minus className="h-4 w-4" />
          Ajustar
        </button>
      </div>

      <p className="mt-4 text-xs text-gray-500">
        Environnement de démonstration — données fictives uniquement.
      </p>
    </div>
  )
}
