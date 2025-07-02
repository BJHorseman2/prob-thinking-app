import { createClient } from '@supabase/supabase-js'

// Check if Supabase is configured
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

// Create the Supabase client if configured
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : createMockClient()

// Mock client for when Supabase is not configured
function createMockClient(): any {
  const mockResponse = {
    data: null,
    error: { message: 'Supabase not configured - using localStorage' }
  }

  const mockSuccessResponse = {
    data: [],
    error: null
  }

  const mockBuilder: any = {
    select: () => mockBuilder,
    order: () => mockBuilder,
    limit: () => Promise.resolve(mockSuccessResponse),
    eq: () => mockBuilder,
    single: () => Promise.resolve(mockResponse),
    in: () => mockBuilder,
    from: () => mockBuilder,
    insert: () => mockBuilder,
    update: () => mockBuilder,
    upsert: () => Promise.resolve(mockResponse)
  }

  return {
    from: () => mockBuilder,
    auth: {
      signUp: () => Promise.resolve({
        data: { user: null, session: null },
        error: { message: 'Supabase not configured' }
      }),
      signInWithPassword: () => Promise.resolve({
        data: { user: null, session: null },
        error: { message: 'Supabase not configured' }
      }),
      signOut: () => Promise.resolve({ error: null }),
      getSession: () => Promise.resolve({
        data: { session: null },
        error: null
      }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} }},
        error: null
      })
    },
    channel: () => ({
      on: () => ({
        subscribe: () => ({
          unsubscribe: () => {}
        })
      })
    }),
    removeChannel: () => {}
  }
}

// Database types
export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          email: string
          username?: string
          score: number
          rank?: number
          streak: number
          crowd_beats: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          username?: string
          score?: number
          rank?: number
          streak?: number
          crowd_beats?: number
        }
        Update: {
          username?: string
          score?: number
          rank?: number
          streak?: number
          crowd_beats?: number
        }
      }
      predictions: {
        Row: {
          id: string
          user_id: string
          question: string
          prediction: number
          confidence: number
          reasoning?: string
          bias_check?: string
          status: string
          points_earned: number
          created_at: string
        }
        Insert: {
          user_id: string
          question: string
          prediction: number
          confidence: number
          reasoning?: string
          bias_check?: string
          status?: string
          points_earned?: number
        }
      }
      badges: {
        Row: {
          id: string
          user_id: string
          badge_id: string
          earned_at: string
          minted: boolean
          minted_at?: string
          tx_hash?: string
        }
        Insert: {
          user_id: string
          badge_id: string
          minted?: boolean
          minted_at?: string
          tx_hash?: string
        }
      }
      completed_challenges: {
        Row: {
          id: string
          user_id: string
          challenge_id: string
          completed_at: string
        }
        Insert: {
          user_id: string
          challenge_id: string
        }
      }
      user_bets: {
        Row: {
          id: string
          user_id: string
          market_id: string
          position: string
          amount: number
          created_at: string
        }
        Insert: {
          user_id: string
          market_id: string
          position: string
          amount: number
        }
      }
    }
  }
} 