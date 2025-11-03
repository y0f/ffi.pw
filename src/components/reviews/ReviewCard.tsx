import { useRef, useState, type FC, type MouseEvent, type CSSProperties } from 'react'
import { FaQuoteLeft } from 'react-icons/fa'
import { motion } from 'framer-motion'
import clsx from 'clsx'

interface Review {
  content: string
  name: string
  position: string
  date: string
  relationship: string
}

interface ReviewCardProps {
  review: Review
  isActive: boolean
  isDarkMode: boolean
}

interface MousePosition {
  x: number
  y: number
}

const ReviewCard: FC<ReviewCardProps> = ({ review, isActive, isDarkMode }) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 })
  const [glowPosition, setGlowPosition] = useState<MousePosition>({ x: 0, y: 0 })

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setMousePosition({ x, y })

    setTimeout(() => {
      setGlowPosition({ x, y })
    }, 50)
  }

  const cardClass = clsx(
    'cursor-grab relative p-4 sm:p-6 rounded-lg border overflow-hidden h-full md:h-70',
    isActive ? 'z-10' : 'z-0',
    isDarkMode
      ? 'border-neutral-200/20'
      : 'border-gray-400 bg-linear-to-br from-white/10 via-primary-400/10 to-gray-50/10',
  )

  const cardBackground = isDarkMode
    ? `linear-gradient(135deg, rgba(20, 25, 40, 0.18) 0%, rgba(10, 15, 30, 0.98) 100%)`
    : undefined

  const quoteIconClass = clsx(
    'flex-shrink-0 mt-1 text-sm',
    isActive
      ? isDarkMode
        ? 'text-primary-400'
        : 'text-primary-500'
      : isDarkMode
        ? 'text-white/40'
        : 'text-gray-400',
  )

  const reviewTextClass = clsx(
    'fira-thin italic text-xs sm:text-sm md:text-sm leading-relaxed',
    isDarkMode
      ? isActive
        ? 'text-white/90'
        : 'text-white/60'
      : isActive
        ? 'text-gray-900/90'
        : 'text-gray-600/70',
  )

  const dividerClass = clsx(
    'border-t pt-3 mt-4',
    isDarkMode ? 'border-neutral-200/20' : 'border-gray-500/70',
  )

  const nameClass = clsx(
    'fira text-sm sm:text-base md:text-md',
    isActive
      ? isDarkMode
        ? 'text-primary-400 text-shadow-lg'
        : 'text-primary-600'
      : isDarkMode
        ? 'text-white/90 text-shadow-sm'
        : 'text-gray-700',
  )

  const positionClass = clsx(
    'fira text-xs',
    isDarkMode
      ? isActive
        ? 'text-white/80'
        : 'text-white/60'
      : isActive
        ? 'text-gray-700/80'
        : 'text-gray-600/60',
  )

  const dateClass = clsx(
    'fira text-xs',
    isDarkMode
      ? isActive
        ? 'text-white/80'
        : 'text-white/40'
      : isActive
        ? 'text-gray-700/70'
        : 'text-gray-500/50',
  )

  const relationshipClass = clsx(
    'fira text-xs mt-1',
    isDarkMode
      ? isActive
        ? 'text-white/80'
        : 'text-white/30'
      : isActive
        ? 'text-gray-700/70'
        : 'text-gray-500/50',
  )

  const cardStyle: CSSProperties = {
    background: cardBackground,
    perspective: '1000px',
    transformStyle: 'preserve-3d',
  }

  const glowStyle: CSSProperties = {
    background: `radial-gradient(circle at ${glowPosition.x}px ${glowPosition.y}px,
      ${isDarkMode ? 'rgba(255, 255, 255, 0.01)' : 'rgba(255, 255, 255, 1)'},
      transparent 70%)`,
    opacity: isActive ? 1 : 0,
    transform: `translateZ(30px)`,
  }

  const transformStyle: CSSProperties = {
    transform: isActive
      ? `rotateX(${mousePosition.y / -20}deg) rotateY(${mousePosition.x / 20}deg)`
      : 'rotateX(0) rotateY(0)',
    transformStyle: 'preserve-3d',
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isActive ? 1 : 0.5,
        y: isActive ? 0 : 20,
        scale: isActive ? 1 : 0.95,
      }}
      transition={{ duration: 0.5 }}
      className={cardClass}
      style={cardStyle}
    >
      <div
        className='absolute inset-0 pointer-events-none transition-opacity duration-300'
        style={glowStyle}
      />
      <motion.div
        style={transformStyle}
        transition={{ type: 'spring' as const, stiffness: 300, damping: 20 }}
      >
        <div className='flex items-start gap-5'>
          <motion.div
            className={quoteIconClass}
            animate={{
              rotate: isActive ? [0, 5, -5, 0] : 0,
            }}
            transition={{ duration: 0.5 }}
          >
            <FaQuoteLeft />
          </motion.div>
          <motion.p
            className={reviewTextClass}
            animate={{
              textShadow: isActive
                ? isDarkMode
                  ? '0 0 8px rgba(255, 255, 255, 0.1)'
                  : '0 0 8px rgba(0, 0, 0, 0.05)'
                : 'none',
            }}
          >
            {review.content}
          </motion.p>
        </div>
        <div className={dividerClass}>
          <motion.p
            className={nameClass}
            animate={{
              opacity: isActive ? 1 : 0.6,
            }}
          >
            {review.name}
          </motion.p>
          <div className='flex flex-wrap justify-between items-baseline mt-1'>
            <motion.p className={positionClass}>{review.position}</motion.p>
            <motion.p className={dateClass}>{review.date}</motion.p>
          </div>
          <motion.p className={relationshipClass}>{review.relationship}</motion.p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ReviewCard
