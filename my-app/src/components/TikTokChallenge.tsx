'use client'

'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TikTokChallengeProps {
  onComplete: (points: number) => void
}

export default function TikTokChallenge({ onComplete }: TikTokChallengeProps) {
  const [timeLeft, setTimeLeft] = useState(15)
  const [currentChallenge, setCurrentChallenge] = useState(0)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [isRecording, setIsRecording] = useState(false)

  // Quick 15-second challenges perfect for TikTok
  const tiktokChallenges = [
    {
      id: 'quick-bias-1',
      title: '🧠 10 Second Brain Test',
      question: 'A burger and fries cost $7.50. The burger costs $7 more than the fries. How much are the fries?',
      options: ['$0.50', '$0.25', '$1.00', '$0.75'],
      correct: 1, // $0.25
      explanation: 'If fries = x, burger = x + 7, total = 2x + 7 = 7.50, so x = 0.25!'
    },
    {
      id: 'quick-bias-2',
      title: '⚡ Instant Decision',
      question: 'You have 5 seconds! Which is riskier?',
      options: ['🦈 Swimming with sharks', '🚗 Driving to work'],
      correct: 1, // Driving
      explanation: 'Driving kills 38,000/year in US. Sharks? Just 1. Media bias tricks us!'
    },
    {
      id: 'quick-bias-3',
      title: '💰 Money Mind Trick',
      question: 'You find $20. Then lose $20. How do you feel?',
      options: ['😐 Neutral', '😢 Sad', '😊 Happy', '🤷 Confused'],
      correct: 1, // Sad
      explanation: 'Loss aversion! We feel losses 2x stronger than gains. Nobel winner Kahneman proved it!'
    }
  ]

  const challenge = tiktokChallenges[currentChallenge]

  useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !showResult) {
      handleTimeout()
    }
  }, [timeLeft, showResult])

  const handleAnswer = (answerIndex: number) => {
    const isCorrect = answerIndex === challenge.correct
    const points = isCorrect ? 100 : 25
    setScore(score + points)
    setShowResult(true)
    
    setTimeout(() => {
      if (currentChallenge < tiktokChallenges.length - 1) {
        setCurrentChallenge(currentChallenge + 1)
        setTimeLeft(15)
        setShowResult(false)
      } else {
        onComplete(score + points)
      }
    }, 3000)
  }

  const handleTimeout = () => {
    setShowResult(true)
    setTimeout(() => {
      if (currentChallenge < tiktokChallenges.length - 1) {
        setCurrentChallenge(currentChallenge + 1)
        setTimeLeft(15)
        setShowResult(false)
      } else {
        onComplete(score)
      }
    }, 3000)
  }

  const startRecording = () => {
    setIsRecording(true)
    // In a real app, this would start screen recording
    alert('📱 Start recording your screen now! Share to TikTok with #ProbablChallenge')
  }

  return (
    <div className="fixed inset-0 bg-black flex flex-col justify-between p-4 z-50">
      {/* TikTok-style header */}
      <div className="text-center">
        <motion.div 
          className="inline-block"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <span className="text-3xl font-bold text-white">
            {timeLeft}s
          </span>
        </motion.div>
        <div className="text-sm text-gray-400 mt-2">
          Challenge {currentChallenge + 1}/{tiktokChallenges.length}
        </div>
      </div>

      {/* Main content - centered for mobile */}
      <div className="flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key={challenge.id}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-4">
                  {challenge.title}
                </h2>
                <p className="text-lg text-white px-4">
                  {challenge.question}
                </p>
              </div>

              {/* Swipeable options */}
              <div className="space-y-3 px-4">
                {challenge.options.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-white text-lg font-semibold"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center px-4"
            >
              <div className="text-6xl mb-4">
                {challenge.correct === currentChallenge ? '🎉' : '😅'}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {challenge.correct === currentChallenge ? 'Genius!' : 'Tricked!'}
              </h3>
              <p className="text-white text-lg">
                {challenge.explanation}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom section - TikTok style */}
      <div className="space-y-4">
        {/* Score display */}
        <div className="text-center">
          <motion.div
            key={score}
            initial={{ scale: 1.5 }}
            animate={{ scale: 1 }}
            className="text-3xl font-bold text-green-400"
          >
            {score} pts
          </motion.div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => window.location.reload()}
            className="text-white/60 text-sm"
          >
            ← Exit
          </button>
          
          {!isRecording && (
            <motion.button
              onClick={startRecording}
              className="bg-red-500 text-white px-6 py-3 rounded-full font-bold flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-xl">🎥</span>
              <span>Record for TikTok</span>
            </motion.button>
          )}
          
          <button
            onClick={() => {
              const text = `Just scored ${score} on Probabl! Can you beat my behavioral economics IQ? 🧠 #ProbablChallenge #BehavioralEconomics`
              window.open(`https://www.tiktok.com/upload?caption=${encodeURIComponent(text)}`)
            }}
            className="text-white/60 text-sm"
          >
            Share →
          </button>
        </div>

        {/* TikTok hashtags */}
        <div className="text-center text-xs text-gray-400">
          <p>#ProbablChallenge #BrainTest #Economics #NobelPrize</p>
        </div>
      </div>
    </div>
  )
} 