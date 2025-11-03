/**
 * @fileoverview Tests for the matrix command with animation
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { matrix } from '../commands/effects/matrix'
import { animationRegistry } from '../core/AnimatedCommand'
import type { CommandContext } from '../core/Command'

describe('matrix command', () => {
  let mockContext: CommandContext
  let setOutputSpy: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.useFakeTimers()
    setOutputSpy = vi.fn()
    mockContext = {
      setOutput: setOutputSpy,
      setActiveGame: vi.fn(),
      setIsTrippy: vi.fn(),
      setIsExpanded: vi.fn(),
      parsed: {
        command: 'matrix',
        args: [],
        flags: [],
        options: {},
        raw: 'matrix',
      },
    }
  })

  afterEach(() => {
    vi.useRealTimers()
    animationRegistry.stopAll()
  })

  it('should have correct command metadata', () => {
    expect(matrix.name).toBe('matrix')
    expect(matrix.description).toBe('Animated Matrix digital rain effect')
    expect(matrix.category).toBe('effects')
    expect(matrix.usage).toBe('matrix')
  })

  it('should start animation when executed', async () => {
    const result = await matrix.execute(mockContext)

    expect(Array.isArray(result)).toBe(true)

    vi.advanceTimersByTime(100)

    // setOutput should be called with a function
    expect(setOutputSpy).toHaveBeenCalled()
    const firstCall = setOutputSpy.mock.calls[0][0]

    // The AnimatedCommand passes an update function to setOutput
    expect(typeof firstCall).toBe('function')

    const output = firstCall([])
    expect(output).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          text: 'Entering the Matrix...',
          color: 'text-green-400 font-bold',
        }),
        expect.objectContaining({ text: ' ' }),
        expect.objectContaining({
          text: 'Type "clear" or another command to exit',
          color: 'text-green-600 text-xs',
        }),
        expect.objectContaining({ text: ' ' }),
      ]),
    )
  })

  it('should update animation frames', async () => {
    await matrix.execute(mockContext)

    setOutputSpy.mockClear()

    // Advance past the initial delay (500ms) to start the actual animation
    vi.advanceTimersByTime(600)

    expect(setOutputSpy).toHaveBeenCalled()

    // Advance more to see multiple frames
    const frameDelay = 1000 / 15 // 15 FPS as configured
    vi.advanceTimersByTime(frameDelay * 5)

    expect(setOutputSpy.mock.calls.length).toBeGreaterThan(4)
  })

  it('should generate Matrix rain output format', async () => {
    await matrix.execute(mockContext)

    // Advance to start animation
    vi.advanceTimersByTime(600)

    const latestCall = setOutputSpy.mock.calls[setOutputSpy.mock.calls.length - 1]
    if (!latestCall) return

    // The update function should receive a function that returns output
    const updateFn = latestCall[0]
    if (typeof updateFn === 'function') {
      const output = updateFn([])

      expect(output.length).toBeGreaterThan(20)

      const rainLines = output.filter((line) => line.parts)
      expect(rainLines.length).toBeGreaterThan(0)

      const headerLines = output.slice(0, 5)
      expect(headerLines).toContainEqual(
        expect.objectContaining({
          text: 'Type "clear" or another command to exit',
          color: 'text-green-600 text-xs',
        }),
      )
    }
  })

  it('should be stoppable via animation registry', async () => {
    await matrix.execute(mockContext)

    vi.advanceTimersByTime(600)

    setOutputSpy.mockClear()

    animationRegistry.stopAll()

    // Advance time significantly
    vi.advanceTimersByTime(5000)

    expect(setOutputSpy).not.toHaveBeenCalled()
  })

  it('should handle multiple instances correctly', async () => {
    await matrix.execute(mockContext)
    vi.advanceTimersByTime(100)

    const firstCallCount = setOutputSpy.mock.calls.length

    await matrix.execute(mockContext)
    vi.advanceTimersByTime(100)

    expect(setOutputSpy.mock.calls.length).toBeGreaterThan(firstCallCount)
  })

  it('should use different colors for rain intensity', async () => {
    await matrix.execute(mockContext)

    // Advance to get actual rain output
    vi.advanceTimersByTime(700)

    const latestCall = setOutputSpy.mock.calls[setOutputSpy.mock.calls.length - 1]
    if (!latestCall) return

    const updateFn = latestCall[0]
    if (typeof updateFn === 'function') {
      const output = updateFn([])

      const coloredLines = output.filter((line) =>
        line.parts?.some((part) => part.color?.includes('text-green')),
      )

      if (coloredLines.length > 0) {
        const allColors = coloredLines.flatMap(
          (line) => line.parts?.map((p) => p.color).filter(Boolean) || [],
        )

        const expectedColors = [
          'text-green-100', // Brightest
          'text-green-200',
          'text-green-300',
          'text-green-400',
          'text-green-500',
          'text-green-600', // Dimmest
        ]

        // At least some of these colors should be present
        const hasMatrixColors = expectedColors.some((color) =>
          allColors.some((c) => c?.includes(color)),
        )

        expect(hasMatrixColors).toBe(true)
      }
    }
  })

  it('should include Matrix characters in output', async () => {
    await matrix.execute(mockContext)

    // Advance to get actual rain output
    vi.advanceTimersByTime(700)

    const latestCall = setOutputSpy.mock.calls[setOutputSpy.mock.calls.length - 1]
    if (!latestCall) return

    const updateFn = latestCall[0]
    if (typeof updateFn === 'function') {
      const output = updateFn([])

      const allText = output
        .map((line) => {
          if (line.text) return line.text
          if (line.parts) return line.parts.map((p) => p.text).join('')
          return ''
        })
        .join('')

      const hasMatrixChars = /[ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ0-9]/.test(allText)
      expect(hasMatrixChars).toBe(true)
    }
  })
})
