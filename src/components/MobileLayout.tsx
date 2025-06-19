'use client'

import React, { useState, useEffect } from 'react'
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion'

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
  const y = useMotionValue(0)
  const x = useMotionValue(0)
  
  // Transform values for visual feedback
  const opacity = useTransform(y, [-100, 0, 100], [0.5, 1, 0.5])
  const scale = useTransform(y, [-100, 0, 100], [0.95, 1, 0.95])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleDragEnd = (event: any, info: PanInfo) => {
    const swipeThreshold = 50
    
    if (Math.abs(info.offset.y) > Math.abs(info.offset.x)) {
      // Vertical swipe
      if (info.offset.y < -swipeThreshold && onSwipeUp) {
        onSwipeUp()
      } else if (info.offset.y > swipeThreshold && onSwipeDown) {
        onSwipeDown()
      }
    } else {
      // Horizontal swipe
      if (info.offset.x < -swipeThreshold && onSwipeLeft) {
        onSwipeLeft()
      } else if (info.offset.x > swipeThreshold && onSwipeRight) {
        onSwipeRight()
      }
    }
  }

  if (!isMobile) {
    return <>{children}</>
  }

  return (
    <div className="mobile-wrapper">
      {/* Mobile-optimized wrapper - removed motion.div to fix scrolling */}
      <div className="min-h-screen bg-black text-white overflow-y-auto overflow-x-hidden">
        {/* Safe area padding for notches */}
        <div className="safe-top" />
        
        {/* Content */}
        <div className="h-full pb-20">
          {children}
        </div>
        
        {/* Safe area padding for home indicators */}
        <div className="safe-bottom" />
      </div>
      
      <style jsx>{`
        .mobile-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }
        .safe-top {
          padding-top: env(safe-area-inset-top);
        }
        .safe-bottom {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </div>
  )
} 