/**
 * @fileoverview Animated command support for terminal
 * Provides infrastructure for commands that update their output over time
 */

import type { OutputObject, CommandContext } from './Command'

export interface AnimatedCommandContext extends CommandContext {
  /** Update the output with animation frames */
  updateOutput: (output: OutputObject[]) => void
  /** Check if animation should continue */
  isActive: () => boolean
  /** Clean up when animation stops */
  cleanup: () => void
}

export interface AnimatedCommand {
  /** Start the animation */
  start: (context: AnimatedCommandContext) => void
  /** Stop the animation */
  stop?: () => void
  /** Duration in milliseconds (0 for infinite) */
  duration?: number
}

/**
 * Registry for active animations
 */
class AnimationRegistry {
  private activeAnimations = new Map<
    string,
    {
      controller: AbortController
      cleanup?: () => void
    }
  >()

  register(id: string, controller: AbortController, cleanup?: () => void) {
    this.stop(id)
    this.activeAnimations.set(id, { controller, cleanup })
  }

  stop(id: string) {
    const animation = this.activeAnimations.get(id)
    if (animation) {
      animation.controller.abort()
      animation.cleanup?.()
      this.activeAnimations.delete(id)
    }
  }

  stopAll() {
    for (const [id] of this.activeAnimations) {
      this.stop(id)
    }
  }

  isActive(id: string): boolean {
    return this.activeAnimations.has(id)
  }
}

export const animationRegistry = new AnimationRegistry()

/**
 * Helper to create an animated command with proper lifecycle management
 */
export function createAnimatedCommand(
  name: string,
  animation: AnimatedCommand,
): (context: CommandContext) => Promise<OutputObject[]> {
  return async (context: CommandContext) => {
    const controller = new AbortController()
    const animationId = `${name}-${Date.now()}`

    let currentOutput: OutputObject[] = []
    let isRunning = true

    const animationMarker = { type: 'animation', id: animationId }

    const animatedContext: AnimatedCommandContext = {
      ...context,
      updateOutput: (output: OutputObject[]) => {
        if (!controller.signal.aborted) {
          currentOutput = output
          context.setOutput((prev: OutputObject[]) => {
            const animationStartIndex = prev.findIndex(
              (item) => item.type === 'animation' && item.id === animationId,
            )

            if (animationStartIndex !== -1) {
              let animationEndIndex = prev.length
              for (let i = animationStartIndex + 1; i < prev.length; i++) {
                const item = prev[i]
                if (item && item.type === 'command') {
                  animationEndIndex = i
                  break
                }
              }

              return [
                ...prev.slice(0, animationStartIndex + 1),
                ...output,
                ...prev.slice(animationEndIndex),
              ]
            } else {
              return [...prev, animationMarker, ...output]
            }
          })
        }
      },
      isActive: () => !controller.signal.aborted && isRunning,
      cleanup: () => {
        isRunning = false
        animationRegistry.stop(animationId)
      },
    }

    animationRegistry.register(animationId, controller, () => {
      isRunning = false
      animation.stop?.()
    })

    animation.start(animatedContext)

    // If duration is specified, stop after that time
    if (animation.duration && animation.duration > 0) {
      setTimeout(() => {
        animationRegistry.stop(animationId)
      }, animation.duration)
    }

    return currentOutput
  }
}

/**
 * Utility for frame-based animations
 */
export function animateFrames(
  frames: (() => OutputObject[])[],
  frameDelay: number,
  context: AnimatedCommandContext,
) {
  let frameIndex = 0

  const animate = () => {
    if (!context.isActive()) return

    const frame = frames[frameIndex % frames.length]
    if (frame) {
      context.updateOutput(frame())
    }
    frameIndex++

    setTimeout(animate, frameDelay)
  }

  animate()
}

/**
 * Utility for continuous animations with a render function
 */
export function animateContinuous(
  render: (time: number) => OutputObject[],
  fps: number,
  context: AnimatedCommandContext,
) {
  const frameDelay = 1000 / fps
  const startTime = Date.now()

  const animate = () => {
    if (!context.isActive()) return

    const elapsed = Date.now() - startTime
    context.updateOutput(render(elapsed))

    setTimeout(animate, frameDelay)
  }

  animate()
}
