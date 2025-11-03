/**
 * @fileoverview Tests for AnimatedCommand system
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  animationRegistry,
  createAnimatedCommand,
  animateFrames,
  animateContinuous,
} from '../core/AnimatedCommand'
import { formatText } from '../core/formatters'
import type { CommandContext, OutputObject } from '../core/Command'

describe('AnimatedCommand', () => {
  let mockContext: CommandContext

  beforeEach(() => {
    vi.useFakeTimers()
    mockContext = {
      setOutput: vi.fn(),
      setActiveGame: vi.fn(),
      setIsTrippy: vi.fn(),
      setIsExpanded: vi.fn(),
      parsed: {
        command: 'test',
        args: [],
        flags: [],
        options: {},
        raw: 'test',
      },
    }
  })

  afterEach(() => {
    vi.useRealTimers()
    animationRegistry.stopAll()
  })

  describe('animationRegistry', () => {
    it('should register and track animations', () => {
      const controller = new AbortController()
      animationRegistry.register('test-anim', controller)
      expect(animationRegistry.isActive('test-anim')).toBe(true)
    })

    it('should stop animations', () => {
      const controller = new AbortController()
      const cleanup = vi.fn()
      animationRegistry.register('test-anim', controller, cleanup)

      animationRegistry.stop('test-anim')
      expect(controller.signal.aborted).toBe(true)
      expect(cleanup).toHaveBeenCalled()
      expect(animationRegistry.isActive('test-anim')).toBe(false)
    })

    it('should stop all animations', () => {
      const controller1 = new AbortController()
      const controller2 = new AbortController()
      animationRegistry.register('anim1', controller1)
      animationRegistry.register('anim2', controller2)

      animationRegistry.stopAll()
      expect(controller1.signal.aborted).toBe(true)
      expect(controller2.signal.aborted).toBe(true)
      expect(animationRegistry.isActive('anim1')).toBe(false)
      expect(animationRegistry.isActive('anim2')).toBe(false)
    })

    it('should replace existing animation with same id', () => {
      const controller1 = new AbortController()
      const controller2 = new AbortController()
      animationRegistry.register('test-anim', controller1)
      animationRegistry.register('test-anim', controller2)

      expect(controller1.signal.aborted).toBe(true)
      expect(controller2.signal.aborted).toBe(false)
      expect(animationRegistry.isActive('test-anim')).toBe(true)
    })
  })

  describe('createAnimatedCommand', () => {
    it('should create an animated command', async () => {
      const animation = {
        start: vi.fn((context) => {
          context.updateOutput([formatText('Animated output')])
        }),
      }

      const command = createAnimatedCommand('test', animation)
      const result = await command(mockContext)

      expect(animation.start).toHaveBeenCalled()
      expect(mockContext.setOutput).toHaveBeenCalled()
    })

    it('should stop animation after specified duration', async () => {
      const stopFn = vi.fn()
      const animation = {
        start: vi.fn(),
        stop: stopFn,
        duration: 1000,
      }

      const command = createAnimatedCommand('test', animation)
      await command(mockContext)

      expect(stopFn).not.toHaveBeenCalled()

      // Advance time past duration
      vi.advanceTimersByTime(1000)

      expect(stopFn).toHaveBeenCalled()
    })

    it('should handle infinite duration', async () => {
      const animation = {
        start: vi.fn(),
        duration: 0,
      }

      const command = createAnimatedCommand('test', animation)
      await command(mockContext)

      // Advance time significantly
      vi.advanceTimersByTime(10000)

      // Animation should still be active (would need to check registry)
      // In real usage, it would be stopped by user input or navigation
    })
  })

  describe('animateFrames', () => {
    it('should animate through frames', () => {
      const frames = [
        () => [formatText('Frame 1')],
        () => [formatText('Frame 2')],
        () => [formatText('Frame 3')],
      ]

      const updateOutput = vi.fn()
      const context = {
        updateOutput,
        isActive: () => true,
        cleanup: vi.fn(),
        setOutput: vi.fn(),
        setActiveGame: vi.fn(),
        setIsTrippy: vi.fn(),
        setIsExpanded: vi.fn(),
        parsed: mockContext.parsed,
      }

      animateFrames(frames, 100, context)

      // Initial frame
      expect(updateOutput).toHaveBeenCalledWith([formatText('Frame 1')])

      // Advance to next frame
      vi.advanceTimersByTime(100)
      expect(updateOutput).toHaveBeenCalledWith([formatText('Frame 2')])

      // Advance to next frame
      vi.advanceTimersByTime(100)
      expect(updateOutput).toHaveBeenCalledWith([formatText('Frame 3')])

      vi.advanceTimersByTime(100)
      expect(updateOutput).toHaveBeenCalledWith([formatText('Frame 1')])
    })

    it('should stop when context is not active', () => {
      const frames = [() => [formatText('Frame 1')]]
      const updateOutput = vi.fn()
      let isActive = true

      const context = {
        updateOutput,
        isActive: () => isActive,
        cleanup: vi.fn(),
        setOutput: vi.fn(),
        setActiveGame: vi.fn(),
        setIsTrippy: vi.fn(),
        setIsExpanded: vi.fn(),
        parsed: mockContext.parsed,
      }

      animateFrames(frames, 100, context)

      expect(updateOutput).toHaveBeenCalledTimes(1)

      // Deactivate
      isActive = false

      vi.advanceTimersByTime(100)
      expect(updateOutput).toHaveBeenCalledTimes(1)
    })
  })

  describe('animateContinuous', () => {
    it('should continuously render with time parameter', () => {
      const render = vi.fn((time: number) => [formatText(`Time: ${time}`)])
      const updateOutput = vi.fn()

      const context = {
        updateOutput,
        isActive: () => true,
        cleanup: vi.fn(),
        setOutput: vi.fn(),
        setActiveGame: vi.fn(),
        setIsTrippy: vi.fn(),
        setIsExpanded: vi.fn(),
        parsed: mockContext.parsed,
      }

      animateContinuous(render, 30, context)

      // Initial render
      expect(render).toHaveBeenCalled()
      expect(updateOutput).toHaveBeenCalled()

      const frameDelay = 1000 / 30

      // Advance one frame
      vi.advanceTimersByTime(frameDelay)
      expect(render).toHaveBeenCalledTimes(2)

      // The time parameter should increase
      const firstCall = render.mock.calls[0][0]
      const secondCall = render.mock.calls[1][0]
      expect(secondCall).toBeGreaterThanOrEqual(firstCall)
    })

    it('should respect FPS setting', () => {
      const render = vi.fn(() => [formatText('Frame')])
      const updateOutput = vi.fn()

      const context = {
        updateOutput,
        isActive: () => true,
        cleanup: vi.fn(),
        setOutput: vi.fn(),
        setActiveGame: vi.fn(),
        setIsTrippy: vi.fn(),
        setIsExpanded: vi.fn(),
        parsed: mockContext.parsed,
      }

      animateContinuous(render, 60, context)

      const frameDelay = 1000 / 60

      // Advance by multiple frames
      vi.advanceTimersByTime(frameDelay * 10)

      expect(render).toHaveBeenCalledTimes(11)
    })

    it('should stop when context becomes inactive', () => {
      const render = vi.fn(() => [formatText('Frame')])
      const updateOutput = vi.fn()
      let isActive = true

      const context = {
        updateOutput,
        isActive: () => isActive,
        cleanup: vi.fn(),
        setOutput: vi.fn(),
        setActiveGame: vi.fn(),
        setIsTrippy: vi.fn(),
        setIsExpanded: vi.fn(),
        parsed: mockContext.parsed,
      }

      animateContinuous(render, 30, context)

      expect(render).toHaveBeenCalledTimes(1)

      // Deactivate
      isActive = false

      vi.advanceTimersByTime(1000)
      expect(render).toHaveBeenCalledTimes(1)
    })
  })
})
