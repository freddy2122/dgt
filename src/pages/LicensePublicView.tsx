import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import LicenseResult, {
  type LicenseRecord,
  type PointRow,
} from '../components/LicenseResult'

const SELECT =
  'id, identifier, document_number, first_name, last_name, birth_date, categories, status, points_balance, issue_date, expiry_date, photo_url'

const IDLE_MS = 30_000
const IDLE_EVENTS = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'] as const

export default function LicensePublicView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [license, setLicense] = useState<LicenseRecord | null>(null)
  const [history, setHistory] = useState<PointRow[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    async function load() {
      const { data, error: queryError } = await supabase
        .from('licenses')
        .select(SELECT)
        .eq('id', id)
        .maybeSingle()

      if (queryError) {
        setError(queryError.message)
        setLoading(false)
        return
      }

      if (!data) {
        setError('Registro no encontrado.')
        setLoading(false)
        return
      }

      const hist = await supabase
        .from('points_history')
        .select('created_at, points, type, description, balance_after')
        .eq('license_id', id)
        .order('created_at', { ascending: false })

      setLicense(data as LicenseRecord)
      setHistory((hist.data as PointRow[]) ?? [])
      setLoading(false)
    }

    void load()
  }, [id])

  useEffect(() => {
    if (!license) return

    let timer = 0
    const leave = () => {
      navigate('/verificar-permiso', { replace: true })
    }
    const reset = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(leave, IDLE_MS)
    }

    IDLE_EVENTS.forEach((event) =>
      window.addEventListener(event, reset, { passive: true }),
    )
    reset()

    return () => {
      window.clearTimeout(timer)
      IDLE_EVENTS.forEach((event) => window.removeEventListener(event, reset))
    }
  }, [license, navigate])

  if (loading) {
    return (
      <div className="py-16 text-center text-sm text-gray-500">Cargando…</div>
    )
  }

  if (error || !license) {
    return (
      <div className="py-16 text-center text-sm text-red-700">
        {error || 'Registro no encontrado.'}
      </div>
    )
  }

  return <LicenseResult license={license} history={history} />
}
