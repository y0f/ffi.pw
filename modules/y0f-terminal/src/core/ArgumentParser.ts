import type { ParsedCommand } from './Command'

/**
 * @fileoverview ArgumentParser
 *
 * Parses command-line style arguments for terminal commands.
 * Supports:
 * - Named arguments: --name=value or --flag
 * - Positional arguments: cmd arg1 arg2
 * - Quoted strings: "hello world"
 * - Flags: -f, --verbose
 */

const MAX_INPUT_LENGTH = 10000
const MAX_ARGS = 100
const MAX_TOKEN_LENGTH = 1000
const MAX_OPTIONS = 50

/**
 * Validates parsed command to prevent potential issues
 */
function validateParsedCommand(parsed: ParsedCommand): { valid: boolean; error?: string } {
  if (parsed.raw && parsed.raw.length > MAX_INPUT_LENGTH) {
    return { valid: false, error: `Input too long (max ${MAX_INPUT_LENGTH} characters)` }
  }

  if (parsed.args.length > MAX_ARGS) {
    return { valid: false, error: `Too many arguments (max ${MAX_ARGS})` }
  }

  for (const arg of parsed.args) {
    if (arg.length > MAX_TOKEN_LENGTH) {
      return { valid: false, error: `Argument too long (max ${MAX_TOKEN_LENGTH} characters)` }
    }
  }

  const optionCount = Object.keys(parsed.options).length + parsed.flags.length
  if (optionCount > MAX_OPTIONS) {
    return { valid: false, error: `Too many options/flags (max ${MAX_OPTIONS})` }
  }

  for (const key of Object.keys(parsed.options)) {
    if (!key || key.trim() === '') {
      return { valid: false, error: 'Invalid option key: empty key not allowed' }
    }
    if (key.length > MAX_TOKEN_LENGTH) {
      return { valid: false, error: `Option key too long (max ${MAX_TOKEN_LENGTH} characters)` }
    }
  }

  return { valid: true }
}

export function parseCommandInput(input: string): ParsedCommand {
  if (!input || typeof input !== 'string') {
    return {
      command: '',
      args: [],
      flags: [],
      options: {},
      raw: input || '',
    }
  }

  // Pre-validation: check input length
  if (input.length > MAX_INPUT_LENGTH) {
    console.warn(`Input exceeds maximum length of ${MAX_INPUT_LENGTH} characters`)
    return {
      command: 'error',
      args: [`Input too long (max ${MAX_INPUT_LENGTH} characters)`],
      flags: [],
      options: {},
      raw: input.substring(0, MAX_INPUT_LENGTH),
    }
  }

  const trimmed = input.trim()
  const tokens = tokenize(trimmed)

  if (tokens.length === 0) {
    return {
      command: '',
      args: [],
      flags: [],
      options: {},
      raw: input,
    }
  }

  const command = tokens[0]?.toLowerCase() ?? ''
  const args: string[] = []
  const flags: string[] = []
  const options: Record<string, string | boolean> = {}

  for (let i = 1; i < tokens.length; i++) {
    const token = tokens[i]
    if (!token) continue

    if (token.length > MAX_TOKEN_LENGTH) {
      console.warn(`Token exceeds maximum length of ${MAX_TOKEN_LENGTH} characters`)
      continue
    }

    if (token.startsWith('--') && token.includes('=')) {
      const [key, ...valueParts] = token.slice(2).split('=')
      if (key && key.trim() !== '') {
        options[key] = valueParts.join('=')
      }
    } else if (token.startsWith('--')) {
      const flag = token.slice(2)
      if (flag && flag.trim() !== '') {
        flags.push(flag)
        options[flag] = true
      }
    } else if (token.startsWith('-') && token.length > 1 && !token.match(/^-\d/)) {
      const shortFlags = token.slice(1).split('')
      shortFlags.forEach((flag) => {
        if (flag && flag.trim() !== '') {
          flags.push(flag)
          options[flag] = true
        }
      })
    } else {
      args.push(token)
    }
  }

  const parsed = {
    command,
    args,
    flags,
    options,
    raw: input,
  }

  const validation = validateParsedCommand(parsed)
  if (!validation.valid) {
    console.warn(`Parsed command validation failed: ${validation.error}`)
    return {
      command: 'error',
      args: [validation.error || 'Validation failed'],
      flags: [],
      options: {},
      raw: input,
    }
  }

  return parsed
}

/**
 * Tokenize input string, respecting quoted strings
 */
function tokenize(input: string): string[] {
  const tokens: string[] = []
  let current = ''
  let inQuotes = false
  let quoteChar = ''

  for (let i = 0; i < input.length; i++) {
    const char = input[i]
    if (!char) continue

    if ((char === '"' || char === "'") && !inQuotes) {
      inQuotes = true
      quoteChar = char
      continue
    }

    if (char === quoteChar && inQuotes) {
      inQuotes = false
      quoteChar = ''
      continue
    }

    if (char === ' ' && !inQuotes) {
      if (current) {
        tokens.push(current)
        current = ''
      }
      continue
    }

    current += char
  }

  if (current) {
    tokens.push(current)
  }

  return tokens
}

export function getArg(parsed: ParsedCommand, index: number): string | undefined
export function getArg<T>(parsed: ParsedCommand, index: number, defaultValue: T): string | T
export function getArg<T>(
  parsed: ParsedCommand,
  index: number,
  defaultValue?: T,
): string | T | undefined {
  return parsed.args[index] ?? defaultValue
}

export function getOption(parsed: ParsedCommand, name: string): string | boolean | undefined
export function getOption<T>(
  parsed: ParsedCommand,
  name: string,
  defaultValue: T,
): string | boolean | T
export function getOption<T>(
  parsed: ParsedCommand,
  name: string,
  defaultValue?: T,
): string | boolean | T | undefined {
  return parsed.options[name] ?? defaultValue
}

export function hasFlag(parsed: ParsedCommand, flag: string): boolean {
  return parsed.flags.includes(flag)
}

export function requireArgs(parsed: ParsedCommand, minArgs: number): void {
  if (parsed.args.length < minArgs) {
    throw new Error(`Not enough arguments. Expected at least ${minArgs}, got ${parsed.args.length}`)
  }
}

export function requireOptions(parsed: ParsedCommand, requiredOptions: string[]): void {
  const missing = requiredOptions.filter((opt) => !(opt in parsed.options))

  if (missing.length > 0) {
    throw new Error(`Missing required options: ${missing.join(', ')}`)
  }
}
