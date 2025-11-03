import { useState, ReactNode, useEffect } from 'react'
import { OwlContext } from '../contexts/OwlContext.tsx'

interface OwlProviderProps {
  children: ReactNode
}

export function OwlProvider({ children }: OwlProviderProps) {
  const [owlVisible, setOwlVisible] = useState<boolean>(false)
  const [owlIsSmoking, setOwlIsSmoking] = useState<boolean>(false)

  const showOwl = () => setOwlVisible(true)
  const hideOwl = () => setOwlVisible(false)

  // Listen for spawn event from terminal command
  useEffect(() => {
    const handleSpawn = () => showOwl()
    document.addEventListener('spawnOwl', handleSpawn)
    return () => document.removeEventListener('spawnOwl', handleSpawn)
  }, [])

  return (
    <OwlContext.Provider
      value={{
        owlVisible,
        setOwlVisible,
        owlIsSmoking,
        setOwlIsSmoking,
        showOwl,
        hideOwl,
      }}
    >
      {children}
    </OwlContext.Provider>
  )
}
