'use client'

import { useState, useEffect } from 'react'

interface LeaderboardEntry {
  id: string
  email: string
  username?: string
  score: number
  rank: number
  streak: number
  crowd_beats: number
  badge_count?: number
}

export default function RealtimeLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [isRealtime, setIsRealtime] = useState(false)

  // Mock data for when Supabase isn't configured
  const mockLeaderboard: LeaderboardEntry[] = [
    { id: '1', email: 'quantwizard@example.com', username: 'QuantWizard', score: 8420, rank: 1, streak: 12, crowd_beats: 45, badge_count: 8 },
    { id: '2', email: 'biasslayer@example.com', username: 'BiasSlayer', score: 7890, rank: 2, streak: 8, crowd_beats: 38, badge_count: 7 },
    { id: '3', email: 'predictorpro@example.com', username: 'PredictorPro', score: 7650, rank: 3, streak: 15, crowd_beats: 42, badge_count: 6 },
    { id: '4', email: 'mindmaster@example.com', username: 'MindMaster', score: 6230, rank: 4, streak: 5, crowd_beats: 28, badge_count: 5 },
    { id: '5', email: 'cognitivechamp@example.com', username: 'CognitiveChamp', score: 5890, rank: 5, streak: 7, crowd_beats: 25, badge_count: 4 }
  ]

  useEffect(() => {
    // Fetch leaderboard data from API
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('/api/leaderboard')
        if (response.ok) {
          const data = await response.json()
          setLeaderboard(data.leaderboard || mockLeaderboard)
          setIsRealtime(false) // API doesn't support realtime
        } else {
          setLeaderboard(mockLeaderboard)
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error)
        setLeaderboard(mockLeaderboard)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()

    // Refresh leaderboard every 30 seconds
    const interval = setInterval(fetchLeaderboard, 30000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-400">Loading leaderboard...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white">
          {isRealtime ? '🔴 Live' : '🎮 Demo'} Leaderboard
        </h3>
        {isRealtime && (
          <div className="text-sm text-green-400 animate-pulse">
            ● Updates in real-time
          </div>
        )}
      </div>

      <div className="space-y-3">
        {leaderboard.map((player) => (
          <div
            key={player.id}
            className={`
              flex items-center justify-between p-4 rounded-xl transition-all duration-300
              ${player.rank <= 3 
                ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30' 
                : 'bg-white/5 border border-white/10'
              }
              hover:scale-[1.02] hover:bg-white/10
            `}
          >
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold" style={{ minWidth: '3rem' }}>
                {player.rank === 1 && '🥇'}
                {player.rank === 2 && '🥈'}
                {player.rank === 3 && '🥉'}
                {player.rank > 3 && `#${player.rank}`}
              </div>
              
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-white">
                    {player.username || player.email.split('@')[0]}
                  </span>
                  {player.badge_count && player.badge_count > 5 && (
                    <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full">
                      {player.badge_count} badges
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span>🔥 {player.streak} streak</span>
                  <span>🎯 {player.crowd_beats} crowd beats</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-green-400">
                {player.score.toLocaleString()}
              </div>
              <div className="text-xs text-gray-400">points</div>
            </div>
          </div>
        ))}
      </div>

      {!isRealtime && (
        <div className="mt-6 p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
          <p className="text-sm text-yellow-300 text-center">
            📱 Sign in to see the real global leaderboard and compete with other players!
          </p>
        </div>
      )}
    </div>
  )
} 