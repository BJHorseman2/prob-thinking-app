'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'

interface SocialChallengeProps {
  userScore: number
  userName?: string
}

export default function SocialChallenge({ userScore, userName = 'Player' }: SocialChallengeProps) {
  const [showShareModal, setShowShareModal] = useState(false)
  const [challengeLink, setChallengeLink] = useState('')
  const [copied, setCopied] = useState(false)

  const createChallenge = () => {
    // Generate a unique challenge link
    const challengeId = Math.random().toString(36).substring(7)
    const link = `${window.location.origin}?challenge=${challengeId}&challenger=${encodeURIComponent(userName)}&score=${userScore}`
    setChallengeLink(link)
    setShowShareModal(true)
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(challengeLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: '💬',
      action: () => window.open(`https://wa.me/?text=${encodeURIComponent(`🧠 Can you beat my score of ${userScore} in Probabl? I challenge you to outsmart cognitive biases! ${challengeLink}`)}`)
    },
    {
      name: 'Twitter/X',
      icon: '🐦',
      action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Just scored ${userScore} on @Probabl! 🧠 Can you beat my behavioral economics knowledge? Challenge: ${challengeLink}`)}`)
    },
    {
      name: 'LinkedIn',
      icon: '💼',
      action: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(challengeLink)}`)
    },
    {
      name: 'TikTok',
      icon: '🎵',
      action: () => alert('Record your reaction to the challenges and tag #ProbablChallenge!')
    }
  ]

  return (
    <>
      <motion.button
        onClick={createChallenge}
        className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all duration-300 shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        🎯 Challenge a Friend
      </motion.button>

      {showShareModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div 
            className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 max-w-md w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">🎯 Challenge Created!</h3>
              <p className="text-gray-300">Your score to beat: <span className="text-green-400 font-bold">{userScore} points</span></p>
            </div>

            <div className="bg-white/5 rounded-xl p-4 mb-6">
              <p className="text-xs text-gray-400 mb-2">Challenge Link:</p>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={challengeLink}
                  readOnly
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white"
                />
                <button
                  onClick={copyToClipboard}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                >
                  {copied ? '✅' : '📋'}
                </button>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <p className="text-sm text-gray-300 text-center mb-3">Share your challenge:</p>
              <div className="grid grid-cols-2 gap-3">
                {shareOptions.map((option) => (
                  <button
                    key={option.name}
                    onClick={option.action}
                    className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl p-3 text-center transition-all"
                  >
                    <div className="text-2xl mb-1">{option.icon}</div>
                    <div className="text-xs text-gray-300">{option.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 mb-6">
              <p className="text-sm text-center text-white">
                🏆 <strong>Winner gets:</strong> Exclusive "Mind Master" NFT Badge + 500 bonus points!
              </p>
            </div>

            <button
              onClick={() => setShowShareModal(false)}
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