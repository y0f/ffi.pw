import { useEffect, useState, useCallback, useMemo, type FC } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ServiceCard from '../components/services/ServiceCard.tsx'
import servicesData from '../config/services.json'
import useDeviceCapability from '../hooks/useDeviceCapability'
import { useTheme } from '../hooks/useTheme'
import { combineThemePatterns, themePatterns } from '../utils/themeClasses'

interface Service {
  id: string
  title: string
  slug: string
  description: string
  items: Array<{ title: string; price: string; description: string }>
  features: string[]
  technologies: string[]
  available?: boolean
}

interface ServicesData {
  services: Service[]
}

const typedServicesData = servicesData as ServicesData

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 300, damping: 25 },
  },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
}

const Services: FC = () => {
  const { isMobile, shouldReduceMotion } = useDeviceCapability()
  const { isDarkMode } = useTheme()

  const [rotations] = useState<number[]>(() =>
    typedServicesData.services.map(() =>
      isMobile ? Math.random() * 0.5 - 0.25 : Math.random() * 1.5 - 0.75,
    ),
  )
  const [hiddenCards, setHiddenCards] = useState<string[]>([])
  const [maximizedCard, setMaximizedCard] = useState<string | null>(null)
  const [zIndices, setZIndices] = useState<Record<string, number>>(() => {
    const initialZIndices: Record<string, number> = {}
    typedServicesData.services.forEach((service, index) => {
      initialZIndices[service.id] = index + 1
    })
    return initialZIndices
  })
  const [hasAnimatedIn, setHasAnimatedIn] = useState<boolean>(false)

  const shouldAnimate = !isMobile && !shouldReduceMotion

  useEffect(() => {
    const timer = setTimeout(() => setHasAnimatedIn(true), 800)
    return () => clearTimeout(timer)
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
    () => typedServicesData.services.filter((service) => !hiddenCards.includes(service.id)),
    [hiddenCards],
  )

  const headerTitleClass = useMemo(
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
    <div
      className={
        'h-auto sm:max-h-screen flex flex-col items-center p-3 relative overflow-hidden pb-4 sm:pb-6'
      }
    >
      <div className='w-full max-w-7xl mx-auto relative'>
        {/* Header section */}
        <motion.div
          initial={shouldAnimate ? { opacity: 0, y: -10 } : false}
          animate={shouldAnimate ? { opacity: 1, y: 0 } : {}}
          transition={shouldAnimate ? { duration: 0.4, ease: 'easeOut' } : {}}
          className='text-center pb-6 mb-4 sm:mb-6 md:mb-3 py-4 relative overflow-hidden w-full max-w-7xl'
        >
          <div className='flex items-center justify-center gap-4 mb-2'>
            <motion.div
              className='h-px w-8 sm:w-12 bg-linear-to-r from-transparent to-primary-500'
              initial={shouldAnimate ? { scaleX: 0 } : false}
              animate={shouldAnimate ? { scaleX: 1 } : {}}
              transition={shouldAnimate ? { delay: 0.2, duration: 0.5 } : {}}
            />
            <h1 className={headerTitleClass}>SERVICES</h1>
            <motion.div
              className='h-px w-8 sm:w-12 bg-linear-to-l from-transparent to-primary-500'
              initial={shouldAnimate ? { scaleX: 0 } : false}
              animate={shouldAnimate ? { scaleX: 1 } : {}}
              transition={shouldAnimate ? { delay: 0.2, duration: 0.5 } : {}}
            />
          </div>
          <motion.div
            initial={shouldAnimate ? { opacity: 0 } : false}
            animate={shouldAnimate ? { opacity: 1 } : {}}
            className={subtitleClass}
          >
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
          </motion.div>
        </motion.div>

        {/* Main content */}
        {maximizedCard ? (
          <div className='fixed inset-0 pt-12 p-4 z-40 flex items-center justify-center'>
            {typedServicesData.services
              .filter((service) => service.id === maximizedCard)
              .map((service, index) => (
                <ServiceCard
                  key={service.id}
                  rotation={rotations[index] || 0}
                  title={service.title}
                  items={service.items}
                  onClose={() => handleClose(service.id)}
                  onMaximize={() => handleMaximize(service.id)}
                  isMaximized={true}
                  zIndex={zIndices[service.id] || index + 1}
                  serviceSlug={service.slug}
                  description={service.description}
                  features={service.features}
                  technologies={service.technologies}
                />
              ))}
          </div>
        ) : (
          <motion.div
            variants={shouldAnimate ? containerVariants : {}}
            initial={shouldAnimate && !hasAnimatedIn ? 'hidden' : false}
            animate={shouldAnimate ? 'visible' : {}}
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pb-12 sm:pb-0 w-full justify-items-center'
          >
            <AnimatePresence>
              {visibleCards.map((service, index) => (
                <motion.div
                  key={service.id}
                  layoutId={shouldAnimate ? `card-${service.id}` : undefined}
                  variants={shouldAnimate ? cardVariants : {}}
                  initial={shouldAnimate && !hasAnimatedIn ? 'hidden' : false}
                  animate={shouldAnimate ? 'visible' : {}}
                  exit={shouldAnimate ? 'exit' : {}}
                  className='w-full max-w-md pl-2 pr-2 pb-1 sm:p-0'
                >
                  <ServiceCard
                    rotation={rotations[index] || 0}
                    title={service.title}
                    items={service.items}
                    onClose={() => handleClose(service.id)}
                    onMaximize={() => handleMaximize(service.id)}
                    isMaximized={false}
                    isAvailable={service.available}
                    zIndex={zIndices[service.id] || index + 1}
                    serviceSlug={service.slug}
                    description={service.description}
                    features={service.features}
                    technologies={service.technologies}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
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
