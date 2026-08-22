import { useEffect, useState, type SubmitEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save, ImagePlus } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { fieldClass, labelClass } from '../../components/admin/AdminAuthLayout'

type FormData = {
  identifier: string
  document_number: string
  first_name: string
  last_name: string
  birth_date: string
  categories: string
  status: 'Activo' | 'Caducado' | 'Suspendido'
  points_balance: string
  issue_date: string
  expiry_date: string
  photo_url: string
}

const initialForm: FormData = {
  identifier: '',
  document_number: '',
  first_name: '',
  last_name: '',
  birth_date: '',
  categories: 'B',
  status: 'Activo',
  points_balance: '0',
  issue_date: '',
  expiry_date: '',
  photo_url: '',
}

const MAX_PHOTO_BYTES = 2 * 1024 * 1024
const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export default function LicenseForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const editing = Boolean(id)

  const [form, setForm] = useState<FormData>(initialForm)
  const [loading, setLoading] = useState(editing)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState('')

  useEffect(() => {
    if (!id) return

    async function load() {
      const { data, error: queryError } = await supabase
        .from('licenses')
        .select(
          'identifier, document_number, first_name, last_name, birth_date, categories, status, points_balance, issue_date, expiry_date, photo_url',
        )
        .eq('id', id)
        .single()

      if (queryError) {
        setError(queryError.message)
      } else if (data) {
        setForm({
          identifier: data.identifier ?? '',
          document_number: data.document_number ?? '',
          first_name: data.first_name ?? '',
          last_name: data.last_name ?? '',
          birth_date: String(data.birth_date ?? '').slice(0, 10),
          categories: Array.isArray(data.categories)
            ? data.categories.join(', ')
            : (data.categories ?? 'B'),
          status: data.status ?? 'Activo',
          points_balance: String(data.points_balance ?? 0),
          issue_date: String(data.issue_date ?? '').slice(0, 10),
          expiry_date: String(data.expiry_date ?? '').slice(0, 10),
          photo_url: data.photo_url ?? '',
        })
        setPhotoPreview(data.photo_url ?? '')
      }

      setLoading(false)
    }

    void load()
  }, [id])

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function onPhotoChange(file: File | undefined) {
    if (!file) return
    if (!PHOTO_TYPES.includes(file.type)) {
      setError('Image JPG, PNG ou WebP uniquement.')
      return
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setError('Image trop lourde (max 2 Mo).')
      return
    }
    setError('')
    setPhotoFile(file)
    setPhotoPreview((current) => {
      if (current.startsWith('blob:')) URL.revokeObjectURL(current)
      return URL.createObjectURL(file)
    })
  }

  async function uploadPhoto(file: File) {
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const path = `${crypto.randomUUID()}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('license-photos')
      .upload(path, file, { contentType: file.type, upsert: false })

    if (uploadError) {
      throw uploadError
    }

    const { data } = supabase.storage.from('license-photos').getPublicUrl(path)
    return data.publicUrl
  }

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError('')

    let photoUrl = form.photo_url

    try {
      if (photoFile) {
        photoUrl = await uploadPhoto(photoFile)
      }
    } catch (err) {
      setSaving(false)
      setError(
        err instanceof Error
          ? `Upload image : ${err.message}. Crée un bucket public « license-photos » dans Supabase Storage.`
          : 'Échec de l’upload image.',
      )
      return
    }

    const payload = {
      identifier: form.identifier.trim(),
      document_number: form.document_number.trim(),
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      birth_date: form.birth_date || null,
      categories: form.categories
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      status: form.status,
      points_balance: Number(form.points_balance) || 0,
      issue_date: form.issue_date || null,
      expiry_date: form.expiry_date || null,
      photo_url: photoUrl || null,
    }

    const result = editing
      ? await supabase.from('licenses').update(payload).eq('id', id)
      : await supabase.from('licenses').insert(payload)

    if (result.error) {
      setError(result.error.message)
      setSaving(false)
      return
    }

    navigate('/admin/licenses')
  }

  if (loading) {
    return <p className="text-sm text-slate-500">Chargement…</p>
  }

  return (
    <div className="max-w-3xl">
      <Link
        to="/admin/licenses"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux données de test
      </Link>

      <h1 className="mt-3 text-2xl font-semibold text-slate-900">
        {editing ? 'Modifier un record' : 'Nouveau record'}
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Toutes les informations saisies ici sont des données fictives de démonstration.
      </p>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        {error && (
          <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        <form onSubmit={submit} className="space-y-6">
          <div>
            <p className={labelClass}>Image</p>
            <div className="flex items-center gap-4">
              <label className="flex h-28 w-28 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50 hover:border-slate-400">
                {photoPreview ? (
                  <img src={photoPreview} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="flex flex-col items-center gap-1 text-slate-400">
                    <ImagePlus className="h-6 w-6" />
                    <span className="text-[11px] font-medium">Ajouter</span>
                  </span>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(event) => onPhotoChange(event.target.files?.[0])}
                />
              </label>
              <p className="text-xs text-slate-500">
                JPG, PNG ou WebP — 2 Mo max.
                {photoPreview ? (
                  <>
                    <br />
                    <button
                      type="button"
                      className="mt-1 font-semibold text-rose-600"
                      onClick={() => {
                        setPhotoFile(null)
                        setPhotoPreview('')
                        update('photo_url', '')
                      }}
                    >
                      Retirer l’image
                    </button>
                  </>
                ) : null}
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Identifiant de test"
              value={form.identifier}
              onChange={(value) => update('identifier', value)}
              placeholder="TEST-0001"
              required
            />
            <Field
              label="Référence du record"
              value={form.document_number}
              onChange={(value) => update('document_number', value)}
              placeholder="DEMO-0001"
              required
            />
            <Field
              label="Prénom fictif"
              value={form.first_name}
              onChange={(value) => update('first_name', value)}
              placeholder="Alex"
              required
            />
            <Field
              label="Nom fictif"
              value={form.last_name}
              onChange={(value) => update('last_name', value)}
              placeholder="TEST"
              required
            />
            <Field
              label="Date de naissance"
              type="date"
              value={form.birth_date}
              onChange={(value) => update('birth_date', value)}
              required
            />
            <Field
              label="Catégories"
              value={form.categories}
              onChange={(value) => update('categories', value)}
              placeholder="B"
            />
            <div>
              <label className={labelClass}>État</label>
              <select
                value={form.status}
                onChange={(event) =>
                  update('status', event.target.value as FormData['status'])
                }
                className={fieldClass}
              >
                <option value="Activo">Activo</option>
                <option value="Caducado">Caducado</option>
                <option value="Suspendido">Suspendido</option>
              </select>
            </div>
            <Field
              label="Points de démonstration"
              type="number"
              min="0"
              value={form.points_balance}
              onChange={(value) => update('points_balance', value)}
            />
            <Field
              label="Date d'émission (4a)"
              type="date"
              value={form.issue_date}
              onChange={(value) => update('issue_date', value)}
            />
            <Field
              label="Date d'expiration (4b)"
              type="date"
              value={form.expiry_date}
              onChange={(value) => update('expiry_date', value)}
            />
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Mode démonstration : aucun numéro officiel, document réel ou QR
            officiel n’est généré.
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-6">
            <Link
              to="/admin/licenses"
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0b1220] px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Enregistrement…' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
  min,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
  required?: boolean
  min?: string
}) {
  return (
    <div>
      <label className={labelClass}>
        {label}
        {required ? <span className="ml-1 text-red-500">*</span> : null}
      </label>
      <input
        type={type}
        value={value}
        min={min}
        required={required}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={fieldClass}
      />
    </div>
  )
}
