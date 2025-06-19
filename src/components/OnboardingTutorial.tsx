'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface OnboardingStep {
  title: string
  description: string
  target?: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}

const steps: OnboardingStep[] = [
  {
    title: "Welcome to Probabl! 🧠",
    description: "Master behavioral economics through gamified challenges. Let's show you around!",
  },
  {
    title: "Quick Challenges ⚡",
    description: "Test your brain against Nobel Prize-winning insights. Each challenge teaches you about cognitive biases.",
    target: "challenges-tab",
    position: "bottom"
  },
  {
    title: "Beat the Crowd 👥",
    description: "Compare your answers with other players. Beat the crowd to earn bonus points!",
    target: "crowd-mode",
    position: "top"
  },
  {
    title: "Live Markets 📈",
    description: "Make predictions on real-world events. But remember - you can only predict once per market!",
    target: "markets-tab",
    position: "bottom"
  },
  {
    title: "Earn NFT Badges 🏆",
    description: "Complete challenges to unlock exclusive digital collectibles. The rarer the badge, the harder to earn!",
    target: "badges-tab",
    position: "bottom"
  },
  {
    title: "Track Your Progress 📊",
    description: "Watch your score, rank, and streak grow. Can you reach the top of the leaderboard?",
    target: "score-display",
    position: "left"
  }
]

export default function OnboardingTutorial() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [hasSeenTutorial, setHasSeenTutorial] = useState(true)

  useEffect(() => {
    const seen = localStorage.getItem('hasSeenTutorial')
    if (!seen) {
      setHasSeenTutorial(false)
      setIsVisible(true)
    }
  }, [])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleSkip = () => {
    handleComplete()
  }

  const handleComplete = () => {
    localStorage.setItem('hasSeenTutorial', 'true')
    setIsVisible(false)
    setHasSeenTutorial(true)
  }

  if (hasSeenTutorial || !isVisible) return null

  const currentStepData = steps[currentStep]

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50"
            onClick={handleSkip}
          />

          {/* Tutorial Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
          >
            <div className="bg-gradient-to-br from-purple-900/95 to-indigo-900/95 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full border border-purple-500/30 shadow-2xl pointer-events-auto">
              {/* Progress dots */}
              <div className="flex justify-center space-x-2 mb-6">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentStep
                        ? 'bg-purple-400 w-8'
                        : index < currentStep
                        ? 'bg-purple-400/50'
                        : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>

              {/* Content */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">
                  {currentStepData.title}
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  {currentStepData.description}
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center">
                <button
                  onClick={handleSkip}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Skip Tutorial
                </button>
                <button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-xl font-semibold hover:scale-105 transition-transform"
                >
                  {currentStep === steps.length - 1 ? "Let's Go! 🚀" : 'Next →'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
} 