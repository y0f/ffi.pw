/**
 * @fileoverview Command
 *
 * This module provides the foundational types for command creation, execution context,
 * and output formatting. All terminal commands follow these interfaces for consistency
 * and type safety.
 *
 * Key exports:
 * - CommandCategory: Categorization constants for commands
 * - Command: Complete command interface with metadata and execute function
 * - CommandContext: Execution context provided to commands
 * - OutputObject: Terminal output structure for consistent display
 * - createCommand: Factory function for creating type-safe commands
 */

export const CommandCategory = {
  SYSTEM: 'system',
  INFO: 'info',
  EFFECTS: 'effects',
  SERVICES: 'services',
  GAMES: 'games',
  DEVTOOLS: 'devtools',
  FILESYSTEM: 'filesystem',
} as const

export type CommandCategoryType = (typeof CommandCategory)[keyof typeof CommandCategory]

export interface ParsedCommand {
  command: string
  args: string[]
  flags: string[]
  options: Record<string, string | boolean>
  raw: string
}

export interface OutputPart {
  text: string
  color?: string
}

export interface OutputObject {
  text?: string
  color?: string
  parts?: OutputPart[]
  isLink?: boolean
  url?: string
  isCommand?: boolean
  className?: string
  [key: string]: unknown
}

export interface CommandContext {
  setOutput: (output: OutputObject[] | ((prev: OutputObject[]) => OutputObject[])) => void
  setActiveGame: (game: string | null) => void
  setIsTrippy: (isTrippy: boolean) => void
  setIsExpanded?: (isExpanded: boolean) => void
  parsed: ParsedCommand
}

export type CommandExecute = (context: CommandContext) => Promise<OutputObject[]>

export interface CommandExample {
  command: string
  description: string
  output?: string
}

export interface Command {
  name: string
  description: string
  category: CommandCategoryType
  usage: string
  aliases: string[]
  hidden: boolean
  execute: CommandExecute
  examples?: CommandExample[]
  longDescription?: string
}

export interface CommandOptions {
  name: string
  description: string
  category: CommandCategoryType
  usage?: string
  aliases?: string[]
  hidden?: boolean
  execute: CommandExecute
  examples?: CommandExample[]
  longDescription?: string
}

/**
 * Creates a standardized command object
 */
export function createCommand(options: CommandOptions): Command {
  const {
    name,
    description,
    category,
    usage,
    aliases,
    hidden,
    execute,
    examples,
    longDescription,
  } = options

  if (!name || !description || !category || !execute) {
    throw new Error('Command must have: name, description, category, and execute function')
  }

  if (typeof execute !== 'function') {
    throw new Error('Command execute must be a function')
  }

  const normalizedAliases = aliases
    ? aliases.map((alias) => alias.toLowerCase()).filter((alias) => alias !== name.toLowerCase())
    : []

  return {
    name: name.toLowerCase(),
    description,
    category,
    usage: usage || name,
    aliases: normalizedAliases,
    hidden: hidden || false,
    execute,
    examples,
    longDescription,
  }
}
