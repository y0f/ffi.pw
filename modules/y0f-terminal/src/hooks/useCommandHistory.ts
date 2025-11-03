import { useState, useCallback, useRef } from 'react'

export interface CommandHistory {
  addToHistory: (command: string) => void
  navigateUp: (currentValue: string) => string | null
  navigateDown: (currentValue: string) => string | null
  clearHistory: () => void
  getHistory: () => string[]
  historyLength: number
}

export function useCommandHistory(maxHistory: number = 100): CommandHistory {
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState<number>(-1)
  const currentInputRef = useRef<string>('')

  const addToHistory = useCallback(
    (command: string) => {
      if (!command.trim()) return

      setHistory((prev) => {
        if (prev.length > 0 && prev[prev.length - 1] === command) {
          return prev
        }

        const newHistory = [...prev, command]
        if (newHistory.length > maxHistory) {
          return newHistory.slice(-maxHistory)
        }
        return newHistory
      })

      setHistoryIndex(-1)
      currentInputRef.current = ''
    },
    [maxHistory],
  )

  const navigateUp = useCallback(
    (currentValue: string): string | null => {
      if (history.length === 0) return null

      if (historyIndex === -1) {
        currentInputRef.current = currentValue
      }

      const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1)

      setHistoryIndex(newIndex)
      return history[newIndex] ?? null
    },
    [history, historyIndex],
  )

  const navigateDown = useCallback(
    (_currentValue: string): string | null => {
      if (history.length === 0) return null

      if (historyIndex === -1) return null

      const newIndex = historyIndex + 1

      if (newIndex >= history.length) {
        setHistoryIndex(-1)
        return currentInputRef.current
      }

      setHistoryIndex(newIndex)
      return history[newIndex] ?? null
    },
    [history, historyIndex],
  )

  const clearHistory = useCallback(() => {
    setHistory([])
    setHistoryIndex(-1)
    currentInputRef.current = ''
  }, [])

  const getHistory = useCallback((): string[] => {
    return [...history]
  }, [history])

  return {
    addToHistory,
    navigateUp,
    navigateDown,
    clearHistory,
    getHistory,
    historyLength: history.length,
  }
}
