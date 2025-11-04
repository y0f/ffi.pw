import { useEffect } from 'react'

export interface BackgroundHookOptions {
  isDarkMode: boolean
  darkBackground?: string
  lightBackground?: string
}

const useApplySavedBackground = (options: BackgroundHookOptions): null => {
  const { isDarkMode, darkBackground, lightBackground } = options

  useEffect(() => {
    const bg = isDarkMode
      ? darkBackground || 'backgrounds/default-bg.webp'
      : lightBackground || 'backgrounds/light-bg.webp'

    const root = document.documentElement
    const backgroundColor = isDarkMode ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.10)'

    root.style.setProperty('--terminal-bg-image', `url(/${bg})`)
    root.style.setProperty('--terminal-bg-color', backgroundColor)
  }, [isDarkMode, darkBackground, lightBackground])

  return null
}

export default useApplySavedBackground
