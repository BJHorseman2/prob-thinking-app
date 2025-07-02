'use client'

import { DataService } from './dataService'

export class LeaderboardService {
  // Update user's score and sync with leaderboard
  static async updateUserScore(
    userId: string, 
    scoreIncrease: number, 
    streakCount?: number,
    crowdBeats?: number
  ): Promise<{
    success: boolean
    newScore: number
    rank?: number
    total?: number
  }> {
    try {
      // Get current user profile
      const currentProfile = await DataService.getUserProfile(userId)
      
      if (!currentProfile) {
        console.error('User profile not found for score update')
        return { success: false, newScore: 0 }
      }

      // Calculate new totals
      const newScore = currentProfile.score + scoreIncrease
      const newStreak = streakCount !== undefined ? streakCount : currentProfile.streak
      const newCrowdBeats = crowdBeats !== undefined ? 
        currentProfile.crowd_beats + crowdBeats : currentProfile.crowd_beats

      // Update user profile
      const updatedProfile = await DataService.updateUserProfile(userId, {
        score: newScore,
        streak: newStreak,
        crowd_beats: newCrowdBeats
      })

      if (!updatedProfile) {
        return { success: false, newScore: currentProfile.score }
      }

      // Update leaderboard via API (for real-time sync)
      try {
        const response = await fetch('/api/leaderboard', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            score: newScore,
            streak: newStreak,
            crowd_beats: newCrowdBeats
          }),
        })

        if (response.ok) {
          const result = await response.json()
          return {
            success: true,
            newScore,
            rank: result.rank,
            total: result.total
          }
        } else {
          console.warn('API leaderboard update failed, but local update succeeded')
        }
      } catch (apiError) {
        console.warn('API leaderboard update failed:', apiError)
      }

      // Return success even if API fails (local update succeeded)
      return {
        success: true,
        newScore
      }

    } catch (error) {
      console.error('Error updating user score:', error)
      return { success: false, newScore: 0 }
    }
  }

  // Get user's current rank
  static async getUserRank(userId: string): Promise<number | null> {
    try {
      const leaderboard = await DataService.getLeaderboard(1000)
      const rank = leaderboard.findIndex(p => p.id === userId) + 1
      return rank > 0 ? rank : null
    } catch (error) {
      console.error('Error getting user rank:', error)
      return null
    }
  }

  // Check if user made it to top N
  static async isInTopN(userId: string, n: number = 10): Promise<boolean> {
    const rank = await this.getUserRank(userId)
    return rank !== null && rank <= n
  }
}