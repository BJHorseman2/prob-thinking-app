'use client'

import React, { useState } from 'react'

export default function TestPage() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1>React Hydration Test</h1>
      <button 
        onClick={() => {
          console.log('Button clicked!')
          setCount(prev => prev + 1)
          alert(`Count: ${count + 1}`)
        }}
        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white"
      >
        Count: {count}
      </button>
    </div>
  )
}