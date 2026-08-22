import { useState, type SubmitEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import AdminAuthLayout, {
  fieldClass,
  labelClass,
  primaryBtnClass,
} from '../../components/admin/AdminAuthLayout'

export default function AdminRegister() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    setError('')
    setSuccess('')

    if (!name.trim() || !email.trim() || password.length < 8) {
      setError(
        'Veuillez renseigner le nom, un email valide et un mot de passe de 8 caractères minimum.',
      )
      return
    }

    setLoading(true)

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { name: name.trim() },
        },
      })

      if (signUpError) {
        const already =
          signUpError.status === 422 ||
          /already registered|already exists/i.test(signUpError.message)

        throw new Error(
          already
            ? 'Cet email existe déjà dans Authentication. Va dans Supabase → Authentication → Users, supprime cet utilisateur, puis réessaie. S’il a déjà une ligne dans admin_users, utilise plutôt « Retour à la connexion ».'
            : signUpError.message,
        )
      }

      if (!data.user) {
        throw new Error('Impossible de créer le compte.')
      }

      if (!data.session) {
        throw new Error(
          'Compte Auth créé, mais sans session : la confirmation d’email est activée. Dans Supabase → Authentication → Providers → Email, désactive « Confirm email », puis réessaie (ou confirme le mail).',
        )
      }

      const { error: profileError } = await supabase
        .from('admin_users')
        .insert({
          auth_user_id: data.user.id,
          email: email.trim(),
          name: name.trim(),
          role: 'admin',
          is_active: true,
        })

      if (profileError) {
        throw new Error(
          profileError.code === '42501' ||
            /row-level security|permission denied|403/i.test(profileError.message)
            ? '403 RLS : exécute supabase/admin_users_rls.sql dans SQL Editor (policy INSERT authenticated).'
            : profileError.message,
        )
      }

      setSuccess('Compte administrateur créé avec succès.')

      setTimeout(() => {
        navigate('/admin-login')
      }, 1200)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Une erreur est survenue lors de la création du compte.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminAuthLayout
      title="Créer un administrateur"
      subtitle="Compte technique pour l’environnement de démonstration."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className={labelClass}>
            Nom
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={fieldClass}
            placeholder="Administrateur Test"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={fieldClass}
            placeholder="admin@test.local"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className={labelClass}>
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={fieldClass}
            placeholder="Minimum 8 caractères"
            minLength={8}
            required
          />
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        )}

        <button type="submit" disabled={loading} className={primaryBtnClass}>
          {loading ? 'Création…' : 'Créer le compte'}
        </button>
      </form>

      <div className="mt-6 border-t border-slate-100 pt-5 text-center">
        <Link
          to="/admin-login"
          className="text-sm font-semibold text-slate-700 hover:text-slate-900"
        >
          Retour à la connexion
        </Link>
      </div>
    </AdminAuthLayout>
  )
}