'use client'

import React, { useState, useEffect } from 'react'

interface MobileLayoutProps {
  children: React.ReactNode
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
}

export default function MobileLayout({ 
  children, 
  onSwipeUp, 
  onSwipeDown, 
  onSwipeLeft, 
  onSwipeRight 
}: MobileLayoutProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    // Fix for iOS viewport height
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }
    setViewportHeight()
    window.addEventListener('resize', setViewportHeight)
    
    return () => {
      window.removeEventListener('resize', checkMobile)
      window.removeEventListener('resize', setViewportHeight)
    }
  }, [])

  // Always render children directly to avoid wrapper issues
  return <>{children}</>
} 