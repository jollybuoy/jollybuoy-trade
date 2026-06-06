import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@/context/ThemeContext'
import { IbkrDataProvider } from '@/context/IbkrDataContext'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <IbkrDataProvider>
        <App />
      </IbkrDataProvider>
    </ThemeProvider>
  </StrictMode>,
)
