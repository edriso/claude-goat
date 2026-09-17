import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { lazy, Suspense, useEffect, useState } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import { useLocalStorage } from './hooks/useLocalStorage'

// The doc page carries the markdown renderer and the syntax highlighter, which
// the home page never needs. Loading it on demand keeps them out of the entry
// chunk; each page's prose is a further chunk of its own (see src/content).
const DocPage = lazy(() => import('./pages/DocPage'))

export default function App() {
  const location = useLocation()
  return <AppContent key={location.pathname} />
}

function AppContent() {
  // Desktop: collapse state is remembered across refreshes.
  const [collapsed, setCollapsed] = useLocalStorage('cg-sidebar-collapsed', false)
  // Mobile: the drawer is ephemeral and starts closed.
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  const isDesktop = () =>
    typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches

  const toggleSidebar = () => {
    if (isDesktop()) setCollapsed((c) => !c)
    else setMobileOpen((o) => !o)
  }

  // Each route gets a fresh mobile drawer; keep scroll position in sync.
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [location.pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <Header onToggleSidebar={toggleSidebar} />

      <div className="flex flex-1">
        {/* Desktop sidebar (in flow, collapsible width) */}
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] md:block">
          <Sidebar collapsed={collapsed} />
        </aside>

        {/* Mobile drawer + backdrop */}
        {mobileOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div
              className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <div className="absolute left-0 top-0 h-full shadow-2xl">
              <Sidebar collapsed={false} onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1">
          <Suspense fallback={<PageLoading />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/docs/:slug" element={<DocPage />} />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  )
}

function PageLoading() {
  return (
    <div
      className="mx-auto flex max-w-6xl gap-10 px-5 py-10 md:px-8"
      role="status"
      aria-label="Loading"
    >
      <div className="min-w-0 flex-1 animate-pulse space-y-4">
        <div className="h-4 w-11/12 rounded bg-stone-200 dark:bg-stone-800" />
        <div className="h-4 w-full rounded bg-stone-200 dark:bg-stone-800" />
        <div className="h-4 w-9/12 rounded bg-stone-200 dark:bg-stone-800" />
      </div>
      <div className="hidden w-56 shrink-0 xl:block" />
    </div>
  )
}
