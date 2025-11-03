import { useState, type FC } from 'react'
import { FaLeaf } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { useTheme } from '../../hooks/useTheme'
import clsx from 'clsx'

const TogglePetals: FC = () => {
  const { isDarkMode } = useTheme()
  const [petalsEnabled, setPetalsEnabled] = useState(true)

  const toggle = () => {
    setPetalsEnabled(!petalsEnabled)
    document.dispatchEvent(new CustomEvent('petalsToggle', { detail: !petalsEnabled }))
  }

  const buttonClass = clsx(
    'relative flex items-center justify-center w-9 h-9 rounded-md focus:outline-none cursor-pointer transition-all duration-300',
    isDarkMode
      ? 'bg-gray-950 hover:bg-black text-white border border-neutral-200/30'
      : 'bg-black/10 hover:bg-white/20 text-black border border-gray-800/30',
  )

  const iconClass = clsx(
    'h-full w-full transition-colors duration-300',
    petalsEnabled &&
      (isDarkMode
        ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]'
        : 'drop-shadow-[0_0_6px_rgba(0,0,0,0.2)]'),
    isDarkMode ? 'text-white' : 'text-gray-800 ',
  )

  const iconVariants = {
    initial: { rotate: 0, y: 0, scale: 1 },
    active: {
      rotate: [-3, 3, -3],
      y: [-2, 2, -2],
      scale: [1, 1.1, 1],
      transition: {
        duration: 2,
        ease: 'easeInOut' as const,
        repeat: Infinity,
      },
    },
  }

  return (
    <button
      onClick={toggle}
      aria-label={petalsEnabled ? 'Stop petals' : 'Start petals'}
      className={buttonClass}
    >
      <motion.div
        animate={petalsEnabled ? 'active' : 'initial'}
        variants={iconVariants}
        className='relative z-20 h-4 w-4'
      >
        <FaLeaf className={iconClass} />
      </motion.div>
    </button>
  )
}

export default TogglePetals
