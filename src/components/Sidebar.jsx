import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { nav } from '../data/nav'

export default function Sidebar({ collapsed, onNavigate }) {
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()

  const sections = nav
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) =>
          !q ||
          item.title.toLowerCase().includes(q) ||
          item.blurb.toLowerCase().includes(q),
      ),
    }))
    .filter((section) => section.items.length > 0)

  return (
    <div
      className={`flex h-full flex-col overflow-hidden border-r border-stone-200 bg-white/70 backdrop-blur dark:border-stone-800 dark:bg-[#201f1c]/70 ${
        collapsed ? 'w-0' : 'w-72'
      } transition-[width] duration-300`}
    >
      <div className="flex w-72 flex-1 flex-col overflow-hidden">
        <div className="px-4 pt-4">
          <label className="relative block">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-stone-400">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
              </svg>
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter topics..."
              className="w-full rounded-lg border border-stone-200 bg-stone-50 py-2 pl-9 pr-3 text-sm text-stone-700 outline-none transition placeholder:text-stone-400 focus:border-clay-400 focus:ring-2 focus:ring-clay-200 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 dark:focus:ring-clay-900"
            />
          </label>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {sections.map((section) => (
            <div key={section.title} className="mb-5">
              <div className="mb-1.5 flex items-center gap-2 px-2 text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                <span aria-hidden>{section.icon}</span>
                {section.title}
              </div>
              <ul className="space-y-0.5">
                {section.items.map((item) => (
                  <li key={item.slug}>
                    <NavLink
                      to={`/docs/${item.slug}`}
                      onClick={onNavigate}
                      className={({ isActive }) =>
                        `block rounded-lg px-3 py-1.5 text-sm transition ${
                          isActive
                            ? 'bg-clay-100 font-semibold text-clay-800 dark:bg-clay-900/40 dark:text-clay-200'
                            : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100'
                        }`
                      }
                    >
                      {item.title}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {sections.length === 0 && (
            <p className="px-3 text-sm text-stone-400">No topics match “{query}”.</p>
          )}
        </nav>

        <div className="border-t border-stone-200 px-4 py-3 text-xs text-stone-400 dark:border-stone-800 dark:text-stone-500">
          Built with Claude Code 🐐
        </div>
      </div>
    </div>
  )
}
