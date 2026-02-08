"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "./theme-provider"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, toggleTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-9 h-9" />
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-300 flex items-center justify-center group"
      title={`Current: ${theme} (Showing: ${resolvedTheme})`}
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5">
        {/* System Icon */}
        <Monitor 
          className={`absolute inset-0 h-5 w-5 transition-all duration-500 ${
            theme === 'system' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'
          }`} 
        />
        
        {/* Sun Icon */}
        <Sun 
          className={`absolute inset-0 h-5 w-5 transition-all duration-500 ${
            theme === 'light' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'
          }`} 
        />
        
        {/* Moon Icon */}
        <Moon 
          className={`absolute inset-0 h-5 w-5 transition-all duration-500 ${
            theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'
          }`} 
        />
      </div>

      {/* Mode Indicator Dot */}
      <span className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  )
}
