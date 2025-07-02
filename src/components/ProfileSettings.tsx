'use client'

import { useState } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase-client'

interface ProfileSettingsProps {
  userId: string
  currentUsername?: string
  onClose: () => void
  onUpdate: (username: string) => void
}

export default function ProfileSettings({ userId, currentUsername, onClose, onUpdate }: ProfileSettingsProps) {
  const [username, setUsername] = useState(currentUsername || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleUpdateProfile = async () => {
    if (!username.trim()) {
      setError('Username cannot be empty')
      return
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters')
      return
    }

    if (!isSupabaseConfigured || !supabase) {
      // Just update locally
      onUpdate(username)
      onClose()
      return
    }

    setLoading(true)
    setError('')

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ username })
        .eq('id', userId)

      if (error) throw error

      onUpdate(username)
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Profile Settings</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                setError('')
              }}
              placeholder="Enter your username"
              className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400"
              maxLength={20}
            />
            {error && (
              <p className="mt-2 text-sm text-red-400">{error}</p>
            )}
            <p className="mt-2 text-xs text-gray-400">
              This will be displayed on the leaderboard
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleUpdateProfile}
              disabled={loading || !username.trim()}
              className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border border-white/20 text-white rounded-xl hover:bg-white/10"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 