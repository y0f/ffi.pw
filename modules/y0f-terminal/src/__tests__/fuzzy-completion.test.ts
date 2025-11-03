/**
 * @fileoverview Tests for fuzzy tab completion
 */

import { describe, it, expect } from 'vitest'
import { fuzzyScore, getCompletions, TabCompletionManager } from '../core/TabCompletion'

describe('fuzzyScore', () => {
  it('should give highest score to exact matches', () => {
    expect(fuzzyScore('echo', 'echo')).toBe(1000)
    expect(fuzzyScore('ls', 'ls')).toBe(1000)
  })

  it('should give high score to prefix matches', () => {
    const score = fuzzyScore('ec', 'echo')
    expect(score).toBe(500)
  })

  it('should give medium score to substring matches', () => {
    const score = fuzzyScore('cho', 'echo')
    expect(score).toBe(200)
  })

  it('should score fuzzy character matches', () => {
    const score = fuzzyScore('eo', 'echo')
    expect(score).toBeGreaterThan(0)
    expect(score).toBeLessThan(200)
  })

  it('should give bonus for consecutive matches', () => {
    const consecutive = fuzzyScore('ech', 'echo')
    const nonConsecutive = fuzzyScore('eho', 'echo')
    expect(consecutive).toBeGreaterThan(nonConsecutive)
  })

  it('should return 0 for non-matching input', () => {
    expect(fuzzyScore('xyz', 'echo')).toBe(0)
    expect(fuzzyScore('abc', 'ls')).toBe(0)
  })

  it('should prefer shorter commands with same match type', () => {
    // Both are prefix matches, but 'ls' is shorter
    const shortScore = fuzzyScore('l', 'ls')
    const longScore = fuzzyScore('l', 'listdirectory')
    // Both get 500 for prefix match, but shorter gets bonus
    expect(shortScore).toBeGreaterThanOrEqual(longScore)
  })

  it('should be case insensitive', () => {
    expect(fuzzyScore('EC', 'echo')).toBe(500)
    expect(fuzzyScore('Echo', 'ECHO')).toBe(1000)
  })

  it('should match all input characters in order', () => {
    expect(fuzzyScore('eho', 'echo')).toBeGreaterThan(0)
    expect(fuzzyScore('ohe', 'echo')).toBe(0)
  })
})

describe('getCompletions with fuzzy matching', () => {
  const commands = ['echo', 'ls', 'cat', 'clear', 'neofetch', 'history', 'alias', 'base64', 'hash']

  it('should return all commands when input is empty', () => {
    const results = getCompletions('', commands, true)
    expect(results).toHaveLength(commands.length)
  })

  it('should find exact prefix matches first', () => {
    const results = getCompletions('ec', commands, true)
    expect(results[0]).toBe('echo')
  })

  it('should find substring matches', () => {
    const results = getCompletions('ch', commands, true)
    expect(results).toContain('echo')
    expect(results).toContain('neofetch')
  })

  it('should find fuzzy matches with scattered characters', () => {
    const results = getCompletions('nft', commands, true)
    expect(results).toContain('neofetch')
  })

  it('should sort by relevance (best matches first)', () => {
    const results = getCompletions('h', commands, true)
    // 'hash' and 'history' start with 'h', should come before 'echo' which contains 'h'
    const hashIndex = results.indexOf('hash')
    const echoIndex = results.indexOf('echo')
    expect(hashIndex).toBeLessThan(echoIndex)
  })

  it('should work with partial command names', () => {
    const results = getCompletions('eo', commands, true)
    expect(results).toContain('echo')
    expect(results).toContain('neofetch')
  })

  it('should return empty array when no matches', () => {
    const results = getCompletions('xyz', commands, true)
    expect(results).toHaveLength(0)
  })

  it('should handle single character input', () => {
    const results = getCompletions('c', commands, true)
    expect(results).toContain('cat')
    expect(results).toContain('clear')
    expect(results).toContain('echo')
    expect(results).toContain('neofetch')
  })

  it('should prefer prefix matches over fuzzy matches', () => {
    const results = getCompletions('ca', commands, true)
    expect(results[0]).toBe('cat')
  })
})

