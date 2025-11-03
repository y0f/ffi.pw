/**
 * @fileoverview Tests for command chaining functionality
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { hasChain, splitByChain, executeChainedCommands } from '../core/ChainHandler'
import type { CommandContext, OutputObject } from '../core/Command'
import { ensureCommandsRegistered } from '../commands/index'
import { resetFileSystem } from '../core/VirtualFileSystem'

function createContext(): Omit<CommandContext, 'parsed'> {
  return {
    setOutput: () => {},
    setActiveGame: () => {},
    setIsTrippy: () => {},
    setIsExpanded: () => {},
  }
}

describe('hasChain', () => {
  it('should detect && operator', () => {
    expect(hasChain('echo hello && echo world')).toBe(true)
    expect(hasChain('mkdir test && cd test')).toBe(true)
  })

  it('should detect || operator', () => {
    expect(hasChain('rm file.txt || echo "failed"')).toBe(true)
    expect(hasChain('mkdir test || echo error')).toBe(true)
  })

  it('should detect ; operator', () => {
    expect(hasChain('echo step1 ; echo step2')).toBe(true)
    expect(hasChain('pwd ; ls ; whoami')).toBe(true)
  })

  it('should not detect operators inside quotes', () => {
    expect(hasChain('echo "hello && world"')).toBe(false)
    expect(hasChain("echo 'test || data'")).toBe(false)
    expect(hasChain('echo "step1 ; step2"')).toBe(false)
  })

  it('should return false for commands without chain', () => {
    expect(hasChain('echo hello')).toBe(false)
    expect(hasChain('ls -la')).toBe(false)
  })
})

describe('splitByChain', () => {
  it('should split commands with && operator', () => {
    const result = splitByChain('echo hello && echo world')
    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({ command: 'echo hello', operator: '&&' })
    expect(result[1]).toEqual({ command: 'echo world' })
  })

  it('should split commands with || operator', () => {
    const result = splitByChain('mkdir test || echo "failed"')
    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({ command: 'mkdir test', operator: '||' })
    expect(result[1]).toEqual({ command: 'echo "failed"' })
  })

  it('should split commands with ; operator', () => {
    const result = splitByChain('pwd ; ls ; whoami')
    expect(result).toHaveLength(3)
    expect(result[0]).toEqual({ command: 'pwd', operator: ';' })
    expect(result[1]).toEqual({ command: 'ls', operator: ';' })
    expect(result[2]).toEqual({ command: 'whoami' })
  })

  it('should preserve operators inside quotes', () => {
    const result = splitByChain('echo "hello && world" && echo test')
    expect(result).toHaveLength(2)
    expect(result[0]?.command).toBe('echo "hello && world"')
    expect(result[1]?.command).toBe('echo test')
  })

  it('should handle mixed operators', () => {
    const result = splitByChain('mkdir test && cd test || echo "failed"')
    expect(result).toHaveLength(3)
    expect(result[0]).toEqual({ command: 'mkdir test', operator: '&&' })
    expect(result[1]).toEqual({ command: 'cd test', operator: '||' })
    expect(result[2]).toEqual({ command: 'echo "failed"' })
  })

  it('should trim whitespace around commands', () => {
    const result = splitByChain('echo test  &&  pwd  ;  ls')
    expect(result).toHaveLength(3)
    expect(result[0]?.command).toBe('echo test')
    expect(result[1]?.command).toBe('pwd')
    expect(result[2]?.command).toBe('ls')
  })
})

describe('Chain Integration Tests', () => {
  beforeEach(() => {
    ensureCommandsRegistered()
    resetFileSystem()
  })

  it('should execute all commands with ; operator', async () => {
    const commands = splitByChain('echo "step1" ; echo "step2" ; echo "step3"')
    const context = createContext()
    const result = await executeChainedCommands(commands, context)

    expect(result.length).toBeGreaterThan(0)
    const output = JSON.stringify(result)
    expect(output).toContain('step1')
    expect(output).toContain('step2')
    expect(output).toContain('step3')
  })

  it('should stop execution with && if command fails', async () => {
    const commands = splitByChain('mkdir testdir && rm nonexistent.txt && echo "should not run"')
    const context = createContext()
    const result = await executeChainedCommands(commands, context)

    const output = JSON.stringify(result)
    expect(output).not.toContain('should not run')
  })

  it('should continue execution with && if commands succeed', async () => {
    const commands = splitByChain('mkdir testdir && cd testdir && pwd')
    const context = createContext()
    const result = await executeChainedCommands(commands, context)

    const output = JSON.stringify(result)
    // All commands should have executed
    expect(output).toContain('testdir')
  })

  it('should only execute second command with || if first fails', async () => {
    const commands = splitByChain('rm nonexistent.txt || echo "fallback"')
    const context = createContext()
    const result = await executeChainedCommands(commands, context)

    const output = JSON.stringify(result)
    expect(output).toContain('fallback')
  })

  it('should not execute second command with || if first succeeds', async () => {
    const commands = splitByChain('echo "success" || echo "should not run"')
    const context = createContext()
    const result = await executeChainedCommands(commands, context)

    const output = JSON.stringify(result)
    expect(output).toContain('success')
    expect(output).not.toContain('should not run')
  })

  it('should handle complex chaining logic', async () => {
    // mkdir succeeds, cd succeeds, touch succeeds, echo runs
    const commands = splitByChain('mkdir project && cd project && touch file.txt && echo "done"')
    const context = createContext()
    const result = await executeChainedCommands(commands, context)

    const output = JSON.stringify(result)
    expect(output).toContain('done')
  })

  it('should handle non-existent command in chain', async () => {
    const commands = splitByChain('echo test && nonexistent && echo "after"')
    const context = createContext()
    const result = await executeChainedCommands(commands, context)

    const output = JSON.stringify(result)
    expect(output).toContain('command not found')
    expect(output).not.toContain('after')
  })

  it('should execute all commands regardless of status with ;', async () => {
    const commands = splitByChain('mkdir testdir ; rm nonexistent.txt ; echo "always runs"')
    const context = createContext()
    const result = await executeChainedCommands(commands, context)

    const output = JSON.stringify(result)
    expect(output).toContain('always runs')
  })
})
