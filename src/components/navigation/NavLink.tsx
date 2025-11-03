import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import type { FC } from 'react'

interface NavLinkProps {
  path: string
  label: string
  isActive: boolean
  isDarkMode: boolean
  linkBaseClass: string
}

const getBorderHighlightClass = (isDarkMode: boolean): string =>
  clsx('', isDarkMode ? 'border-neutral-200/20' : 'border-gray-800/40')

const getLabelTextClass = (isActive: boolean, isDarkMode: boolean): string => {
  if (isActive) {
    return clsx(
      'px-4 pt-1 z-10',
      isDarkMode
        ? 'text-white [text-shadow:_0_0_8px_rgba(255,255,255,0.8)]'
        : 'text-gray-800 [text-shadow:_0_0_8px_rgba(0,0,0,0.1)] fira-bold',
    )
  }
  return clsx(
    'px-4 pt-1 z-10',
    isDarkMode
      ? 'hover:text-white hover:[text-shadow:_0_0_10px_rgba(255,255,255,0.6)]'
      : 'hover:text-gray-800 hover:[text-shadow:_0_0_10px_rgba(0,0,0,0.9)]',
  )
}

const NavLink: FC<NavLinkProps> = ({ path, label, isActive, isDarkMode, linkBaseClass }) => {
  const borderHighlightClass = getBorderHighlightClass(isDarkMode)
  const labelTextClass = getLabelTextClass(isActive, isDarkMode)

  return (
    <Link to={path} className={linkBaseClass}>
      <div className='h-[2rem] flex items-center relative'>
        {isActive && (
          <motion.div
            className={borderHighlightClass}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
        <span className={labelTextClass}>{label.toLowerCase()}</span>
      </div>
    </Link>
  )
}

export default NavLink
