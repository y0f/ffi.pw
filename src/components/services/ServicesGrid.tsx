import { memo, type FC } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import ServiceCard from './ServiceCard'
import type { Service } from '../../config/services.processed'

interface ServicesGridProps {
  services: readonly Service[]
  rotations: number[]
  zIndices: Record<string, number>
  onClose: (id: string) => void
  onMaximize: (id: string) => void
  shouldAnimate: boolean
  hasAnimatedIn: boolean
  cardVariants: Variants
  containerVariants: Variants
}

const ServicesGrid: FC<ServicesGridProps> = memo(
  ({
    services,
    rotations,
    zIndices,
    onClose,
    onMaximize,
    shouldAnimate,
    hasAnimatedIn,
    cardVariants,
    containerVariants,
  }) => {
    return (
      <motion.div
        variants={shouldAnimate ? containerVariants : undefined}
        initial={shouldAnimate && !hasAnimatedIn ? 'hidden' : false}
        animate={shouldAnimate ? 'visible' : undefined}
        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pb-12 sm:pb-0 w-full justify-items-center'
      >
        <AnimatePresence>
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              variants={shouldAnimate ? cardVariants : undefined}
              initial={shouldAnimate && !hasAnimatedIn ? 'hidden' : false}
              animate={shouldAnimate ? 'visible' : undefined}
              exit={shouldAnimate ? 'exit' : undefined}
              style={{ willChange: shouldAnimate ? 'transform, opacity' : 'auto' }}
              className='w-full max-w-md pl-2 pr-2 pb-1 sm:p-0'
            >
              <ServiceCard
                rotation={rotations[index] || 0}
                title={service.title}
                items={service.items}
                onClose={() => onClose(service.id)}
                onMaximize={() => onMaximize(service.id)}
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
    )
  },
)

ServicesGrid.displayName = 'ServicesGrid'

export default ServicesGrid
