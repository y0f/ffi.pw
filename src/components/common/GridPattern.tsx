import { memo, useMemo, type FC, type CSSProperties } from 'react'
import clsx from 'clsx'

interface GridPatternProps {
  isDarkMode: boolean
  className?: string
}

const GridPattern: FC<GridPatternProps> = memo(({ isDarkMode, className }) => {
  const style: CSSProperties = useMemo(
    () => ({
      backgroundImage: `linear-gradient(${isDarkMode ? '#ffffff' : '#000000'} 1px, transparent 1px), linear-gradient(90deg, ${isDarkMode ? '#ffffff' : '#000000'} 1px, transparent 1px)`,
      backgroundSize: '20px 20px',
    }),
    [isDarkMode],
  )

  return <div className={clsx('absolute inset-0 opacity-5 z-0', className)} style={style} />
})

GridPattern.displayName = 'GridPattern'

export default GridPattern
