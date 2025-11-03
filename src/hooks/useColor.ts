import { useContext } from 'react'
import { ColorContext, ColorContextType } from '../contexts/ColorContext.tsx'

export const useColor = (): ColorContextType => {
  const context = useContext(ColorContext)
  if (!context) {
    throw new Error('useColor must be used within a ColorProvider')
  }
  return context
}
