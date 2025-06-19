'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

interface AnimatedScoreProps {
  value: number
  duration?: number
  className?: string
  prefix?: string
  suffix?: string
}

export default function AnimatedScore({ 
  value, 
  duration = 1, 
  className = '',
  prefix = '',
  suffix = ''
}: AnimatedScoreProps) {
  const [displayValue, setDisplayValue] = useState(value)
  const previousValue = useRef(value)
  const animationRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const startValue = previousValue.current
    const endValue = value
    const startTime = Date.now()
    const animationDuration = duration * 1000

    const animate = () => {
      const now = Date.now()
      const progress = Math.min((now - startTime) / animationDuration, 1)
      
      // Easing function (ease-out-expo)
      const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      
      const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutExpo)
      setDisplayValue(currentValue)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        previousValue.current = endValue
      }
    }

    // Cancel any ongoing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    // Start new animation
    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [value, duration])

  // Add commas to large numbers
  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  // Detect if score increased or decreased
  const isIncreasing = value > previousValue.current
  const hasChanged = value !== previousValue.current

  return (
    <div className={`relative ${className}`}>
      <motion.div
        key={value}
        initial={hasChanged ? { scale: 1 } : false}
        animate={hasChanged ? { scale: [1, 1.2, 1] } : false}
        transition={{ duration: 0.3 }}
      >
        <span className={hasChanged ? (isIncreasing ? 'text-green-400' : 'text-red-400') : ''}>
          {prefix}{formatNumber(displayValue)}{suffix}
        </span>
      </motion.div>

      {/* Floating +/- indicator */}
      {hasChanged && (
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 0, y: isIncreasing ? -20 : 20 }}
          transition={{ duration: 1 }}
          className={`absolute -right-8 top-0 text-sm font-bold ${
            isIncreasing ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {isIncreasing ? '+' : ''}{value - previousValue.current}
        </motion.div>
      )}
    </div>
  )
}

// Circular progress version for rank display
export function AnimatedRankProgress({ 
  rank, 
  maxRank = 1000 
}: { 
  rank: number | null
  maxRank?: number 
}) {
  const progress = rank ? (maxRank - rank) / maxRank : 0
  const springProgress = useSpring(progress, { stiffness: 100, damping: 30 })
  const strokeDashoffset = useTransform(springProgress, [0, 1], [251.2, 0])

  return (
    <div className="relative w-20 h-20">
      <svg className="w-full h-full transform -rotate-90">
        {/* Background circle */}
        <circle
          cx="40"
          cy="40"
          r="36"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-gray-700"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx="40"
          cy="40"
          r="36"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          strokeDasharray="226.08"
          style={{ strokeDashoffset }}
          className="text-yellow-400"
          strokeLinecap="round"
        />
      </svg>
      
      {/* Rank display */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-bold text-yellow-400">
            {rank ? `#${rank}` : '—'}
          </div>
          <div className="text-xs text-gray-400">Rank</div>
        </div>
      </div>
    </div>
  )
} 