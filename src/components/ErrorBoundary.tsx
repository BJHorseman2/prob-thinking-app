'use client'

import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo)
    
    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      // TODO: Add Sentry or other error logging service
      // Sentry.captureException(error, { extra: errorInfo })
    }
  }

  render() {
    if (this.state.hasError) {
      const Fallback = this.props.fallback || DefaultErrorFallback
      return (
        <Fallback 
          error={this.state.error!} 
          reset={() => this.setState({ hasError: false, error: undefined })}
        />
      )
    }

    return this.props.children
  }
}

function DefaultErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 max-w-md w-full text-center">
        <div className="text-6xl mb-6">😵</div>
        <h2 className="text-2xl font-bold text-white mb-4">Oops! Something went wrong</h2>
        <p className="text-gray-300 mb-6">
          We encountered an unexpected error. Don't worry, your progress is saved!
        </p>
        
        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300"
          >
            Try Again
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-white/10 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300"
          >
            Refresh Page
          </button>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 text-left">
            <summary className="text-sm text-gray-400 cursor-pointer">Error Details</summary>
            <pre className="mt-2 text-xs text-red-300 bg-black/20 p-2 rounded overflow-auto">
              {error.message}
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}

export default ErrorBoundary