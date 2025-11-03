/**
 * Tests for new commands: neofetch, history, alias, base64, hash, uuid
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { neofetch } from '../commands/info/neofetch'
import { createHistoryCommand } from '../commands/system/history'
import { alias } from '../commands/system/alias'
import { base64 } from '../commands/devtools/base64'
import { hash } from '../commands/devtools/hash'
import { uuid } from '../commands/devtools/uuid'
import { parseCommandInput } from '../core/ArgumentParser'
import type { OutputObject } from '../core/Command'

const createContext = (input: string) => ({
  setOutput: vi.fn(),
  setActiveGame: vi.fn(),
  setIsTrippy: vi.fn(),
  parsed: parseCommandInput(input),
})

describe('neofetch command', () => {
  it('should display system information', async () => {
    const context = createContext('neofetch')
    const result = (await neofetch.execute(context)) as OutputObject[]

    expect(result.length).toBeGreaterThan(0)
    expect(result.some((r) => r.parts)).toBe(true)
  })
})

describe('history command', () => {
  let mockHistory: string[]
  let historyCommand: ReturnType<typeof createHistoryCommand>

  beforeEach(() => {
    mockHistory = ['ls', 'help', 'whoami']
    const getHistory = vi.fn(() => mockHistory)
    const clearHistory = vi.fn(() => {
      mockHistory = []
    })
    historyCommand = createHistoryCommand(getHistory, clearHistory)
  })

  it('should display command history', async () => {
    const context = createContext('history')
    const result = (await historyCommand.execute(context)) as OutputObject[]

    expect(result.length).toBeGreaterThan(3)
    const hasLs = result.some((r) => {
      if (r.text?.includes('ls')) return true
      if (r.parts) {
        return r.parts.some((p) => p.text?.includes('ls'))
      }
      return false
    })
    expect(hasLs).toBe(true)
  })

  it('should clear history with --clear flag', async () => {
    const context = createContext('history --clear')
    const result = (await historyCommand.execute(context)) as OutputObject[]

    expect(result.length).toBe(1)
    expect(result[0]?.text).toContain('cleared')
  })

  it('should search history', async () => {
    const context = createContext('history help')
    const result = (await historyCommand.execute(context)) as OutputObject[]

    expect(result.some((r) => r.text?.includes('help'))).toBe(true)
  })
})

describe('alias command', () => {
  it('should show no aliases initially', async () => {
    const context = createContext('alias')
    const result = (await alias.execute(context)) as OutputObject[]

    expect(result.some((r) => r.text?.includes('No aliases'))).toBe(true)
  })

  it('should create an alias', async () => {
    const context = createContext('alias ll=ls -la')
    const result = (await alias.execute(context)) as OutputObject[]

    expect(result.some((r) => r.text?.includes('created'))).toBe(true)
  })

  it('should show error for invalid syntax', async () => {
    const context = createContext('alias invalid')
    const result = (await alias.execute(context)) as OutputObject[]

    expect(result.some((r) => r.parts?.some((p) => p.color?.includes('red')))).toBe(true)
  })
})

describe('base64 command', () => {
  it('should encode text', async () => {
    const context = createContext('base64 hello')
    const result = (await base64.execute(context)) as OutputObject[]

    expect(result.some((r) => r.text?.includes('aGVsbG8='))).toBe(true)
  })

  it('should decode text', async () => {
    const context = createContext('base64 -d aGVsbG8=')
    const result = (await base64.execute(context)) as OutputObject[]

    expect(result.some((r) => r.text?.includes('hello'))).toBe(true)
  })

  it('should show error for missing input', async () => {
    const context = createContext('base64')
    const result = (await base64.execute(context)) as OutputObject[]

    expect(result.some((r) => r.text?.includes('Usage'))).toBe(true)
  })
})

describe('hash command', () => {
  it('should generate SHA-256 hash', async () => {
    const context = createContext('hash test')
    const result = (await hash.execute(context)) as OutputObject[]

    expect(result.length).toBeGreaterThan(0)
    expect(result.some((r) => r.parts?.some((p) => p.text && p.text.length === 64))).toBe(true)
  })

  it('should support different algorithms', async () => {
    const context = createContext('hash --algo=sha512 test')
    const result = (await hash.execute(context)) as OutputObject[]

    // SHA-512 is 128 chars
    expect(result.some((r) => r.parts?.some((p) => p.text && p.text.length === 128))).toBe(true)
  })

  it('should show error for invalid algorithm', async () => {
    const context = createContext('hash --algo=md5 test')
    const result = (await hash.execute(context)) as OutputObject[]

    expect(result.some((r) => r.text?.includes('unknown algorithm'))).toBe(true)
  })
})

describe('uuid command', () => {
  it('should generate a valid UUID', async () => {
    const context = createContext('uuid')
    const result = (await uuid.execute(context)) as OutputObject[]

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    expect(result.some((r) => r.text && uuidRegex.test(r.text))).toBe(true)
  })
})
