import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@/context/ThemeContext'
import { IbkrDataProvider } from '@/context/IbkrDataContext'
import { loadAccountSettings, saveAccountSettings } from '@/lib/settingsStorage'
import App from './App'
import './index.css'

const STRATEGIES_RESET_KEY = 'jollybuoy-strategies-cleared-v2'

function Bootstrap() {
  useEffect(() => {
    if (localStorage.getItem(STRATEGIES_RESET_KEY)) return

    localStorage.setItem('jollybuoy-strategies', '[]')
    localStorage.removeItem('jollybuoy-bot-log')

    const settings = loadAccountSettings()
    saveAccountSettings({
      ...settings,
      risk: { ...settings.risk, emergencyStopActive: false },
    })

    localStorage.setItem(STRATEGIES_RESET_KEY, 'true')
  }, [])

  return (
    <ThemeProvider>
      <IbkrDataProvider>
        <App />
      </IbkrDataProvider>
    </ThemeProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Bootstrap />
  </StrictMode>,
)
