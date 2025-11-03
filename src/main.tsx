import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './styles/css/index.css'
import { ColorProvider } from './providers/ColorProvider.tsx'
import { ThemeProvider } from './providers/ThemeProvider.tsx'
import { OwlProvider } from './providers/OwlProvider.tsx'
import { registerServiceWorker } from './utils/registerSW'

registerServiceWorker()

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ColorProvider>
          <OwlProvider>
            <App />
          </OwlProvider>
        </ColorProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
