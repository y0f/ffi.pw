/**
 * @fileoverview TabCompletion
 *
 * Provides tab completion functionality for terminal commands.
 * Supports command name completion, fuzzy matching, and cycling through multiple matches.
 */

export interface CompletionResult {
  completion: string
  index: number
}

export interface FuzzyMatch {
  command: string
  score: number
}

/**
 * Calculate fuzzy match score for a command
 * Higher score = better match
 */
export function fuzzyScore(input: string, command: string): number {
  const inputLower = input.toLowerCase()
  const commandLower = command.toLowerCase()

  // Exact match gets highest score
  if (commandLower === inputLower) return 1000

  // Starts with gets high score
  if (commandLower.startsWith(inputLower)) return 500

  // Contains as substring gets medium score
  if (commandLower.includes(inputLower)) return 200

  // Fuzzy character matching
  let score = 0
  let inputIndex = 0
  let consecutiveMatches = 0

  for (let i = 0; i < commandLower.length && inputIndex < inputLower.length; i++) {
    if (commandLower[i] === inputLower[inputIndex]) {
      score += 10
      consecutiveMatches++
      // Bonus for consecutive character matches
      if (consecutiveMatches > 1) {
        score += consecutiveMatches * 2
      }
      inputIndex++
    } else {
      consecutiveMatches = 0
    }
  }

  // If we didn't match all input characters, not a valid match
  if (inputIndex < inputLower.length) {
    return 0
  }

  // Bonus for shorter commands (more concise matches)
  score += Math.max(0, 50 - command.length)

  return score
}

export function getCompletions(
  input: string,
  commandNames: string[],
  useFuzzy: boolean = true,
): string[] {
  if (input === null || input === undefined || typeof input !== 'string') {
    return []
  }

  const trimmed = input.trim().toLowerCase()

  if (!trimmed) {
    return commandNames.sort()
  }

  if (!useFuzzy) {
    // Original behavior: prefix matching only
    const matches = commandNames.filter((cmd) => cmd.toLowerCase().startsWith(trimmed))
    return matches.sort()
  }

  // Fuzzy matching: score each command and sort by score
  const scoredMatches: FuzzyMatch[] = commandNames
    .map((cmd) => ({
      command: cmd,
      score: fuzzyScore(trimmed, cmd),
    }))
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score)

  return scoredMatches.map((m) => m.command)
}

export function getNextCompletion(
  currentInput: string,
  matches: string[],
  currentIndex: number = -1,
): CompletionResult {
  if (matches.length === 0) {
    return { completion: currentInput, index: -1 }
  }

  if (matches.length === 1) {
    return { completion: matches[0] ?? currentInput, index: 0 }
  }

  const nextIndex = (currentIndex + 1) % matches.length
  return { completion: matches[nextIndex] ?? currentInput, index: nextIndex }
}

/**
 * Get the longest common prefix of multiple strings
 */
export function getLongestCommonPrefix(strings: string[]): string {
  if (strings.length === 0) return ''
  if (strings.length === 1) return strings[0] ?? ''

  let prefix = strings[0] ?? ''

  for (let i = 1; i < strings.length; i++) {
    const current = strings[i]
    if (!current) continue

    while (current.indexOf(prefix) !== 0) {
      prefix = prefix.slice(0, -1)
      if (prefix === '') return ''
    }
  }

  return prefix
}

export function autoComplete(input: string, matches: string[]): string {
  if (matches.length === 0) {
    return input
  }

  if (matches.length === 1) {
    return matches[0] ?? input
  }

  const prefix = getLongestCommonPrefix(matches)
  return prefix
}

/**
 * Tab completion state manager
 */
export class TabCompletionManager {
  private commandNames: string[]
  private matches: string[]
  private currentIndex: number
  private useFuzzy: boolean

  constructor(commandNames: string[] = [], useFuzzy: boolean = true) {
    this.commandNames = commandNames
    this.matches = []
    this.currentIndex = -1
    this.useFuzzy = useFuzzy
  }

  reset(): void {
    this.matches = []
    this.currentIndex = -1
  }

  setCommandNames(names: string[]): void {
    this.commandNames = names
    this.reset()
  }

  complete(currentInput: string, isRepeat: boolean = false): string {
    if (!isRepeat) {
      this.matches = getCompletions(currentInput, this.commandNames, this.useFuzzy)
      this.currentIndex = -1
    }

    if (this.matches.length === 0) {
      return currentInput
    }

    if (this.matches.length === 1) {
      return this.matches[0] ?? currentInput
    }

    if (this.currentIndex === -1) {
      const prefix = getLongestCommonPrefix(this.matches)

      if (prefix.length > currentInput.length) {
        return prefix
      }

      if (prefix.length === currentInput.length && !isRepeat) {
        return prefix
      }

      this.currentIndex = 0
      return this.matches[0] ?? currentInput
    }

    const { completion, index } = getNextCompletion(currentInput, this.matches, this.currentIndex)
    this.currentIndex = index
    return completion
  }

  getMatches(): string[] {
    return [...this.matches]
  }

  hasMultipleMatches(): boolean {
    return this.matches.length > 1
  }
}
