'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface DayActivity {
  date: string
  completed: boolean
  points: number
}

export default function StreakCalendar() {
  const [activities, setActivities] = useState<DayActivity[]>([])
  const [currentStreak, setCurrentStreak] = useState(0)
  const [longestStreak, setLongestStreak] = useState(0)

  useEffect(() => {
    // Load activity data from localStorage
    const stored = localStorage.getItem('dailyActivities')
    if (stored) {
      setActivities(JSON.parse(stored))
    } else {
      // Generate last 30 days of mock data
      const mockData = generateLast30Days()
      setActivities(mockData)
    }
  }, [])

  const generateLast30Days = (): DayActivity[] => {
    const days: DayActivity[] = []
    const today = new Date()
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      // Mock data - in real app, this would come from actual activity
      const completed = Math.random() > 0.3 && i > 0 // More likely to have completed
      const points = completed ? Math.floor(Math.random() * 200) + 50 : 0
      
      days.push({
        date: date.toISOString().split('T')[0],
        completed,
        points
      })
    }
    
    return days
  }

  const calculateStreaks = () => {
    let current = 0
    let longest = 0
    let tempStreak = 0
    
    // Calculate from most recent day backwards
    for (let i = activities.length - 1; i >= 0; i--) {
      if (activities[i].completed) {
        tempStreak++
        if (i === activities.length - 1) {
          current = tempStreak
        }
      } else {
        longest = Math.max(longest, tempStreak)
        tempStreak = 0
      }
    }
    
    longest = Math.max(longest, tempStreak)
    
    setCurrentStreak(current)
    setLongestStreak(longest)
  }

  useEffect(() => {
    if (activities.length > 0) {
      calculateStreaks()
    }
  }, [activities])

  const getIntensityClass = (points: number) => {
    if (points === 0) return 'bg-gray-800'
    if (points < 100) return 'bg-purple-900'
    if (points < 200) return 'bg-purple-700'
    if (points < 300) return 'bg-purple-500'
    return 'bg-purple-400'
  }

  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { weekday: 'short' })[0]
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
      <h3 className="text-xl font-bold text-white mb-4">Activity Streak 🔥</h3>
      
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/5 rounded-xl p-4">
          <div className="text-2xl font-bold text-orange-400">{currentStreak}</div>
          <div className="text-sm text-gray-400">Current Streak</div>
        </div>
        <div className="bg-white/5 rounded-xl p-4">
          <div className="text-2xl font-bold text-yellow-400">{longestStreak}</div>
          <div className="text-sm text-gray-400">Longest Streak</div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="space-y-1">
        {/* Day labels */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <div key={i} className="text-xs text-gray-500 text-center">
              {day}
            </div>
          ))}
        </div>

        {/* Activity squares */}
        <div className="grid grid-cols-7 gap-1">
          {activities.slice(-28).map((activity, index) => (
            <motion.div
              key={activity.date}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.01 }}
              className="relative group"
            >
              <div
                className={`aspect-square rounded ${getIntensityClass(activity.points)} 
                  hover:ring-2 hover:ring-purple-400 transition-all cursor-pointer`}
              />
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 
                opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                  {new Date(activity.date).toLocaleDateString()}
                  {activity.completed && (
                    <div className="text-green-400">+{activity.points} points</div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-6 text-xs text-gray-400">
        <span>Less</span>
        <div className="flex space-x-1">
          <div className="w-3 h-3 bg-gray-800 rounded" />
          <div className="w-3 h-3 bg-purple-900 rounded" />
          <div className="w-3 h-3 bg-purple-700 rounded" />
          <div className="w-3 h-3 bg-purple-500 rounded" />
          <div className="w-3 h-3 bg-purple-400 rounded" />
        </div>
        <span>More</span>
      </div>
    </div>
  )
} 