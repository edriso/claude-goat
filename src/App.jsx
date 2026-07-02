import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import DocPage from './pages/DocPage'
import NotFound from './pages/NotFound'
import { useLocalStorage } from './hooks/useLocalStorage'

export default function App() {
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

  // Close the mobile drawer and scroll to top whenever the route changes.
  useEffect(() => {
    setMobileOpen(false)
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
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/docs/:slug" element={<DocPage />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
