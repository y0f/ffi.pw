export function registerServiceWorker(): void {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration: ServiceWorkerRegistration) => {
          console.log('SW registered:', registration)
        })
        .catch((error: Error) => {
          console.log('SW registration failed:', error)
        })
    })
  }
}
