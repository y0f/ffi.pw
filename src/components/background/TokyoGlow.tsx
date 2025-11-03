import { memo, useEffect, useState, useMemo, type FC } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../../hooks/useTheme'
import useDeviceCapability from '../../hooks/useDeviceCapability'
import { getOptimizedBlur } from '../../utils/performance'
import clsx from 'clsx'
import type { DeviceCapability } from '../../hooks/useDeviceCapability'

interface TokyoGlowProps {
  deviceInfo?: DeviceCapability
}

interface BlurValues {
  large: number
  medium: number
  small: number
  tiny: number
}

const TokyoGlow: FC<TokyoGlowProps> = memo(({ deviceInfo }) => {
  const { isDarkMode } = useTheme()
  const fallbackDeviceInfo = useDeviceCapability()
  const { deviceTier, shouldReduceMotion } = deviceInfo || fallbackDeviceInfo
  const [primaryColor, setPrimaryColor] = useState('#3b82f6')

  const blurValues: BlurValues = useMemo(
    () => ({
      large: getOptimizedBlur(120, deviceTier),
      medium: getOptimizedBlur(100, deviceTier),
      small: getOptimizedBlur(90, deviceTier),
      tiny: getOptimizedBlur(60, deviceTier),
    }),
    [deviceTier],
  )

  const shouldRenderAnimations = !shouldReduceMotion && deviceTier === 'desktop'

  useEffect(() => {
    const updatePrimaryColor = () => {
      const color =
        getComputedStyle(document.documentElement).getPropertyValue('--color-primary-500').trim() ||
        '#3b82f6'
      setPrimaryColor(color)
    }

    updatePrimaryColor()

    const observer = new MutationObserver((mutations: MutationRecord[]) => {
      mutations.forEach((mutation: MutationRecord) => {
        if (mutation.attributeName === 'data-theme') {
          updatePrimaryColor()
        }
      })
    })

    observer.observe(document.documentElement, { attributes: true })

    return () => observer.disconnect()
  }, [])

  return (
    <div className='fixed inset-0 pointer-events-none overflow-hidden z-0'>
      {shouldRenderAnimations && (
        <>
          <motion.div
            className='absolute w-[600px] h-[600px] rounded-full'
            style={{
              background: `radial-gradient(circle, ${primaryColor}15 0%, transparent 10%)`,
              filter: `blur(${blurValues.large}px)`,
              top: '10%',
              right: '15%',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
              x: [0, 30, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'easeInOut' as const,
            }}
          />

          <motion.div
            className='absolute w-[500px] h-[500px] rounded-full'
            style={{
              background: `radial-gradient(circle, ${primaryColor}20 0%, transparent 70%)`,
              filter: `blur(${blurValues.medium}px)`,
              bottom: '20%',
              left: '10%',
            }}
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.4, 0.6, 0.4],
              x: [0, -25, 0],
              y: [0, 15, 0],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: 'easeInOut' as const,
              delay: 1,
            }}
          />

          <motion.div
            className='absolute w-[400px] h-[400px] rounded-full'
            style={{
              background: `radial-gradient(circle, ${primaryColor}18 0%, transparent 70%)`,
              filter: `blur(${blurValues.small}px)`,
              top: '60%',
              right: '30%',
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.35, 0.55, 0.35],
              x: [0, 20, 0],
              y: [0, -10, 0],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: 'easeInOut' as const,
              delay: 2,
            }}
          />
        </>
      )}

      <div
        className={clsx('absolute inset-0', isDarkMode ? 'opacity-[0.03]' : 'opacity-[0.02]')}
        style={{
          backgroundImage: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent 2px,
            ${primaryColor}40 2px,
            ${primaryColor}40 3px
          )`,
          backgroundSize: '100px 100%',
        }}
      />

      <motion.div
        className={clsx('absolute inset-0', isDarkMode ? 'opacity-[0.02]' : 'opacity-[0.015]')}
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 4px,
            ${primaryColor}30 4px,
            ${primaryColor}30 5px
          )`,
          backgroundSize: '100% 200px',
        }}
        animate={{
          backgroundPosition: ['0% 0%', '0% 100%'],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear' as const,
        }}
      />

      <div
        className='absolute top-0 left-0 w-[300px] h-[300px] rounded-full'
        style={{
          background: `radial-gradient(circle, ${primaryColor}12 0%, transparent 70%)`,
          filter: `blur(${getOptimizedBlur(80, deviceTier)}px)`,
          opacity: isDarkMode ? 0.6 : 0.4,
        }}
      />

      <div
        className='absolute bottom-0 right-0 w-[350px] h-[350px] rounded-full'
        style={{
          background: `radial-gradient(circle, ${primaryColor}15 0%, transparent 70%)`,
          filter: `blur(${blurValues.small}px)`,
          opacity: isDarkMode ? 0.7 : 0.5,
        }}
      />

      <motion.div
        className='absolute inset-0'
        style={{
          background: `linear-gradient(
            135deg,
            transparent 0%,
            transparent 45%,
            ${primaryColor}08 50%,
            transparent 55%,
            transparent 100%
          )`,
          opacity: isDarkMode ? 0.3 : 0.2,
        }}
        animate={
          shouldReduceMotion
            ? {}
            : {
                backgroundPosition: ['0% 0%', '100% 100%'],
              }
        }
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear' as const,
        }}
      />

      {shouldRenderAnimations && (
        <>
          <motion.div
            className='absolute top-1/4 left-1/4 w-[200px] h-[200px] rounded-full'
            style={{
              background: `radial-gradient(circle, ${primaryColor}25 0%, transparent 70%)`,
              filter: `blur(${blurValues.tiny}px)`,
            }}
            animate={{
              opacity: [0.2, 0.5, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut' as const,
            }}
          />

          <motion.div
            className='absolute bottom-1/3 right-1/4 w-[180px] h-[180px] rounded-full'
            style={{
              background: `radial-gradient(circle, ${primaryColor}20 0%, transparent 70%)`,
              filter: `blur(${getOptimizedBlur(50, deviceTier)}px)`,
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [0.9, 1.1, 0.9],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut' as const,
              delay: 0.5,
            }}
          />
        </>
      )}
    </div>
  )
})

TokyoGlow.displayName = 'TokyoGlow'

export default TokyoGlow
