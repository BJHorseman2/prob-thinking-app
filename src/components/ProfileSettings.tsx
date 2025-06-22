'use client'

import { useState } from 'react'
import { useTheme } from '@/lib/theme-context'

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

    setLoading(true)
    setError('')

    try {
      // Save to localStorage for now
      const profiles = JSON.parse(localStorage.getItem('userProfiles') || '{}')
      profiles[userId] = { username, updatedAt: new Date().toISOString() }
      localStorage.setItem('userProfiles', JSON.stringify(profiles))

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
      <div className="glass-morphism-enhanced rounded-2xl p-6 max-w-md w-full">
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
              className="w-full p-3 theme-input rounded-xl placeholder-gray-400 focus:outline-none transition-all duration-200"
              maxLength={20}
            />
            {error && (
              <p className="mt-2 text-sm text-red-400">{error}</p>
            )}
            <p className="mt-2 text-xs text-gray-400">
              This will be displayed on the leaderboard
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Theme Preference
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['light', 'dark', 'system'] as const).map((themeName) => (
                <button
                  key={themeName}
                  onClick={() => setTheme(themeName)}
                  className={`
                    p-3 rounded-xl border transition-all duration-200 
                    ${theme === themeName
                      ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
                    }
                  `}
                >
                  <div className="flex flex-col items-center space-y-1">
                    <span className="text-lg">
                      {themeName === 'light' && '☀️'}
                      {themeName === 'dark' && '🌙'}
                      {themeName === 'system' && '💻'}
                    </span>
                    <span className="text-xs font-medium capitalize">
                      {themeName}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-400">
              Current: {resolvedTheme === 'dark' ? 'Dark' : 'Light'} mode
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