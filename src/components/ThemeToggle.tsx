'use client'

import { useTheme } from '@/lib/theme-context'

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="
        relative p-2 rounded-xl border border-white/10 
        bg-white/5 hover:bg-white/10 
        transition-all duration-200 
        hover:scale-105 hover:border-white/20
        dark:border-gray-700 dark:bg-gray-800/50 dark:hover:bg-gray-700/50
      "
      title={`Current theme: ${theme} (${resolvedTheme})`}
    >
      <div className="flex items-center justify-center w-6 h-6">
        {theme === 'light' && (
          <span className="text-yellow-500 text-lg">☀️</span>
        )}
        {theme === 'dark' && (
          <span className="text-blue-300 text-lg">🌙</span>
        )}
        {theme === 'system' && (
          <span className="text-gray-400 text-lg">💻</span>
        )}
      </div>
    </button>
  )
}