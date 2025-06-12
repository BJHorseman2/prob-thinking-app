import { createClient } from '@supabase/supabase-js'

// Supabase configuration with fallback
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Only create client if both values exist
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

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