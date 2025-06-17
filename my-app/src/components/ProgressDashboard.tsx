'use client'

import React from 'react'
import { motion } from 'framer-motion'
import StreakCalendar from './StreakCalendar'

interface ProgressDashboardProps {
  userScore: number
  userRank: number | null
  streak: number
  badges: string[]
  crowdBeats: number
  predictions: any[]
}

export default function ProgressDashboard({
  userScore,
  userRank,
  streak,
  badges,
  crowdBeats,
  predictions
}: ProgressDashboardProps) {
  // Calculate stats
  const totalPredictions = predictions.length
  const successfulPredictions = predictions.filter(p => p.points_earned > 50).length
  const accuracy = totalPredictions > 0 ? (successfulPredictions / totalPredictions) * 100 : 0
  const avgPointsPerPrediction = totalPredictions > 0 ? userScore / totalPredictions : 0

  const stats = [
    {
      label: 'Total Score',
      value: userScore.toLocaleString(),
      icon: '💰',
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      change: '+125',
      trend: 'up'
    },
    {
      label: 'Global Rank',
      value: userRank ? `#${userRank}` : 'Unranked',
      icon: '🏆',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      change: userRank ? '↑12' : '',
      trend: 'up'
    },
    {
      label: 'Current Streak',
      value: `${streak} days`,
      icon: '🔥',
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      change: '',
      trend: 'neutral'
    },
    {
      label: 'Accuracy Rate',
      value: `${accuracy.toFixed(1)}%`,
      icon: '🎯',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      change: '+2.3%',
      trend: 'up'
    },
    {
      label: 'Badges Earned',
      value: badges.length,
      icon: '🏅',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      change: '+2',
      trend: 'up'
    },
    {
      label: 'Crowd Beats',
      value: crowdBeats,
      icon: '⚔️',
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10',
      change: '+3',
      trend: 'up'
    }
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 pb-12">
      <h2 className="text-3xl font-bold text-center mb-8">📊 Your Progress Dashboard</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`text-3xl ${stat.bgColor} p-3 rounded-xl`}>
                {stat.icon}
              </div>
              {stat.change && (
                <span className={`text-sm ${stat.trend === 'up' ? 'text-green-400' : 'text-gray-400'}`}>
                  {stat.change}
                </span>
              )}
            </div>
            <div className={`text-2xl font-bold ${stat.color} mb-1`}>
              {stat.value}
            </div>
            <div className="text-sm text-gray-400">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Activity Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <StreakCalendar />
      </motion.div>

      {/* Performance Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-8 bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
      >
        <h3 className="text-xl font-bold text-white mb-4">Performance Insights 📈</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Best Performance */}
          <div>
            <h4 className="text-sm text-gray-400 mb-3">Your Strengths</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white">Kahneman Challenges</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div className="h-2 bg-green-400 rounded-full" style={{ width: '85%' }} />
                  </div>
                  <span className="text-sm text-gray-400">85%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">Market Predictions</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div className="h-2 bg-blue-400 rounded-full" style={{ width: '72%' }} />
                  </div>
                  <span className="text-sm text-gray-400">72%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">Crowd Beating</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div className="h-2 bg-purple-400 rounded-full" style={{ width: '68%' }} />
                  </div>
                  <span className="text-sm text-gray-400">68%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Areas to Improve */}
          <div>
            <h4 className="text-sm text-gray-400 mb-3">Areas to Improve</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white">Thaler Challenges</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div className="h-2 bg-yellow-400 rounded-full" style={{ width: '45%' }} />
                  </div>
                  <span className="text-sm text-gray-400">45%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">Annie Duke Puzzles</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div className="h-2 bg-orange-400 rounded-full" style={{ width: '52%' }} />
                  </div>
                  <span className="text-sm text-gray-400">52%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">Estimation Accuracy</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div className="h-2 bg-red-400 rounded-full" style={{ width: '38%' }} />
                  </div>
                  <span className="text-sm text-gray-400">38%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Motivational Message */}
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
          <p className="text-sm text-gray-300">
            💡 <strong>Pro Tip:</strong> Your Kahneman challenge performance is excellent! 
            Focus on Thaler's endowment effect puzzles to boost your overall accuracy. 
            You're in the top 15% of players globally!
          </p>
        </div>
      </motion.div>
    </div>
  )
} 