import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://rlcvgjqxrmeezgwpcaaf.supabase.co'

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_zFD8veGO4xmNu3ZsUJOZdw_xOX3PxO0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
