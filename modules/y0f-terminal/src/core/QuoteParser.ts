/**
 * @fileoverview Shared quote parsing utilities to eliminate code duplication
 * Provides consistent quote handling across pipe, chain, and argument parsing
 */

export interface QuoteState {
  inQuotes: boolean
  quoteChar: string
}

/**
 * Parse a string character by character, tracking quote state
 * Handles both single and double quotes with escape character support
 */
export function parseWithQuotes(
  input: string,
  callback: (char: string, index: number, state: QuoteState) => void,
): void {
  let inQuotes = false
  let quoteChar = ''

  for (let i = 0; i < input.length; i++) {
    const char = input[i]
    const prevChar = i > 0 ? input[i - 1] : ''

    if ((char === '"' || char === "'") && prevChar !== '\\') {
      if (!inQuotes) {
        inQuotes = true
        quoteChar = char
      } else if (char === quoteChar) {
        inQuotes = false
        quoteChar = ''
      }
    }

    callback(char, i, { inQuotes, quoteChar })
  }
}

/**
 * Split a string by a delimiter, respecting quoted sections
 */
export function splitRespectingQuotes(
  input: string,
  delimiter: string | RegExp,
  includeDelimiter = false,
): string[] {
  const parts: string[] = []
  let current = ''
  let delimiterMatch = ''

  const isDelimiter = (str: string, pos: number): { match: boolean; length: number } => {
    if (typeof delimiter === 'string') {
      const slice = str.slice(pos, pos + delimiter.length)
      return { match: slice === delimiter, length: delimiter.length }
    } else {
      const remaining = str.slice(pos)
      const match = remaining.match(delimiter)
      if (match && match.index === 0) {
        return { match: true, length: match[0].length }
      }
      return { match: false, length: 0 }
    }
  }

  parseWithQuotes(input, (char, index, state) => {
    const delimCheck = isDelimiter(input, index)

    if (!state.inQuotes && delimCheck.match) {
      // Found delimiter outside quotes
      if (current.trim() || includeDelimiter) {
        parts.push(current.trim())
        if (includeDelimiter) {
          delimiterMatch = input.slice(index, index + delimCheck.length)
        }
      }
      current = ''
      for (let i = 1; i < delimCheck.length; i++) {
        // We need to skip ahead
      }
    } else {
      current += char
    }
  })

  if (current.trim()) {
    parts.push(current.trim())
  }

  return parts
}

/**
 * Find all occurrences of patterns in a string, respecting quotes
 */
export function findPatternsOutsideQuotes(
  input: string,
  patterns: string[] | RegExp[],
): Array<{ pattern: string; index: number; length: number }> {
  const results: Array<{ pattern: string; index: number; length: number }> = []
  let skipUntil = -1

  parseWithQuotes(input, (char, index, state) => {
    if (index < skipUntil) return
    if (state.inQuotes) return

    for (const pattern of patterns) {
      if (typeof pattern === 'string') {
        const slice = input.slice(index, index + pattern.length)
        if (slice === pattern) {
          results.push({ pattern, index, length: pattern.length })
          skipUntil = index + pattern.length
          break
        }
      } else {
        const remaining = input.slice(index)
        const match = remaining.match(pattern)
        if (match && match.index === 0) {
          results.push({ pattern: match[0], index, length: match[0].length })
          skipUntil = index + match[0].length
          break
        }
      }
    }
  })

  return results
}

/**
 * Remove quotes from a string, handling escape sequences
 */
export function removeQuotes(str: string): string {
  if (str.length < 2) return str

  const firstChar = str[0]
  const lastChar = str[str.length - 1]

  if ((firstChar === '"' && lastChar === '"') || (firstChar === "'" && lastChar === "'")) {
    return str.slice(1, -1).replace(/\\(['"])/g, '$1')
  }

  return str
}

/**
 * Check if a string contains any unmatched quotes
 */
export function hasUnmatchedQuotes(input: string): boolean {
  let inQuotes = false
  let quoteChar = ''

  parseWithQuotes(input, (char, index, state) => {
    inQuotes = state.inQuotes
    quoteChar = state.quoteChar
  })

  return inQuotes
}

/**
 * Escape quotes in a string for safe inclusion in quoted context
 */
export function escapeQuotes(str: string, quoteType: '"' | "'" = '"'): string {
  return str.replace(new RegExp(quoteType, 'g'), '\\' + quoteType)
}
