'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AuthButton from '@/components/AuthButton'
import RealtimeLeaderboard from '@/components/RealtimeLeaderboard'
import { fireWinConfetti, fireConfetti } from '@/lib/confetti'
import OnboardingTutorial from '@/components/OnboardingTutorial'
import ProgressDashboard from '@/components/ProgressDashboard'
import AnimatedScore from '@/components/AnimatedScore'
import { useAchievementToast } from '@/components/AchievementToast'
import { getWeeklyChallenges, getNextWeeksChallenges, hasCompletedThisWeek, getDaysUntilNextWeek } from '@/lib/weeklyChallenges'
import SocialChallenge from '@/components/SocialChallenge'
import ShareableResultCard from '@/components/ShareableResultCard'
import TikTokChallenge from '@/components/TikTokChallenge'
import MobileLayout from '@/components/MobileLayout'

// Using localStorage for data persistence - no Supabase needed

interface Prediction {
  id: string
  user_email: string
  question: string
  prediction: number
  confidence: number
  reasoning: string
  bias_check: string
  created_at: string
  status: string
  points_earned: number
}

// Type definitions for better type safety
type BadgeId = 'first-challenge' | 'system-1-survivor' | 'crowd-beater' | 'bias-slayer' | 
  'streak-master' | 'perfect-calibration' | 'thaler-scholar' | 'market-prophet' | 
  'nobel-laureate' | 'grand-master'

type RarityType = 'Common' | 'Uncommon' | 'Rare' | 'Legendary' | 'Mythic'

interface Badge {
  name: string
  emoji: string
  description: string
  rarity: RarityType
  points: number
  nftMetadata: {
    background: string
    trait: string
    power: number
    special?: string
  }
}

interface CrowdData {
  participantCount: number
  distributions?: Array<{
    option: string
    votes: number
    percentage: number
  }>
  crowdChoice?: string
  estimates?: number[]
  crowdAverage?: number
  distribution?: Array<{
    range: string
    count: number
  }>
  topReasons: string[]
}

