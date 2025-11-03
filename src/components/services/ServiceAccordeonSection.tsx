import { useState, type FC, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import { FaPlus } from 'react-icons/fa'
import { useTheme } from '../../hooks/useTheme'

interface ServiceAccordionSectionProps {
  title: string
  children: ReactNode
  initiallyOpen?: boolean
}

const ServiceAccordionSection: FC<ServiceAccordionSectionProps> = ({
  title,
  children,
  initiallyOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen)
  const { isDarkMode } = useTheme()

  return (
    <div className='mb-8'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          'w-full flex items-center justify-between p-4 rounded-lg border',
          isDarkMode
            ? 'bg-linear-to-br from-primary-400/10 to-primary-500/10 border-neutral-200/20'
            : 'bg-linear-to-br from-primary-400/5 to-primary-500/15 border-gray-800/20',
          'transition-all duration-300',
          isOpen ? (isDarkMode ? 'border-primary-400/70' : 'border-primary-500/70') : '',
        )}
      >
        <h2
          className={clsx(
            'text-xl fira flex items-center',
            isDarkMode ? 'text-primary-300' : 'text-primary-600',
          )}
        >
          <motion.span
            className={clsx(
              'inline-block mr-2 p-1 rounded cursor-pointer',
              isDarkMode ? 'bg-primary-400/20' : 'bg-primary-500/20',
            )}
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isOpen ? (
              <FaPlus className='text-sm transform rotate-45' />
            ) : (
              <FaPlus className='text-sm' />
            )}
          </motion.span>
          {title}
        </h2>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className='overflow-hidden'
          >
            <div className='pt-6 pb-2'>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ServiceAccordionSection
