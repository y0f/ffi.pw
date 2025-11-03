/**
 * @fileoverview Pipe handler for command piping
 *
 * Handles command piping functionality, allowing output from one command
 * to be used as input for another command.
 *
 * Examples:
 * - echo "hello world" | base64
 * - cat README.md | base64
 * - echo "test data" | hash
 */

import type { OutputObject, CommandContext } from './Command'
import { parseCommandInput } from './ArgumentParser'
import { findPatternsOutsideQuotes, splitRespectingQuotes } from './QuoteParser'
import registry from '../commands/index'

/**
 * Check if input contains pipe operator
 */
export function hasPipe(input: string): boolean {
  const patterns = findPatternsOutsideQuotes(input, ['|'])
  return patterns.length > 0
}

/**
 * Split input by pipe operator, respecting quotes
 */
export function splitByPipe(input: string): string[] {
  return splitRespectingQuotes(input, '|')
}

/**
 * Convert OutputObject array to plain text string
 */
export function outputToText(output: OutputObject[]): string {
  const lines: string[] = []

  for (const obj of output) {
    if (obj.text !== undefined) {
      lines.push(obj.text)
    } else if (obj.parts) {
      const line = obj.parts.map((p) => p.text).join('')
      lines.push(line)
    }
  }

  return lines.join('\n')
}

/**
 * Execute a piped command sequence
 */
export async function executePipedCommands(
  commands: string[],
  context: Omit<CommandContext, 'input' | 'parsed'>,
): Promise<OutputObject[]> {
  let pipeInput = ''

  for (let i = 0; i < commands.length; i++) {
    const cmdString = commands[i]
    if (!cmdString) continue

    // For subsequent commands in the pipe, append the previous output as an argument
    let finalCommand = cmdString
    if (i > 0 && pipeInput) {
      const parsed = parseCommandInput(cmdString)
      if (parsed.args.length === 0) {
        // No arguments, add pipe input as argument
        finalCommand = `${cmdString} "${pipeInput.replace(/"/g, '\\"')}"`
      } else {
        // Has arguments, replace first arg or append (depends on command)
        // For now, we'll append as additional arg
        finalCommand = `${cmdString} "${pipeInput.replace(/"/g, '\\"')}"`
      }
    }

    const parsed = parseCommandInput(finalCommand)
    const commandName = parsed.command

    if (!registry.has(commandName)) {
      return [
        {
          text: `pipe: ${commandName}: command not found`,
          color: 'text-red-500',
        },
      ]
    }

    try {
      const cmdContext: CommandContext = {
        ...context,
        parsed,
      }

      const result = await registry.execute(commandName, cmdContext)
      const resultArray = Array.isArray(result) ? result : [result]

      if (i < commands.length - 1) {
        pipeInput = outputToText(resultArray)
      } else {
        return resultArray
      }
    } catch (error) {
      console.error(`Error executing piped command '${commandName}':`, error)
      return [
        {
          text: `pipe: error executing ${commandName}`,
          color: 'text-red-500',
        },
      ]
    }
  }

  return []
}
