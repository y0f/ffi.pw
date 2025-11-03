/**
 * Command Aliases Tests
 *
 * Tests for command alias functionality in CommandRegistry.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { CommandRegistry } from '../core/CommandRegistry'
import { createCommand, CommandCategory } from '../core/Command'
import type { CommandContext } from '../core/Command'

describe('Command Aliases', () => {
  let registry: CommandRegistry

  beforeEach(() => {
    registry = new CommandRegistry()
  })

  afterEach(() => {
    registry.clear()
  })

  describe('createCommand with aliases', () => {
    it('should create command with aliases', () => {
      const cmd = createCommand({
        name: 'list',
        description: 'List items',
        category: CommandCategory.SYSTEM,
        aliases: ['ls', 'dir'],
        execute: async () => [],
      })

      expect(cmd.aliases).toEqual(['ls', 'dir'])
    })

    it('should normalize alias case', () => {
      const cmd = createCommand({
        name: 'list',
        description: 'List items',
        category: CommandCategory.SYSTEM,
        aliases: ['LS', 'Dir'],
        execute: async () => [],
      })

      expect(cmd.aliases).toEqual(['ls', 'dir'])
    })

    it('should filter out duplicate aliases that match command name', () => {
      const cmd = createCommand({
        name: 'list',
        description: 'List items',
        category: CommandCategory.SYSTEM,
        aliases: ['list', 'LIST', 'ls'],
        execute: async () => [],
      })

      expect(cmd.aliases).toEqual(['ls'])
    })

    it('should handle empty aliases array', () => {
      const cmd = createCommand({
        name: 'list',
        description: 'List items',
        category: CommandCategory.SYSTEM,
        aliases: [],
        execute: async () => [],
      })

      expect(cmd.aliases).toEqual([])
    })

    it('should handle undefined aliases', () => {
      const cmd = createCommand({
        name: 'list',
        description: 'List items',
        category: CommandCategory.SYSTEM,
        execute: async () => [],
      })

      expect(cmd.aliases).toEqual([])
    })
  })

  describe('CommandRegistry with aliases', () => {
    it('should register command with aliases', () => {
      const cmd = createCommand({
        name: 'list',
        description: 'List items',
        category: CommandCategory.SYSTEM,
        aliases: ['ls', 'dir'],
        execute: async () => [],
      })

      registry.register(cmd)

      expect(registry.has('list')).toBe(true)
      expect(registry.has('ls')).toBe(true)
      expect(registry.has('dir')).toBe(true)
    })

    it('should retrieve command by primary name', () => {
      const cmd = createCommand({
        name: 'list',
        description: 'List items',
        category: CommandCategory.SYSTEM,
        aliases: ['ls'],
        execute: async () => [],
      })

      registry.register(cmd)

      const retrieved = registry.get('list')
      expect(retrieved).toBe(cmd)
    })

    it('should retrieve command by alias', () => {
      const cmd = createCommand({
        name: 'list',
        description: 'List items',
        category: CommandCategory.SYSTEM,
        aliases: ['ls', 'dir'],
        execute: async () => [],
      })

      registry.register(cmd)

      const retrievedByLs = registry.get('ls')
      const retrievedByDir = registry.get('dir')

      expect(retrievedByLs).toBe(cmd)
      expect(retrievedByDir).toBe(cmd)
    })

    it('should resolve alias to command name', () => {
      const cmd = createCommand({
        name: 'list',
        description: 'List items',
        category: CommandCategory.SYSTEM,
        aliases: ['ls'],
        execute: async () => [],
      })

      registry.register(cmd)

      expect(registry.resolveAlias('ls')).toBe('list')
      expect(registry.resolveAlias('list')).toBeNull()
      expect(registry.resolveAlias('unknown')).toBeNull()
    })

    it('should throw error for duplicate aliases', () => {
      const cmd1 = createCommand({
        name: 'list',
        description: 'List items',
        category: CommandCategory.SYSTEM,
        aliases: ['ls'],
        execute: async () => [],
      })

      const cmd2 = createCommand({
        name: 'directory',
        description: 'Show directory',
        category: CommandCategory.SYSTEM,
        aliases: ['ls'],
        execute: async () => [],
      })

      registry.register(cmd1)

      expect(() => registry.register(cmd2)).toThrow("Alias 'ls' is already registered")
    })

    it('should execute command via alias', async () => {
      let executed = false

      const cmd = createCommand({
        name: 'test',
        description: 'Test command',
        category: CommandCategory.SYSTEM,
        aliases: ['t'],
        execute: async () => {
          executed = true
          return [{ text: 'executed' }]
        },
      })

      registry.register(cmd)

      const context = {} as CommandContext

      await registry.execute('t', context)

      expect(executed).toBe(true)
    })

    it('should include aliases in getAllNames', () => {
      const cmd = createCommand({
        name: 'list',
        description: 'List items',
        category: CommandCategory.SYSTEM,
        aliases: ['ls', 'dir'],
        execute: async () => [],
      })

      registry.register(cmd)

      const allNames = registry.getAllNames()

      expect(allNames).toContain('list')
      expect(allNames).toContain('ls')
      expect(allNames).toContain('dir')
    })

    it('should not include aliases in getNames', () => {
      const cmd = createCommand({
        name: 'list',
        description: 'List items',
        category: CommandCategory.SYSTEM,
        aliases: ['ls', 'dir'],
        execute: async () => [],
      })

      registry.register(cmd)

      const names = registry.getNames()

      expect(names).toContain('list')
      expect(names).not.toContain('ls')
      expect(names).not.toContain('dir')
    })

    it('should clear aliases when registry is cleared', () => {
      const cmd = createCommand({
        name: 'list',
        description: 'List items',
        category: CommandCategory.SYSTEM,
        aliases: ['ls'],
        execute: async () => [],
      })

      registry.register(cmd)
      expect(registry.has('ls')).toBe(true)

      registry.clear()

      expect(registry.has('list')).toBe(false)
      expect(registry.has('ls')).toBe(false)
    })

    it('should handle case-insensitive alias lookup', () => {
      const cmd = createCommand({
        name: 'list',
        description: 'List items',
        category: CommandCategory.SYSTEM,
        aliases: ['ls'],
        execute: async () => [],
      })

      registry.register(cmd)

      expect(registry.has('LS')).toBe(true)
      expect(registry.has('Ls')).toBe(true)
      expect(registry.get('LS')).toBe(cmd)
    })

    it('should handle multiple commands with different aliases', () => {
      const list = createCommand({
        name: 'list',
        description: 'List items',
        category: CommandCategory.SYSTEM,
        aliases: ['ls'],
        execute: async () => [],
      })

      const remove = createCommand({
        name: 'remove',
        description: 'Remove item',
        category: CommandCategory.SYSTEM,
        aliases: ['rm', 'del'],
        execute: async () => [],
      })

      registry.register(list)
      registry.register(remove)

      expect(registry.get('ls')).toBe(list)
      expect(registry.get('rm')).toBe(remove)
      expect(registry.get('del')).toBe(remove)
    })
  })
})
