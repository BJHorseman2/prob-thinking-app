'use client'

import { useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase-client'

export function useSupabaseSync(userId: string | null, localData: any) {
  // Sync user profile data
  const syncUserProfile = useCallback(async () => {
    if (!isSupabaseConfigured() || !userId || !supabase) return

    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: userId,
          score: localData.score,
          streak: localData.streak,
          crowd_beats: localData.crowdBeats,
          updated_at: new Date().toISOString()
        })

      if (error) console.error('Error syncing profile:', error)
    } catch (err) {
      console.error('Sync error:', err)
    }
  }, [userId, localData.score, localData.streak, localData.crowdBeats])

  // Sync badges
  const syncBadges = useCallback(async () => {
    if (!isSupabaseConfigured() || !userId || !localData.badges || !supabase) return

    try {
      // Get existing badges from Supabase
      const { data: existingBadges } = await supabase
        .from('badges')
        .select('badge_id')
        .eq('user_id', userId)

      const existingBadgeIds = existingBadges?.map(b => b.badge_id) || []
      
      // Find new badges to insert
      const newBadges = localData.badges.filter((badgeId: string) => 
        !existingBadgeIds.includes(badgeId)
      )

      if (newBadges.length > 0) {
        const { error } = await supabase
          .from('badges')
          .insert(
            newBadges.map((badgeId: string) => ({
              user_id: userId,
              badge_id: badgeId,
              minted: localData.mintedBadges?.includes(badgeId) || false
            }))
          )

        if (error) console.error('Error syncing badges:', error)
      }

      // Update minted status for existing badges
      const mintedUpdates = localData.mintedBadges?.filter((badgeId: string) =>
        existingBadgeIds.includes(badgeId)
      ) || []

      if (mintedUpdates.length > 0) {
        const { error } = await supabase
          .from('badges')
          .update({ minted: true, minted_at: new Date().toISOString() })
          .eq('user_id', userId)
          .in('badge_id', mintedUpdates)

        if (error) console.error('Error updating minted badges:', error)
      }
    } catch (err) {
      console.error('Badge sync error:', err)
    }
  }, [userId, localData.badges, localData.mintedBadges])

  // Sync completed challenges
  const syncCompletedChallenges = useCallback(async () => {
    if (!isSupabaseConfigured() || !userId || !localData.completedChallenges || !supabase) return

    try {
      const { data: existing } = await supabase
        .from('completed_challenges')
        .select('challenge_id')
        .eq('user_id', userId)

      const existingIds = existing?.map(c => c.challenge_id) || []
      const newChallenges = localData.completedChallenges.filter((id: string) => 
        !existingIds.includes(id)
      )

      if (newChallenges.length > 0) {
        const { error } = await supabase
          .from('completed_challenges')
          .insert(
            newChallenges.map((challengeId: string) => ({
              user_id: userId,
              challenge_id: challengeId
            }))
          )

        if (error) console.error('Error syncing challenges:', error)
      }
    } catch (err) {
      console.error('Challenge sync error:', err)
    }
  }, [userId, localData.completedChallenges])

  // Load data from Supabase on mount
  const loadFromSupabase = useCallback(async () => {
    if (!isSupabaseConfigured() || !userId || !supabase) return null

    try {
      // Load user profile
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      // Load badges
      const { data: badges } = await supabase
        .from('badges')
        .select('*')
        .eq('user_id', userId)

      // Load completed challenges
      const { data: challenges } = await supabase
        .from('completed_challenges')
        .select('*')
        .eq('user_id', userId)

      return {
        profile,
        badges: badges?.map(b => b.badge_id) || [],
        mintedBadges: badges?.filter(b => b.minted).map(b => b.badge_id) || [],
        completedChallenges: challenges?.map(c => c.challenge_id) || []
      }
    } catch (err) {
      console.error('Load error:', err)
      return null
    }
  }, [userId])

  // Auto-sync when data changes
  useEffect(() => {
    if (!userId) return

    const syncAll = async () => {
      await Promise.all([
        syncUserProfile(),
        syncBadges(),
        syncCompletedChallenges()
      ])
    }

    syncAll()
  }, [userId, syncUserProfile, syncBadges, syncCompletedChallenges])

  return { loadFromSupabase, syncUserProfile, syncBadges, syncCompletedChallenges }
} 