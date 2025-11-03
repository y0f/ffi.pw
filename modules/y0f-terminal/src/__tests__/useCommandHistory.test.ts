/**
 * Command History Hook Tests
 *
 * Tests for command history navigation functionality.
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCommandHistory, type CommandHistory } from '../hooks/useCommandHistory'

describe('useCommandHistory', () => {
  let hook: ReturnType<typeof renderHook<CommandHistory, number>>

  beforeEach(() => {
    hook = renderHook(() => useCommandHistory())
  })

  describe('addToHistory', () => {
    it('should add command to history', () => {
      act(() => {
        hook.result.current.addToHistory('help')
      })

      expect(hook.result.current.historyLength).toBe(1)
      expect(hook.result.current.getHistory()).toEqual(['help'])
    })

    it('should add multiple commands', () => {
      act(() => {
        hook.result.current.addToHistory('help')
        hook.result.current.addToHistory('clear')
        hook.result.current.addToHistory('whoami')
      })

      expect(hook.result.current.historyLength).toBe(3)
      expect(hook.result.current.getHistory()).toEqual(['help', 'clear', 'whoami'])
    })

    it('should not add empty commands', () => {
      act(() => {
        hook.result.current.addToHistory('')
        hook.result.current.addToHistory('   ')
      })

      expect(hook.result.current.historyLength).toBe(0)
    })

    it('should avoid duplicate consecutive entries', () => {
      act(() => {
        hook.result.current.addToHistory('help')
        hook.result.current.addToHistory('help')
        hook.result.current.addToHistory('clear')
        hook.result.current.addToHistory('help')
      })

      expect(hook.result.current.historyLength).toBe(3)
      expect(hook.result.current.getHistory()).toEqual(['help', 'clear', 'help'])
    })

    it('should respect max history limit', () => {
      const limitedHook = renderHook(() => useCommandHistory(3))

      act(() => {
        limitedHook.result.current.addToHistory('cmd1')
        limitedHook.result.current.addToHistory('cmd2')
        limitedHook.result.current.addToHistory('cmd3')
        limitedHook.result.current.addToHistory('cmd4')
      })

      expect(limitedHook.result.current.historyLength).toBe(3)
      expect(limitedHook.result.current.getHistory()).toEqual(['cmd2', 'cmd3', 'cmd4'])
    })
  })

  describe('navigateUp', () => {
    beforeEach(() => {
      act(() => {
        hook.result.current.addToHistory('help')
        hook.result.current.addToHistory('clear')
        hook.result.current.addToHistory('whoami')
      })
    })

    it('should navigate to most recent command', () => {
      let result: string | null = null
      act(() => {
        result = hook.result.current.navigateUp('')
      })

      expect(result).toBe('whoami')
    })

    it('should navigate through history backwards', () => {
      let result: string | null = null

      act(() => {
        result = hook.result.current.navigateUp('')
      })
      expect(result).toBe('whoami')

      act(() => {
        result = hook.result.current.navigateUp('whoami')
      })
      expect(result).toBe('clear')

      act(() => {
        result = hook.result.current.navigateUp('clear')
      })
      expect(result).toBe('help')
    })

    it('should not go beyond first command', () => {
      let result: string | null = null

      act(() => {
        result = hook.result.current.navigateUp('')
      })
      expect(result).toBe('whoami')

      act(() => {
        result = hook.result.current.navigateUp('whoami')
      })
      expect(result).toBe('clear')

      act(() => {
        result = hook.result.current.navigateUp('clear')
      })
      expect(result).toBe('help')

      act(() => {
        result = hook.result.current.navigateUp('help')
      })
      expect(result).toBe('help')
    })

    it('should return null when history is empty', () => {
      const emptyHook = renderHook(() => useCommandHistory())
      let result: string | null = null

      act(() => {
        result = emptyHook.result.current.navigateUp('')
      })

      expect(result).toBeNull()
    })

    it('should preserve current input when starting navigation', () => {
      let result: string | null = null

      act(() => {
        result = hook.result.current.navigateUp('test input')
      })
      expect(result).toBe('whoami')

      // Navigate back down to restore
      act(() => {
        result = hook.result.current.navigateDown('whoami')
        result = hook.result.current.navigateDown('clear')
        result = hook.result.current.navigateDown('help')
      })

      expect(result).toBe('test input')
    })
  })

  describe('navigateDown', () => {
    beforeEach(() => {
      act(() => {
        hook.result.current.addToHistory('help')
        hook.result.current.addToHistory('clear')
        hook.result.current.addToHistory('whoami')
      })
    })

    it('should navigate forward in history', () => {
      let result: string | null = null

      // Go up twice
      act(() => {
        hook.result.current.navigateUp('')
        hook.result.current.navigateUp('whoami')
      })

      act(() => {
        result = hook.result.current.navigateDown('clear')
      })

      expect(result).toBe('whoami')
    })

    it('should return null when at bottom of history', () => {
      let result: string | null = null

      act(() => {
        result = hook.result.current.navigateDown('')
      })

      expect(result).toBeNull()
    })

    it('should restore original input when going past bottom', () => {
      let result: string | null = null

      // Navigate up first
      act(() => {
        result = hook.result.current.navigateUp('original input')
      })
      expect(result).toBe('whoami')

      act(() => {
        result = hook.result.current.navigateDown('whoami')
      })

      expect(result).toBe('original input')
    })
  })

  describe('clearHistory', () => {
    it('should clear all history', () => {
      act(() => {
        hook.result.current.addToHistory('help')
        hook.result.current.addToHistory('clear')
      })

      expect(hook.result.current.historyLength).toBe(2)

      act(() => {
        hook.result.current.clearHistory()
      })

      expect(hook.result.current.historyLength).toBe(0)
      expect(hook.result.current.getHistory()).toEqual([])
    })

    it('should reset navigation state', () => {
      act(() => {
        hook.result.current.addToHistory('help')
        hook.result.current.navigateUp('')
        hook.result.current.clearHistory()
      })

      let result: string | null = null
      act(() => {
        result = hook.result.current.navigateUp('')
      })

      expect(result).toBeNull()
    })
  })

  describe('getHistory', () => {
    it('should return a copy of history array', () => {
      act(() => {
        hook.result.current.addToHistory('help')
      })

      const history1 = hook.result.current.getHistory()
      const history2 = hook.result.current.getHistory()

      expect(history1).toEqual(history2)
      expect(history1).not.toBe(history2)
    })
  })
})
