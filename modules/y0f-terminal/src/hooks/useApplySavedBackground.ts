import { useEffect } from 'react'
import clsx from 'clsx'

export interface BackgroundHookOptions {
  isDarkMode: boolean
  darkBackground?: string
  lightBackground?: string
}

const applyBackground = (imageFile: string, isDarkMode: boolean): void => {
  const terminalElements = document.querySelectorAll<HTMLElement>('.terminal-wp')
  if (!terminalElements.length) return

  const backgroundColor = clsx({
    'rgba(0, 0, 0, 0.85)': isDarkMode,
    'rgba(255,255, 255, 0.10)': !isDarkMode,
  })

  terminalElements.forEach((el) => {
    el.style.backgroundImage = `url(/${imageFile})`
    el.style.backgroundSize = 'cover'
    el.style.backgroundPosition = 'center'
    el.style.backgroundColor = backgroundColor
    el.style.backgroundBlendMode = 'overlay'
  })
}

const useApplySavedBackground = (options: BackgroundHookOptions): null => {
  const { isDarkMode, darkBackground, lightBackground } = options

  useEffect(() => {
    const bg = isDarkMode
      ? darkBackground || 'backgrounds/default-bg.webp'
      : lightBackground || 'backgrounds/light-bg.webp'
    applyBackground(bg, isDarkMode)
  }, [isDarkMode, darkBackground, lightBackground])

  return null
}

export default useApplySavedBackground
