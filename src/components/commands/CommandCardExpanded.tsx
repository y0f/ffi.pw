import { type FC, memo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MdClose } from 'react-icons/md'
import { useTheme } from '../../hooks/useTheme'
import clsx from 'clsx'
import type { ExpandedCommandViewProps } from './types'

const CommandCardExpanded: FC<ExpandedCommandViewProps> = memo(({
  command,
  categoryColor,
  categoryBg,
  onClose,
}) => {
  const { isDarkMode } = useTheme()

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  // Prevent body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className='fixed inset-0 bg-black/50 backdrop-blur-sm z-40'
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className={clsx(
          'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
          'w-[90vw] max-w-3xl max-h-[85vh] overflow-y-auto',
          'rounded-xl border shadow-2xl z-50',
          isDarkMode
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={clsx(
          'sticky top-0 z-10 px-6 py-4 border-b flex items-start justify-between',
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        )}>
          <div className='flex-1'>
            <div className='flex items-center gap-3 mb-2'>
              <h2 className={clsx(
                'text-3xl font-mono font-bold',
                isDarkMode ? 'text-white' : 'text-gray-900'
              )}>
                {command.name}
              </h2>
              <span className={clsx(
                'text-sm px-3 py-1 rounded-full font-semibold',
                categoryBg,
                categoryColor
              )}>
                {command.category}
              </span>
            </div>
            {command.aliases.length > 0 && (
              <div className='flex gap-2'>
                {command.aliases.map((alias) => (
                  <span
                    key={alias}
                    className={clsx(
                      'text-xs px-2 py-1 rounded',
                      isDarkMode
                        ? 'bg-gray-700 text-gray-300'
                        : 'bg-gray-100 text-gray-600'
                    )}
                  >
                    alias: {alias}
                  </span>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className={clsx(
              'p-2 rounded-lg transition-colors',
              isDarkMode
                ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            )}
            aria-label='Close'
          >
            <MdClose size={24} />
          </button>
        </div>

        {/* Content */}
        <div className='p-6 space-y-6'>
          {/* Description */}
          <div>
            <h3 className={clsx(
              'text-sm font-semibold mb-2 uppercase tracking-wide',
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            )}>
              Description
            </h3>
            <p className={clsx(
              'text-base leading-relaxed',
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            )}>
              {command.description}
            </p>
          </div>

          {/* Long Description (if available) */}
          {command.longDescription && (
            <div>
              <h3 className={clsx(
                'text-sm font-semibold mb-2 uppercase tracking-wide',
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              )}>
                Details
              </h3>
              <p className={clsx(
                'text-base leading-relaxed',
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              )}>
                {command.longDescription}
              </p>
            </div>
          )}

          {/* Usage */}
          <div>
            <h3 className={clsx(
              'text-sm font-semibold mb-2 uppercase tracking-wide',
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            )}>
              Usage
            </h3>
            <code className={clsx(
              'block px-4 py-3 rounded-lg font-mono text-sm',
              isDarkMode
                ? 'bg-gray-900 text-green-400'
                : 'bg-gray-50 text-green-700'
            )}>
              $ {command.usage}
            </code>
          </div>

          {/* Examples (if available) */}
          {command.examples && command.examples.length > 0 && (
            <div>
              <h3 className={clsx(
                'text-sm font-semibold mb-3 uppercase tracking-wide',
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              )}>
                Examples
              </h3>
              <div className='space-y-3'>
                {command.examples.map((example, idx) => (
                  <div key={idx}>
                    <p className={clsx(
                      'text-sm mb-1',
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    )}>
                      {example.description}
                    </p>
                    <code className={clsx(
                      'block px-4 py-2 rounded font-mono text-sm',
                      isDarkMode
                        ? 'bg-gray-900 text-green-400'
                        : 'bg-gray-50 text-green-700'
                    )}>
                      $ {example.command}
                    </code>
                    {example.output && (
                      <pre className={clsx(
                        'mt-2 px-4 py-2 rounded font-mono text-xs overflow-x-auto',
                        isDarkMode
                          ? 'bg-gray-900 text-gray-400'
                          : 'bg-gray-50 text-gray-600'
                      )}>
                        {example.output}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={clsx(
          'sticky bottom-0 px-6 py-4 border-t',
          isDarkMode
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        )}>
          <p className={clsx(
            'text-xs text-center',
            isDarkMode ? 'text-gray-500' : 'text-gray-400'
          )}>
            Press ESC or click outside to close
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  )
})

CommandCardExpanded.displayName = 'CommandCardExpanded'

export default CommandCardExpanded
