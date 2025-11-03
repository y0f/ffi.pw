/**
 * Formatter Utilities Tests
 *
 * Tests output formatting helpers.
 */

import { describe, it, expect } from 'vitest'
import {
  formatHeader,
  formatDivider,
  formatThickDivider,
  formatThinDivider,
  formatText,
  formatEmptyLine,
  formatBullet,
  formatLink,
  formatMultiPart,
  formatCommandLine,
  formatError,
  formatCompletionHint,
} from '../core/formatters'
import { TERMINAL, ERROR_MESSAGES } from '../constants'
import type { OutputObject, OutputPart } from '../core/Command'

describe('Formatters', () => {
  describe('formatHeader', () => {
    it('should create a header with default color', () => {
      const result = formatHeader('TEST HEADER')

      expect(result.text).toBe('TEST HEADER')
      expect(result.color).toBe('text-primary-400')
    })

    it('should create a header with custom color', () => {
      const result = formatHeader('TEST', 'text-red-500')

      expect(result.text).toBe('TEST')
      expect(result.color).toBe('text-red-500')
    })
  })

  describe('formatDivider', () => {
    it('should create a divider with default color', () => {
      const result = formatDivider()

      expect(result.text).toContain('─')
      expect(result.color).toBe('text-white/20')
    })

    it('should create a divider with custom color', () => {
      const result = formatDivider('text-gray-500')

      expect(result.color).toBe('text-gray-500')
    })
  })

  describe('formatThickDivider', () => {
    it('should create a thick divider', () => {
      const result = formatThickDivider()

      expect(result.text).toContain('═')
      expect(result.color).toBe('text-white/20')
    })
  })

  describe('formatThinDivider', () => {
    it('should create a thin divider', () => {
      const result = formatThinDivider()

      expect(result.text).toContain('─')
    })
  })

  describe('formatText', () => {
    it('should create simple text with default color', () => {
      const result = formatText('Hello world')

      expect(result.text).toBe('Hello world')
      expect(result.color).toBe('text-gray-200')
    })

    it('should create text with custom color', () => {
      const result = formatText('Warning', 'text-yellow-500')

      expect(result.text).toBe('Warning')
      expect(result.color).toBe('text-yellow-500')
    })
  })

  describe('formatEmptyLine', () => {
    it('should create an empty line', () => {
      const result = formatEmptyLine()

      expect(result.text).toBe(' ')
      expect(result.color).toBe('text-gray-200')
    })
  })

  describe('formatBullet', () => {
    it('should create a bullet point with default colors', () => {
      const result = formatBullet('Item text')

      expect(result.parts).toBeDefined()
      expect(result.parts?.[0]?.text).toBe('◈ ')
      expect(result.parts?.[0]?.color).toBe('text-primary-400')
      expect(result.parts?.[1]?.text).toBe('Item text')
      expect(result.parts?.[1]?.color).toBe('text-gray-200')
    })

    it('should create a bullet with custom colors', () => {
      const result = formatBullet('Text', 'text-white', 'text-green-500')

      expect(result.parts?.[0]?.color).toBe('text-green-500')
      expect(result.parts?.[1]?.color).toBe('text-white')
    })
  })

  describe('formatLink', () => {
    it('should create a clickable link', () => {
      const result = formatLink('Google', 'https://google.com')

      expect(result.text).toBe('Google')
      expect(result.url).toBe('https://google.com')
      expect(result.isLink).toBe(true)
      expect(result.color).toBe('text-white')
    })

    it('should create a link with custom color', () => {
      const result = formatLink('Link', 'https://example.com', 'text-blue-400')

      expect(result.color).toBe('text-blue-400')
    })
  })

  describe('formatMultiPart', () => {
    it('should create a multi-part line', () => {
      const parts: OutputPart[] = [
        { text: 'Part 1: ', color: 'text-gray-500' },
        { text: 'Part 2', color: 'text-white' },
      ]

      const result = formatMultiPart(parts)

      expect(result.parts).toBe(parts)
    })
  })

  describe('formatCommandLine', () => {
    it('should format a command prompt line', () => {
      const result = formatCommandLine('help')

      expect(result.parts).toBeDefined()
      expect(result.isCommand).toBe(true)
      expect(result.className).toBe('fira')

      const texts = result.parts?.map((p) => p.text).join('') ?? ''
      expect(texts).toContain(TERMINAL.USER)
      expect(texts).toContain(TERMINAL.PATH)
      expect(texts).toContain('help')
    })

    it('should handle long commands', () => {
      const result = formatCommandLine('very long command with args')

      const texts = result.parts?.map((p) => p.text).join('') ?? ''
      expect(texts).toContain('very long command with args')
    })
  })

  describe('formatError', () => {
    it('should format command not found error', () => {
      const result = formatError('badcmd')

      expect(result.isCommand).toBe(false)
      expect(result.parts).toBeDefined()

      const texts = result.parts?.map((p) => p.text).join('') ?? ''
      expect(texts).toContain(ERROR_MESSAGES.COMMAND_NOT_FOUND)
      expect(texts).toContain('badcmd')
      expect(texts).toContain(ERROR_MESSAGES.HELP_HINT)
    })

    it('should format custom error message', () => {
      const result = formatError('cmd', 'Custom error')

      const texts = result.parts?.map((p) => p.text).join('') ?? ''
      expect(texts).toContain('Custom error')
      expect(texts).toContain('cmd')
      expect(texts).not.toContain(ERROR_MESSAGES.HELP_HINT)
    })

    it('should use error colors', () => {
      const result = formatError('cmd')

      const colors = result.parts?.map((p) => p.color) ?? []
      expect(colors.some((c) => c?.includes('red'))).toBe(true)
    })
  })

  describe('formatCompletionHint', () => {
    it('should format multiple completion matches', () => {
      const result = formatCompletionHint(['help', 'header', 'heap'])

      expect(result.parts).toBeDefined()
      expect(result.parts?.length).toBe(2)
      expect(result.parts?.[0]?.text).toBe('Available: ')
      expect(result.parts?.[0]?.color).toBe('text-gray-500')
      expect(result.parts?.[1]?.text).toBe('help  header  heap')
      expect(result.parts?.[1]?.color).toBe('text-primary-400')
    })

    it('should format single completion match', () => {
      const result = formatCompletionHint(['help'])

      expect(result.parts).toBeDefined()
      const texts = result.parts?.map((p) => p.text).join('') ?? ''
      expect(texts).toContain('help')
    })

    it('should handle empty matches array', () => {
      const result = formatCompletionHint([])

      expect(result.text).toBe('')
      expect(result.color).toBe('text-gray-200')
    })

    it('should handle null matches', () => {
      const result = formatCompletionHint(null)

      expect(result.text).toBe('')
      expect(result.color).toBe('text-gray-200')
    })

    it('should handle undefined matches', () => {
      const result = formatCompletionHint(undefined)

      expect(result.text).toBe('')
      expect(result.color).toBe('text-gray-200')
    })

    it('should separate matches with double space', () => {
      const result = formatCompletionHint(['cmd1', 'cmd2', 'cmd3'])

      const texts = result.parts?.map((p) => p.text).join('') ?? ''
      expect(texts).toContain('cmd1  cmd2  cmd3')
    })
  })
})

describe('Formatter Output Structure', () => {
  it('all formatters should return valid output objects', () => {
    const outputs: OutputObject[] = [
      formatHeader('Test'),
      formatDivider(),
      formatThickDivider(),
      formatThinDivider(),
      formatText('Test'),
      formatEmptyLine(),
      formatBullet('Test'),
      formatLink('Test', 'https://example.com'),
      formatMultiPart([{ text: 'test', color: 'text-white' }]),
      formatCommandLine('test'),
      formatError('test'),
      formatCompletionHint(['test1', 'test2']),
    ]

    outputs.forEach((output) => {
      expect(output).toBeDefined()
      expect(typeof output).toBe('object')

      const hasText = typeof output.text === 'string'
      const hasParts = Array.isArray(output.parts)
      expect(hasText || hasParts).toBe(true)

      // If parts exist, validate structure
      if (hasParts && output.parts) {
        output.parts.forEach((part) => {
          expect(typeof part.text).toBe('string')
          expect(typeof part.color).toBe('string')
        })
      }

      // If color exists, should be string
      if (output.color) {
        expect(typeof output.color).toBe('string')
      }
    })
  })
})
