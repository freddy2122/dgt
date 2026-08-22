import { useState, type SubmitEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import AdminAuthLayout, {
  fieldClass,
  labelClass,
  primaryBtnClass,
} from '../../components/admin/AdminAuthLayout'

export default function AdminLogin() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (!email.trim() || !password) {
      setError('Veuillez renseigner l’email et le mot de passe.')
      return
    }

    setLoading(true)

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (signInError) {
        throw signInError
      }

      if (!data.user) {
        throw new Error('Connexion impossible.')
      }

      let { data: profile, error: profileError } = await supabase
        .from('admin_users')
        .select('id, is_active')
        .eq('auth_user_id', data.user.id)
        .maybeSingle()

      if (profileError) {
        await supabase.auth.signOut()
        throw new Error(profileError.message)
      }

      if (!profile) {
        const { error: insertError } = await supabase.from('admin_users').insert({
          auth_user_id: data.user.id,
          email: data.user.email,
          name:
            typeof data.user.user_metadata?.name === 'string'
              ? data.user.user_metadata.name
              : 'Admin',
          role: 'admin',
          is_active: true,
        })

        if (insertError) {
          await supabase.auth.signOut()
          throw new Error(
            /duplicate|unique/i.test(insertError.message)
              ? 'Une ligne admin_users existe déjà mais le SELECT est bloqué par RLS. Exécute supabase/admin_users_rls.sql dans SQL Editor.'
              : `Impossible de créer le profil admin : ${insertError.message}`,
          )
        }

        const retry = await supabase
          .from('admin_users')
          .select('id, is_active')
          .eq('auth_user_id', data.user.id)
          .maybeSingle()

        profile = retry.data
        profileError = retry.error

        if (profileError) {
          await supabase.auth.signOut()
          throw new Error(profileError.message)
        }
      }

      if (!profile || profile.is_active === false) {
        await supabase.auth.signOut()
        throw new Error(
          'Accès refusé : profil admin introuvable ou inactif. Dans SQL Editor, exécute supabase/link_auth_admin.sql.',
        )
      }

      navigate('/admin')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Une erreur est survenue lors de la connexion.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminAuthLayout
      title="Connexion"
      subtitle="Accès restreint au personnel autorisé."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
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
            required
          />
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <button type="submit" disabled={loading} className={primaryBtnClass}>
          {loading ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>
    </AdminAuthLayout>
  )
}
