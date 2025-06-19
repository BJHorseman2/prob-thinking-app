'use client'

import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface ShareableResultCardProps {
  score: number
  rank: number | null
  topBias: string
  accuracy: number
  badges: string[]
}

export default function ShareableResultCard({ score, rank, topBias, accuracy, badges }: ShareableResultCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [showShare, setShowShare] = useState(false)
  
  const generateShareImage = async () => {
    // In a real app, you'd use html2canvas or similar
    // For now, we'll create a shareable text
    const shareText = `🧠 My Probabl Stats:\n\n` +
      `Score: ${score} points\n` +
      `Rank: ${rank ? `#${rank}` : 'Unranked'}\n` +
      `Accuracy: ${accuracy}%\n` +
      `Mastered: ${topBias}\n` +
      `Badges: ${badges.length}\n\n` +
      `Think you can beat me? Play at probabl.app!`
    
    return shareText
  }

  const shareToSocial = async (platform: string) => {
    const text = await generateShareImage()
    const url = 'https://probabl.app'
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`)
        break
      case 'instagram':
        alert('Screenshot this card and share to your Instagram story with #ProbablChallenge!')
        break
      case 'tiktok':
        alert('Create a video explaining your hardest challenge and tag #BehavioralEconomics #Probabl!')
        break
    }
  }

  const getGradeEmoji = () => {
    if (accuracy >= 90) return '🏆'
    if (accuracy >= 80) return '🥇'
    if (accuracy >= 70) return '🥈'
    if (accuracy >= 60) return '🥉'
    return '📈'
  }

  const getInsight = () => {
    if (topBias === 'Anchoring Bias') return 'You resist numerical manipulation like a pro!'
    if (topBias === 'Loss Aversion') return 'You make decisions without fear of loss!'
    if (topBias === 'Confirmation Bias') return 'You see through your own biases!'
    return 'You think like a Nobel laureate!'
  }

  return (
    <>
      <motion.button
        onClick={() => setShowShare(true)}
        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:scale-105 transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        📸 Share Results
      </motion.button>

      {showShare && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md w-full"
          >
            {/* Shareable Card */}
            <div 
              ref={cardRef}
              className="bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 p-1 rounded-3xl mb-4"
            >
              <div className="bg-black rounded-3xl p-8">
                {/* Header */}
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold text-white mb-2">🧠 Probabl Master</h2>
                  <p className="text-gray-300">Behavioral Economics Champion</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/10 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-green-400">{score}</div>
                    <div className="text-sm text-gray-300">Total Score</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-yellow-400">
                      {rank ? `#${rank}` : '—'}
                    </div>
                    <div className="text-sm text-gray-300">Global Rank</div>
                  </div>
                </div>

                {/* Accuracy Bar */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-300">Accuracy</span>
                    <span className="text-lg font-bold text-white">{accuracy}% {getGradeEmoji()}</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-3">
                    <motion.div 
                      className="h-3 bg-gradient-to-r from-green-400 to-blue-400 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${accuracy}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </div>

                {/* Special Achievement */}
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 mb-6 border border-purple-500/30">
                  <p className="text-center text-white">
                    <span className="text-2xl mb-2 block">🎯</span>
                    <strong>Top Skill:</strong> {topBias} Master
                    <br />
                    <span className="text-sm text-gray-300">{getInsight()}</span>
                  </p>
                </div>

                {/* Badge Count */}
                <div className="text-center">
                  <div className="inline-flex items-center space-x-2 bg-white/10 rounded-full px-4 py-2">
                    <span className="text-2xl">🏅</span>
                    <span className="text-white font-semibold">{badges.length} Badges Earned</span>
                  </div>
                </div>

                {/* Watermark */}
                <div className="text-center mt-6">
                  <p className="text-xs text-gray-400">probabl.app • Beat cognitive biases</p>
                </div>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <button
                onClick={() => shareToSocial('twitter')}
                className="bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold transition-all"
              >
                🐦 Twitter
              </button>
              <button
                onClick={() => shareToSocial('instagram')}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white py-3 rounded-xl font-semibold transition-all"
              >
                📷 Instagram
              </button>
              <button
                onClick={() => shareToSocial('tiktok')}
                className="bg-black hover:bg-gray-900 text-white py-3 rounded-xl font-semibold transition-all border border-white/20"
              >
                🎵 TikTok
              </button>
            </div>

            <button
              onClick={() => setShowShare(false)}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl font-semibold transition-all"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </>
  )
} 