describe('getCompletions with fuzzy disabled', () => {
  const commands = ['echo', 'ls', 'cat', 'clear', 'neofetch']

  it('should only match prefixes when fuzzy is disabled', () => {
    const results = getCompletions('ch', commands, false)
    expect(results).toHaveLength(0)
  })

  it('should find prefix matches when fuzzy is disabled', () => {
    const results = getCompletions('ec', commands, false)
    expect(results).toContain('echo')
    expect(results).toHaveLength(1)
  })

  it('should not find substring matches when fuzzy is disabled', () => {
    const results = getCompletions('cho', commands, false)
    expect(results).toHaveLength(0)
  })
})

describe('TabCompletionManager with fuzzy search', () => {
  const commands = ['echo', 'ls', 'cat', 'clear', 'history', 'neofetch']

  it('should use fuzzy matching by default', () => {
    const manager = new TabCompletionManager(commands)
    const result = manager.complete('nf')
    expect(result).toBe('neofetch')
  })

  it('should find matches with scattered characters', () => {
    const manager = new TabCompletionManager(commands)
    const result = manager.complete('hst')
    expect(result).toBe('history')
  })

  it('should cycle through fuzzy matches', () => {
    const manager = new TabCompletionManager(commands)

    const first = manager.complete('c', false)
    expect(['cat', 'clear', 'echo', 'neofetch']).toContain(first)

    // Second tab
    const second = manager.complete('c', true)
    expect(second).not.toBe(first)
  })

  it('should work with prefix-only mode when fuzzy disabled', () => {
    const manager = new TabCompletionManager(commands, false)
    const result = manager.complete('ec')
    expect(result).toBe('echo')
  })

  it('should return input when no fuzzy matches', () => {
    const manager = new TabCompletionManager(commands)
    const result = manager.complete('xyz')
    expect(result).toBe('xyz')
  })

  it('should find best match for common abbreviations', () => {
    const manager = new TabCompletionManager(commands)

    // 'e' should prefer 'echo' over 'neofetch'
    const result = manager.complete('e')
    expect(result).toBe('echo')
  })

  it('should handle multiple characters fuzzy match', () => {
    const manager = new TabCompletionManager(['neofetch', 'history', 'echo'])
    const result = manager.complete('nft')
    expect(result).toBe('neofetch')
  })
})

describe('Real-world fuzzy matching scenarios', () => {
  const allCommands = [
    'clear',
    'help',
    'whoami',
    'links',
    'echo',
    'history',
    'alias',
    'theme',
    'ls',
    'cd',
    'cat',
    'pwd',
    'mkdir',
    'touch',
    'rm',
    'base64',
    'hash',
    'uuid',
    'neofetch',
    'time',
    'crypto',
    'matrix',
    'cowsay',
    'figlet',
    'games',
    'doom',
    'bifi',
    'omf',
  ]

  it('should find commands with partial abbreviations', () => {
    const results = getCompletions('nf', allCommands, true)
    expect(results).toContain('neofetch')
  })

  it('should find "mkdir" with "mkd"', () => {
    const results = getCompletions('mkd', allCommands, true)
    expect(results).toContain('mkdir')
  })

  it('should find "base64" with "b64"', () => {
    const results = getCompletions('b64', allCommands, true)
    expect(results).toContain('base64')
  })

  it('should find "cowsay" with "cw"', () => {
    const results = getCompletions('cw', allCommands, true)
    expect(results).toContain('cowsay')
  })

  it('should prioritize exact starts over fuzzy', () => {
    const results = getCompletions('cat', allCommands, true)
    expect(results[0]).toBe('cat')
  })

  it('should handle common typos gracefully', () => {
    // Missing middle character
    const results = getCompletions('ech', allCommands, true)
    expect(results).toContain('echo')
  })
})
