import { useEffect, useState, type FC } from 'react'

interface LogoProps {
  className?: string
}

interface ThemeColors {
  primary500: string
  primary600: string
  primary400: string
  primary300: string
}

const Logo: FC<LogoProps> = ({ className = '' }) => {
  const [themeColors, setThemeColors] = useState<ThemeColors>({
    primary500: '#3b82f6',
    primary600: '#2563eb',
    primary400: '#60a5fa',
    primary300: '#93c5fd',
  })

  useEffect(() => {
    const updateThemeColors = () => {
      const style = getComputedStyle(document.documentElement)
      setThemeColors({
        primary500: style.getPropertyValue('--color-primary-500').trim() || '#3b82f6',
        primary600: style.getPropertyValue('--color-primary-600').trim() || '#2563eb',
        primary400: style.getPropertyValue('--color-primary-400').trim() || '#60a5fa',
        primary300: style.getPropertyValue('--color-primary-300').trim() || '#93c5fd',
      })
    }

    updateThemeColors()

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          updateThemeColors()
        }
      })
    })

    observer.observe(document.documentElement, { attributes: true })

    return () => observer.disconnect()
  }, [])

  return (
    <svg
      viewBox='0 0 120 100'
      className={className}
      xmlns='http://www.w3.org/2000/svg'
      aria-label='FFI Logo'
      preserveAspectRatio='xMidYMid meet'
    >
      <defs>
        <filter id='softGlow'>
          <feGaussianBlur in='SourceAlpha' stdDeviation='2' />
          <feFlood floodColor={themeColors.primary500} floodOpacity='0.5' />
          <feComposite in2='SourceAlpha' operator='in' />
          <feMerge>
            <feMergeNode />
            <feMergeNode in='SourceGraphic' />
          </feMerge>
        </filter>
      </defs>

      <g filter='url(#softGlow)'>
        <path
          d='M 15 95 L 20 15 L 55 15 M 19 52 L 48 52'
          stroke={themeColors.primary600}
          strokeWidth='8'
          fill='none'
          strokeLinecap='round'
          strokeLinejoin='round'
        />

        <path
          d='M 55 15 L 60 10'
          stroke={themeColors.primary600}
          strokeWidth='6'
          strokeLinecap='round'
        />
        <path
          d='M 48 52 L 52 48'
          stroke={themeColors.primary600}
          strokeWidth='5'
          strokeLinecap='round'
        />

        <path
          d='M 48 95 L 53 15 L 88 15 M 52 52 L 81 52'
          stroke={themeColors.primary600}
          strokeWidth='8'
          fill='none'
          strokeLinecap='round'
          strokeLinejoin='round'
        />

        <path
          d='M 88 15 L 93 10'
          stroke={themeColors.primary600}
          strokeWidth='6'
          strokeLinecap='round'
        />
        <path
          d='M 81 52 L 85 48'
          stroke={themeColors.primary600}
          strokeWidth='5'
          strokeLinecap='round'
        />

        <path
          d='M 100 30 L 105 95'
          stroke={themeColors.primary600}
          strokeWidth='8'
          fill='none'
          strokeLinecap='round'
        />

        <circle cx='102' cy='12' r='6' fill={themeColors.primary600} />
      </g>
    </svg>
  )
}

export default Logo
