import { useContext } from 'react'
import { OwlContext, OwlContextType } from '../contexts/OwlContext.tsx'

export const useOwl = (): OwlContextType => {
  const context = useContext(OwlContext)
  if (!context) {
    throw new Error('useOwl must be used within an OwlProvider')
  }
  return context
}
