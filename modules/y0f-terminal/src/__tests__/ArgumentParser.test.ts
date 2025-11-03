/**
 * ArgumentParser Tests
 *
 * Tests for command-line argument parsing functionality.
 */

import { describe, it, expect } from 'vitest'
import {
  parseCommandInput,
  getArg,
  getOption,
  hasFlag,
  requireArgs,
  requireOptions,
} from '../core/ArgumentParser'

describe('parseCommandInput', () => {
  it('should parse simple command with no arguments', () => {
    const result = parseCommandInput('help')

    expect(result.command).toBe('help')
    expect(result.args).toEqual([])
    expect(result.flags).toEqual([])
    expect(result.options).toEqual({})
  })

  it('should parse command with positional arguments', () => {
    const result = parseCommandInput('echo hello world')

    expect(result.command).toBe('echo')
    expect(result.args).toEqual(['hello', 'world'])
  })

  it('should parse command with quoted strings', () => {
    const result = parseCommandInput('echo "hello world" test')

    expect(result.command).toBe('echo')
    expect(result.args).toEqual(['hello world', 'test'])
  })

  it('should parse command with single quotes', () => {
    const result = parseCommandInput("echo 'hello world'")

    expect(result.command).toBe('echo')
    expect(result.args).toEqual(['hello world'])
  })

  it('should parse command with long flags', () => {
    const result = parseCommandInput('list --verbose --all')

    expect(result.command).toBe('list')
    expect(result.flags).toEqual(['verbose', 'all'])
    expect(result.options).toEqual({ verbose: true, all: true })
  })

  it('should parse command with short flags', () => {
    const result = parseCommandInput('list -l -a')

    expect(result.command).toBe('list')
    expect(result.flags).toEqual(['l', 'a'])
    expect(result.options).toEqual({ l: true, a: true })
  })

  it('should parse command with combined short flags', () => {
    const result = parseCommandInput('list -la')

    expect(result.command).toBe('list')
    expect(result.flags).toEqual(['l', 'a'])
    expect(result.options).toEqual({ l: true, a: true })
  })

  it('should parse command with named options', () => {
    const result = parseCommandInput('search --query=test --limit=10')

    expect(result.command).toBe('search')
    expect(result.options).toEqual({ query: 'test', limit: '10' })
  })

  it('should parse command with mixed arguments', () => {
    const result = parseCommandInput('cmd arg1 --flag arg2 --name=value -abc')

    expect(result.command).toBe('cmd')
    expect(result.args).toEqual(['arg1', 'arg2'])
    expect(result.flags).toEqual(['flag', 'a', 'b', 'c'])
    expect(result.options).toEqual({
      flag: true,
      name: 'value',
      a: true,
      b: true,
      c: true,
    })
  })

  it('should handle empty input', () => {
    const result = parseCommandInput('')

    expect(result.command).toBe('')
    expect(result.args).toEqual([])
  })

  it('should handle whitespace-only input', () => {
    const result = parseCommandInput('   ')

    expect(result.command).toBe('')
    expect(result.args).toEqual([])
  })

  it('should preserve raw input', () => {
    const input = 'test --flag arg'
    const result = parseCommandInput(input)

    expect(result.raw).toBe(input)
  })

  it('should convert command to lowercase', () => {
    const result = parseCommandInput('HELP')

    expect(result.command).toBe('help')
  })

  it('should handle negative numbers as arguments', () => {
    const result = parseCommandInput('calc -5 -10')

    expect(result.command).toBe('calc')
    expect(result.args).toEqual(['-5', '-10'])
  })

  it('should handle options with equals sign in value', () => {
    const result = parseCommandInput('test --url=http://example.com')

    expect(result.command).toBe('test')
    expect(result.options.url).toBe('http://example.com')
  })
})

describe('getArg', () => {
  it('should get argument by index', () => {
    const parsed = parseCommandInput('cmd arg1 arg2 arg3')

    expect(getArg(parsed, 0)).toBe('arg1')
    expect(getArg(parsed, 1)).toBe('arg2')
    expect(getArg(parsed, 2)).toBe('arg3')
  })

  it('should return default value for missing argument', () => {
    const parsed = parseCommandInput('cmd arg1')

    expect(getArg(parsed, 5, 'default')).toBe('default')
  })

  it('should return undefined for missing argument with no default', () => {
    const parsed = parseCommandInput('cmd arg1')

    expect(getArg(parsed, 5)).toBeUndefined()
  })
})

describe('getOption', () => {
  it('should get option by name', () => {
    const parsed = parseCommandInput('cmd --name=value --flag')

    expect(getOption(parsed, 'name')).toBe('value')
    expect(getOption(parsed, 'flag')).toBe(true)
  })

  it('should return default value for missing option', () => {
    const parsed = parseCommandInput('cmd')

    expect(getOption(parsed, 'missing', 'default')).toBe('default')
  })

  it('should return undefined for missing option with no default', () => {
    const parsed = parseCommandInput('cmd')

    expect(getOption(parsed, 'missing')).toBeUndefined()
  })
})

describe('hasFlag', () => {
  it('should return true for set flags', () => {
    const parsed = parseCommandInput('cmd --verbose -a')

    expect(hasFlag(parsed, 'verbose')).toBe(true)
    expect(hasFlag(parsed, 'a')).toBe(true)
  })

  it('should return false for unset flags', () => {
    const parsed = parseCommandInput('cmd --verbose')

    expect(hasFlag(parsed, 'other')).toBe(false)
  })
})

describe('requireArgs', () => {
  it('should not throw when enough arguments', () => {
    const parsed = parseCommandInput('cmd arg1 arg2 arg3')

    expect(() => requireArgs(parsed, 2)).not.toThrow()
    expect(() => requireArgs(parsed, 3)).not.toThrow()
  })

  it('should throw when not enough arguments', () => {
    const parsed = parseCommandInput('cmd arg1')

    expect(() => requireArgs(parsed, 2)).toThrow('Not enough arguments')
  })
})

describe('requireOptions', () => {
  it('should not throw when all required options present', () => {
    const parsed = parseCommandInput('cmd --name=value --type=test')

    expect(() => requireOptions(parsed, ['name', 'type'])).not.toThrow()
  })

  it('should throw when required options missing', () => {
    const parsed = parseCommandInput('cmd --name=value')

    expect(() => requireOptions(parsed, ['name', 'type'])).toThrow('Missing required options: type')
  })

  it('should throw listing all missing options', () => {
    const parsed = parseCommandInput('cmd')

    expect(() => requireOptions(parsed, ['name', 'type', 'id'])).toThrow(
      'Missing required options: name, type, id',
    )
  })
})