export default function Probabl() {
  // All state variables
  const [activeTab, setActiveTab] = useState('home')
  const [userEmail, setUserEmail] = useState('')
  const [challengeMode, setChallengeMode] = useState<{active: boolean, challengerId: string, challengerName: string, targetScore: number} | null>(null)
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [confidence, setConfidence] = useState(50)
  const [showResult, setShowResult] = useState(false)
  const [userScore, setUserScore] = useState(0)
  const [userRank, setUserRank] = useState<number | null>(null)
  const [streak, setStreak] = useState(0)
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(false)
  const [gameMode, setGameMode] = useState<'solo' | 'crowd'>('solo')
  const [crowdData, setCrowdData] = useState<CrowdData | null>(null)
  const [showCrowdResults, setShowCrowdResults] = useState(false)
  const [crowdBeats, setCrowdBeats] = useState(0)
  const [lastResult, setLastResult] = useState<any>(null)
  const [badges, setBadges] = useState<BadgeId[]>([])
  const [showBadgeModal, setShowBadgeModal] = useState(false)
  const [newBadge, setNewBadge] = useState<Badge | null>(null)
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([])
  const [dailyChallenges, setDailyChallenges] = useState<any[]>([])
  const [lastRefreshDate, setLastRefreshDate] = useState<string>('')
  const [selectedBet, setSelectedBet] = useState<any>(null)
  const [betAmount, setBetAmount] = useState('')
  const [userBets, setUserBets] = useState<any[]>([])
  const [selectedMarket, setSelectedMarket] = useState<any>(null)
  const [marketPrediction, setMarketPrediction] = useState('')
  const [showMarketModal, setShowMarketModal] = useState(false)
  const [isMinting, setIsMinting] = useState(false)
  const [mintedBadges, setMintedBadges] = useState<string[]>([])
  const [activeWeeklyChallenge, setActiveWeeklyChallenge] = useState<any>(null)
  const [weeklyProgress, setWeeklyProgress] = useState<any>({})
  const [showWeeklyModal, setShowWeeklyModal] = useState(false)
  const [completedMarkets, setCompletedMarkets] = useState<number[]>([])
  const [showTikTokMode, setShowTikTokMode] = useState(false)
  
  // Achievement toast hook
  const { showAchievement, AchievementToastComponent } = useAchievementToast()
  
  // Load data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('gameData')
    if (stored) {
      const data = JSON.parse(stored)
      setUserScore(data.score || 0)
      setStreak(data.streak || 0)
      setCrowdBeats(data.crowdBeats || 0)
      setBadges(data.badges || [])
      setCompletedChallenges(data.completedChallenges || [])
      setCompletedMarkets(data.completedMarkets || [])
      setUserRank(data.rank || null)
    }
    
    // Check for challenge in URL
    const urlParams = new URLSearchParams(window.location.search)
    const challengeId = urlParams.get('challenge')
    const challengerName = urlParams.get('challenger')
    const targetScore = urlParams.get('score')
    
    if (challengeId && challengerName && targetScore) {
      setChallengeMode({
        active: true,
        challengerId: challengeId,
        challengerName: decodeURIComponent(challengerName),
        targetScore: parseInt(targetScore)
      })
      // Show challenge notification
      alert(`🎯 Challenge from ${decodeURIComponent(challengerName)}!\n\nBeat their score of ${targetScore} points to win!`)
    }
  }, [])

  // Save data to localStorage and update leaderboard
  useEffect(() => {
    const data = {
      score: userScore,
      streak,
      crowdBeats,
      badges,
      completedChallenges,
      completedMarkets,
      rank: userRank
    }
    localStorage.setItem('gameData', JSON.stringify(data))
    
    // Submit to leaderboard API if score > 0
    if (userScore > 0 && userEmail) {
      const submitToLeaderboard = async () => {
        try {
          const response = await fetch('/api/leaderboard', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: userEmail,
              name: userEmail.split('@')[0],
              score: userScore,
              badges: badges
            })
          })
          const result = await response.json()
          if (result.rank) {
            setUserRank(result.rank)
          }
        } catch (error) {
          console.error('Failed to update leaderboard:', error)
        }
      }
      submitToLeaderboard()
    }
  }, [userScore, streak, crowdBeats, badges, completedChallenges, completedMarkets, userRank, userEmail])

  // Load minted badges from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('mintedBadges')
    if (stored) {
      const mints = JSON.parse(stored)
      setMintedBadges(mints.map((m: any) => m.badgeId))
    }
  }, [])

  // Badge system with NFT-ready metadata
  const badgeSystem: Record<BadgeId, Badge> = {
    // Beginner Badges (Bronze NFTs)
    'first-challenge': {
      name: 'First Steps',
      emoji: '🎯',
      description: 'Completed your first behavioral economics challenge',
      rarity: 'Common',
      points: 50,
      nftMetadata: {
        background: 'gradient-bronze',
        trait: 'Beginner',
        power: 1
      }
    },
    'system-1-survivor': {
      name: 'System 1 Survivor',
      emoji: '🧠',
      description: 'Correctly answered Kahneman\'s bat & ball puzzle',
      rarity: 'Common',
      points: 75,
      nftMetadata: {
        background: 'gradient-bronze',
        trait: 'Kahneman Scholar',
        power: 2
      }
    },
    
    // Intermediate Badges (Silver NFTs)
    'crowd-beater': {
      name: 'Crowd Beater',
      emoji: '⚔️',
      description: 'Beat the crowd 5 times in a row',
      rarity: 'Uncommon',
      points: 200,
      nftMetadata: {
        background: 'gradient-silver',
        trait: 'Independent Thinker',
        power: 5
      }
    },
    'bias-slayer': {
      name: 'Bias Slayer',
      emoji: '🗡️',
      description: 'Correctly identified cognitive biases in 10 different challenges',
      rarity: 'Uncommon',
      points: 300,
      nftMetadata: {
        background: 'gradient-silver',
        trait: 'Cognitive Warrior',
        power: 7
      }
    },
    'streak-master': {
      name: 'Streak Master',
      emoji: '🔥',
      description: 'Maintained a 10-day prediction streak',
      rarity: 'Uncommon',
      points: 250,
      nftMetadata: {
        background: 'gradient-silver',
        trait: 'Consistent Predictor',
        power: 6
      }
    },
    
    // Advanced Badges (Gold NFTs)
    'perfect-calibration': {
      name: 'Perfect Calibration',
      emoji: '🎯',
      description: 'Achieved 90%+ accuracy on 20 probability estimates',
      rarity: 'Rare',
      points: 500,
      nftMetadata: {
        background: 'gradient-gold',
        trait: 'Master Calibrator',
        power: 10
      }
    },
    'thaler-scholar': {
      name: 'Thaler Scholar',
      emoji: '🏆',
      description: 'Mastered all endowment effect and nudge theory challenges',
      rarity: 'Rare',
      points: 400,
      nftMetadata: {
        background: 'gradient-gold',
        trait: 'Behavioral Expert',
        power: 8
      }
    },
    'market-prophet': {
      name: 'Market Prophet',
      emoji: '🔮',
      description: 'Correctly predicted 5 live market outcomes',
      rarity: 'Rare',
      points: 600,
      nftMetadata: {
        background: 'gradient-gold',
        trait: 'Future Seer',
        power: 12
      }
    },
    
    // Legendary Badges (Diamond NFTs)
    'nobel-laureate': {
      name: 'Nobel Laureate',
      emoji: '🏅',
      description: 'Reached top 1% globally in behavioral economics mastery',
      rarity: 'Legendary',
      points: 1000,
      nftMetadata: {
        background: 'gradient-diamond',
        trait: 'Legendary Scholar',
        power: 20,
        special: 'Animated'
      }
    },
    'grand-master': {
      name: 'Grand Master',
      emoji: '👑',
      description: 'Earned all other badges and maintained #1 rank for 30 days',
      rarity: 'Mythic',
      points: 2000,
      nftMetadata: {
        background: 'gradient-mythic',
        trait: 'Ultimate Predictor',
        power: 50,
        special: 'Ultra-Rare Animated'
      }
    }
  }

  // Game rules for badges
  const gameRules = {
    // How to earn badges
    badges: {
      'first-challenge': () => predictions.length >= 1,
      'system-1-survivor': () => predictions.some(p => p.question.includes('bat and ball') && p.points_earned > 50),
      'crowd-beater': () => crowdBeats >= 5,
      'bias-slayer': () => predictions.filter(p => p.points_earned > p.points_earned * 0.8).length >= 10,
      'streak-master': () => streak >= 10,
      'perfect-calibration': () => {
        const estimates = predictions.filter(p => p.prediction !== null)
        return estimates.length >= 20 && estimates.filter(p => p.points_earned > 0.9).length >= 18
      },
      'thaler-scholar': () => predictions.filter(p => p.question.includes('endowment') || p.question.includes('nudge')).length >= 5,
      'market-prophet': () => predictions.filter(p => p.status === 'resolved' && p.points_earned > 0.8).length >= 5,
      'nobel-laureate': () => userRank !== null && userRank <= 50 && userScore >= 10000,
      'grand-master': () => userRank === 1 && userScore >= 25000 && Object.keys(badgeSystem).length - 1 === badges.length
    } as Record<BadgeId, () => boolean>,
    
    // Scoring system
    scoring: {
      basePoints: {
        'choice-correct': 100,
        'choice-wrong': 25,
        'estimate-perfect': 200,
        'estimate-good': 100,
        'estimate-poor': 25
      },
      multipliers: {
        'beat-crowd': 1.5,
        'streak-3': 1.1,
        'streak-7': 1.25,
        'streak-15': 1.5,
        'first-try': 1.2
      }
    },
    
    // NFT Badge Properties
    nftProperties: {
      'Common': { 
        supply: 'Unlimited', 
        transferable: true, 
        stakeable: false,
        marketValue: 'No guaranteed value - market determined'
      },
      'Uncommon': { 
        supply: 'Limited to 10,000', 
        transferable: true, 
        stakeable: true,
        marketValue: 'No guaranteed value - market determined'
      },
      'Rare': { 
        supply: 'Limited to 1,000', 
        transferable: true, 
        stakeable: true,
        marketValue: 'No guaranteed value - market determined'
      },
      'Legendary': { 
        supply: 'Limited to 100', 
        transferable: true, 
        stakeable: true,
        marketValue: 'No guaranteed value - market determined'
      },
      'Mythic': { 
        supply: 'Limited to 10', 
        transferable: true, 
        stakeable: true,
        marketValue: 'No guaranteed value - market determined'
      }
    } as Record<RarityType, {
      supply: string
      transferable: boolean
      stakeable: boolean
      marketValue: string
    }>
  }

  // Check for new badges after each game
  const checkForNewBadges = () => {
    (Object.keys(badgeSystem) as BadgeId[]).forEach(badgeId => {
      if (!badges.includes(badgeId) && gameRules.badges[badgeId]?.()) {
        setBadges(prev => [...prev, badgeId])
        setNewBadge(badgeSystem[badgeId])
        setShowBadgeModal(true)
        
        // Add bonus points for earning badge
        setUserScore(prev => prev + badgeSystem[badgeId].points)
        
        // Show achievement toast
        const badge = badgeSystem[badgeId]
        showAchievement({
          id: badgeId,
          title: `${badge.name} Unlocked!`,
          description: badge.description,
          icon: badge.emoji,
          points: badge.points,
          rarity: badge.rarity.toLowerCase() as 'common' | 'rare' | 'epic' | 'legendary'
        })
      }
    })
  }

  // Handle NFT minting simulation
  const handleMintBadge = async () => {
    if (!newBadge) return
    
    setIsMinting(true)
    
    // Simulate blockchain minting process
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Generate mock NFT metadata
    const nftMetadata = {
      name: newBadge.name,
      description: newBadge.description,
      image: `https://probabl.app/badges/${newBadge.name.toLowerCase().replace(/\s+/g, '-')}.png`,
      attributes: [
        { trait_type: 'Rarity', value: newBadge.rarity },
        { trait_type: 'Points', value: newBadge.points },
        { trait_type: 'Power', value: newBadge.nftMetadata.power },
        { trait_type: 'Background', value: newBadge.nftMetadata.background },
        { trait_type: 'Trait', value: newBadge.nftMetadata.trait },
        { trait_type: 'Earned Date', value: new Date().toISOString() }
      ],
      external_url: 'https://probabl.app',
      background_color: '000000'
    }
    
    // Store minted badge
    const badgeId = Object.entries(badgeSystem).find(([_, badge]) => badge === newBadge)?.[0]
    if (badgeId) {
      setMintedBadges(prev => [...prev, badgeId])
      
      // Store in localStorage
      const storedMints = JSON.parse(localStorage.getItem('mintedBadges') || '[]')
      storedMints.push({
        badgeId,
        metadata: nftMetadata,
        mintedAt: new Date().toISOString(),
        txHash: `0x${Math.random().toString(16).substr(2, 64)}` // Mock transaction hash
      })
      localStorage.setItem('mintedBadges', JSON.stringify(storedMints))
    }
    
    setIsMinting(false)
    
    // Show success message
    alert(`🎉 Badge minted successfully!\n\nMock Transaction Hash:\n0x${Math.random().toString(16).substr(2, 8)}...\n\nYour ${newBadge.name} badge is now in your collection!`)
    
    setShowBadgeModal(false)
    setNewBadge(null)
  }

  // Generate crowd data for challenges
  const generateCrowdData = (challenge: any) => {
    const participantCount = Math.floor(Math.random() * 50) + 20 // 20-70 participants
    
    if (challenge.type === 'choice') {
      const distributions = challenge.options.map((option: string, index: number) => {
        // Make correct answer slightly less popular (crowd is often wrong!)
        const isCorrect = option === challenge.correctAnswer
        const baseChance = isCorrect ? 0.3 : 0.7 / (challenge.options.length - 1)
        const votes = Math.floor(participantCount * (baseChance + Math.random() * 0.3))
        return { option, votes, percentage: Math.round((votes / participantCount) * 100) }
      })
      
      return {
        participantCount,
        distributions,
        crowdChoice: distributions.reduce((prev: any, current: any) => (prev.votes > current.votes) ? prev : current).option,
        topReasons: getContextualReasons(challenge)
      }
    } else {
      // For estimates, generate a distribution around the anchor
      const estimates = []
      const anchor = challenge.anchor || challenge.correctAnswer
      
      for (let i = 0; i < participantCount; i++) {
        // Simulate anchoring bias - most estimates cluster around anchor
        const bias = (Math.random() - 0.5) * 0.8 + 1 // 0.6 to 1.4 multiplier
        estimates.push(Math.round(anchor * bias))
      }
      
      const crowdAverage = Math.round(estimates.reduce((a, b) => a + b, 0) / estimates.length)
      
      return {
        participantCount,
        estimates,
        crowdAverage,
        distribution: generateHistogram(estimates),
        topReasons: getContextualReasons(challenge)
      }
    }
  }

  const generateHistogram = (estimates: number[]) => {
    const min = Math.min(...estimates)
    const max = Math.max(...estimates)
    const buckets = 5
    const bucketSize = (max - min) / buckets
    
    const histogram = Array(buckets).fill(0).map((_, i) => ({
      range: `${Math.round(min + i * bucketSize)}-${Math.round(min + (i + 1) * bucketSize)}`,
      count: 0
    }))
    
    estimates.forEach(est => {
      const bucketIndex = Math.min(Math.floor((est - min) / bucketSize), buckets - 1)
      histogram[bucketIndex].count++
    })
    
    return histogram
  }

  // Generate contextual crowd reasoning based on the specific challenge
  const getContextualReasons = (challenge: any) => {
    const reasonsByChallenge: { [key: string]: string[] } = {
      'duke-outcome-bias': [
        "The board should focus on results, not process",
        "If it failed, the decision was obviously wrong", 
        "Companies need accountability for bad outcomes"
      ],
      'kahneman-fast-slow': [
        "Most people go with their gut reaction",
        "The obvious answer usually feels right",
        "Quick math seems straightforward"
      ],
      'thaler-endowment': [
        "I just got it, so it's more valuable to me now",
        "I wouldn't want to lose something I own",
        "It feels wrong to sell for the same price"
      ],
      'kahneman-availability': [
        "Shark attacks get way more media coverage",
        "I can easily remember shark attack stories",
        "Airplane parts falling seems extremely rare"
      ]
    }
    
    return reasonsByChallenge[challenge.id] || [
      "Most people go with gut instinct here",
      "This feels like the obvious answer",
      "Initial reaction usually guides the choice"
    ]
  }
  // Get this week's challenges
  const [quickChallenges, setQuickChallenges] = useState<any[]>([])
  const [allWeekCompleted, setAllWeekCompleted] = useState(false)
  
  useEffect(() => {
    const challenges = getWeeklyChallenges()
    setQuickChallenges(challenges)
    
    // Check if all this week's challenges are completed
    const completed = hasCompletedThisWeek(completedChallenges)
    setAllWeekCompleted(completed)
  }, [completedChallenges])

  const liveMarkets = [
    {
      id: 1,
      question: "Will the Federal Reserve cut rates by 0.5% or more before March 2025?",
      timeLeft: "67d 14h",
      participants: 147,
      averageGuess: 73,
      prize: "🏅 Prophet Badge",
      difficulty: "Medium",
      category: "Economics",
      yourLastGuess: null,
      inspiration: "Thaler's nudge theory shows how framing affects decisions - see how the crowd's guess influences yours!"
    },
    {
      id: 2,
      question: "Will a major AI company (OpenAI, Google, Anthropic) announce AGI before 2026?",
      timeLeft: "89d 6h",
      participants: 203,
      averageGuess: 34,
      prize: "🤖 AI Oracle Badge",
      difficulty: "Hard",
      category: "Technology",
      yourLastGuess: 45,
      inspiration: "Kahneman warned about the planning fallacy - tech predictions are notoriously overconfident!"
    }
  ]



  // Handle challenge answers with crowd comparison
  const handleChallengeAnswer = (challenge: any, answer: any) => {
    setLoading(true)
    
    // Generate crowd data when user submits
    const crowd = generateCrowdData(challenge)
    setCrowdData(crowd)
    
    // Simple scoring logic
    let points = 0
    let feedback = ""
    let beatCrowd = false
    
    if (challenge.type === 'choice') {
      const isCorrect = answer === challenge.correctAnswer
      const crowdWasWrong = crowd.crowdChoice !== challenge.correctAnswer
      
      console.log('Debug:', { answer, correctAnswer: challenge.correctAnswer, isCorrect })
      
      if (isCorrect) {
        points = challenge.points
        feedback = `🎉 Correct! ${challenge.explanation}`
        if (crowdWasWrong) {
          beatCrowd = true
          points = Math.floor(points * 1.5) // Bonus for beating crowd
          feedback += `\n\n🔥 CROWD BEAT! +50% bonus! Most people chose "${crowd.crowdChoice}"`
        }
      } else {
        points = Math.floor(challenge.points * 0.3)
        feedback = `❌ Wrong. ${challenge.explanation}`
      }
    } else if (challenge.type === 'estimate') {
      // Convert to number and check if valid
      const userEstimate = Number(answer)
      const correctAnswer = Number(challenge.correctAnswer)
      
      if (isNaN(userEstimate) || userEstimate <= 0) {
        points = 0
        feedback = `❌ Please enter a valid number! The correct answer was ${correctAnswer}.`
      } else {
        const userError = Math.abs(userEstimate - correctAnswer) / correctAnswer
        const crowdError = crowd.crowdAverage ? Math.abs(crowd.crowdAverage - correctAnswer) / correctAnswer : 1
        
        beatCrowd = userError < crowdError
        
        const accuracy = 1 - userError
        points = Math.floor(challenge.points * Math.max(0.1, accuracy))
        
        if (beatCrowd && crowd.crowdAverage) {
          points = Math.floor(points * 1.3) // Bonus for beating crowd
          feedback = `🎯 Your estimate: ${userEstimate}\n🔥 CROWD BEAT! (Crowd avg: ${crowd.crowdAverage})\nActual: ${correctAnswer}\n+30% bonus!`
        } else {
          feedback = `Your estimate: ${userEstimate}\nCrowd average: ${crowd.crowdAverage || 'N/A'}\nActual: ${correctAnswer}\nAccuracy: ${Math.round(Math.max(0, accuracy) * 100)}%`
        }
        
        feedback += `\n\n${challenge.explanation}`
      }
    }
    
    // Store result for display
    setLastResult({
      points,
      challengePoints: challenge.points,
      beatCrowd
    })
    
    // Update score and assign initial rank for first-time players
    if (!isNaN(points) && points > 0) {
      const newScore = userScore + points
      setUserScore(newScore)
      
      // Assign initial rank when user gets their first points
      if (userRank === null && newScore > 0) {
        const initialRank = Math.floor(Math.random() * 50) + 950 // Start somewhere between 950-1000
        setUserRank(initialRank)
      }
      
      setStreak(prev => prev + (points > challenge.points * 0.7 ? 1 : 0))
    }
    
    if (beatCrowd) {
      setCrowdBeats(prev => prev + 1)
      // Fire confetti for beating the crowd
      fireConfetti()
    }

    // Mark challenge as completed to prevent re-doing
    if (!completedChallenges.includes(challenge.id)) {
      setCompletedChallenges(prev => [...prev, challenge.id])
    }
    
    setTimeout(() => {
      if (gameMode === 'crowd') {
        setShowCrowdResults(true)
      } else {
        alert(`+${points} points! ${feedback}`)
        setShowResult(false)
        setSelectedChallenge(null)
        setLoading(false)
        setUserAnswer('')
      }
      
      // Check for new badges after delay - but do this for both modes
      setTimeout(() => checkForNewBadges(), 500)
    }, 1000)
  }

  // Handle bet placement
  const handlePlaceBet = (market: any, position: string) => {
    const amount = parseInt(betAmount)
    if (amount > 0 && amount <= userScore) {
      setUserScore(prev => prev - amount)
      setUserBets(prev => [...prev, {
        market,
        position,
        amount,
        timestamp: new Date().toISOString()
      }])
      alert(`Bet placed! ${amount} points on ${position.toUpperCase()}`)
      setSelectedBet(null)
      setBetAmount('')
    }
  }

  // Handle market prediction submission
  const handleMarketPrediction = () => {
    // Check if user has already predicted on this market
    if (completedMarkets.includes(selectedMarket.id)) {
      alert('⚠️ You have already made a prediction on this market!\n\nYou can only predict once per market to keep the game fair.')
      setShowMarketModal(false)
      setSelectedMarket(null)
      setMarketPrediction('')
      return
    }

    const prediction = parseInt(marketPrediction)
    if (isNaN(prediction) || prediction < 0 || prediction > 100) {
      alert('Please enter a valid percentage between 0 and 100')
      return
    }

    // Calculate points based on how close to the average
    const difference = Math.abs(prediction - selectedMarket.averageGuess)
    let points = 0
    let feedback = ''

    if (difference <= 5) {
      points = 100
      feedback = '🎯 Excellent! Very close to the crowd consensus!'
    } else if (difference <= 15) {
      points = 50
      feedback = '👍 Good prediction! Reasonably aligned with the crowd.'
    } else {
      points = 25
      feedback = '🤔 Interesting contrarian view! Time will tell if you\'re right.'
    }

    setUserScore(prev => prev + points)
    
    // Mark this market as completed
    setCompletedMarkets(prev => [...prev, selectedMarket.id])
    
    // Store the prediction
    const newPrediction: Prediction = {
      id: Date.now().toString(),
      user_email: userEmail,
      question: selectedMarket.question,
      prediction: prediction,
      confidence: 50,
      reasoning: selectedMarket.inspiration,
      bias_check: '',
      created_at: new Date().toISOString(),
      status: 'pending',
      points_earned: points
    }
    
    setPredictions(prev => [...prev, newPrediction])
    
    alert(`+${points} points! ${feedback}\n\nYour prediction: ${prediction}%\nCrowd average: ${selectedMarket.averageGuess}%`)
    
    setShowMarketModal(false)
    setSelectedMarket(null)
    setMarketPrediction('')
    
    // Check for badges
    setTimeout(() => checkForNewBadges(), 500)
  }

  return (
    <MobileLayout
      onSwipeUp={() => {
        // Navigate to next tab
        const tabs = ['home', 'challenges', 'markets', 'progress', 'badges', 'leaderboard']
        const currentIndex = tabs.indexOf(activeTab)
        if (currentIndex < tabs.length - 1) {
          setActiveTab(tabs[currentIndex + 1])
        }
      }}
      onSwipeDown={() => {
        // Navigate to previous tab
        const tabs = ['home', 'challenges', 'markets', 'progress', 'badges', 'leaderboard']
        const currentIndex = tabs.indexOf(activeTab)
        if (currentIndex > 0) {
          setActiveTab(tabs[currentIndex - 1])
        }
      }}
    >
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-white pb-32 md:pb-0 overflow-visible">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-xl border-b border-white/10 animate-fadeIn">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-4">
              <motion.div 
                className="text-xl md:text-2xl"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                🎯
              </motion.div>
              <div className="animate-slideInRight">
                <h1 className="text-lg md:text-xl font-bold gradient-text-animate">
                  Probabl
                </h1>
                <p className="hidden md:block text-xs text-gray-300">Beat cognitive biases • Earn legendary badges</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 md:space-x-4">
              <AuthButton />
              {/* Social Features */}
              <div className="hidden md:flex items-center space-x-2">
                <SocialChallenge userScore={userScore} userName={userEmail || 'Player'} />
                <ShareableResultCard 
                  score={userScore} 
                  rank={userRank} 
                  topBias="Loss Aversion"
                  accuracy={Math.round((badges.length / Object.keys(badgeSystem).length) * 100)}
                  badges={badges}
                />
              </div>
              <div className="hidden sm:flex items-center space-x-2 md:space-x-4" id="score-display">
                <div className="text-center">
                  <AnimatedScore 
                    value={userScore} 
                    prefix="$" 
                    className="text-sm md:text-lg font-bold text-green-400"
                  />
                  <div className="text-xs text-gray-400">Score</div>
                </div>
                <div className="text-center">
                  <div className="text-sm md:text-lg font-bold text-yellow-400">
                    {userRank ? `#${userRank}` : 'Unranked'}
                  </div>
                  <div className="text-xs text-gray-400">Rank</div>
                </div>
                <div className="text-center">
                  <div className="text-sm md:text-lg font-bold text-orange-400">
                    {streak > 0 ? `${streak}🔥` : '0'}
                  </div>
                  <div className="text-xs text-gray-400">Streak</div>
                </div>
                {activeTab === 'challenges' && gameMode === 'crowd' && (
                  <div className="text-center">
                    <div className="text-sm md:text-lg font-bold text-purple-400">{crowdBeats}🎯</div>
                    <div className="text-xs text-gray-400">Crowd Beats</div>
                  </div>
                )}
              </div>
              {/* Mobile score only */}
              <div className="sm:hidden text-center">
                <div className="text-sm font-bold text-green-400">${userScore}</div>
                <div className="text-xs text-gray-400">Score</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Challenge Mode Banner */}
      {challengeMode && (
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 px-6 text-center">
          <p className="text-lg font-bold">
            🎯 Challenge Mode Active! Beat {challengeMode.challengerName}'s score of {challengeMode.targetScore} points!
          </p>
          {userScore >= challengeMode.targetScore && (
            <p className="text-sm mt-2">
              🎉 Congratulations! You've beaten the challenge! Share your victory!
            </p>
          )}
        </div>
      )}

      {/* Hero Section */}
      <AnimatePresence mode="wait">
        {activeTab === 'home' && (
          <motion.div 
            className="max-w-6xl mx-auto px-4 md:px-8 py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-16">
              <div className="text-6xl mb-6 animate-float">🧠💰</div>
              <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-fadeInUp">
                Can You Beat Your Own Brain?
              </h2>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto animate-fadeInUp stagger-1">
                Predict the future. Outsmart cognitive biases. Earn legendary badges.
                <br />
                <span className="text-purple-400 font-semibold">Master the behavioral economics insights that win Nobel Prizes.</span>
              </p>
            
            {/* Quick Demo */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 max-w-2xl mx-auto mb-16">
              <h3 className="text-2xl font-bold mb-6 text-center">⚡ Loss Aversion Demo</h3>
              <div className="text-lg text-gray-300 mb-6">
                <strong>"Would you rather have a guaranteed $500, or a 50% chance to win $1,100?"</strong>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button 
                  onClick={() => alert('❌ Classic loss aversion! The 50% bet has an expected value of $550, which is MORE than $500. But your brain hates the risk of getting nothing. This irrational fear costs investors millions! Nobel laureate Kahneman proved we feel losses twice as strongly as gains. +0 points, try the math!')}
                  className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-300 py-4 px-6 rounded-xl transition-all duration-300 font-semibold text-lg"
                >
                  💵 Take $500
                </button>
                <button 
                  onClick={() => alert('🎉 Brilliant! You did the math: 50% × $1,100 = $550 expected value, which beats $500. Most people can\'t do this - loss aversion makes them take the "safe" but WORSE option. You just demonstrated the kind of thinking that wins in markets! +75 points!')}
                  className="bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-300 py-4 px-6 rounded-xl transition-all duration-300 font-semibold text-lg"
                >
                  🎲 Take the bet
                </button>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-300 mb-4">
                  👆 This tests <strong>System 1 vs System 2 thinking</strong> from Daniel Kahneman's Nobel Prize-winning work.
                </p>
                <button 
                  onClick={() => setActiveTab('challenges')}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-bold text-lg hover:scale-105 transform transition-all duration-300"
                >
                  Play This Week's 4 Challenges 🧠
                </button>
                
                {/* TikTok Mode Button - Mobile Only */}
                <button 
                  onClick={() => setShowTikTokMode(true)}
                  className="md:hidden mt-4 bg-black border-2 border-white text-white px-8 py-3 rounded-xl font-bold text-lg hover:scale-105 transform transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span>🎵</span>
                  <span>TikTok Mode</span>
                  <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">NEW</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>

      {/* Desktop Navigation */}
      <div className="desktop-nav flex justify-center space-x-2 mb-8 px-4 flex-wrap">
        {[
          { id: 'home', label: '🏠 Home' },
          { id: 'challenges', label: '⚡ Quick Challenges' },
          { id: 'markets', label: '📈 Live Markets' },
          { id: 'progress', label: '📊 Progress' },
          { id: 'badges', label: '🏆 Badge Collection' },
          { id: 'leaderboard', label: '👑 Leaderboard' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-purple-500 text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Mobile Navigation */}
      <div className="mobile-nav">
        <div className="flex justify-around items-center w-full px-4">
          {[
            { id: 'home', icon: '🏠', label: 'Home' },
            { id: 'challenges', icon: '⚡', label: 'Play' },
            { id: 'markets', icon: '📈', label: 'Markets' },
            { id: 'badges', icon: '🏆', label: 'Badges' },
            { id: 'leaderboard', icon: '👑', label: 'Rank' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'text-purple-400'
                  : 'text-gray-400'
              }`}
            >
              <span className="text-xl mb-1">{tab.icon}</span>
              <span className="text-xs">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Challenges */}
      {activeTab === 'challenges' && (
        <div className="max-w-4xl mx-auto px-4 md:px-8 pb-12">
          <h2 className="text-3xl font-bold text-center mb-4">⚡ Behavioral Economics Challenges</h2>
          <p className="text-center text-gray-300 mb-6">Test your brain against Nobel Prize winners Kahneman & Thaler, plus decision strategist Annie Duke.</p>
          
          {/* Mode Selector */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-1 border border-white/10">
              <button
                onClick={() => setGameMode('solo')}
                className={`px-4 py-2 rounded-lg text-sm transition-all duration-300 ${
                  gameMode === 'solo'
                    ? 'bg-purple-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                🎯 Solo Training
              </button>
              <button
                onClick={() => setGameMode('crowd')}
                className={`px-4 py-2 rounded-lg text-sm transition-all duration-300 ${
                  gameMode === 'crowd'
                    ? 'bg-purple-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                👥 Beat the Crowd
              </button>
            </div>
          </div>

          {gameMode === 'crowd' && (
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-xl p-4 mb-6 border border-purple-500/30">
              <div className="text-center">
                <h3 className="text-lg font-bold text-white mb-2">🔥 Beat the Crowd Mode</h3>
                <p className="text-sm text-gray-300">
                  See how your answers compare to other players. Beat the crowd to earn bonus points!
                </p>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickChallenges.map((challenge, index) => {
              const isCompleted = completedChallenges.includes(challenge.id)
              return (
                <motion.div 
                  key={challenge.id} 
                  className={`
                    bg-white/5 backdrop-blur-xl rounded-2xl p-6 border cursor-pointer hover-lift animate-scaleIn
                    ${isCompleted ? 'border-green-500/50 bg-green-500/10' : 'border-white/10 hover:border-purple-500/50 hover-glow'}
                  `}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => !isCompleted && setSelectedChallenge(challenge)}>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-white">{challenge.title}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs bg-purple-500/30 text-purple-300 px-2 py-1 rounded-full">+{challenge.points} pts</span>
                      {isCompleted && <span className="text-green-400 text-lg">✅</span>}
                    </div>
                  </div>
                  <p className="text-gray-300 mb-4">{challenge.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-400">
                    <span>⏱️ {challenge.timeToComplete}</span>
                    <span className={`font-semibold ${isCompleted ? 'text-green-400' : 'text-purple-400'}`}>
                      {isCompleted ? 'Completed' : 'Play →'}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Weekly refresh notice */}
          <div className="text-center mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
            {allWeekCompleted ? (
              <div>
                <p className="text-sm text-green-400 font-semibold mb-2">
                  ✅ Great job! You've completed all of this week's challenges!
                </p>
                <p className="text-sm text-gray-300">
                  🔄 Come back in {getDaysUntilNextWeek()} days for 4 new behavioral economics puzzles.
                </p>
                <button 
                  onClick={() => {
                    const nextWeek = getNextWeeksChallenges()
                    const titles = nextWeek.map((c: any) => c.title).join(', ')
                    alert(`Next week's challenges: ${titles}`)
                  }}
                  className="mt-2 text-xs text-purple-400 hover:text-purple-300 underline"
                >
                  Preview next week's challenges →
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-300">
                🔄 Challenges refresh weekly every Monday. Complete all 4 challenges before the week ends!
              </p>
            )}
          </div>

          {/* Challenge Modal */}
          <AnimatePresence>
            {selectedChallenge && !showCrowdResults && (
              <motion.div 
                className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  setSelectedChallenge(null)
                  setShowCrowdResults(false)
                  setCrowdData(null)
                  setLastResult(null)
                }}
              >
                <motion.div 
                  className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 max-w-2xl w-full"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  onClick={(e) => e.stopPropagation()}
                >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold">{selectedChallenge.title}</h3>
                  <button onClick={() => {
                    setSelectedChallenge(null)
                    setShowCrowdResults(false)
                    setCrowdData(null)
                    setLastResult(null)
                  }} className="text-gray-400 hover:text-white">✕</button>
                </div>
                
                {gameMode === 'crowd' && (
                  <div className="mb-4 p-3 bg-purple-500/20 rounded-xl border border-purple-500/30">
                    <p className="text-sm text-purple-300">
                      👥 {Math.floor(Math.random() * 20) + 15} people have already answered this question
                    </p>
                  </div>
                )}
                
                <div className="mb-6">
                  <p className="text-lg text-white mb-4">{selectedChallenge.question}</p>
                  
                  {selectedChallenge.type === 'choice' && (
                    <div className="space-y-3">
                      {selectedChallenge.options.map((option: string) => (
                        <button
                          key={option}
                          onClick={() => handleChallengeAnswer(selectedChallenge, option)}
                          disabled={loading}
                          className="w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-left transition-all duration-300 disabled:opacity-50"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {selectedChallenge.type === 'estimate' && (
                    <div className="space-y-4">
                      <input
                        type="number"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white text-center text-xl"
                        placeholder="Enter your estimate"
                        disabled={loading}
                      />
                      <button
                        onClick={() => handleChallengeAnswer(selectedChallenge, userAnswer ? parseInt(userAnswer) : 0)}
                        disabled={loading || !userAnswer || isNaN(Number(userAnswer))}
                        className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
                      >
                        {loading ? 'Processing...' : 'Submit Answer'}
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

          {/* Betting Modal */}
          {selectedBet && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-white/20">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-white">Place Bet</h3>
                  <button onClick={() => setSelectedBet(null)} className="text-gray-400 hover:text-white">✕</button>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-white mb-2">{selectedBet.market.title}</h4>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-gray-300">Betting on:</span>
                    <span className={`font-bold ${selectedBet.position === 'yes' ? 'text-green-400' : 'text-red-400'}`}>
                      {selectedBet.position.toUpperCase()}
                    </span>
                    <span className="text-gray-300">at {Math.round((selectedBet.position === 'yes' ? selectedBet.market.yesPrice : selectedBet.market.noPrice) * 100)}¢</span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Bet Amount (Max: ${userScore})
                  </label>
                  <input
                    type="number"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    placeholder="Enter amount..."
                    min="1"
                    max={userScore}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                </div>

                {betAmount && parseInt(betAmount) > 0 && (
                  <div className="mb-4 p-3 bg-white/5 rounded-xl">
                    <div className="text-sm text-gray-300">
                      <div>Bet Amount: ${betAmount}</div>
                      <div>Potential Win: ${Math.floor(parseInt(betAmount) / (selectedBet.position === 'yes' ? selectedBet.market.yesPrice : selectedBet.market.noPrice))}</div>
                      <div>Profit if correct: ${Math.floor(parseInt(betAmount) / (selectedBet.position === 'yes' ? selectedBet.market.yesPrice : selectedBet.market.noPrice)) - parseInt(betAmount)}</div>
                    </div>
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    onClick={() => handlePlaceBet(selectedBet.market, selectedBet.position)}
                    disabled={!betAmount || parseInt(betAmount) <= 0 || parseInt(betAmount) > userScore}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all"
                  >
                    Place Bet
                  </button>
                  <button
                    onClick={() => setSelectedBet(null)}
                    className="px-6 py-3 border border-white/20 text-white rounded-xl hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Crowd Results Modal */}
          {showCrowdResults && crowdData && lastResult && selectedChallenge && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold">👥 Crowd Results</h3>
                  <button onClick={() => {
                    setShowCrowdResults(false)
                    setSelectedChallenge(null)
                    setCrowdData(null)
                    setLoading(false)
                    setUserAnswer('')
                  }} className="text-gray-400 hover:text-white">✕</button>
                </div>
                
                <div className="space-y-6">
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <h4 className="text-lg font-bold mb-2">📊 {crowdData.participantCount} People Participated</h4>
                  </div>

                  {selectedChallenge.type === 'choice' && crowdData.distributions && (
                    <div>
                      <h4 className="text-lg font-bold mb-4">How the crowd voted:</h4>
                      <div className="space-y-3">
                        {crowdData.distributions.map((dist: any) => (
                          <div key={dist.option} className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                            <span className={dist.option === selectedChallenge.correctAnswer ? 'text-green-400' : 'text-white'}>
                              {dist.option}
                            </span>
                            <div className="flex items-center space-x-2">
                              <div className="w-32 bg-gray-700 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${dist.option === selectedChallenge.correctAnswer ? 'bg-green-400' : 'bg-gray-400'}`}
                                  style={{ width: `${dist.percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-sm">{dist.percentage}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 p-3 bg-yellow-500/20 rounded-xl border border-yellow-500/30">
                        <p className="text-sm text-yellow-300">
                          💭 Crowd choice: "{crowdData.crowdChoice}"
                          {crowdData.crowdChoice === selectedChallenge.correctAnswer ? ' ✅ (Correct!)' : ' ❌ (Wrong!)'}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedChallenge.type === 'estimate' && crowdData.distribution && (
                    <div>
                      <h4 className="text-lg font-bold mb-4">Estimate Distribution:</h4>
                      <div className="space-y-2">
                        {crowdData.distribution.map((bucket: any, i: number) => (
                          <div key={i} className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                            <span className="text-sm">{bucket.range}</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-24 bg-gray-700 rounded-full h-2">
                                <div 
                                  className="h-2 rounded-full bg-blue-400"
                                  style={{ width: `${(bucket.count / crowdData.participantCount) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-xs">{bucket.count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 p-3 bg-blue-500/20 rounded-xl border border-blue-500/30">
                        <p className="text-sm text-blue-300">
                          📊 Crowd average: {crowdData.crowdAverage}
                          <br />
                          🎯 Correct answer: {selectedChallenge.correctAnswer}
                        </p>
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-lg font-bold mb-3">💭 Top Reasoning from Participants:</h4>
                    <div className="space-y-2">
                      {crowdData.topReasons.map((reason: string, i: number) => (
                        <div key={i} className="p-3 bg-white/5 rounded-xl">
                          <p className="text-sm text-gray-300">"{reason}"</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Educational Explanation */}
                  <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-4 border border-blue-500/30">
                    <h4 className="text-lg font-bold mb-3 text-blue-300">🧠 The Science Behind This</h4>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {selectedChallenge.explanation}
                    </p>
                  </div>

                  <div className="text-center pt-4">
                    <div className="mb-4 p-4 bg-white/5 rounded-xl">
                      <h4 className="text-lg font-bold mb-2">🎯 Your Result</h4>
                      <p className="text-lg">
                        <span className={`font-bold ${lastResult.points > lastResult.challengePoints * 0.7 ? 'text-green-400' : 'text-yellow-400'}`}>
                          +{lastResult.points} points!
                        </span>
                        {lastResult.beatCrowd && (
                          <span className="block text-purple-400 font-bold mt-2">
                            🔥 CROWD BEAT! Bonus points earned!
                          </span>
                        )}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => {
                        setShowCrowdResults(false)
                        setSelectedChallenge(null)
                        setCrowdData(null)
                        setLastResult(null)
                        setLoading(false)
                        setUserAnswer('')
                      }}
                      className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-xl font-semibold"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Live Markets */}
      {activeTab === 'markets' && (
        <div className="max-w-6xl mx-auto px-4 md:px-8 pb-12">
          <h2 className="text-3xl font-bold text-center mb-8">📈 Live Prediction Markets</h2>
          <p className="text-center text-gray-300 mb-6">Predict real events. Compete with thousands. Win bigger badges.</p>
          
          {/* One prediction per market notice */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-8 max-w-2xl mx-auto">
            <p className="text-sm text-yellow-300 text-center">
              ⚠️ <strong>Fair Play Rule:</strong> You can only make one prediction per market. Choose wisely!
            </p>
          </div>
          
          <div className="space-y-6">
            {liveMarkets.map((market) => {
              const hasCompleted = completedMarkets.includes(market.id)
              return (
                <div key={market.id} className={`bg-white/5 backdrop-blur-xl rounded-2xl p-6 border ${hasCompleted ? 'border-green-500/50 bg-green-500/10' : 'border-white/10'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-white">{market.question}</h3>
                    {hasCompleted && <span className="text-green-400 text-lg">✅</span>}
                  </div>
                  <div className="flex items-center space-x-6 text-sm text-gray-400 mb-4">
                    <span>⏰ {market.timeLeft}</span>
                    <span>👥 {market.participants.toLocaleString()} players</span>
                    <span>🎯 Avg: {market.averageGuess}%</span>
                    <span className="text-green-400">🏆 {market.prize}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    {!hasCompleted ? (
                      <button 
                        onClick={() => {
                          setSelectedMarket(market)
                          setShowMarketModal(true)
                        }}
                        className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-xl font-semibold"
                      >
                        Make Prediction
                      </button>
                    ) : (
                      <span className="text-sm text-green-400 font-semibold">
                        ✅ Prediction Submitted
                      </span>
                    )}
                    {market.yourLastGuess && (
                      <span className="text-sm text-gray-400">Your last: {market.yourLastGuess}%</span>
                    )}
                  </div>
                  {market.inspiration && (
                    <div className="mt-4 p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                      <p className="text-xs text-blue-300 italic">💡 {market.inspiration}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Market Prediction Modal */}
          {showMarketModal && selectedMarket && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 max-w-2xl w-full">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold">📊 Make Your Prediction</h3>
                  <button onClick={() => {
                    setShowMarketModal(false)
                    setSelectedMarket(null)
                    setMarketPrediction('')
                  }} className="text-gray-400 hover:text-white">✕</button>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-lg font-bold text-white mb-2">{selectedMarket.question}</h4>
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="bg-white/5 rounded-xl p-3">
                      <div className="text-gray-400">Time Left</div>
                      <div className="font-bold text-white">⏰ {selectedMarket.timeLeft}</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3">
                      <div className="text-gray-400">Participants</div>
                      <div className="font-bold text-white">👥 {selectedMarket.participants.toLocaleString()}</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3">
                      <div className="text-gray-400">Crowd Average</div>
                      <div className="font-bold text-white">📊 {selectedMarket.averageGuess}%</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3">
                      <div className="text-gray-400">Prize</div>
                      <div className="font-bold text-green-400">{selectedMarket.prize}</div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Your Prediction (0-100%)
                    </label>
                    <input
                      type="number"
                      value={marketPrediction}
                      onChange={(e) => setMarketPrediction(e.target.value)}
                      min="0"
                      max="100"
                      className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white text-center text-2xl"
                      placeholder="Enter percentage"
                    />
                    <div className="mt-2 text-xs text-gray-400 text-center">
                      The crowd average is {selectedMarket.averageGuess}%. Will you follow or diverge?
                    </div>
                  </div>
                  
                  {selectedMarket.inspiration && (
                    <div className="mb-4 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                      <p className="text-sm text-blue-300">💡 {selectedMarket.inspiration}</p>
                    </div>
                  )}
                  
                  <button
                    onClick={handleMarketPrediction}
                    disabled={!marketPrediction || isNaN(Number(marketPrediction))}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all"
                  >
                    Submit Prediction
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Badge Collection */}
      {activeTab === 'badges' && (
        <div className="max-w-6xl mx-auto px-4 md:px-8 pb-12">
          <h2 className="text-3xl font-bold text-center mb-4">🏆 NFT Badge Collection</h2>
          <p className="text-center text-gray-300 mb-8">
            Earn exclusive NFT badges by mastering behavioral economics. These digital collectibles have no guaranteed monetary value.
          </p>
          
          {/* User's Badge Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 text-center border border-white/10">
              <div className="text-2xl font-bold text-purple-400">{badges.length}</div>
              <div className="text-sm text-gray-400">Badges Earned</div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 text-center border border-white/10">
              <div className="text-2xl font-bold text-green-400">{mintedBadges.length}</div>
              <div className="text-sm text-gray-400">NFTs Minted</div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 text-center border border-white/10">
              <div className="text-2xl font-bold text-yellow-400">{crowdBeats}</div>
              <div className="text-sm text-gray-400">Crowd Beats</div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 text-center border border-white/10">
              <div className="text-2xl font-bold text-orange-400">{Math.round((badges.length / Object.keys(badgeSystem).length) * 100)}%</div>
              <div className="text-sm text-gray-400">Collection</div>
            </div>
          </div>

          {/* Badge Categories */}
          {['Common', 'Uncommon', 'Rare', 'Legendary', 'Mythic'].map(rarity => {
            const rarityBadges = Object.entries(badgeSystem).filter(([_, badge]) => badge.rarity === rarity)
            const earnedCount = rarityBadges.filter(([id]) => badges.includes(id as BadgeId)).length
            
            return (
              <div key={rarity} className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                    <span className={`w-3 h-3 rounded-full ${
                      rarity === 'Common' ? 'bg-gray-400' :
                      rarity === 'Uncommon' ? 'bg-green-400' :
                      rarity === 'Rare' ? 'bg-yellow-400' :
                      rarity === 'Legendary' ? 'bg-purple-400' :
                      'bg-pink-400'
                    }`}></span>
                    <span>{rarity} NFTs</span>
                  </h3>
                  <span className="text-sm text-gray-400">
                    {earnedCount}/{rarityBadges.length} collected
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rarityBadges.map(([badgeId, badge]) => {
                    const isEarned = badges.includes(badgeId as BadgeId)
                    const isMinted = mintedBadges.includes(badgeId)
                    const progress = gameRules.badges[badgeId as BadgeId] ? 
                      (gameRules.badges[badgeId as BadgeId]() ? 100 : Math.min(95, Math.random() * 60 + 20)) : 0
                    
                    return (
                      <div key={badgeId} className={`
                        bg-white/5 backdrop-blur-xl rounded-xl p-4 border transition-all duration-300 relative overflow-hidden
                        ${isEarned ? (isMinted ? 'border-purple-500/50 bg-purple-500/10' : 'border-green-500/50 bg-green-500/10') : 'border-white/10'}
                      `}>
                        {isMinted && (
                          <div className="absolute top-2 right-2">
                            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                              NFT
                            </div>
                          </div>
                        )}
                        <div className="text-center">
                          <div className={`text-4xl mb-2 ${isEarned ? (isMinted ? 'animate-pulse' : '') : 'grayscale opacity-50'}`}>
                            {badge.emoji}
                          </div>
                          <h4 className="font-bold text-white mb-1">{badge.name}</h4>
                          <p className="text-xs text-gray-400 mb-3">{badge.description}</p>
                          
                          {isEarned ? (
                            <div className="space-y-2">
                              {isMinted ? (
                                <>
                                  <div className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs">
                                    ⛓️ Minted NFT
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    On-chain collectible
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs">
                                    ✅ Earned
                                  </div>
                                  <button
                                    onClick={() => {
                                      setNewBadge(badge)
                                      setShowBadgeModal(true)
                                    }}
                                    className="text-xs text-purple-400 hover:text-purple-300 underline"
                                  >
                                    Mint as NFT
                                  </button>
                                </>
                              )}
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="w-full bg-gray-700 rounded-full h-2">
                                <div 
                                  className="h-2 bg-purple-500 rounded-full transition-all duration-300"
                                  style={{ width: `${progress}%` }}
                                ></div>
                              </div>
                              <div className="text-xs text-gray-400">
                                {progress}% progress
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
                
                {/* NFT Properties for this rarity */}
                <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-sm text-gray-300 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div><strong>Supply:</strong> {gameRules.nftProperties[rarity as RarityType].supply}</div>
                    <div><strong>Transferable:</strong> {gameRules.nftProperties[rarity as RarityType].transferable ? '✅' : '❌'}</div>
                    <div><strong>Stakeable:</strong> {gameRules.nftProperties[rarity as RarityType].stakeable ? '✅' : '❌'}</div>
                    <div><strong>Value:</strong> Market determined only</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Badge Earned Modal */}
      {showBadgeModal && newBadge && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30 max-w-md w-full text-center">
            {!isMinting ? (
              <>
                <div className="text-6xl mb-4 animate-bounce">{newBadge.emoji}</div>
                <h3 className="text-2xl font-bold text-white mb-2">🎉 Badge Earned!</h3>
                <h4 className="text-xl text-purple-300 mb-4">{newBadge.name}</h4>
                <p className="text-gray-300 mb-4">{newBadge.description}</p>
                
                <div className="bg-white/10 rounded-xl p-4 mb-6">
                  <div className="text-sm text-gray-300 space-y-2">
                    <div><strong>Rarity:</strong> <span className={`font-bold ${
                      newBadge.rarity === 'Common' ? 'text-gray-400' :
                      newBadge.rarity === 'Uncommon' ? 'text-green-400' :
                      newBadge.rarity === 'Rare' ? 'text-yellow-400' :
                      newBadge.rarity === 'Legendary' ? 'text-purple-400' :
                      'text-pink-400'
                    }`}>{newBadge.rarity}</span></div>
                    <div><strong>Digital Collectible:</strong> No guaranteed monetary value</div>
                    <div><strong>Bonus Points:</strong> <span className="text-green-400 font-bold">+{newBadge.points}</span></div>
                    <div><strong>Power Level:</strong> <span className="text-blue-400">{newBadge.nftMetadata.power}</span></div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <button
                    onClick={handleMintBadge}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300"
                  >
                    Mint NFT Badge 🎯
                  </button>
                  <button
                    onClick={() => {
                      setShowBadgeModal(false)
                      setNewBadge(null)
                    }}
                    className="w-full text-gray-400 hover:text-white text-sm"
                  >
                    Skip for now
                  </button>
                </div>
              </>
            ) : (
              <div className="py-8">
                <div className="text-6xl mb-6 animate-spin">⚡</div>
                <h3 className="text-2xl font-bold text-white mb-4">Minting Your NFT...</h3>
                <div className="mb-6">
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                    <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" style={{ width: '75%' }}></div>
                  </div>
                  <p className="text-sm text-gray-400">Simulating blockchain transaction...</p>
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>🔗 Connecting to blockchain...</p>
                  <p>📝 Creating metadata...</p>
                  <p>🎨 Generating NFT artwork...</p>
                  <p>⛓️ Confirming transaction...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {activeTab === 'leaderboard' && (
        <div className="max-w-4xl mx-auto px-4 md:px-8 pb-12">
          <RealtimeLeaderboard />
        </div>
      )}

      {/* Progress Dashboard */}
      {activeTab === 'progress' && (
        <ProgressDashboard
          userScore={userScore}
          userRank={userRank}
          streak={streak}
          badges={badges}
          crowdBeats={crowdBeats}
          predictions={predictions}
        />
      )}

      {/* Onboarding Tutorial */}
      <OnboardingTutorial />

      {/* Achievement Toast */}
      <AchievementToastComponent />
      
      {/* TikTok Mode */}
      {showTikTokMode && (
        <TikTokChallenge 
          onComplete={(points) => {
            setUserScore(prev => prev + points)
            setShowTikTokMode(false)
            alert(`🎉 TikTok Challenge Complete! +${points} points!`)
          }}
        />
      )}
    </div>
    </MobileLayout>
  )
}