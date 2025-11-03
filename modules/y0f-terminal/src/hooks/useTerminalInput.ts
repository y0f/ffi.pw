/**
 * @fileoverview Terminal input management hook.
 *
 * Manages all terminal input interactions including command history navigation,
 * tab completion for command names, and keyboard event handling.
 */

import { useState, useRef, useCallback, useEffect, type KeyboardEvent } from 'react'
import { TabCompletionManager } from '../core/TabCompletion'
import { formatCompletionHint } from '../core/formatters'
import registry, { ensureCommandsRegistered } from '../commands/index'
import type { OutputObject } from '../core/Command'

export interface TerminalInput {
  input: string
  setInput: (input: string) => void
  handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void
}

export function useTerminalInput(
  navigateUp: (currentValue: string) => string | null,
  navigateDown: (currentValue: string) => string | null,
  setOutput: React.Dispatch<React.SetStateAction<OutputObject[]>>,
): TerminalInput {
  const [input, setInput] = useState<string>('')
  const tabCompletionRef = useRef<TabCompletionManager | null>(null)
  const lastInputRef = useRef<string>('')

  useEffect(() => {
    ensureCommandsRegistered()
    const commandNames = registry.getNames()
    tabCompletionRef.current = new TabCompletionManager(commandNames)
  }, [])

  const handleHistoryNavigation = useCallback(
    (direction: 'up' | 'down') => {
      const historyCommand = direction === 'up' ? navigateUp(input) : navigateDown(input)
      if (historyCommand !== null) {
        setInput(historyCommand)
      }
    },
    [input, navigateUp, navigateDown],
  )

  const handleTabCompletion = useCallback(() => {
    if (!tabCompletionRef.current) return

    const isRepeat = lastInputRef.current === input
    const newInput = tabCompletionRef.current.complete(input, isRepeat)
    const matches = tabCompletionRef.current.getMatches()

    setInput(newInput)
    lastInputRef.current = input

    if (matches.length > 1 && !isRepeat) {
      const hint = formatCompletionHint(matches)
      setOutput((prev) => [...prev, hint])
    }
  }, [input, setOutput])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      const keyHandlers: Record<string, () => void> = {
        ArrowUp: () => handleHistoryNavigation('up'),
        ArrowDown: () => handleHistoryNavigation('down'),
        Tab: handleTabCompletion,
      }

      const handler = keyHandlers[e.key]
      if (handler) {
        e.preventDefault()
        handler()
      } else {
        tabCompletionRef.current?.reset()
        lastInputRef.current = ''
      }
    },
    [handleHistoryNavigation, handleTabCompletion],
  )

  return {
    input,
    setInput,
    handleKeyDown,
  }
}
