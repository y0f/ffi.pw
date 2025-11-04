import { type FC } from 'react'
import { motion } from 'framer-motion'

interface HexagonNavigationProps {
  currentSlide: number
  totalSlides: number
  onSelect: (index: number) => void
  isDarkMode: boolean
}

const HexagonNavigation: FC<HexagonNavigationProps> = ({
  currentSlide,
  totalSlides,
  onSelect,
  isDarkMode,
}) => {
  return (
    <div className='flex justify-center items-center space-x-2 sm:space-x-2 mt-8 sm:mt-0'>
      {Array.from({ length: totalSlides }).map((_, index) => {
        const hexagonFill =
          currentSlide === index
            ? isDarkMode
              ? 'rgba(99, 179, 237, 0.05)'
              : 'rgba(255, 255, 255, 0.35)'
            : 'rgba(255, 255, 255, 0.05)'

        const hexagonStroke =
          currentSlide === index
            ? isDarkMode
              ? 'text-primary-400'
              : 'text-primary-600'
            : isDarkMode
              ? 'text-white/80'
              : 'text-black'

        const numberColor =
          currentSlide === index
            ? isDarkMode
              ? 'text-white/80'
              : 'text-gray-800'
            : isDarkMode
              ? 'text-white/60'
              : 'text-black'

        return (
          <motion.button
            key={index}
            onClick={() => onSelect(index)}
            className='relative w-7.5 h-7.5 sm:w-9.5 sm:h-10 flex items-center justify-center focus:outline-none group cursor-pointer'
            aria-label={`Go to review ${index + 1}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{
                rotate: currentSlide === index ? 360 : 0,
                scale: currentSlide === index ? 1.2 : 0.8,
                opacity: currentSlide === index ? 1 : 0.6,
              }}
              transition={{ type: 'spring' as const, stiffness: 500 }}
              className='absolute inset-0 pointer-events-none'
            >
              <svg viewBox='0 0 100 100' className='w-7.5 md:w-full h-7.5 md:h-full'>
                <polygon
                  points='50,5 95,25 95,75 50,95 5,75 5,25'
                  fill={hexagonFill}
                  stroke='currentColor'
                  strokeWidth='1.5'
                  className={hexagonStroke}
                />
              </svg>
            </motion.div>
            <motion.span
              animate={{
                scale: currentSlide === index ? 1.3 : 0.9,
              }}
              className={`absolute text-xs fira-thin pointer-events-none ${numberColor}`}
            >
              {index + 1}
            </motion.span>
          </motion.button>
        )
      })}
    </div>
  )
}

export default HexagonNavigation
