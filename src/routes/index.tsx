import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { PortfolioPage } from '@/pages/PortfolioPage'
import { WatchlistPage } from '@/pages/WatchlistPage'
import { StrategiesPage } from '@/pages/StrategiesPage'
import { TradeHistoryPage } from '@/pages/TradeHistoryPage'
import { SettingsPage } from '@/pages/SettingsPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/portfolio" replace /> },
      { path: 'portfolio', element: <PortfolioPage /> },
      { path: 'watchlist', element: <WatchlistPage /> },
      { path: 'strategies', element: <StrategiesPage /> },
      { path: 'history', element: <TradeHistoryPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: '*', element: <Navigate to="/portfolio" replace /> },
    ],
  },
])
