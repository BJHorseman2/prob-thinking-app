'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  points: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

interface AchievementToastProps {
  achievement: Achievement | null
  onClose: () => void
}

export default function AchievementToast({ achievement, onClose }: AchievementToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (achievement) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300) // Wait for exit animation
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [achievement, onClose])

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-600 to-gray-700'
      case 'rare': return 'from-blue-600 to-blue-700'
      case 'epic': return 'from-purple-600 to-purple-700'
      case 'legendary': return 'from-yellow-600 to-orange-600'
      default: return 'from-gray-600 to-gray-700'
    }
  }

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'common': return ''
      case 'rare': return 'shadow-blue-500/50'
      case 'epic': return 'shadow-purple-500/50'
      case 'legendary': return 'shadow-yellow-500/50 animate-pulse'
      default: return ''
    }
  }

  if (!achievement) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.8 }}
          className="fixed top-4 right-4 z-50"
        >
          <div className={`
            bg-gradient-to-r ${getRarityColor(achievement.rarity)} 
            rounded-2xl p-6 shadow-2xl ${getRarityGlow(achievement.rarity)}
            border border-white/20 backdrop-blur-xl
            max-w-sm
          `}>
            <div className="flex items-start space-x-4">
              {/* Icon */}
              <motion.div
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="text-4xl"
              >
                {achievement.icon}
              </motion.div>

              {/* Content */}
              <div className="flex-1">
                <motion.h3
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-lg font-bold text-white mb-1"
                >
                  {achievement.title}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-sm text-white/80 mb-2"
                >
                  {achievement.description}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="inline-flex items-center space-x-2"
                >
                  <span className="text-xs bg-white/20 rounded-full px-3 py-1 text-white font-semibold">
                    +{achievement.points} XP
                  </span>
                  <span className="text-xs text-white/60 uppercase">
                    {achievement.rarity}
                  </span>
                </motion.div>
              </div>

              {/* Close button */}
              <button
                onClick={() => setIsVisible(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Progress bar */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 rounded-b-2xl overflow-hidden"
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 5, ease: "linear" }}
              style={{ transformOrigin: "left" }}
            >
              <div className="h-full bg-white/40" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Hook to manage achievement queue
export function useAchievementToast() {
  const [queue, setQueue] = useState<Achievement[]>([])
  const [current, setCurrent] = useState<Achievement | null>(null)

  const showAchievement = (achievement: Achievement) => {
    setQueue(prev => [...prev, achievement])
  }

  useEffect(() => {
    if (!current && queue.length > 0) {
      setCurrent(queue[0])
      setQueue(prev => prev.slice(1))
    }
  }, [current, queue])

  const handleClose = () => {
    setCurrent(null)
  }

  return {
    current,
    showAchievement,
    handleClose,
    AchievementToastComponent: () => (
      <AchievementToast achievement={current} onClose={handleClose} />
    )
  }
} 