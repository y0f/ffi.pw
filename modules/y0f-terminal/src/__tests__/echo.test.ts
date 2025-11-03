/**
 * Echo Command Tests
 *
 * Tests the echo command with various argument combinations.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { echo } from '../commands/system/echo'
import { parseCommandInput } from '../core/ArgumentParser'
import type { CommandContext } from '../core/Command'

describe('echo command', () => {
  let context: CommandContext

  beforeEach(() => {
    context = {
      setOutput: vi.fn(),
      setActiveGame: vi.fn(),
      setIsTrippy: vi.fn(),
      parsed: parseCommandInput('echo'),
    }
  })

  it('should have correct metadata', () => {
    expect(echo.name).toBe('echo')
    expect(echo.category).toBe('system')
    expect(echo.description).toBeDefined()
  })

  it('should echo simple text', async () => {
    const parsed = parseCommandInput('echo hello world')
    context.parsed = parsed

    const result = await echo.execute(context)

    expect(result).toHaveLength(1)
    expect(result[0]?.text).toBe('hello world')
  })

  it('should handle empty input', async () => {
    const parsed = parseCommandInput('echo')
    context.parsed = parsed

    const result = await echo.execute(context)

    expect(result).toHaveLength(1)
    expect(result[0]?.text).toBe('')
  })

  it('should handle uppercase flag', async () => {
    const parsed = parseCommandInput('echo hello world --upper')
    context.parsed = parsed

    const result = await echo.execute(context)

    expect(result).toHaveLength(1)
    expect(result[0]?.text).toBe('HELLO WORLD')
  })

  it('should handle lowercase flag', async () => {
    const parsed = parseCommandInput('echo HELLO WORLD --lower')
    context.parsed = parsed

    const result = await echo.execute(context)

    expect(result).toHaveLength(1)
    expect(result[0]?.text).toBe('hello world')
  })

  it('should handle quoted strings', async () => {
    const parsed = parseCommandInput('echo "hello world" test')
    context.parsed = parsed

    const result = await echo.execute(context)

    expect(result).toHaveLength(1)
    expect(result[0]?.text).toBe('hello world test')
  })

  it('should process escape sequences with -e flag', async () => {
    const parsed = parseCommandInput('echo -e "Line 1\\nLine 2"')
    context.parsed = parsed

    const result = await echo.execute(context)

    expect(result.length).toBeGreaterThan(1)
    const output = JSON.stringify(result)
    expect(output).toContain('Line 1')
    expect(output).toContain('Line 2')
  })

  it('should apply color with --color flag', async () => {
    const parsed = parseCommandInput('echo --color cyan "Test"')
    context.parsed = parsed

    const result = await echo.execute(context)

    expect(result.length).toBeGreaterThan(0)
    const output = JSON.stringify(result)
    expect(output).toContain('Test')
  })

  it('should handle multiple words and flags together', async () => {
    const parsed = parseCommandInput('echo hello beautiful world --upper')
    context.parsed = parsed

    const result = await echo.execute(context)

    expect(result).toHaveLength(1)
    expect(result[0]?.text).toBe('HELLO BEAUTIFUL WORLD')
  })

  it('should prioritize upper over lower if both are present', async () => {
    const parsed = parseCommandInput('echo hello --upper --lower')
    context.parsed = parsed

    const result = await echo.execute(context)

    expect(result).toHaveLength(1)
    expect(result[0]?.text).toBe('HELLO')
  })
})
