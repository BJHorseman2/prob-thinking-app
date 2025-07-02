'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // In production, you'd send this to your backend or email service
    // For now, we'll just log it and show success
    console.log('Feedback submitted:', { feedback, email, timestamp: new Date().toISOString() })
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    
    // Reset after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setIsOpen(false)
      setFeedback('')
      setEmail('')
    }, 3000)
  }

  return (
    <>
      {/* Feedback Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        💬
      </motion.button>

      {/* Feedback Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 max-w-md w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {!isSubmitted ? (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-white">Feedback</h3>
                    <button 
                      onClick={() => setIsOpen(false)}
                      className="text-gray-400 hover:text-white text-xl"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        How can we improve Probabl?
                      </label>
                      <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 resize-none focus:outline-none focus:border-purple-500"
                        rows={4}
                        placeholder="Share your thoughts, suggestions, or report issues..."
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email (optional)
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                        placeholder="your@email.com"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        We'll only use this to follow up on your feedback
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || !feedback.trim()}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Feedback'}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🙏</div>
                  <h3 className="text-2xl font-bold text-white mb-2">Thank you!</h3>
                  <p className="text-gray-300">
                    Your feedback helps us make Probabl better for everyone.
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}