import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import './i18n/index.js'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from '@/components/common/ErrorBoundary.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <App />
        <Toaster position="top-right" richColors closeButton duration={3500} />
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>,
)
