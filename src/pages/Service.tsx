import { useEffect, useMemo, type FC } from 'react'
import { useParams, Link } from 'react-router-dom'
import { SERVICES_BY_SLUG } from '../config/services.processed'
import { useTheme } from '../hooks/useTheme'
import useDeviceCapability from '../hooks/useDeviceCapability'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import { FiArrowLeft } from 'react-icons/fi'
import ServiceHeader from '../components/services/ServiceHeader'
import ServiceOfferings from '../components/services/ServiceOfferings'
import { createTechIcons } from '../utils/techIcons'
import { getReadableTitle, getServiceExplanation } from '../utils/serviceUtils'

const getGridPattern = (isDarkMode: boolean): React.CSSProperties => ({
  backgroundImage: `linear-gradient(${isDarkMode ? '#ffffff' : '#000000'} 1px, transparent 1px), linear-gradient(90deg, ${isDarkMode ? '#ffffff' : '#000000'} 1px, transparent 1px)`,
  backgroundSize: '20px 20px',
})

const Service: FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const { isDarkMode } = useTheme()
  const { isMobile, shouldReduceMotion } = useDeviceCapability()

  const service = slug ? SERVICES_BY_SLUG.get(slug) : undefined

  const techIcons = useMemo(() => createTechIcons(isDarkMode), [isDarkMode])
  const gridPatternStyle = useMemo(() => getGridPattern(isDarkMode), [isDarkMode])
  const shouldAnimate = !isMobile && !shouldReduceMotion

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!service) {
    return (
      <div className='min-h-auto max-h-screen flex flex-col items-center justify-center p-8'>
        <h2 className={clsx('text-2xl mb-4', isDarkMode ? 'text-gray-200' : 'text-gray-800')}>
          404 - Service not found
        </h2>
        <Link
          to='/services'
          className={clsx(
            'inline-flex items-center px-4 py-2 rounded',
            isDarkMode
              ? 'bg-primary-400/20 hover:bg-primary-400/30'
              : 'bg-primary-500/20 hover:bg-primary-500/30',
            'transition-all duration-300',
          )}
        >
          <FiArrowLeft className='mr-2' /> Return to Services
        </Link>
      </div>
    )
  }

  const readableTitle = getReadableTitle(service.title)

  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0 } : false}
      animate={shouldAnimate ? { opacity: 1 } : {}}
      transition={shouldAnimate ? { duration: 0.3, ease: 'easeOut' } : {}}
      className={clsx('min-h-screen p-4 md:p-8', isDarkMode ? 'text-gray-200' : 'text-gray-800')}
    >
      <div className='max-w-4xl mx-auto'>
        <ServiceHeader
          slug={slug || ''}
          readableTitle={readableTitle}
          description={service.description}
          explanation={getServiceExplanation(slug || '')}
          isDarkMode={isDarkMode}
          shouldAnimate={shouldAnimate}
          gridPatternStyle={gridPatternStyle}
        />

        <ServiceOfferings
          slug={slug || ''}
          readableTitle={readableTitle}
          items={service.items}
          features={service.features}
          technologies={service.technologies}
          techIcons={techIcons}
          isDarkMode={isDarkMode}
          gridPatternStyle={gridPatternStyle}
        />
      </div>
    </motion.div>
  )
}

export default Service
