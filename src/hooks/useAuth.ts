'use client'

import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase-client'
import type { User, Session } from '@supabase/supabase-js'

interface AuthUser {
  id: string
  email: string
  username?: string
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      if (typeof window === 'undefined') {
        setLoading(false)
        return
      }
      
      if (isSupabaseConfigured) {
        const { data: { session } } = await supabase.auth.getSession()
        setSession(session)
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            username: session.user.user_metadata?.username
          })
        }
      } else {
        // Fallback to localStorage
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      }
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    if (isSupabaseConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event: any, session: any) => {
          setSession(session)
          if (session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email!,
              username: session.user.user_metadata?.username
            })
          } else {
            setUser(null)
          }
          setLoading(false)
        }
      )

      return () => subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string) => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      return { data, error }
    } else {
      // Mock sign up for localStorage fallback
      const mockUser = { id: Date.now().toString(), email }
      localStorage.setItem('user', JSON.stringify(mockUser))
      setUser(mockUser)
      return { data: { user: mockUser, session: null }, error: null }
    }
  }

  const signIn = async (email: string, password: string) => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { data, error }
    } else {
      // Mock sign in for localStorage fallback
      const mockUser = { id: Date.now().toString(), email }
      localStorage.setItem('user', JSON.stringify(mockUser))
      setUser(mockUser)
      return { data: { user: mockUser, session: null }, error: null }
    }
  }

  const signOut = async () => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.signOut()
      return { error }
    } else {
      // Mock sign out for localStorage fallback
      localStorage.removeItem('user')
      setUser(null)
      return { error: null }
    }
  }

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    isSupabaseConfigured
  }
}