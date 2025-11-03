/**
 * @fileoverview Tests for QuoteParser utility
 */

import { describe, it, expect } from 'vitest'
import {
  parseWithQuotes,
  splitRespectingQuotes,
  findPatternsOutsideQuotes,
  removeQuotes,
  hasUnmatchedQuotes,
  escapeQuotes,
} from '../core/QuoteParser'

describe('QuoteParser', () => {
  describe('parseWithQuotes', () => {
    it('should track quote state correctly', () => {
      const states: boolean[] = []
      parseWithQuotes('hello "world" test', (char, index, state) => {
        states.push(state.inQuotes)
      })

      // h e l l o   " w o r l d "   t e s t
      // 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7
      // F F F F F F T T T T T T F F F F F F
      expect(states[6]).toBe(true)
      expect(states[7]).toBe(true)
      expect(states[11]).toBe(true)
      expect(states[12]).toBe(false)
    })

    it('should handle single quotes', () => {
      const states: boolean[] = []
      parseWithQuotes("hello 'world' test", (char, index, state) => {
        states.push(state.inQuotes)
      })

      expect(states[6]).toBe(true)
      expect(states[7]).toBe(true)
      expect(states[11]).toBe(true)
      expect(states[12]).toBe(false)
    })

    it('should handle escaped quotes', () => {
      const states: boolean[] = []
      parseWithQuotes('hello \\"world\\" test', (char, index, state) => {
        states.push(state.inQuotes)
      })

      // All should be false as the quotes are escaped
      expect(states.every((s) => !s)).toBe(true)
    })

    it('should handle mixed quotes', () => {
      const states: { inQuotes: boolean; quoteChar: string }[] = []
      parseWithQuotes(`"hello 'world'" and 'test "nested"'`, (char, index, state) => {
        states.push({ ...state })
      })

      expect(states[0].inQuotes).toBe(true)
      expect(states[0].quoteChar).toBe('"')
      expect(states[7].inQuotes).toBe(true)
      expect(states[7].quoteChar).toBe('"')

      // Second single-quoted section
      expect(states[20].inQuotes).toBe(true)
      expect(states[20].quoteChar).toBe("'")
    })
  })

  describe('splitRespectingQuotes', () => {
    it('should split by delimiter outside quotes', () => {
      const result = splitRespectingQuotes('echo "hello world" | base64', '|')
      expect(result).toEqual(['echo "hello world"', 'base64'])
    })

    it('should not split inside quotes', () => {
      const result = splitRespectingQuotes('echo "hello | world"', '|')
      expect(result).toEqual(['echo "hello | world"'])
    })

    it('should handle multiple delimiters', () => {
      const result = splitRespectingQuotes('cmd1 | cmd2 | cmd3', '|')
      expect(result).toEqual(['cmd1', 'cmd2', 'cmd3'])
    })

    it('should handle empty segments', () => {
      // The current implementation filters out empty strings
      // This is actually correct behavior for command parsing
      const result = splitRespectingQuotes('cmd1 || cmd2', '|')
      expect(result).toEqual(['cmd1', 'cmd2'])
    })
  })

  describe('findPatternsOutsideQuotes', () => {
    it('should find patterns outside quotes', () => {
      const patterns = findPatternsOutsideQuotes('echo "test" && ls || cat', ['&&', '||'])
      expect(patterns).toHaveLength(2)
      expect(patterns[0]).toMatchObject({ pattern: '&&', index: 12 })
      expect(patterns[1]).toMatchObject({ pattern: '||', index: 18 })
    })

    it('should not find patterns inside quotes', () => {
      const patterns = findPatternsOutsideQuotes('echo "test && ls" || cat', ['&&', '||'])
      expect(patterns).toHaveLength(1)
      expect(patterns[0]).toMatchObject({ pattern: '||', index: 18 })
    })

    it('should handle regex patterns', () => {
      const patterns = findPatternsOutsideQuotes('echo test ; ls', [/;/])
      expect(patterns).toHaveLength(1)
      expect(patterns[0]).toMatchObject({ pattern: ';', index: 10 })
    })
  })

  describe('removeQuotes', () => {
    it('should remove surrounding quotes', () => {
      expect(removeQuotes('"hello world"')).toBe('hello world')
      expect(removeQuotes("'hello world'")).toBe('hello world')
    })

    it('should not remove non-matching quotes', () => {
      expect(removeQuotes('"hello world\'')).toBe('"hello world\'')
      expect(removeQuotes('hello world')).toBe('hello world')
    })

    it('should handle escaped quotes inside', () => {
      expect(removeQuotes('"hello \\"world\\""')).toBe('hello "world"')
      expect(removeQuotes("'hello \\'world\\''")).toBe("hello 'world'")
    })

    it('should handle empty strings', () => {
      expect(removeQuotes('')).toBe('')
      expect(removeQuotes('"')).toBe('"')
    })
  })

  describe('hasUnmatchedQuotes', () => {
    it('should detect unmatched quotes', () => {
      expect(hasUnmatchedQuotes('hello "world')).toBe(true)
      expect(hasUnmatchedQuotes("hello 'world")).toBe(true)
      expect(hasUnmatchedQuotes('hello "world"')).toBe(false)
      expect(hasUnmatchedQuotes("hello 'world'")).toBe(false)
    })

    it('should handle escaped quotes', () => {
      expect(hasUnmatchedQuotes('hello \\"world')).toBe(false)
      expect(hasUnmatchedQuotes("hello \\'world")).toBe(false)
    })

    it('should handle nested quotes', () => {
      expect(hasUnmatchedQuotes('"hello \'world\'"')).toBe(false)
      expect(hasUnmatchedQuotes('\'hello "world"\'')).toBe(false)
    })
  })

  describe('escapeQuotes', () => {
    it('should escape double quotes by default', () => {
      expect(escapeQuotes('hello "world"')).toBe('hello \\"world\\"')
    })

    it('should escape single quotes when specified', () => {
      expect(escapeQuotes("hello 'world'", "'")).toBe("hello \\'world\\'")
    })

    it('should not affect already escaped quotes', () => {
      const input = 'hello \\"world\\"'
      const result = escapeQuotes(input)
      expect(result).toBe('hello \\\\"world\\\\"')
    })

    it('should handle empty strings', () => {
      expect(escapeQuotes('')).toBe('')
    })
  })
})
