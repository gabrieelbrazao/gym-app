import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.tsx'

registerSW({
  immediate: true,
  onRegisteredSW(_swUrl, r) {
    if (!r) return
    // Check for updates whenever the app is foregrounded (critical for standalone PWA)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) r.update()
    })
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
