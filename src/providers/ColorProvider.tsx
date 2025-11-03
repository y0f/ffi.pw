import React, { useState, useEffect, ReactNode } from 'react'
import { ColorContext, ColorScheme } from '../contexts/ColorContext.tsx'

interface ColorProviderProps {
  children: ReactNode
}

export const ColorProvider: React.FC<ColorProviderProps> = ({ children }) => {
  const [color, setColor] = useState<ColorScheme>('ice-blue')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', color)
  }, [color])

  return <ColorContext.Provider value={{ color, setColor }}>{children}</ColorContext.Provider>
}
