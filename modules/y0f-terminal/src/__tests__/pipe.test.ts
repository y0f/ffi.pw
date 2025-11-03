/**
 * @fileoverview Tests for command piping functionality
 */

import { describe, it, expect } from 'vitest'
import { hasPipe, splitByPipe, outputToText } from '../core/PipeHandler'
import type { OutputObject } from '../core/Command'

describe('hasPipe', () => {
  it('should detect pipe operator', () => {
    expect(hasPipe('echo hello | base64')).toBe(true)
    expect(hasPipe('cat file.txt | hash')).toBe(true)
  })

  it('should not detect pipe inside quotes', () => {
    expect(hasPipe('echo "hello | world"')).toBe(false)
    expect(hasPipe("echo 'test | data'")).toBe(false)
  })

  it('should return false for commands without pipe', () => {
    expect(hasPipe('echo hello')).toBe(false)
    expect(hasPipe('ls -la')).toBe(false)
  })

  it('should handle multiple pipes', () => {
    expect(hasPipe('echo hello | base64 | hash')).toBe(true)
  })
})

describe('splitByPipe', () => {
  it('should split simple piped commands', () => {
    const result = splitByPipe('echo hello | base64')
    expect(result).toEqual(['echo hello', 'base64'])
  })

  it('should split multiple piped commands', () => {
    const result = splitByPipe('echo test | base64 | hash')
    expect(result).toEqual(['echo test', 'base64', 'hash'])
  })

  it('should preserve pipes inside quotes', () => {
    const result = splitByPipe('echo "hello | world" | base64')
    expect(result).toEqual(['echo "hello | world"', 'base64'])
  })

  it('should handle commands with flags', () => {
    const result = splitByPipe('echo -e "test\\ndata" | base64 -w')
    expect(result).toEqual(['echo -e "test\\ndata"', 'base64 -w'])
  })

  it('should trim whitespace around commands', () => {
    const result = splitByPipe('echo hello  |  base64  |  hash')
    expect(result).toEqual(['echo hello', 'base64', 'hash'])
  })

  it('should handle single quotes', () => {
    const result = splitByPipe("echo 'test | data' | base64")
    expect(result).toEqual(["echo 'test | data'", 'base64'])
  })
})

describe('outputToText', () => {
  it('should convert text output to string', () => {
    const output: OutputObject[] = [{ text: 'Hello' }, { text: 'World' }]
    expect(outputToText(output)).toBe('Hello\nWorld')
  })

  it('should convert parts output to string', () => {
    const output: OutputObject[] = [
      {
        parts: [
          { text: 'SHA256:', color: 'text-cyan-400' },
          { text: 'abc123', color: 'text-primary-400' },
        ],
      },
    ]
    expect(outputToText(output)).toBe('SHA256:abc123')
  })

  it('should handle mixed output types', () => {
    const output: OutputObject[] = [
      { text: 'Line 1' },
      {
        parts: [{ text: 'Part 1' }, { text: 'Part 2' }],
      },
      { text: 'Line 3' },
    ]
    expect(outputToText(output)).toBe('Line 1\nPart 1Part 2\nLine 3')
  })

  it('should handle empty output', () => {
    expect(outputToText([])).toBe('')
  })

  it('should handle empty text', () => {
    const output: OutputObject[] = [{ text: '' }, { text: 'test' }]
    expect(outputToText(output)).toBe('\ntest')
  })
})
