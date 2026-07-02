import { useEffect, useState } from 'react'

/**
 * A tiny state hook that persists its value to localStorage, so choices
 * like the theme and sidebar state survive a page refresh.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key)
      if (stored !== null) return JSON.parse(stored)
    } catch {
      // Ignore read errors (e.g. private mode) and fall back to the default.
    }
    return initialValue
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Ignore write errors.
    }
  }, [key, value])

  return [value, setValue]
}
