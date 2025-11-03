/**
 * Tab Completion Tests
 *
 * Tests for tab completion functionality.
 */

import { describe, it, expect, beforeEach } from 'vitest'
import {
  getCompletions,
  getNextCompletion,
  getLongestCommonPrefix,
  autoComplete,
  TabCompletionManager,
} from '../core/TabCompletion'

describe('getCompletions', () => {
  const commands: string[] = ['help', 'clear', 'crypto', 'time', 'games', 'whoami', 'links']

  it('should return all commands when input is empty', () => {
    const result = getCompletions('', commands)
    expect(result).toEqual(commands.sort())
  })

  it('should return matching commands', () => {
    const result = getCompletions('c', commands)
    expect(result).toEqual(['clear', 'crypto'])
  })

  it('should return single match', () => {
    const result = getCompletions('tim', commands)
    expect(result).toEqual(['time'])
  })

  it('should return empty array for no matches', () => {
    const result = getCompletions('xyz', commands)
    expect(result).toEqual([])
  })

  it('should be case-insensitive', () => {
    const result = getCompletions('C', commands)
    expect(result).toEqual(['clear', 'crypto'])
  })

  it('should handle whitespace', () => {
    const result = getCompletions('  hel  ', commands)
    expect(result).toEqual(['help'])
  })
})

describe('getNextCompletion', () => {
  it('should return first match when starting', () => {
    const matches: string[] = ['clear', 'crypto']
    const result = getNextCompletion('c', matches, -1)

    expect(result.completion).toBe('clear')
    expect(result.index).toBe(0)
  })

  it('should cycle through matches', () => {
    const matches: string[] = ['clear', 'crypto']

    let result = getNextCompletion('c', matches, -1)
    expect(result.completion).toBe('clear')
    expect(result.index).toBe(0)

    result = getNextCompletion('c', matches, result.index)
    expect(result.completion).toBe('crypto')
    expect(result.index).toBe(1)

    result = getNextCompletion('c', matches, result.index)
    expect(result.completion).toBe('clear')
    expect(result.index).toBe(0)
  })

  it('should return single match', () => {
    const matches: string[] = ['time']
    const result = getNextCompletion('t', matches, -1)

    expect(result.completion).toBe('time')
    expect(result.index).toBe(0)
  })

  it('should return original input when no matches', () => {
    const result = getNextCompletion('xyz', [], -1)

    expect(result.completion).toBe('xyz')
    expect(result.index).toBe(-1)
  })
})

describe('getLongestCommonPrefix', () => {
  it('should return common prefix', () => {
    const result = getLongestCommonPrefix(['clear', 'crypto'])
    expect(result).toBe('c')
  })

  it('should return full string for single item', () => {
    const result = getLongestCommonPrefix(['help'])
    expect(result).toBe('help')
  })

  it('should return empty string for no common prefix', () => {
    const result = getLongestCommonPrefix(['help', 'clear'])
    expect(result).toBe('')
  })

  it('should return empty string for empty array', () => {
    const result = getLongestCommonPrefix([])
    expect(result).toBe('')
  })

  it('should handle longer common prefixes', () => {
    const result = getLongestCommonPrefix(['mobile-dev', 'mobile-app'])
    expect(result).toBe('mobile-')
  })
})

describe('autoComplete', () => {
  it('should complete to single match', () => {
    const result = autoComplete('tim', ['time'])
    expect(result).toBe('time')
  })

  it('should complete to common prefix', () => {
    const result = autoComplete('c', ['clear', 'crypto'])
    expect(result).toBe('c')
  })

  it('should return input when no matches', () => {
    const result = autoComplete('xyz', [])
    expect(result).toBe('xyz')
  })
})

describe('TabCompletionManager', () => {
  let manager: TabCompletionManager
  const commands: string[] = ['help', 'clear', 'crypto', 'time', 'games']

  beforeEach(() => {
    manager = new TabCompletionManager(commands)
  })

  describe('complete', () => {
    it('should complete single match', () => {
      const result = manager.complete('tim')
      expect(result).toBe('time')
    })

    it('should complete to common prefix on first tab', () => {
      const result = manager.complete('c')
      expect(result).toBe('c')
    })

    it('should cycle through multiple matches on repeated tabs', () => {
      let result = manager.complete('c')
      expect(result).toBe('c')

      result = manager.complete('c', true)
      expect(result).toBe('clear')

      result = manager.complete('clear', true)
      expect(result).toBe('crypto')

      result = manager.complete('crypto', true)
      expect(result).toBe('clear')
    })

    it('should return input when no matches', () => {
      const result = manager.complete('xyz')
      expect(result).toBe('xyz')
    })

    it('should reset when input changes', () => {
      manager.complete('c')
      manager.complete('c', true)

      const result = manager.complete('h')
      expect(result).toBe('help')
    })

    it('should handle completing longer common prefix', () => {
      const mgr = new TabCompletionManager(['web-dev', 'web-app', 'mobile'])

      const result = mgr.complete('w')
      expect(result).toBe('web-')
    })
  })

  describe('getMatches', () => {
    it('should return current matches', () => {
      manager.complete('c')
      const matches = manager.getMatches()
      expect(matches).toEqual(['clear', 'crypto'])
    })

    it('should return empty array initially', () => {
      const matches = manager.getMatches()
      expect(matches).toEqual([])
    })
  })

  describe('hasMultipleMatches', () => {
    it('should return true for multiple matches', () => {
      manager.complete('c')
      expect(manager.hasMultipleMatches()).toBe(true)
    })

    it('should return false for single match', () => {
      manager.complete('tim')
      expect(manager.hasMultipleMatches()).toBe(false)
    })

    it('should return false for no matches', () => {
      manager.complete('xyz')
      expect(manager.hasMultipleMatches()).toBe(false)
    })
  })

  describe('setCommandNames', () => {
    it('should update command names', () => {
      manager.setCommandNames(['new', 'commands'])
      const result = manager.complete('n')
      expect(result).toBe('new')
    })

    it('should reset state when updating commands', () => {
      manager.complete('c')
      manager.setCommandNames(['new'])

      const matches = manager.getMatches()
      expect(matches).toEqual([])
    })
  })

  describe('reset', () => {
    it('should clear all state', () => {
      manager.complete('c')
      manager.reset()

      expect(manager.getMatches()).toEqual([])
      expect(manager.hasMultipleMatches()).toBe(false)
    })
  })
})
