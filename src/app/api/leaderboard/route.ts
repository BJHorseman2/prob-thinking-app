import { NextResponse } from 'next/server'
import { DataService } from '@/lib/dataService'

export async function GET() {
  try {
    const leaderboard = await DataService.getLeaderboard(100)
    return NextResponse.json({ leaderboard })
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId, score, streak, crowd_beats } = await request.json()
    
    if (!userId || typeof score !== 'number') {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    // Update user profile with new score
    const updatedProfile = await DataService.updateUserProfile(userId, {
      score,
      streak: streak || 0,
      crowd_beats: crowd_beats || 0
    })
    
    if (!updatedProfile) {
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }
    
    // Get updated leaderboard to calculate rank
    const leaderboard = await DataService.getLeaderboard(1000) // Get more entries to calculate accurate rank
    const rank = leaderboard.findIndex(p => p.id === userId) + 1
    
    return NextResponse.json({ 
      success: true, 
      rank,
      total: leaderboard.length,
      profile: updatedProfile
    })
  } catch (error) {
    console.error('Error updating leaderboard:', error)
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }
} 