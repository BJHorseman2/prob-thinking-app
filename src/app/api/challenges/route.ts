import { NextResponse } from 'next/server'

// In-memory storage for challenges
let challenges: Array<{
  id: string
  challengerId: string
  challengerName: string
  targetScore: number
  acceptedBy: Array<{
    id: string
    name: string
    score: number
    beaten: boolean
  }>
  createdAt: string
}> = []

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const challengeId = searchParams.get('id')
  
  if (challengeId) {
    const challenge = challenges.find(c => c.id === challengeId)
    return NextResponse.json({ challenge })
  }
  
  // Return all challenges
  return NextResponse.json({ challenges })
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    if (data.action === 'create') {
      // Create new challenge
      const newChallenge = {
        id: Math.random().toString(36).substring(7),
        challengerId: data.challengerId,
        challengerName: data.challengerName,
        targetScore: data.targetScore,
        acceptedBy: [],
        createdAt: new Date().toISOString()
      }
      challenges.push(newChallenge)
      
      return NextResponse.json({ 
        success: true, 
        challengeId: newChallenge.id 
      })
    } else if (data.action === 'accept') {
      // Accept challenge
      const challenge = challenges.find(c => c.id === data.challengeId)
      if (!challenge) {
        return NextResponse.json({ error: 'Challenge not found' }, { status: 404 })
      }
      
      challenge.acceptedBy.push({
        id: data.playerId,
        name: data.playerName,
        score: data.score,
        beaten: data.score >= challenge.targetScore
      })
      
      return NextResponse.json({ 
        success: true,
        beaten: data.score >= challenge.targetScore
      })
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }
} 