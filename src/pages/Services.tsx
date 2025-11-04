import { useEffect, useState, useCallback, useMemo, type FC } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ServicesGrid from '../components/services/ServicesGrid.tsx'
import MaximizedCardView from '../components/services/MaximizedCardView.tsx'
import {
  SERVICES,
  SERVICES_BY_ID,
  getInitialZIndices,
  getServiceRotations,
} from '../config/services.processed'
import useDeviceCapability from '../hooks/useDeviceCapability'
import { useTheme } from '../hooks/useTheme'
import { combineThemePatterns, themePatterns } from '../utils/themeClasses'
import PageHeader from '../components/common/PageHeader'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
      when: 'beforeChildren' as const,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'tween' as const,
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: 'easeIn' as const } },
}

const reducedMotionCardVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
  exit: { opacity: 0, transition: { duration: 0.1 } },
}

const Services: FC = () => {
  const { isMobile, shouldReduceMotion } = useDeviceCapability()
  const { isDarkMode } = useTheme()

  const [rotations] = useState<number[]>(() => getServiceRotations(isMobile))
  const [hiddenCards, setHiddenCards] = useState<string[]>([])
  const [maximizedCard, setMaximizedCard] = useState<string | null>(null)
  const [zIndices, setZIndices] = useState<Record<string, number>>(getInitialZIndices)
  const [hasAnimatedIn, setHasAnimatedIn] = useState<boolean>(false)

  const shouldAnimate = !isMobile && !shouldReduceMotion

  useEffect(() => {
    const contentTimer = setTimeout(() => setHasAnimatedIn(true), 500)

    return () => {
      clearTimeout(contentTimer)
    }
  }, [])

  const handleClose = useCallback((id: string) => {
    setHiddenCards((prev) => [...prev, id])
    setMaximizedCard(null)
  }, [])

  const handleMaximize = useCallback(
    (id: string) => {
      setMaximizedCard((prev) => (prev === id ? null : id))
      const maxZIndex = Math.max(...Object.values(zIndices))
      setZIndices((prev) => ({
        ...prev,
        [id]: maxZIndex + 1,
      }))
    },
    [zIndices],
  )

  const visibleCards = useMemo(
    () => SERVICES.filter((service) => !hiddenCards.includes(service.id)),
    [hiddenCards],
  )

  return (
    <div
      className={
        'h-auto sm:max-h-screen flex flex-col items-center p-3 relative overflow-hidden pb-4 sm:pb-6'
      }
    >
      <div className='w-full max-w-7xl mx-auto relative'>
        {/* Header section */}
        <PageHeader
          title='SERVICES'
          subtitle={
            <div className='typed-out fira-thin text-center'>
              <span>Professional digital solutions · Built with precision</span>
              <div className='flex justify-center items-center mt-3 gap-4 text-xs sm:text-sm opacity-80'>
                <div className='flex items-center gap-1'>
                  <span
                    className={combineThemePatterns(
                      isDarkMode,
                      'inline-block w-2 h-2 rounded-full border border-rounded',
                      themePatterns.status.available,
                    )}
                  />
                  <span className='text-xs md:text-sm fira'>Available</span>
                </div>
                <div className='flex items-center gap-1'>
                  <span
                    className={combineThemePatterns(
                      isDarkMode,
                      'inline-block w-2 h-2 rounded-full border border-rounded',
                      themePatterns.status.unavailable,
                    )}
                  />
                  <span className='text-xs md:text-sm fira'>Negotiable</span>
                </div>
                <div className='flex items-center gap-1'>
                  <span
                    className={combineThemePatterns(
                      isDarkMode,
                      'inline-block w-2 h-2 rounded-full border border-rounded',
                      themePatterns.status.disabled,
                    )}
                  />
                  <span className='text-xs md:text-sm fira'>Unavailable</span>
                </div>
              </div>
            </div>
          }
          isDarkMode={isDarkMode}
          shouldAnimate={shouldAnimate}
          className='pb-6 mb-4 sm:mb-6 md:mb-3'
        />

        {/* Main content */}
        {maximizedCard && SERVICES_BY_ID.get(maximizedCard) ? (
          <MaximizedCardView
            service={SERVICES_BY_ID.get(maximizedCard)!}
            rotation={rotations[SERVICES.findIndex((s) => s.id === maximizedCard)] || 0}
            zIndex={zIndices[maximizedCard] || 100}
            onClose={() => handleClose(maximizedCard)}
            onMaximize={() => handleMaximize(maximizedCard)}
          />
        ) : (
          <ServicesGrid
            services={visibleCards}
            rotations={rotations}
            zIndices={zIndices}
            onClose={handleClose}
            onMaximize={handleMaximize}
            shouldAnimate={shouldAnimate}
            hasAnimatedIn={hasAnimatedIn}
            cardVariants={shouldReduceMotion ? reducedMotionCardVariants : cardVariants}
            containerVariants={containerVariants}
          />
        )}

        {/* Hidden cards notice */}
        <AnimatePresence>
          {hiddenCards.length > 0 && !maximizedCard && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={combineThemePatterns(
                isDarkMode,
                'text-center mt-6 fira text-xs',
                themePatterns.text.secondary,
              )}
            >
              {hiddenCards.length} service{hiddenCards.length !== 1 ? 's' : ''} closed — refresh to
              restore
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Services
