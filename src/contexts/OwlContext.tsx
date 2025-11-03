import { createContext } from 'react'

export interface OwlContextType {
  owlVisible: boolean
  setOwlVisible: (visible: boolean) => void
  showOwl: () => void
  hideOwl: () => void
  owlIsSmoking: boolean
  setOwlIsSmoking: (smoking: boolean) => void
}

export const OwlContext = createContext<OwlContextType | null>(null)
