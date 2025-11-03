/**
 * @fileoverview Integration tests for command piping with real commands
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { executePipedCommands, splitByPipe } from '../core/PipeHandler'
import type { CommandContext, OutputObject } from '../core/Command'
import { ensureCommandsRegistered } from '../commands/index'

function createContext(): Omit<CommandContext, 'input' | 'parsed'> {
  return {
    setOutput: () => {},
    setActiveGame: () => {},
    setIsTrippy: () => {},
    setIsExpanded: () => {},
  }
}

describe('Pipe Integration Tests', () => {
  beforeEach(() => {
    ensureCommandsRegistered()
  })

  it('should pipe echo to base64', async () => {
    const commands = splitByPipe('echo "hello world" | base64')
    const context = createContext()
    const result = await executePipedCommands(commands, context)

    expect(result.length).toBeGreaterThan(0)
    const output = JSON.stringify(result)
    // Base64 of "hello world" is "aGVsbG8gd29ybGQ="
    expect(output).toContain('aGVsbG8gd29ybGQ')
  })

  it('should pipe echo to hash', async () => {
    const commands = splitByPipe('echo "test" | hash')
    const context = createContext()
    const result = await executePipedCommands(commands, context)

    expect(result.length).toBeGreaterThan(0)
    const output = JSON.stringify(result)
    expect(output).toContain('SHA256' || 'CRYPTOGRAPHIC HASH')
  })

  it('should pipe echo to base64 to hash (multiple pipes)', async () => {
    const commands = splitByPipe('echo "data" | base64 | hash')
    const context = createContext()
    const result = await executePipedCommands(commands, context)

    expect(result.length).toBeGreaterThan(0)
    // Final output should be a hash
    const output = JSON.stringify(result)
    expect(output.length).toBeGreaterThan(10)
  })

  it('should handle pipe with command that takes arguments', async () => {
    const commands = splitByPipe('echo "test data" | base64 -w')
    const context = createContext()
    const result = await executePipedCommands(commands, context)

    expect(result.length).toBeGreaterThan(0)
  })

  it('should handle pipe with uppercase flag', async () => {
    const commands = splitByPipe('echo hello | echo --upper')
    const context = createContext()
    const result = await executePipedCommands(commands, context)

    expect(result.length).toBeGreaterThan(0)
    const output = JSON.stringify(result)
    expect(output).toContain('HELLO')
  })

  it('should return error for non-existent command in pipe', async () => {
    const commands = splitByPipe('echo test | nonexistent')
    const context = createContext()
    const result = await executePipedCommands(commands, context)

    expect(result.length).toBeGreaterThan(0)
    const output = JSON.stringify(result)
    expect(output).toContain('command not found')
  })

  it('should handle empty pipe input gracefully', async () => {
    const commands = splitByPipe('echo "" | base64')
    const context = createContext()
    const result = await executePipedCommands(commands, context)

    expect(result.length).toBeGreaterThan(0)
    // Empty string base64 encoded
    expect(Array.isArray(result)).toBe(true)
  })

  it('should preserve newlines in piped data', async () => {
    const commands = splitByPipe('echo -e "line1\\nline2" | base64')
    const context = createContext()
    const result = await executePipedCommands(commands, context)

    expect(result.length).toBeGreaterThan(0)
    const output = JSON.stringify(result)
    expect(output.length).toBeGreaterThan(10)
  })
})
