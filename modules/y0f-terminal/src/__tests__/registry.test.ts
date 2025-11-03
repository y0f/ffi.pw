/**
 * CommandRegistry Tests
 *
 * Tests the command registry core functionality.
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { CommandRegistry } from '../core/CommandRegistry'
import { createCommand, CommandCategory } from '../core/Command'
import type { CommandContext } from '../core/Command'

describe('CommandRegistry', () => {
  let registry: CommandRegistry

  beforeEach(() => {
    registry = new CommandRegistry()
  })

  describe('register', () => {
    it('should register a command', () => {
      const cmd = createCommand({
        name: 'test',
        description: 'Test command',
        category: CommandCategory.SYSTEM,
        execute: async () => [],
      })

      registry.register(cmd)

      expect(registry.has('test')).toBe(true)
    })

    it('should normalize command names to lowercase', () => {
      const cmd = createCommand({
        name: 'TestCommand',
        description: 'Test',
        category: CommandCategory.SYSTEM,
        execute: async () => [],
      })

      registry.register(cmd)

      expect(registry.has('testcommand')).toBe(true)
      expect(registry.has('TestCommand')).toBe(true)
    })

    it('should allow method chaining', () => {
      const cmd1 = createCommand({
        name: 'cmd1',
        description: 'Test',
        category: CommandCategory.SYSTEM,
        execute: async () => [],
      })

      const cmd2 = createCommand({
        name: 'cmd2',
        description: 'Test',
        category: CommandCategory.SYSTEM,
        execute: async () => [],
      })

      const result = registry.register(cmd1).register(cmd2)

      expect(result).toBe(registry)
      expect(registry.has('cmd1')).toBe(true)
      expect(registry.has('cmd2')).toBe(true)
    })
  })

  describe('registerMany', () => {
    it('should register multiple commands', () => {
      const commands = [
        createCommand({
          name: 'cmd1',
          description: 'Test 1',
          category: CommandCategory.SYSTEM,
          execute: async () => [],
        }),
        createCommand({
          name: 'cmd2',
          description: 'Test 2',
          category: CommandCategory.INFO,
          execute: async () => [],
        }),
      ]

      registry.registerMany(commands)

      expect(registry.has('cmd1')).toBe(true)
      expect(registry.has('cmd2')).toBe(true)
    })
  })

  describe('get', () => {
    it('should retrieve a registered command', () => {
      const cmd = createCommand({
        name: 'test',
        description: 'Test',
        category: CommandCategory.SYSTEM,
        execute: async () => [],
      })

      registry.register(cmd)

      const retrieved = registry.get('test')
      expect(retrieved).toBe(cmd)
    })

    it('should return undefined for non-existent command', () => {
      const result = registry.get('nonexistent')
      expect(result).toBeUndefined()
    })

    it('should be case-insensitive', () => {
      const cmd = createCommand({
        name: 'test',
        description: 'Test',
        category: CommandCategory.SYSTEM,
        execute: async () => [],
      })

      registry.register(cmd)

      expect(registry.get('TEST')).toBe(cmd)
      expect(registry.get('Test')).toBe(cmd)
      expect(registry.get('test')).toBe(cmd)
    })
  })

  describe('has', () => {
    it('should return true for registered commands', () => {
      const cmd = createCommand({
        name: 'test',
        description: 'Test',
        category: CommandCategory.SYSTEM,
        execute: async () => [],
      })

      registry.register(cmd)

      expect(registry.has('test')).toBe(true)
    })

    it('should return false for non-existent commands', () => {
      expect(registry.has('nonexistent')).toBe(false)
    })

    it('should be case-insensitive', () => {
      const cmd = createCommand({
        name: 'test',
        description: 'Test',
        category: CommandCategory.SYSTEM,
        execute: async () => [],
      })

      registry.register(cmd)

      expect(registry.has('TEST')).toBe(true)
      expect(registry.has('Test')).toBe(true)
    })
  })

  describe('getAll', () => {
    it('should return all registered commands', () => {
      const cmd1 = createCommand({
        name: 'cmd1',
        description: 'Test',
        category: CommandCategory.SYSTEM,
        execute: async () => [],
      })

      const cmd2 = createCommand({
        name: 'cmd2',
        description: 'Test',
        category: CommandCategory.INFO,
        execute: async () => [],
      })

      registry.register(cmd1).register(cmd2)

      const all = registry.getAll()
      expect(all.length).toBe(2)
      expect(all).toContain(cmd1)
      expect(all).toContain(cmd2)
    })

    it('should return empty array when no commands registered', () => {
      const all = registry.getAll()
      expect(all).toEqual([])
    })
  })

  describe('getByCategory', () => {
    it('should return commands from specified category', () => {
      const systemCmd = createCommand({
        name: 'sys',
        description: 'Test',
        category: CommandCategory.SYSTEM,
        execute: async () => [],
      })

      const infoCmd = createCommand({
        name: 'info',
        description: 'Test',
        category: CommandCategory.INFO,
        execute: async () => [],
      })

      registry.register(systemCmd).register(infoCmd)

      const systemCommands = registry.getByCategory(CommandCategory.SYSTEM)
      expect(systemCommands.length).toBe(1)
      expect(systemCommands[0]).toBe(systemCmd)
    })

    it('should return empty array for non-existent category', () => {
      const result = registry.getByCategory('nonexistent' as any)
      expect(result).toEqual([])
    })
  })

  describe('getCategories', () => {
    it('should return all unique categories', () => {
      registry.register(
        createCommand({
          name: 'cmd1',
          description: 'Test',
          category: CommandCategory.SYSTEM,
          execute: async () => [],
        }),
      )

      registry.register(
        createCommand({
          name: 'cmd2',
          description: 'Test',
          category: CommandCategory.INFO,
          execute: async () => [],
        }),
      )

      const categories = registry.getCategories()
      expect(categories).toContain(CommandCategory.SYSTEM)
      expect(categories).toContain(CommandCategory.INFO)
    })
  })

  describe('getNames', () => {
    it('should return all command names', () => {
      registry.register(
        createCommand({
          name: 'cmd1',
          description: 'Test',
          category: CommandCategory.SYSTEM,
          execute: async () => [],
        }),
      )

      registry.register(
        createCommand({
          name: 'cmd2',
          description: 'Test',
          category: CommandCategory.INFO,
          execute: async () => [],
        }),
      )

      const names = registry.getNames()
      expect(names).toContain('cmd1')
      expect(names).toContain('cmd2')
    })
  })

  describe('execute', () => {
    it('should execute a command and return result', async () => {
      const cmd = createCommand({
        name: 'test',
        description: 'Test',
        category: CommandCategory.SYSTEM,
        execute: async () => [{ text: 'result' }],
      })

      registry.register(cmd)

      const context = {} as CommandContext
      const result = await registry.execute('test', context)

      expect(result).toEqual([{ text: 'result' }])
    })

    it('should pass context to command', async () => {
      let receivedContext: CommandContext | undefined

      const cmd = createCommand({
        name: 'test',
        description: 'Test',
        category: CommandCategory.SYSTEM,
        execute: async (ctx) => {
          receivedContext = ctx
          return []
        },
      })

      registry.register(cmd)

      const context = { foo: 'bar' } as unknown as CommandContext
      await registry.execute('test', context)

      expect(receivedContext).toBe(context)
    })

    it('should throw error for non-existent command', async () => {
      const context = {} as CommandContext
      await expect(registry.execute('nonexistent', context)).rejects.toThrow('Command not found')
    })
  })

  describe('clear', () => {
    it('should remove all commands', () => {
      registry.register(
        createCommand({
          name: 'cmd1',
          description: 'Test',
          category: CommandCategory.SYSTEM,
          execute: async () => [],
        }),
      )

      registry.clear()

      expect(registry.getAll().length).toBe(0)
      expect(registry.has('cmd1')).toBe(false)
    })

    it('should allow method chaining', () => {
      const result = registry.clear()
      expect(result).toBe(registry)
    })
  })
})
