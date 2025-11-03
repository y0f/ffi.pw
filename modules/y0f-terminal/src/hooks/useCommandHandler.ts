/**
 * @fileoverview Command execution and output management hook.
 *
 * Handles terminal command execution, manages terminal output state,
 * and provides command submission logic. Commands are loaded from the
 * registry system and executed with proper context including output setters,
 * game state, and visual effects state.
 */

import { useState, useCallback } from 'react'
import registry, { ensureCommandsRegistered } from '../commands/index'
import { formatCommandLine, formatError } from '../core/formatters'
import { parseCommandInput } from '../core/ArgumentParser'
import { expandAlias } from '../commands/system/alias'
import { hasPipe, splitByPipe, executePipedCommands } from '../core/PipeHandler'
import { hasChain, splitByChain, executeChainedCommands } from '../core/ChainHandler'
import { animationRegistry } from '../core/AnimatedCommand'
import type { OutputObject } from '../core/Command'

const ERROR_MESSAGES = {
  COMMAND_NOT_FOUND: 'Command not found',
  COMMAND_ERROR: 'Error executing command',
  HELP_HINT: ". Type 'help' for available commands",
} as const

const COMMANDS = {
  CLEAR: 'clear',
} as const

export interface CommandHandler {
  handleSubmit: (input: string, setInput: (value: string) => void) => Promise<void>
  handleCommand: (input: string) => Promise<OutputObject[]>
  isTrippy: boolean
  output: OutputObject[]
  setOutput: React.Dispatch<React.SetStateAction<OutputObject[]>>
}

export interface CommandHandlerOptions {
  setIsExpanded?: (expanded: boolean) => void
  setActiveGame?: (game: string | null) => void
}

export function useCommandHandler(options: CommandHandlerOptions = {}): CommandHandler {
  const { setIsExpanded, setActiveGame } = options

  const [isTrippy, setIsTrippy] = useState<boolean>(false)
  const [output, setOutput] = useState<OutputObject[]>([])

  const executeCommand = useCallback(
    async (input: string): Promise<OutputObject[]> => {
      ensureCommandsRegistered()

      // Expand aliases
      const expandedInput = expandAlias(input)

      if (hasChain(expandedInput)) {
        const commands = splitByChain(expandedInput)
        const context = {
          setOutput,
          setActiveGame: setActiveGame ?? (() => {}),
          setIsTrippy,
          setIsExpanded,
        }
        return await executeChainedCommands(commands, context)
      }

      if (hasPipe(expandedInput)) {
        const commands = splitByPipe(expandedInput)
        const context = {
          setOutput,
          setActiveGame: setActiveGame ?? (() => {}),
          setIsTrippy,
          setIsExpanded,
        }
        return await executePipedCommands(commands, context)
      }

      // Regular command execution
      const parsed = parseCommandInput(expandedInput)
      const commandName = parsed.command

      if (!registry.has(commandName)) {
        return [formatError(commandName)]
      }

      try {
        const context = {
          setOutput,
          setActiveGame: setActiveGame ?? (() => {}),
          setIsTrippy,
          setIsExpanded,
          parsed,
        }

        const result = await registry.execute(commandName, context)
        return Array.isArray(result) ? result : [result]
      } catch (error) {
        console.error(`Error executing command '${commandName}':`, error)
        return [formatError(commandName, ERROR_MESSAGES.COMMAND_ERROR)]
      }
    },
    [setActiveGame, setIsTrippy, setOutput, setIsExpanded],
  )

  const handleSubmit = useCallback(
    async (input: string, setInput: (value: string) => void) => {
      const trimmed = input.trim()
      if (!trimmed) return

      animationRegistry.stopAll()

      const parsed = parseCommandInput(trimmed)
      const commandName = parsed.command

      if (commandName === COMMANDS.CLEAR) {
        await executeCommand(trimmed)
        setInput('')
        return
      }

      const result = await executeCommand(trimmed)
      setOutput((prev) => [
        ...prev,
        formatCommandLine(trimmed),
        ...result,
        { text: '', isCommand: false },
      ])
      setInput('')
    },
    [executeCommand],
  )

  const handleCommand = useCallback(
    (input: string): Promise<OutputObject[]> => executeCommand(input),
    [executeCommand],
  )

  return {
    handleSubmit,
    handleCommand,
    isTrippy,
    output,
    setOutput,
  }
}
