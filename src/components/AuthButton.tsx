'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

export default function AuthButton() {
  const { user, signIn, signUp, signOut, isSupabaseConfigured } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [isAuthLoading, setIsAuthLoading] = useState(false)

  const handleSignIn = async () => {
    setAuthError('')
    setIsAuthLoading(true)
    
    if (!email || !password) {
      setAuthError('Please enter email and password')
      setIsAuthLoading(false)
      return
    }

    const { error } = await signIn(email, password)
    
    if (error) {
      setAuthError(error.message)
    } else {
      setShowAuthModal(false)
      setEmail('')
      setPassword('')
    }
    
    setIsAuthLoading(false)
  }

  const handleSignUp = async () => {
    setAuthError('')
    setIsAuthLoading(true)
    
    if (!email || !password) {
      setAuthError('Please enter email and password')
      setIsAuthLoading(false)
      return
    }

    const { error } = await signUp(email, password)
    
    if (error) {
      setAuthError(error.message)
    } else {
      setShowAuthModal(false)
      setEmail('')
      setPassword('')
      if (isSupabaseConfigured) {
        setAuthError('')
        // Show success message for email confirmation
        alert('Check your email for the confirmation link!')
      }
    }
    
    setIsAuthLoading(false)
  }

  const handleSignOut = async () => {
    await signOut()
  }

  // Always show the button for now to debug
  // if (loading && !forceShow) {
  //   return (
  //     <div className="w-16 h-6 bg-white/10 rounded animate-pulse"></div>
  //   )
  // }

  return (
    <>
      {user ? (
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-300 hidden sm:inline">{user.email}</span>
          <button
            onClick={handleSignOut}
            className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition-all"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowAuthModal(true)}
          className="text-sm bg-purple-500 hover:bg-purple-600 px-3 py-1.5 rounded-lg transition-all text-white font-medium"
        >
          Sign In
        </button>
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 pt-56">
          <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl p-6 max-w-md w-full max-h-[55vh] overflow-y-auto border border-white/10 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">
              {isSignUp ? 'Create Account' : 'Sign In'}
            </h2>
            
            {!isSupabaseConfigured && (
              <div className="mb-4 p-3 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                <p className="text-sm text-yellow-300">
                  ⚠️ Demo Mode - Any email/password works
                </p>
              </div>
            )}
            
            {authError && (
              <div className="mb-4 p-3 bg-red-500/20 rounded-lg">
                <p className="text-sm text-red-300">{authError}</p>
              </div>
            )}
            
            <div className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400"
              />
              
              <button
                onClick={isSignUp ? handleSignUp : handleSignIn}
                disabled={isAuthLoading}
                className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-purple-500/50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-all"
              >
                {isAuthLoading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
              </button>
              
              <div className="text-center">
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-sm text-gray-400 hover:text-white"
                >
                  {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                </button>
              </div>
              
              <button
                onClick={() => {
                  setShowAuthModal(false)
                  setEmail('')
                  setPassword('')
                  setAuthError('')
                }}
                className="w-full text-gray-400 hover:text-white text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 