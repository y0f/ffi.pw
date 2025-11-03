import { useState, useEffect, useRef, type FC } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPalette } from 'react-icons/fa'
import { useTheme } from '../../hooks/useTheme'
import { useMenuManager } from '../../hooks/useMenuManager'
import clsx from 'clsx'

interface ColorOption {
  name: string
  value: string
  color: string
}

const ToggleColors: FC = () => {
  const { isDarkMode } = useTheme()
  const [rotation, setRotation] = useState(0)
  const menuRef = useRef<HTMLDivElement>(null)

  const { isOpen: isMenuOpen, toggleMenu, closeMenu } = useMenuManager('color-theme-menu')

  const colorOptions: ColorOption[] = [
    { name: 'Ice Blue', value: 'ice-blue', color: '#38bdf8' },
    { name: 'Green', value: 'green', color: '#22c55e' },
    { name: 'Pink', value: 'pink', color: '#ec4899' },
    { name: 'Blue', value: 'blue', color: '#3b82f6' },
    { name: 'Purple', value: 'purple', color: '#a855f7' },
    { name: 'Orange', value: 'orange', color: '#f97316' },
    { name: 'Teal', value: 'teal', color: '#14b8a6' },
    { name: 'Red', value: 'red', color: '#ef4444' },
  ]

  const [currentTheme, setCurrentTheme] = useState(() => {
    return document.documentElement.getAttribute('data-theme') || 'ice-blue'
  })

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          setCurrentTheme(document.documentElement.getAttribute('data-theme') || 'ice-blue')
        }
      })
    })

    observer.observe(document.documentElement, { attributes: true })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu()
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen, closeMenu])

  const handleButtonClick = () => {
    setRotation((prev) => prev + 360)
    toggleMenu()
  }

  const handleColorSelect = (colorValue: string) => {
    document.documentElement.setAttribute('data-theme', colorValue)
    setCurrentTheme(colorValue)
  }

  const buttonClass = clsx(
    'cursor-pointer relative flex items-center justify-center w-9 h-9 rounded-md focus:outline-none cursor-pointer transition-all duration-300',
    isDarkMode
      ? 'bg-gray-950 hover:bg-black border border-neutral-200/30'
      : 'bg-primary-500/20 hover:bg-white/20 text-gray-800 border border-gray-800/30',
  )

  const iconClass = clsx(
    'h-full w-full transition-colors duration-300',
    isDarkMode ? 'text-primary-400 hover:text-primary-300' : 'text-gray-800 hover:text-primary-600',
  )

  const dropdownClass = clsx(
    'absolute right-0 mt-5 rounded-lg shadow-lg z-50 min-w-max overflow-hidden border translate-x-10',
    isDarkMode
      ? 'border-neutral-200/20 bg-gray-950 bg-linear-to-br from-gray-900/50 to-gray-900/30'
      : 'border-gray-400 bg-gray-200 bg-linear-to-br from-white/40 via-primary-400/10 to-gray-50/10',
  )

  const optionClass = (isSelected: boolean) =>
    clsx(
      'flex items-center space-x-2 px-3 py-1.5 rounded-md transition-all duration-200 cursor-pointer',
      isSelected
        ? isDarkMode
          ? 'bg-primary-600/20 border rounded-md border-neutral-200/10'
          : 'bg-primary-300/50 border rounded-md border-gray-800/20'
        : isDarkMode
          ? 'hover:bg-gray-800/30 border rounded-md border-neutral-200/10'
          : 'hover:bg-gray-100/50 border rounded-md border-gray-800/20',
    )

  const textClass = clsx('fira-thin text-xs', isDarkMode ? 'text-gray-200' : 'text-gray-600')

  const autoButtonClass = clsx(
    'w-full text-xs py-1.5 px-2 rounded flex items-center justify-center space-x-1 fira-thin cursor-pointer',
    isDarkMode
      ? 'bg-gray-800/70 hover:bg-gray-800 text-gray-200 border border-neutral-200/10'
      : 'bg-gray-100/80 hover:bg-gray-100 text-gray-600 border border-gray-800/20',
  )

  return (
    <div className='relative' ref={menuRef}>
      <button onClick={handleButtonClick} aria-label='Open color palette' className={buttonClass}>
        <motion.div
          animate={{ rotate: rotation }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 15,
            velocity: 50,
          }}
          className='relative z-20 h-4 w-4'
        >
          <FaPalette className={iconClass} />
        </motion.div>
        <motion.div
          className={clsx(
            'absolute inset-0 rounded-md opacity-0 hover:opacity-100 transition-opacity ',
          )}
        />
      </button>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            style={{ transformOrigin: 'top right' }}
            className={dropdownClass}
          >
            <div className='p-2 grid grid-cols-2 gap-1.5'>
              {colorOptions.map((option) => (
                <motion.button
                  key={option.value}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleColorSelect(option.value)}
                  className={optionClass(currentTheme === option.value)}
                  aria-label={`Select ${option.name} theme`}
                >
                  <div
                    className={clsx(
                      'w-3 h-3 rounded-full',
                      currentTheme === option.value && 'ring-1 ring-offset-1 ',
                      isDarkMode
                        ? 'ring-white ring-offset-gray-900 '
                        : 'ring-gray-600 ring-offset-white',
                    )}
                    style={{ backgroundColor: option.color }}
                  />
                  <span className={textClass}>{option.name}</span>
                </motion.button>
              ))}
            </div>
            <div
              className={clsx(
                'px-2 py-1.5 border-t',
                isDarkMode ? 'border-neutral-200/20' : 'border-gray-300/30',
              )}
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  const colors: Array<
                    'ice-blue' | 'green' | 'pink' | 'blue' | 'purple' | 'orange' | 'teal' | 'red'
                  > = ['ice-blue', 'green', 'pink', 'blue', 'purple', 'orange', 'teal', 'red']
                  const currentIndex = colors.findIndex((c) => c === currentTheme)
                  const nextColor = colors[(currentIndex + 1) % colors.length] || 'blue'
                  handleColorSelect(nextColor)
                }}
                className={autoButtonClass}
              >
                <FaPalette className='w-2.5 h-2.5 mr-1' />
                <span>Cycle</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ToggleColors
