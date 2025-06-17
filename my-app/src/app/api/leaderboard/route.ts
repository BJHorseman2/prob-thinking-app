import { NextResponse } from 'next/server'

// In-memory storage (resets when server restarts)
// In production, replace with database or Redis
let leaderboard: Array<{
  id: string
  name: string
  score: number
  badges: string[]
  timestamp: string
}> = []

export async function GET() {
  // Return top 100 players
  const topPlayers = leaderboard
    .sort((a, b) => b.score - a.score)
    .slice(0, 100)
  
  return NextResponse.json({ leaderboard: topPlayers })
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Find existing player or create new entry
    const existingIndex = leaderboard.findIndex(p => p.id === data.id)
    
    if (existingIndex >= 0) {
      // Update existing player if score is higher
      if (data.score > leaderboard[existingIndex].score) {
        leaderboard[existingIndex] = {
          ...data,
          timestamp: new Date().toISOString()
        }
      }
    } else {
      // Add new player
      leaderboard.push({
        ...data,
        timestamp: new Date().toISOString()
      })
    }
    
    // Get player's rank
    const sorted = leaderboard.sort((a, b) => b.score - a.score)
    const rank = sorted.findIndex(p => p.id === data.id) + 1
    
    return NextResponse.json({ 
      success: true, 
      rank,
      total: leaderboard.length 
    })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }
} 