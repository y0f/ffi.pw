/**
 * @fileoverview Game state management hook.
 *
 * Manages game state for terminal games.
 * Library version - accepts game configs as input.
 */

import { useState, useMemo, useCallback, useEffect, type RefObject, type FC } from 'react'

export interface GameComponentProps {
  onClose: () => void
  isDarkMode: boolean
}

export interface GameConfig {
  component: FC<GameComponentProps>
  isJsDos: boolean
}

export interface GameHandler {
  activeGame: string | null
  setActiveGame: (game: string | null) => void
  gameConfig: GameConfig | null
  handleGameClose: () => void
}

export interface GameHandlerOptions {
  inputRef?: RefObject<HTMLInputElement>
  gameConfigs: Record<string, GameConfig>
  onGameClose?: () => void
}

export function useGameHandler(options: GameHandlerOptions): GameHandler {
  const { inputRef, gameConfigs, onGameClose } = options
  const [activeGame, setActiveGame] = useState<string | null>(null)

  const gameConfig = useMemo<GameConfig | null>(() => {
    return activeGame ? (gameConfigs[activeGame] ?? null) : null
  }, [activeGame, gameConfigs])

  useEffect(() => {
    if (activeGame === null) {
      onGameClose?.()
      const timer = setTimeout(() => inputRef?.current?.focus(), 250)
      return () => clearTimeout(timer)
    }
  }, [activeGame, inputRef, onGameClose])

  const handleGameClose = useCallback(() => {
    setActiveGame(null)
  }, [])

  return {
    activeGame,
    setActiveGame,
    gameConfig,
    handleGameClose,
  }
}
