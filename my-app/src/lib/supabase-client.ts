// Supabase configuration with fallback
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Dynamic import to avoid build errors when Supabase is not installed
let supabase: any = null

if (typeof window !== 'undefined' && supabaseUrl && supabaseAnonKey) {
  import('@supabase/supabase-js').then(({ createClient }) => {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
  }).catch(() => {
    console.log('Supabase not available, using localStorage only')
  })
}

export { supabase }

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return supabase !== null
}

// Wrapper functions that fallback to localStorage
export const supabaseHelpers = {
  async signIn(email: string, password: string) {
    if (!supabase) {
      // Fallback to localStorage
      localStorage.setItem('user', JSON.stringify({ email }))
      return { error: null }
    }
    return await supabase.auth.signInWithPassword({ email, password })
  },
  
  async signUp(email: string, password: string) {
    if (!supabase) {
      // Fallback to localStorage
      localStorage.setItem('user', JSON.stringify({ email }))
      return { error: null }
    }
    return await supabase.auth.signUp({ email, password })
  },
  
  async signOut() {
    if (!supabase) {
      localStorage.removeItem('user')
      return { error: null }
    }
    return await supabase.auth.signOut()
  },
  
  async getUser() {
    if (!supabase) {
      const stored = localStorage.getItem('user')
      return stored ? JSON.parse(stored) : null
    }
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }
} 