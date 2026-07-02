import { useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'

const THEME_KEY = 'cg-theme'

/**
 * Light/dark theme, persisted across refreshes. The initial class is applied
 * by an inline script in index.html to avoid a flash; here we keep React and
 * the <html> class in sync whenever the user toggles.
 */
export function useTheme() {
  const getInitial = () => {
    try {
      const stored = localStorage.getItem(THEME_KEY)
      if (stored) return JSON.parse(stored)
    } catch {
      /* noop */
    }
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  const [theme, setTheme] = useLocalStorage(THEME_KEY, getInitial())

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return { theme, toggleTheme }
}
