import { memo, type FC } from 'react'
import { useTheme } from '../../hooks/useTheme'
import useIsMobile from '../../hooks/useIsMobile'
import clsx from 'clsx'

const Grid: FC = memo(() => {
  const { isDarkMode } = useTheme()
  const isMobile = useIsMobile()

  return (
    <>
      <div
        className={clsx(
          'fixed inset-0 pointer-events-none overflow-hidden z-1',
          isDarkMode ? 'opacity-[0.03]' : 'opacity-[0.02]',
        )}
        style={{
          backgroundImage: isDarkMode
            ? 'radial-gradient(circle at center, rgba(255, 255, 255, 0.8) 1px, transparent 1px)'
            : 'radial-gradient(circle at center, rgba(0, 0, 0, 0.6) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      {!isMobile && (
        <>
          <div
            className={clsx(
              'fixed inset-0 pointer-events-none overflow-hidden z-1',
              isDarkMode ? 'opacity-[0.06]' : 'opacity-[0.17]',
            )}
            style={{
              backgroundImage: isDarkMode
                ? `
              linear-gradient(to right, rgba(255, 255, 255, 0.3) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.3) 1px, transparent 1px)
            `
                : `
              linear-gradient(to right, rgba(0, 0, 0, 0.2) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 0, 0, 0.2) 1px, transparent 1px)
            `,
              backgroundSize: '200px 200px',
            }}
          />

          <div
            className={clsx('fixed inset-0 pointer-events-none overflow-hidden z-1')}
            style={{
              background: isDarkMode
                ? 'radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.1) 100%)'
                : 'radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.05) 100%)',
            }}
          />

          <div
            className={clsx(
              'fixed inset-0 pointer-events-none overflow-hidden z-1',
              isDarkMode ? 'opacity-[0.010]' : 'opacity-[0.08]',
            )}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
            }}
          />

          <div
            className={clsx(
              'fixed inset-0 pointer-events-none overflow-hidden z-1',
              isDarkMode ? 'opacity-[0.06]' : 'opacity-[0.18]',
            )}
            style={{
              backgroundImage: isDarkMode
                ? 'repeating-linear-gradient(45deg, transparent, transparent 100px, rgba(255, 255, 255, 0.03) 100px, rgba(255, 255, 255, 0.03) 200px)'
                : 'repeating-linear-gradient(45deg, transparent, transparent 100px, rgba(0, 0, 0, 0.02) 100px, rgba(0, 0, 0, 0.02) 200px)',
            }}
          />
        </>
      )}
    </>
  )
})

Grid.displayName = 'Grid'

export default Grid
