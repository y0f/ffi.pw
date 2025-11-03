/**
 * @fileoverview Chain handler for command chaining
 *
 * Handles command chaining functionality with && and || operators:
 * - && : Execute next command only if previous succeeded
 * - || : Execute next command only if previous failed
 * - ;  : Execute next command regardless of previous result
 *
 * Examples:
 * - mkdir test && cd test && touch file.txt
 * - rm nonexistent.txt || echo "File not found"
 * - echo "step 1" ; echo "step 2" ; echo "step 3"
 */

import type { OutputObject, CommandContext } from './Command'
import { parseCommandInput } from './ArgumentParser'
import { findPatternsOutsideQuotes, parseWithQuotes } from './QuoteParser'
import registry from '../commands/index'

export type ChainOperator = '&&' | '||' | ';'

export interface ChainCommand {
  command: string
  operator?: ChainOperator
}

/**
 * Check if input contains chain operators
 */
export function hasChain(input: string): boolean {
  const patterns = findPatternsOutsideQuotes(input, ['&&', '||', ';'])
  return patterns.length > 0
}

/**
 * Split input by chain operators, preserving quotes
 */
export function splitByChain(input: string): ChainCommand[] {
  const commands: ChainCommand[] = []
  let current = ''
  let lastOperator: ChainOperator | undefined

  parseWithQuotes(input, (char, index, state) => {
    const nextChar = input[index + 1]

    if (!state.inQuotes) {
      if (char === ';') {
        if (current.trim()) {
          commands.push({ command: current.trim(), operator: ';' })
        }
        current = ''
        return
      } else if (char === '&' && nextChar === '&') {
        if (current.trim()) {
          commands.push({ command: current.trim(), operator: '&&' })
        }
        current = ''
        return
      } else if (char === '|' && nextChar === '|') {
        if (current.trim()) {
          commands.push({ command: current.trim(), operator: '||' })
        }
        current = ''
        return
      }
    }

    if (index > 0 && !state.inQuotes) {
      const prevChar = input[index - 1]
      if ((prevChar === '&' && char === '&') || (prevChar === '|' && char === '|')) {
        return
      }
    }

    current += char
  })

  if (current.trim()) {
    commands.push({ command: current.trim() })
  }

  return commands
}

/**
 * Determine if a command succeeded based on its output
 */
function commandSucceeded(output: OutputObject[]): boolean {
  // A command is considered failed if it returns error output (red text)
  for (const obj of output) {
    if (obj.color?.includes('red')) {
      return false
    }
    if (obj.parts) {
      for (const part of obj.parts) {
        if (part.color?.includes('red')) {
          return false
        }
      }
    }
  }
  return true
}

/**
 * Execute a chained command sequence
 */
export async function executeChainedCommands(
  chainedCommands: ChainCommand[],
  context: Omit<CommandContext, 'parsed'>,
): Promise<OutputObject[]> {
  const allOutput: OutputObject[] = []
  let lastSuccess = true

  for (let i = 0; i < chainedCommands.length; i++) {
    const chainCmd = chainedCommands[i]
    if (!chainCmd) continue

    const { command: cmdString } = chainCmd
    if (!cmdString) continue

    // Determine if we should execute this command
    let shouldExecute = true

    if (i > 0) {
      const prevOperator = chainedCommands[i - 1]?.operator

      if (prevOperator === '&&') {
        // Only execute if previous succeeded
        shouldExecute = lastSuccess
      } else if (prevOperator === '||') {
        // Only execute if previous failed
        shouldExecute = !lastSuccess
      }
      // For ';', always execute
    }

    if (!shouldExecute) {
      continue
    }

    const parsed = parseCommandInput(cmdString)
    const commandName = parsed.command

    if (!registry.has(commandName)) {
      const errorOutput: OutputObject = {
        text: `${commandName}: command not found`,
        color: 'text-red-500',
      }
      allOutput.push(errorOutput)
      lastSuccess = false
      continue
    }

    try {
      const cmdContext: CommandContext = {
        ...context,
        parsed,
      }

      const result = await registry.execute(commandName, cmdContext)
      const resultArray = Array.isArray(result) ? result : [result]

      allOutput.push(...resultArray)

      // Determine if command succeeded
      lastSuccess = commandSucceeded(resultArray)
    } catch (error) {
      console.error(`Error executing chained command '${commandName}':`, error)
      const errorOutput: OutputObject = {
        text: `chain: error executing ${commandName}`,
        color: 'text-red-500',
      }
      allOutput.push(errorOutput)
      lastSuccess = false
    }
  }

  return allOutput
}
