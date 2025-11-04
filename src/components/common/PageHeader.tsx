import { useMemo, type FC, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { combineThemePatterns, themePatterns } from '../../utils/themeClasses'

interface PageHeaderProps {
  title: string
  subtitle?: string | ReactNode
  isDarkMode: boolean
  shouldAnimate: boolean
  className?: string
}

const PageHeader: FC<PageHeaderProps> = ({
  title,
  subtitle,
  isDarkMode,
  shouldAnimate,
  className = '',
}) => {
  const fadeInAnimation = useMemo(
    () =>
      shouldAnimate
        ? {
            initial: { opacity: 0, y: -10 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.4, ease: 'easeOut' as const },
          }
        : { initial: false, animate: {}, transition: {} },
    [shouldAnimate],
  )

  const decorLineAnimation = useMemo(
    () =>
      shouldAnimate
        ? {
            initial: { scaleX: 0 },
            animate: { scaleX: 1 },
            transition: { delay: 0.2, duration: 0.5 },
          }
        : { initial: false, animate: {}, transition: {} },
    [shouldAnimate],
  )

  const fadeInOnlyAnimation = useMemo(
    () =>
      shouldAnimate
        ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
        : { initial: false, animate: {} },
    [shouldAnimate],
  )

  const headerTextClass = useMemo(
    () =>
      combineThemePatterns(
        isDarkMode,
        'text-3xl md:text-4xl fira mb-2 md:mb-4 animate-fade-in',
        themePatterns.text.primary,
        themePatterns.shadow.glow,
      ),
    [isDarkMode],
  )

  const subtitleClass = useMemo(
    () =>
      combineThemePatterns(
        isDarkMode,
        'fira-thin text-xs sm:text-sm md:text-base border-t pt-2 md:pt-3 inline-block',
        themePatterns.text.secondary,
        themePatterns.border.primary,
      ),
    [isDarkMode],
  )

  return (
    <motion.div
      {...fadeInAnimation}
      className={`text-center mb-4 sm:mb-6 md:mb-8 py-4 relative overflow-hidden w-full max-w-7xl pb-2 ${className}`}
    >
      <div className='flex items-center justify-center gap-4 mb-2'>
        <motion.div
          className='h-px w-8 sm:w-12 bg-linear-to-r from-transparent to-primary-500'
          {...decorLineAnimation}
        />
        <h1 className={headerTextClass}>{title}</h1>
        <motion.div
          className='h-px w-8 sm:w-12 bg-linear-to-l from-transparent to-primary-500'
          {...decorLineAnimation}
        />
      </div>
      {subtitle && (
        <motion.div {...fadeInOnlyAnimation} className={subtitleClass}>
          {typeof subtitle === 'string' ? (
            <span className='typed-out fira-thin'>{subtitle}</span>
          ) : (
            subtitle
          )}
        </motion.div>
      )}
    </motion.div>
  )
}

export default PageHeader
