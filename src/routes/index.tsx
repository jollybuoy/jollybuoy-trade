import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { DashboardPage } from '@/pages/DashboardPage'
import { PortfolioPage } from '@/pages/PortfolioPage'
import { WatchlistPage } from '@/pages/WatchlistPage'
import { MarketScannerPage } from '@/pages/MarketScannerPage'
import { StrategiesPage } from '@/pages/StrategiesPage'
import { PaperTradingPage } from '@/pages/PaperTradingPage'
import { TradeHistoryPage } from '@/pages/TradeHistoryPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { BacktestingPage } from '@/pages/BacktestingPage'
import { AiAssistantPage } from '@/pages/AiAssistantPage'
import { AlertsPage } from '@/pages/AlertsPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'portfolio', element: <PortfolioPage /> },
      { path: 'watchlist', element: <WatchlistPage /> },
      { path: 'scanner', element: <MarketScannerPage /> },
      { path: 'strategies', element: <StrategiesPage /> },
      { path: 'backtesting', element: <BacktestingPage /> },
      { path: 'assistant', element: <AiAssistantPage /> },
      { path: 'alerts', element: <AlertsPage /> },
      { path: 'paper-trading', element: <PaperTradingPage /> },
      { path: 'history', element: <TradeHistoryPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
])
