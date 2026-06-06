import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Briefcase,
  Eye,
  Radar,
  BrainCircuit,
  Bot,
  LineChart,
  FlaskConical,
  History,
  BellRing,
  Newspaper,
  FileBarChart,
  Settings,
  Anchor,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Portfolio', path: '/portfolio', icon: Briefcase },
  { label: 'Watchlist', path: '/watchlist', icon: Eye },
  { label: 'Market Scanner', path: '/scanner', icon: Radar },
  { label: 'Strategies', path: '/strategies', icon: BrainCircuit },
  { label: 'Backtesting', path: '/backtesting', icon: LineChart },
  { label: 'AI Assistant', path: '/assistant', icon: Bot },
  { label: 'Alerts', path: '/alerts', icon: BellRing },
  { label: 'News & Events', path: '/news', icon: Newspaper },
  { label: 'Reports', path: '/reports', icon: FileBarChart },
  { label: 'Paper Trading', path: '/paper-trading', icon: FlaskConical },
  { label: 'Trade History', path: '/history', icon: History },
  { label: 'Settings', path: '/settings', icon: Settings },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border-subtle bg-surface-elevated/95 backdrop-blur-xl transition-transform duration-200 lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border-subtle px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ai/10 ring-1 ring-ai/20">
              <Anchor className="h-5 w-5 text-ai" />
            </div>
            <div>
              <p className="text-sm font-bold text-text-primary">JollyBuoy</p>
              <p className="text-[10px] font-medium uppercase tracking-widest text-ai/70">
                AI Terminal
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-text-secondary hover:bg-surface-hover hover:text-text-primary lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-ai/10 text-ai ring-1 ring-ai/20'
                    : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary',
                )
              }
            >
              <item.icon className="h-4.5 w-4.5 shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-border-subtle p-4">
          <div className="terminal-glow rounded-lg border border-accent/20 bg-accent/5 p-3">
            <p className="text-[10px] font-medium uppercase tracking-wider text-text-muted">
              Paper Account
            </p>
            <p className="mt-1 font-mono text-lg font-bold text-accent">$108,420.50</p>
            <p className="mt-0.5 text-xs text-accent/70">+$842.18 today</p>
          </div>
        </div>
      </aside>
    </>
  )
}
