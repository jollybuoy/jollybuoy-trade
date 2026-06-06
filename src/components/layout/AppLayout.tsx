import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/portfolio': 'Portfolio',
  '/watchlist': 'Watchlist',
  '/scanner': 'Market Scanner',
  '/strategies': 'Strategies',
  '/backtesting': 'Backtesting',
  '/assistant': 'AI Assistant',
  '/alerts': 'Alerts',
  '/paper-trading': 'Paper Trading',
  '/history': 'Trade History',
  '/settings': 'Settings',
}

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const title = pageTitles[location.pathname] ?? 'JollyBuoy Trade'

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col lg:pl-0">
        <Header title={title} onMenuClick={() => setSidebarOpen(true)} />

        <main className="terminal-grid flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
