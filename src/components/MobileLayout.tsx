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
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // On desktop, just render children normally
  if (!isMobile) {
    return <>{children}</>
  }

  // On mobile, wrap in a scrollable container
  return (
    <div className="mobile-container">
      {children}
      
      <style jsx>{`
        .mobile-container {
          width: 100%;
          height: 100%;
          overflow: visible;
        }
        
        /* Ensure body and html allow scrolling on mobile */
        @media (max-width: 768px) {
          :global(html),
          :global(body) {
            overflow-x: hidden !important;
            overflow-y: auto !important;
            height: auto !important;
            width: 100% !important;
            position: relative !important;
          }
          
          :global(body) {
            -webkit-overflow-scrolling: touch !important;
            overscroll-behavior-y: auto !important;
          }
          
          /* Fix for iOS bounce scrolling */
          :global(.mobile-container) {
            -webkit-overflow-scrolling: touch !important;
          }
          
          /* Prevent fixed elements from blocking scroll */
          :global(.mobile-nav) {
            pointer-events: auto;
          }
          
          /* Ensure main content is scrollable */
          :global(main),
          :global(.main-content) {
            overflow: visible !important;
            height: auto !important;
          }
        }
      `}</style>
    </div>
  )
} 