import { useState, useEffect, useRef, type FC } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../hooks/useTheme'
import useIsMobile from '../../hooks/useIsMobile'

interface OwlProps {
  isSmoking?: boolean
}

interface SmokePuff {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
}

interface EyePosition {
  cx: number
  cy: number
}

interface EyePositions {
  leftEye: EyePosition
  rightEye: EyePosition
}

const Owl: FC<OwlProps> = ({ isSmoking = false }) => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [isHoveringOwl, setIsHoveringOwl] = useState(false)
  const [smokePuffs, setSmokePuffs] = useState<SmokePuff[]>([])
  const owlRef = useRef<HTMLDivElement>(null)
  const { isDarkMode } = useTheme()
  const isMobile = useIsMobile()

  useEffect(() => {
    if (!isSmoking) {
      return () => setSmokePuffs([])
    }

    const interval = setInterval(() => {
      setSmokePuffs((prev) =>
        [
          ...prev,
          {
            id: Date.now(),
            x: 60,
            y: 46,
            vx: Math.random() * 4 - 1,
            vy: Math.random() * 4 - 1,
            size: Math.random() * 0.5 + 0.5,
          },
        ].slice(-8),
      )
    }, 300)

    return () => clearInterval(interval)
  }, [isSmoking])

  useEffect(() => {
    if (isMobile) return

    const handleMouseMove = (e: globalThis.MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isMobile])

  const [eyePositions, setEyePositions] = useState<EyePositions>({
    leftEye: { cx: 28, cy: 35 },
    rightEye: { cx: 52, cy: 35 },
  })

  useEffect(() => {
    const calculateEyePosition = (eyeCenterX: number, eyeCenterY: number): EyePosition => {
      if (!owlRef.current) return { cx: eyeCenterX, cy: eyeCenterY }

      const owlRect = owlRef.current.getBoundingClientRect()
      const owlX = owlRect.left + owlRect.width / 2
      const owlY = owlRect.top + owlRect.height / 2

      const angle = Math.atan2(
        cursorPosition.y - (owlY + eyeCenterY - 40),
        cursorPosition.x - (owlX + eyeCenterX - 40),
      )

      const distance = isHoveringOwl || isSmoking ? 3.5 : 2.5
      return {
        cx: eyeCenterX + Math.cos(angle) * distance,
        cy: eyeCenterY + Math.sin(angle) * distance,
      }
    }

    setEyePositions({
      leftEye: calculateEyePosition(28, 35),
      rightEye: calculateEyePosition(52, 35),
    })
  }, [cursorPosition, isHoveringOwl, isSmoking])

  const leftEye = eyePositions.leftEye
  const rightEye = eyePositions.rightEye

  const eyeHeight = isSmoking ? 5 : 9

  return (
    <motion.div
      ref={owlRef}
      className='absolute right-8 cursor-pointer'
      style={{ bottom: '-10px' }}
      animate={{
        y: isHoveringOwl && !isSmoking ? -5 : 0,
        rotate: isSmoking ? [0, -0.5, 0.5, 0] : 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
        rotate: { duration: 3, repeat: isSmoking ? Infinity : 0 },
      }}
      onMouseEnter={() => setIsHoveringOwl(true)}
      onMouseLeave={() => setIsHoveringOwl(false)}
    >
      <svg width='80' height='75' viewBox='0 0 80 80' style={{ overflow: 'visible' }}>
        <defs>
          <radialGradient id='bodyGradient' cx='50%' cy='30%' r='60%'>
            <stop offset='0%' stopColor={isDarkMode ? '#6B7280' : '#E5E7EB'} />
            <stop offset='100%' stopColor={isDarkMode ? '#374151' : '#6B7280'} />
          </radialGradient>

          <filter id='shadow' x='-50%' y='-50%' width='200%' height='200%'>
            <feDropShadow dx='0' dy='2' stdDeviation='3' floodOpacity='0.15' />
          </filter>

          <radialGradient id='eyeShine'>
            <stop offset='0%' stopColor='white' stopOpacity='0.8' />
            <stop offset='100%' stopColor='white' stopOpacity='0.2' />
          </radialGradient>

          <linearGradient id='cigaretteGradient' x1='0%' y1='0%' x2='100%' y2='0%'>
            <stop offset='0%' stopColor={isDarkMode ? '#E5E7EB' : '#F3F4F6'} />
            <stop offset='70%' stopColor={isDarkMode ? '#E5E7EB' : '#F3F4F6'} />
            <stop offset='70%' stopColor={isDarkMode ? '#DC2626' : '#EF4444'} />
            <stop offset='85%' stopColor={isDarkMode ? '#DC2626' : '#EF4444'} />
            <stop offset='85%' stopColor={isDarkMode ? '#9CA3AF' : '#6B7280'} />
            <stop offset='100%' stopColor={isDarkMode ? '#9CA3AF' : '#6B7280'} />
          </linearGradient>
        </defs>

        <motion.path
          fill='url(#bodyGradient)'
          filter='url(#shadow)'
          initial={{ d: 'M 10 35 Q 5 25, 15 20 Q 20 25, 25 35 Q 20 45, 15 50 Q 5 45, 10 35' }}
          animate={{
            d:
              isHoveringOwl && !isSmoking
                ? 'M 5 30 Q 0 15, 15 15 Q 20 20, 25 35 Q 20 45, 15 55 Q 0 50, 5 30'
                : 'M 10 35 Q 5 25, 15 20 Q 20 25, 25 35 Q 20 45, 15 50 Q 5 45, 10 35',
          }}
          transition={{
            duration: 0.2,
            repeat: isHoveringOwl && !isSmoking ? Infinity : 0,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        />

        <motion.path
          fill='url(#bodyGradient)'
          filter='url(#shadow)'
          initial={{ d: 'M 70 35 Q 75 25, 65 20 Q 60 25, 55 35 Q 60 45, 65 50 Q 75 45, 70 35' }}
          animate={{
            d:
              isHoveringOwl && !isSmoking
                ? 'M 75 30 Q 80 15, 65 15 Q 60 20, 55 35 Q 60 45, 65 55 Q 80 50, 75 30'
                : 'M 70 35 Q 75 25, 65 20 Q 60 25, 55 35 Q 60 45, 65 50 Q 75 45, 70 35',
          }}
          transition={{
            duration: 0.2,
            repeat: isHoveringOwl && !isSmoking ? Infinity : 0,
            repeatType: 'reverse',
            ease: 'easeInOut',
            delay: 0.1,
          }}
        />

        <ellipse cx='40' cy='40' rx='22' ry='28' fill='url(#bodyGradient)' filter='url(#shadow)' />

        <path
          d='M 30 45 Q 40 48, 50 45 M 32 50 Q 40 52, 48 50 M 34 55 Q 40 56, 46 55'
          stroke={isDarkMode ? '#4B5563' : '#6B7280'}
          strokeWidth='1'
          fill='none'
          opacity='0.5'
        />

        <motion.path
          fill='url(#bodyGradient)'
          initial={{ d: 'M 25 20 Q 20 10, 25 15 Q 30 20, 32 25' }}
          animate={{
            d:
              isHoveringOwl && !isSmoking
                ? 'M 25 20 Q 18 8, 25 15 Q 30 20, 32 25'
                : 'M 25 20 Q 20 10, 25 15 Q 30 20, 32 25',
          }}
          transition={{ duration: 0.3 }}
        />
        <motion.path
          fill='url(#bodyGradient)'
          initial={{ d: 'M 55 20 Q 60 10, 55 15 Q 50 20, 48 25' }}
          animate={{
            d:
              isHoveringOwl && !isSmoking
                ? 'M 55 20 Q 62 8, 55 15 Q 50 20, 48 25'
                : 'M 55 20 Q 60 10, 55 15 Q 50 20, 48 25',
          }}
          transition={{ duration: 0.3 }}
        />

        <ellipse cx='28' cy='35' rx='8' ry={eyeHeight} fill={isDarkMode ? '#1F2937' : '#4B5563'} />
        <ellipse cx='52' cy='35' rx='8' ry={eyeHeight} fill={isDarkMode ? '#1F2937' : '#4B5563'} />

        <motion.ellipse
          cx='28'
          cy='35'
          rx='6.5'
          ry={isSmoking ? '3' : '6.5'}
          fill='white'
          animate={{ scale: isHoveringOwl && !isSmoking ? 1.1 : 1 }}
        />
        <motion.ellipse
          cx='52'
          cy='35'
          rx='6.5'
          ry={isSmoking ? '3' : '6.5'}
          fill='white'
          animate={{ scale: isHoveringOwl && !isSmoking ? 1.1 : 1 }}
        />

        <AnimatePresence>
          {isHoveringOwl && !isSmoking && (
            <>
              <motion.path
                d='M 20 28 L 32 32'
                stroke={isDarkMode ? '#DC2626' : '#DC2626'}
                strokeWidth='2'
                strokeLinecap='round'
                initial={{ opacity: 0, y: -2 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -2 }}
              />
              <motion.path
                d='M 60 28 L 48 32'
                stroke={isDarkMode ? '#DC2626' : '#DC2626'}
                strokeWidth='2'
                strokeLinecap='round'
                initial={{ opacity: 0, y: -2 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -2 }}
              />
            </>
          )}
        </AnimatePresence>

        <motion.circle
          cx={leftEye.cx}
          cy={leftEye.cy}
          fill='black'
          initial={{ r: 2, opacity: 1 }}
          animate={{
            r: isHoveringOwl && !isSmoking ? 2.5 : 2,
            opacity: isSmoking ? 0.8 : 1,
          }}
        />
        <motion.circle
          cx={rightEye.cx}
          cy={rightEye.cy}
          fill='black'
          initial={{ r: 2, opacity: 1 }}
          animate={{
            r: isHoveringOwl && !isSmoking ? 2.5 : 2,
            opacity: isSmoking ? 0.8 : 1,
          }}
        />
        <circle cx='30' cy='33' r='1.5' fill='url(#eyeShine)' opacity={isSmoking ? 0.5 : 1} />
        <circle cx='54' cy='33' r='1.5' fill='url(#eyeShine)' opacity={isSmoking ? 0.5 : 1} />

        <motion.path
          fill={isDarkMode ? '#9CA3AF' : '#000000'}
          filter='url(#shadow)'
          initial={{ d: 'M 40 40 L 37 44 L 40 46 L 43 44 Z' }}
          animate={{
            d:
              isHoveringOwl && !isSmoking
                ? 'M 40 40 L 36 45 L 40 48 L 44 45 Z'
                : 'M 40 40 L 37 44 L 40 46 L 43 44 Z',
          }}
        />

        <AnimatePresence>
          {isSmoking && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <rect
                x='42'
                y='52'
                width='18'
                height='2.5'
                rx='1'
                fill='url(#cigaretteGradient)'
                filter='url(#shadow)'
                style={{ transformOrigin: '51px 53.25px', transform: 'rotate(45deg)' }}
              />
              <motion.circle
                cx='56'
                cy='58'
                r='1.8'
                fill={isDarkMode ? '#FCA5A5' : '#EF4444'}
                initial={{ opacity: 0.8, scale: 0.9 }}
                animate={{
                  opacity: [0.8, 1, 0.8],
                  scale: [0.9, 1, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                filter='url(#shadow)'
                style={{ transformOrigin: '60px 53px', transform: 'rotate(45deg)' }}
              />
            </motion.g>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {smokePuffs.map((puff) => (
            <motion.circle
              key={puff.id}
              cx={puff.x}
              cy={puff.y}
              r={10 * puff.size}
              fill={isDarkMode ? 'rgba(229, 231, 235, 0.6)' : 'rgba(55, 65, 81, 0.5)'}
              initial={{
                opacity: 0,
                scale: 0.2,
                x: 0,
                y: 0,
              }}
              animate={{
                opacity: [0.6, 0.4, 0.2, 0],
                scale: [0.2, 0.8, 1.2, 1.5],
                x: [3, 8 + puff.vx * 4, 16 + puff.vx * 8, 24 + puff.vx * 12],
                y: [12, 8 + puff.vy * 4, 16 + puff.vy * 8, 24 + puff.vy * 12],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 2.5,
                ease: 'easeOut',
              }}
              style={{
                filter: isDarkMode ? 'blur(1px)' : 'blur(0.5px)',
              }}
            />
          ))}
        </AnimatePresence>

        <path
          d='M 32 60 L 32 65 M 32 65 L 28 68 M 32 65 L 32 68 M 32 65 L 36 68'
          stroke={isDarkMode ? '#9CA3AF' : '#000000'}
          strokeWidth='2'
          strokeLinecap='round'
          fill='none'
        />
        <path
          d='M 48 60 L 48 65 M 48 65 L 44 68 M 48 65 L 48 68 M 48 65 L 52 68'
          stroke={isDarkMode ? '#9CA3AF' : '#000000'}
          strokeWidth='2'
          strokeLinecap='round'
          fill='none'
        />
      </svg>
    </motion.div>
  )
}

export default Owl
