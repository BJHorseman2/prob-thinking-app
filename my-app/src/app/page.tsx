'use client'

import React, { useState, useEffect } from 'react'

// Supabase will be optional - app works without it
let supabase: any = null

// Try to import Supabase, but don't break if it's not installed
try {
  const { createClient } = require('@supabase/supabase-js')
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
  }
} catch (error) {
  console.log('Supabase not configured - using localStorage only')
}

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
      }
    })
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
  const quickChallenges = [
    {
      id: 'kahneman-fast-slow',
      title: '🧠 Kahneman\'s Two Systems',
      description: 'Can you resist System 1 thinking?',
      timeToComplete: '2 min',
      points: 75,
      question: 'A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?',
      type: 'estimate',
      correctAnswer: 5, // 5 cents
      explanation: 'Your System 1 (fast thinking) screams "10 cents!" But that\'s wrong. If the ball costs 10¢ and the bat costs $1 more (110¢), the total would be 120¢. The ball actually costs 5¢. This is from Kahneman\'s "Thinking, Fast and Slow" - our intuitive mind often gives us the wrong answer.',
      hint: 'Think in cents, not dollars'
    },
    {
      id: 'thaler-endowment',
      title: '🎫 Thaler\'s Endowment Effect',
      description: 'How much do you value what you own?',
      timeToComplete: '90 sec',
      points: 60,
      question: 'You just won a concert ticket worth $100 in a lottery. Minutes later, someone offers to buy it from you. What\'s the minimum you\'d accept?',
      type: 'estimate',
      correctAnswer: 100,
      explanation: 'Most people demand $150+ to sell something they just got for free! This is Thaler\'s "endowment effect" - we overvalue things simply because we own them. Rational? No. Human? Absolutely.',
      anchor: 100
    },
    {
      id: 'duke-outcome-bias',
      title: '🎲 Annie Duke\'s Outcome Bias',
      description: 'Can you judge the decision, not the result?',
      timeToComplete: '2 min',
      points: 80,
      question: 'A CEO decides to launch a risky new product with a 30% chance of success but huge upside. It fails spectacularly. The board fires him. Was this the right decision?',
      type: 'choice',
      options: ['Fire him - the product failed', 'Keep him - it was a good bet'],
      correctAnswer: 'Keep him - it was a good bet',
      explanation: 'Annie Duke calls this "resulting" - judging decisions by outcomes instead of process. The CEO made a GOOD decision with the information available: a 30% chance of huge upside is often worth taking! Yes, it failed, but that was expected 70% of the time. Firing him punishes good decision-making just because of an unlucky outcome. This bias destroys rational thinking in business, poker, and life.',
    },
    {
      id: 'kahneman-availability',
      title: '📺 Availability Heuristic',
      description: 'What kills more Americans yearly?',
      timeToComplete: '1 min',
      points: 50,
      question: 'Which kills more people in the US each year: shark attacks or falling airplane parts?',
      type: 'choice',
      options: ['Shark attacks', 'Falling airplane parts'],
      correctAnswer: 'Falling airplane parts',
      explanation: 'Falling airplane parts kill ~25 people/year, sharks kill ~1. But shark attacks get massive media coverage! Kahneman showed we judge probability by how easily examples come to mind. The news makes rare dramatic events feel common.'
    }
  ]

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

  const leaderboard = [
    { rank: 1, name: "QuantWizard", score: 8420, streak: 12, badge: "🧙‍♂️", achievements: "Legendary Prophet, Bias Slayer, Hall of Fame" },
    { rank: 2, name: "BiasSlayer", score: 7890, streak: 8, badge: "⚔️", achievements: "Master Calibrator, AI Oracle, Crypto Sage" },
    { rank: 3, name: "PredictorPro", score: 7650, streak: 15, badge: "🔮", achievements: "Perfect Month, Streak Master, Economics Expert" }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-white">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-2xl">🎯</div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Probabl
                </h1>
                <p className="text-xs text-gray-300">Beat cognitive biases • Earn legendary badges</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 md:space-x-6">
              <div className="text-center">
                <div className="text-lg md:text-xl font-bold text-green-400">${userScore}</div>
                <div className="text-xs text-gray-400">Score</div>
              </div>
              <div className="text-center">
                <div className="text-lg md:text-xl font-bold text-yellow-400">
                  {userRank ? `#${userRank}` : 'Unranked'}
                </div>
                <div className="text-xs text-gray-400">Rank</div>
              </div>
              <div className="text-center">
                <div className="text-lg md:text-xl font-bold text-orange-400">
                  {streak > 0 ? `${streak}🔥` : '0'}
                </div>
                <div className="text-xs text-gray-400">Streak</div>
              </div>
              {activeTab === 'challenges' && gameMode === 'crowd' && (
                <div className="text-center">
                  <div className="text-lg md:text-xl font-bold text-purple-400">{crowdBeats}🎯</div>
                  <div className="text-xs text-gray-400">Crowd Beats</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      {activeTab === 'home' && (
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
          <div className="text-center mb-16">
            <div className="text-6xl mb-6">🧠💰</div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Can You Beat Your Own Brain?
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
              Predict the future. Outsmart cognitive biases. Earn legendary badges.
              <br />
              <span className="text-purple-400 font-semibold">Master the behavioral economics insights that win Nobel Prizes.</span>
            </p>
            
            {/* Quick Demo */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 max-w-2xl mx-auto mb-16">
              <h3 className="text-2xl font-bold mb-6 text-center">⚡ Kahneman's Famous Puzzle</h3>
              <div className="text-lg text-gray-300 mb-6">
                <strong>"A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?"</strong>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button 
                  onClick={() => alert('❌ Your "System 1" (fast thinking) screamed this answer! But if the ball costs 10¢ and the bat costs $1 more (110¢), the total would be 120¢. The ball actually costs 5¢. From Kahneman\'s "Thinking, Fast and Slow" - our intuitive mind often tricks us! +0 points, try again?')}
                  className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-300 py-4 px-6 rounded-xl transition-all duration-300 font-semibold text-lg"
                >
                  💭 10 cents
                </button>
                <button 
                  onClick={() => alert('🎉 Correct! You beat your System 1 (fast thinking)! Most people say 10¢ because it feels right, but that would make the total $1.20. Your System 2 (slow thinking) caught the error. This is the core of behavioral economics - our brains have shortcuts that often mislead us! +75 points!')}
                  className="bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-300 py-4 px-6 rounded-xl transition-all duration-300 font-semibold text-lg"
                >
                  🧠 5 cents
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
                  Play Today's 4 Daily Challenges 🧠
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-center space-x-2 mb-8 px-4">
        {[
          { id: 'home', label: '🏠 Home' },
          { id: 'challenges', label: '⚡ Quick Challenges' },
          { id: 'markets', label: '📈 Live Markets' },
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

      {/* Quick Challenges */}
      {activeTab === 'challenges' && (
        <div className="max-w-4xl mx-auto px-4 md:px-8 pb-12">
          <h2 className="text-3xl font-bold text-center mb-4">⚡ Behavioral Economics Challenges</h2>
          <p className="text-center text-gray-300 mb-6">Test your brain against the Nobel Prize-winning insights of Kahneman, Thaler, and Annie Duke.</p>
          
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
            {quickChallenges.map((challenge) => {
              const isCompleted = completedChallenges.includes(challenge.id)
              return (
                <div key={challenge.id} className={`
                  bg-white/5 backdrop-blur-xl rounded-2xl p-6 border transition-all duration-300 cursor-pointer
                  ${isCompleted ? 'border-green-500/50 bg-green-500/10' : 'border-white/10 hover:border-purple-500/50'}
                `}
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
                </div>
              )
            })}
          </div>

          {/* Daily refresh notice */}
          <div className="text-center mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-sm text-gray-300">
              🔄 Challenges refresh daily at midnight. Come back tomorrow for 4 new questions!
            </p>
          </div>

          {/* Challenge Modal */}
          {selectedChallenge && !showCrowdResults && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 max-w-2xl w-full">
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
              </div>
            </div>
          )}

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
          <p className="text-center text-gray-300 mb-12">Predict real events. Compete with thousands. Win bigger badges.</p>
          
          <div className="space-y-6">
            {liveMarkets.map((market) => (
              <div key={market.id} className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-2">{market.question}</h3>
                <div className="flex items-center space-x-6 text-sm text-gray-400 mb-4">
                  <span>⏰ {market.timeLeft}</span>
                  <span>👥 {market.participants.toLocaleString()} players</span>
                  <span>🎯 Avg: {market.averageGuess}%</span>
                  <span className="text-green-400">🏆 {market.prize}</span>
                </div>
                <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-xl font-semibold">
                  Predict
                </button>
              </div>
            ))}
          </div>
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
              <div className="text-2xl font-bold text-green-400">{badges.length}</div>
              <div className="text-sm text-gray-400">Badges Collected</div>
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
                    const progress = gameRules.badges[badgeId as BadgeId] ? 
                      (gameRules.badges[badgeId as BadgeId]() ? 100 : Math.min(95, Math.random() * 60 + 20)) : 0
                    
                    return (
                      <div key={badgeId} className={`
                        bg-white/5 backdrop-blur-xl rounded-xl p-4 border transition-all duration-300
                        ${isEarned ? 'border-green-500/50 bg-green-500/10' : 'border-white/10'}
                      `}>
                        <div className="text-center">
                          <div className={`text-4xl mb-2 ${isEarned ? '' : 'grayscale opacity-50'}`}>
                            {badge.emoji}
                          </div>
                          <h4 className="font-bold text-white mb-1">{badge.name}</h4>
                          <p className="text-xs text-gray-400 mb-3">{badge.description}</p>
                          
                          {isEarned ? (
                            <div className="space-y-2">
                              <div className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs">
                                ✅ Owned
                              </div>
                              <div className="text-xs text-gray-400">
                                Achievement unlocked - no monetary value
                              </div>
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
            <div className="text-6xl mb-4">{newBadge.emoji}</div>
            <h3 className="text-2xl font-bold text-white mb-2">🎉 Badge Earned!</h3>
            <h4 className="text-xl text-purple-300 mb-4">{newBadge.name}</h4>
            <p className="text-gray-300 mb-4">{newBadge.description}</p>
            
            <div className="bg-white/10 rounded-xl p-4 mb-6">
              <div className="text-sm text-gray-300 space-y-2">
                <div><strong>Rarity:</strong> {newBadge.rarity}</div>
                <div><strong>Digital Collectible:</strong> No guaranteed monetary value</div>
                <div><strong>Bonus Points:</strong> +{newBadge.points}</div>
              </div>
            </div>
            
            <button
              onClick={() => {
                setShowBadgeModal(false)
                setNewBadge(null)
              }}
              className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-xl font-semibold"
            >
              Mint NFT Badge 🎯
            </button>
          </div>
        </div>
      )}
      {activeTab === 'leaderboard' && (
        <div className="max-w-4xl mx-auto px-4 md:px-8 pb-12">
          <h2 className="text-3xl font-bold text-center mb-8">🏆 Global Leaderboard</h2>
          
          <div className="space-y-4">
            {leaderboard.map((player) => (
              <div key={player.rank} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">
                    {player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : player.rank === 3 ? '🥉' : `#${player.rank}`}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white">{player.name}</span>
                      <span className="text-lg">{player.badge}</span>
                    </div>
                    <div className="text-sm text-gray-400">{player.achievements}</div>
                  </div>
                </div>
                <div className="text-xl font-bold text-green-400">{player.score.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}