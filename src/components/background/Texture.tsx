import { type FC } from 'react'
import { useTheme } from '../../hooks/useTheme'
import useIsMobile from '../../hooks/useIsMobile'
import clsx from 'clsx'

const Texture: FC = () => {
  const { isDarkMode } = useTheme()
  const isMobile = useIsMobile()

  return (
    <div className='fixed inset-0 pointer-events-none z-999'>
      <div className='scanlines ' />
      <div className='noise bg-slate-900' />
      {!isMobile && (
        <div
          className={clsx(
            'select-none repeat-infinite fixed inset-0 pointer-events-none ',
            isDarkMode ? 'invert-0' : 'invert',
          )}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlnsXlink='http://www.w3.org/1999/xlink' viewBox='0 0 700 700' width='700' height='700' opacity='1'%3E%3Ctitle%3Enoise%3C/title%3E%3Cdefs%3E%3Cfilter id='nnnoise-filter' x='-20%25' y='-20%25' width='140%25' height='140%25' filterUnits='objectBoundingBox' primitiveUnits='userSpaceOnUse' color-interpolation-filters='linearRGB'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.2' numOctaves='4' seed='15' stitchTiles='stitch' x='0%25' y='0%25' width='100%25' height='100%25' result='turbulence'/%3E%3CfeSpecularLighting surfaceScale='5' specularConstant='0.8' specularExponent='20' lighting-color='white' x='0%25' y='0%25' width='100%25' height='100%25' in='turbulence' result='specularLighting'%3E%3CfeDistantLight azimuth='3' elevation='96'/%3E%3C/feSpecularLighting%3E%3CfeColorMatrix type='saturate' values='0' x='0%25' y='0%25' width='100%25' height='100%25' in='specularLighting' result='colormatrix'/%3E%3C/filter%3E%3C/defs%3E%3Crect width='700' height='700' fill='black'/%3E%3Crect width='700' height='700' fill='white' filter='url(%23nnnoise-filter)'/%3E%3C/svg%3E\")",
            backgroundSize: '400px',
            opacity: isDarkMode ? 0.05 : 0.09,
            mixBlendMode: isDarkMode ? 'normal' : 'multiply',
          }}
        ></div>
      )}
    </div>
  )
}

export default Texture
