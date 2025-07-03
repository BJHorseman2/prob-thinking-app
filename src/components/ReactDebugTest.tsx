'use client'

import React, { useState } from 'react'
import ClientOnly from './ClientOnly'

export default function ReactDebugTest() {
  const [count, setCount] = useState(0)

  return (
    <ClientOnly fallback={<div className="fixed bottom-4 right-4 z-50 bg-gray-500 p-2 rounded text-white text-xs">Loading...</div>}>
      <div className="fixed bottom-4 right-4 z-50 bg-green-500 p-2 rounded text-white text-xs">
        <button 
          onClick={() => {
            console.log('React Debug button clicked!')
            setCount(prev => prev + 1)
          }}
          className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded"
        >
          React Test: {count}
        </button>
      </div>
    </ClientOnly>
  )
}