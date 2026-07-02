import { Link } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

export default function Header({ onToggleSidebar }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-stone-200 bg-stone-50/85 px-4 backdrop-blur dark:border-stone-800 dark:bg-[#1a1917]/85">
      <button
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
        title="Toggle sidebar"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-stone-500 transition hover:bg-stone-200 hover:text-stone-800 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      <Link to="/" className="group flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-clay-500 text-lg shadow-sm transition group-hover:scale-105">
          🐐
        </span>
        <span className="text-lg font-bold tracking-tight text-stone-900 dark:text-white">
          Claude<span className="text-clay-500">GOAT</span>
        </span>
      </Link>

      <div className="ml-auto flex items-center gap-2">
        <a
          href="https://docs.claude.com"
          target="_blank"
          rel="noreferrer"
          className="hidden rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition hover:text-clay-600 sm:block dark:text-stone-300 dark:hover:text-clay-400"
        >
          Official Docs ↗
        </a>
        <a
          href="https://github.com/edriso/claude-goat"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub repository"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-600 transition hover:border-clay-300 hover:text-clay-600 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300 dark:hover:border-clay-600 dark:hover:text-clay-400"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7 0-.7 0-.7 1.2 0 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z" />
          </svg>
        </a>
        <ThemeToggle />
      </div>
    </header>
  )
}
