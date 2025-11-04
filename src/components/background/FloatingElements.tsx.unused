import { memo, type FC } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { useTheme } from '../../hooks/useTheme'
import useIsMobile from '../../hooks/useIsMobile'

interface AnimationPosition {
  x: number[]
  y: number[]
  rotate: number[]
}

interface FloatingConfig {
  textSize?: string
  lightModeColor?: string
  darkModeColor?: string
  lightOpacity?: string
  darkOpacity?: string
  font?: string
  animationDurations?: number[]
  zIndex?: string
  isTransparent?: boolean
  transparentLightOpacity?: string
  transparentDarkOpacity?: string
}

interface FloatingElementsProps {
  symbols?: string[]
  positions?: AnimationPosition[]
  positionsCSS?: string[]
  config?: FloatingConfig
  className?: string
}

const DEFAULT_CONFIG: Required<FloatingConfig> = {
  textSize: 'text-[9vw] md:text-9xl',
  lightModeColor: 'text-gray-800',
  darkModeColor: 'text-gray-200',
  lightOpacity: 'opacity-80',
  darkOpacity: 'opacity-60',
  font: 'font-mono',
  animationDurations: [12, 14, 10, 11],
  zIndex: 'z-[0]',
  isTransparent: false,
  transparentLightOpacity: 'opacity-20',
  transparentDarkOpacity: 'opacity-30',
}

const FloatingElements: FC<FloatingElementsProps> = memo(
  ({
    symbols = ['★', '◆', '●', '■'],
    positions = [
      { x: [0, 15, 0], y: [0, -15, 0], rotate: [0, 8, 0] },
      { x: [0, -12, 0], y: [0, 12, 0], rotate: [0, -6, 0] },
      { x: [0, 10, 0], y: [0, -10, 0], rotate: [0, 4, 0] },
      { x: [0, -8, 0], y: [0, 8, 0], rotate: [0, -3, 0] },
    ],
    positionsCSS = [
      'left-[5vw] top-[65vh]',
      'right-[5vw] top-[15vh]',
      'left-[20vw] bottom-[10vh]',
      'right-[10vw] bottom-[15vh]',
    ],
    config = {},
    className = '',
  }) => {
    const { isDarkMode } = useTheme()
    const isMobile = useIsMobile()

    const {
      textSize,
      lightModeColor,
      darkModeColor,
      lightOpacity,
      darkOpacity,
      font,
      animationDurations,
      zIndex,
      isTransparent,
      transparentLightOpacity,
      transparentDarkOpacity,
    } = { ...DEFAULT_CONFIG, ...config }

    const textColor = isDarkMode ? darkModeColor : lightModeColor

    const visibilityOpacity = isTransparent
      ? isDarkMode
        ? transparentDarkOpacity
        : transparentLightOpacity
      : isDarkMode
        ? darkOpacity
        : lightOpacity

    const commonStyles = clsx(
      'absolute pointer-events-none select-none',
      font,
      textSize,
      textColor,
      visibilityOpacity,
      zIndex,
    )

    if (isMobile) return null

    return (
      <>
        {symbols.map((symbol, idx) => {
          const position = positions[idx]
          if (!position) return null

          return (
            <motion.div
              key={idx}
              animate={{
                x: position.x,
                y: position.y,
                rotate: position.rotate,
              }}
              transition={{
                duration: animationDurations[idx % animationDurations.length],
                repeat: Infinity,
                repeatType: 'reverse' as const,
              }}
              className={clsx(positionsCSS[idx], commonStyles, className)}
            >
              {symbol}
            </motion.div>
          )
        })}
      </>
    )
  },
)

FloatingElements.displayName = 'FloatingElements'

export default FloatingElements
