'use client'

import { supabase, isSupabaseConfigured } from './supabase-client'

interface UserProfile {
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

interface Prediction {
  id: string
  user_email: string
  question: string
  prediction: number
  confidence: number
  reasoning: string
  bias_check: string
  created_at: string
  status: string
  points_earned: number
}

interface Badge {
  id: string
  user_id: string
  badge_id: string
  earned_at: string
  minted: boolean
}

export class DataService {
  // User Profile Management
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) {
        console.error('Error fetching user profile:', error)
        return null
      }
      
      return data
    } else {
      // Fallback to localStorage
      const storedProfile = localStorage.getItem(`userProfile_${userId}`)
      return storedProfile ? JSON.parse(storedProfile) : null
    }
  }

  static async createUserProfile(userId: string, email: string): Promise<UserProfile | null> {
    const profile: Partial<UserProfile> = {
      id: userId,
      email,
      score: 0,
      streak: 0,
      crowd_beats: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert(profile)
        .select()
        .single()
      
      if (error) {
        console.error('Error creating user profile:', error)
        return null
      }
      
      return data
    } else {
      // Fallback to localStorage
      const fullProfile = profile as UserProfile
      localStorage.setItem(`userProfile_${userId}`, JSON.stringify(fullProfile))
      return fullProfile
    }
  }

  static async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single()
      
      if (error) {
        console.error('Error updating user profile:', error)
        return null
      }
      
      return data
    } else {
      // Fallback to localStorage
      const existing = await this.getUserProfile(userId)
      if (existing) {
        const updated = { ...existing, ...updates, updated_at: new Date().toISOString() }
        localStorage.setItem(`userProfile_${userId}`, JSON.stringify(updated))
        return updated
      }
      return null
    }
  }

  // Leaderboard
  static async getLeaderboard(limit: number = 10): Promise<UserProfile[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('score', { ascending: false })
        .limit(limit)
      
      if (error) {
        console.error('Error fetching leaderboard:', error)
        return []
      }
      
      return data || []
    } else {
      // Fallback to localStorage - this is limited as we can't easily query all users
      const mockLeaderboard: UserProfile[] = [
        {
          id: '1',
          email: 'alice@example.com',
          username: 'alice',
          score: 1250,
          rank: 1,
          streak: 7,
          crowd_beats: 15,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2', 
          email: 'bob@example.com',
          username: 'bob',
          score: 980,
          rank: 2,
          streak: 3,
          crowd_beats: 8,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
      
      return mockLeaderboard
    }
  }

  // Predictions
  static async createPrediction(userId: string, prediction: Omit<Prediction, 'id' | 'created_at'>): Promise<Prediction | null> {
    const newPrediction = {
      ...prediction,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString()
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('predictions')
        .insert({
          user_id: userId,
          question: prediction.question,
          prediction: prediction.prediction,
          confidence: prediction.confidence,
          reasoning: prediction.reasoning,
          bias_check: prediction.bias_check,
          status: prediction.status,
          points_earned: prediction.points_earned
        })
        .select()
        .single()
      
      if (error) {
        console.error('Error creating prediction:', error)
        return null
      }
      
      return { ...data, user_email: prediction.user_email }
    } else {
      // Fallback to localStorage
      const predictions = JSON.parse(localStorage.getItem('predictions') || '[]')
      predictions.push(newPrediction)
      localStorage.setItem('predictions', JSON.stringify(predictions))
      return newPrediction
    }
  }

  static async getUserPredictions(userId: string): Promise<Prediction[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching predictions:', error)
        return []
      }
      
      return data?.map((p: any) => ({ ...p, user_email: '' })) || []
    } else {
      // Fallback to localStorage
      const predictions = JSON.parse(localStorage.getItem('predictions') || '[]')
      return predictions.filter((p: Prediction) => p.user_email === userId)
    }
  }

  // Badges
  static async getUserBadges(userId: string): Promise<Badge[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('badges')
        .select('*')
        .eq('user_id', userId)
        .order('earned_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching badges:', error)
        return []
      }
      
      return data || []
    } else {
      // Fallback to localStorage
      const badges = JSON.parse(localStorage.getItem(`badges_${userId}`) || '[]')
      return badges
    }
  }

  static async awardBadge(userId: string, badgeId: string): Promise<Badge | null> {
    const badge: Badge = {
      id: crypto.randomUUID(),
      user_id: userId,
      badge_id: badgeId,
      earned_at: new Date().toISOString(),
      minted: false
    }

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('badges')
        .insert(badge)
        .select()
        .single()
      
      if (error) {
        console.error('Error awarding badge:', error)
        return null
      }
      
      return data
    } else {
      // Fallback to localStorage
      const badges = JSON.parse(localStorage.getItem(`badges_${userId}`) || '[]')
      
      // Check if badge already exists
      if (badges.some((b: Badge) => b.badge_id === badgeId)) {
        return null // Badge already earned
      }
      
      badges.push(badge)
      localStorage.setItem(`badges_${userId}`, JSON.stringify(badges))
      return badge
    }
  }

  // Challenge completion tracking
  static async markChallengeCompleted(userId: string, challengeId: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('completed_challenges')
        .insert({
          user_id: userId,
          challenge_id: challengeId
        })
      
      if (error) {
        console.error('Error marking challenge completed:', error)
        return false
      }
      
      return true
    } else {
      // Fallback to localStorage
      const completed = JSON.parse(localStorage.getItem(`completed_challenges_${userId}`) || '[]')
      if (!completed.includes(challengeId)) {
        completed.push(challengeId)
        localStorage.setItem(`completed_challenges_${userId}`, JSON.stringify(completed))
      }
      return true
    }
  }

  static async hasCompletedChallenge(userId: string, challengeId: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('completed_challenges')
        .select('id')
        .eq('user_id', userId)
        .eq('challenge_id', challengeId)
        .single()
      
      if (error) {
        return false
      }
      
      return !!data
    } else {
      // Fallback to localStorage
      const completed = JSON.parse(localStorage.getItem(`completed_challenges_${userId}`) || '[]')
      return completed.includes(challengeId)
    }
  }
}