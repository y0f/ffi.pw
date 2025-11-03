import { FaMoon, FaSun } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../hooks/useTheme'
import clsx from 'clsx'
import type { FC } from 'react'

const ToggleTheme: FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme()

  const setBackground = (imageFile: string, isDark: boolean): void => {
    const terminalElements = document.querySelectorAll('.terminal-wp')
    if (!terminalElements.length) return

    const bgColor = isDark ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255,255, 255, 0.2)'

    terminalElements.forEach((el) => {
      const element = el as HTMLElement
      element.style.backgroundImage = `url(/${imageFile})`
      element.style.backgroundSize = 'cover'
      element.style.backgroundPosition = 'center'
      element.style.backgroundColor = bgColor
      element.style.mixBlendMode = 'screen'
    })
  }

  const handleThemeToggle = () => {
    toggleDarkMode()

    setTimeout(() => {
      const newIsDark = document.documentElement.classList.contains('dark')
      const newBg = newIsDark ? 'backgrounds/default-bg.webp' : 'backgrounds/light-bg.webp'
      setBackground(newBg, newIsDark)
    }, 0)
  }

  const buttonClass = clsx(
    'cursor-pointer relative flex items-center justify-center w-9 h-9 border rounded-md focus:outline-none transition-all duration-300',
    isDarkMode
      ? 'bg-gray-950 hover:bg-black text-white border-neutral-200/30'
      : 'bg-black/10 hover:bg-white/20 text-gray-800 border-gray-800/30',
  )

  return (
    <button
      onClick={handleThemeToggle}
      aria-label={isDarkMode ? 'Disable dark mode' : 'Enable dark mode'}
      className={buttonClass}
    >
      <motion.div
        initial={{ rotate: 0, scale: 1 }}
        animate={{
          rotate: isDarkMode ? 180 : 0,
          scale: isDarkMode ? 1.1 : 1,
          transition: { duration: 0.3, ease: 'easeInOut' },
        }}
        className='relative z-20 h-5 w-5 flex items-center justify-center'
      >
        <AnimatePresence mode='wait' initial={false}>
          {isDarkMode ? (
            <motion.div
              key='moon'
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.2 }}
            >
              <FaMoon className='cursor-pointer h-3.5 w-3.5' />
            </motion.div>
          ) : (
            <motion.div
              key='sun'
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.2 }}
            >
              <FaSun className='cursor-pointer h-4 w-4' />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </button>
  )
}

export default ToggleTheme
