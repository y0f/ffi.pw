import { memo, type FC } from 'react'
import { motion } from 'framer-motion'
import { FaCopy, FaCheck } from 'react-icons/fa'
import clsx from 'clsx'
import { combineThemePatterns, themePatterns } from '../../utils/themeClasses'
import GridPattern from '../common/GridPattern'

interface EmailCopyButtonProps {
  copied: boolean
  isDarkMode: boolean
  onClick: () => void
  copyAnimation: Record<string, any>
  hoverTap: Record<string, any>
  hoverRotate: Record<string, any>
  emailBoxClass: string
  emailTextClass: string
}

const EmailCopyButton: FC<EmailCopyButtonProps> = memo(
  ({
    copied,
    isDarkMode,
    onClick,
    copyAnimation,
    hoverTap,
    hoverRotate,
    emailBoxClass,
    emailTextClass,
  }) => {
    return (
      <div className='space-y-2'>
        <p
          className={combineThemePatterns(
            isDarkMode,
            'fira-thin text-sm',
            themePatterns.text.primary,
          )}
        >
          Email me directly at:
        </p>
        <motion.div
          className={clsx(emailBoxClass, 'relative overflow-hidden')}
          onClick={onClick}
          {...hoverTap}
          animate={copyAnimation}
          transition={{ duration: 0.6 }}
        >
          <GridPattern isDarkMode={isDarkMode} />

          <div className='flex items-center justify-between relative z-10 w-full'>
            <span className={emailTextClass}>contact@ffi.pw</span>
            <button className='transition-colors duration-200 ml-auto' aria-label='Copy email'>
              {copied ? (
                <motion.div
                  initial={{ scale: 0.8, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <FaCheck
                    className={clsx('text-sm', isDarkMode ? 'text-green-400' : 'text-green-600')}
                  />
                </motion.div>
              ) : (
                <motion.div {...hoverRotate}>
                  <FaCopy
                    className={combineThemePatterns(
                      isDarkMode,
                      'cursor-pointer text-sm opacity-70 group-hover:opacity-100',
                      themePatterns.accent.text,
                    )}
                  />
                </motion.div>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    )
  },
)

EmailCopyButton.displayName = 'EmailCopyButton'

export default EmailCopyButton
