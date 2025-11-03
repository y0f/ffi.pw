import { motion } from 'framer-motion'
import { FaSmoking } from 'react-icons/fa'
import { useTheme } from '../../hooks/useTheme'
import clsx from 'clsx'
import type { FC } from 'react'

interface ToggleSmokeProps {
  onToggle?: (value: boolean) => void
  isActive: boolean
}

const ToggleSmoke: FC<ToggleSmokeProps> = ({ onToggle, isActive }) => {
  const { isDarkMode } = useTheme()

  const toggle = () => {
    onToggle?.(!isActive)
  }

  const buttonClass = clsx(
    'relative flex items-center justify-center w-9 h-9 rounded-md focus:outline-none cursor-pointer transition-all duration-300',
    isDarkMode
      ? 'bg-gray-950 hover:bg-black text-white border border-neutral-200/30'
      : 'bg-black/10 hover:bg-white/20 text-gray-800 border border-gray-800/30',
  )

  const iconClass = clsx(
    'h-4 w-4 transition-all duration-300',
    isActive ? (isDarkMode ? 'text-primary-400' : '') : 'text-current',
  )

  const iconVariants = {}

  return (
    <button
      onClick={toggle}
      aria-label={isActive ? 'Stop smoking' : 'Start smoking'}
      className={buttonClass}
    >
      <motion.div
        animate={isActive ? 'active' : 'initial'}
        variants={iconVariants}
        className='relative z-20'
      >
        <FaSmoking className={iconClass} />
      </motion.div>
    </button>
  )
}

export default ToggleSmoke
