import { createContext } from 'react'

export type ColorScheme =
  | 'ice-blue'
  | 'blue'
  | 'purple'
  | 'green'
  | 'red'
  | 'orange'
  | 'pink'
  | 'teal'

export interface ColorContextType {
  color: ColorScheme
  setColor: (color: ColorScheme) => void
}

export const ColorContext = createContext<ColorContextType | null>(null)
