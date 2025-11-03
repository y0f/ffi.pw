/**
 * Terminal Command System Tests
 *
 * Tests all terminal commands for correctness and consistency.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import registry from '../commands/index'
import { clear } from '../commands/system/clear'
import { help } from '../commands/system/help'
import { whoami } from '../commands/system/whoami'
import { links } from '../commands/system/links'
import { trippy } from '../commands/effects/trippy'
import { sober } from '../commands/effects/sober'
import { crypto } from '../commands/info/crypto'
import { time } from '../commands/info/time'
import { services, webDev, mobileDev, security } from '../commands/services/index'
import { games, snake, sparrow } from '../commands/games/index'
import type { CommandContext, OutputObject } from '../core/Command'

describe('Terminal Command Registry', () => {
  it('should register all commands', () => {
    const allCommands = registry.getAll()
    expect(allCommands.length).toBeGreaterThan(0)
  })

  it('should have all expected commands', () => {
    const expectedCommands = [
      'clear',
      'help',
      'whoami',
      'links',
      'trippy',
      'sober',
      'crypto',
      'time',
      'services',
      'web-dev',
      'mobile-dev',
      'security',
      'games',
      'snake',
      'sparrow',
    ]

    expectedCommands.forEach((cmd) => {
      expect(registry.has(cmd)).toBe(true)
    })
  })

  it('should return false for non-existent commands', () => {
    expect(registry.has('nonexistent')).toBe(false)
    expect(registry.has('fake-command')).toBe(false)
  })

  it('should get commands by category', () => {
    const systemCommands = registry.getByCategory('system')
    expect(systemCommands.length).toBeGreaterThan(0)

    const gameCommands = registry.getByCategory('games')
    expect(gameCommands.length).toBeGreaterThan(0)
  })

  it('should get all command names', () => {
    const names = registry.getNames()
    expect(names).toContain('help')
    expect(names).toContain('clear')
    expect(names).toContain('crypto')
  })
})

describe('System Commands', () => {
  let context: CommandContext

  beforeEach(() => {
    context = {
      setOutput: vi.fn(),
      setActiveGame: vi.fn(),
      setIsTrippy: vi.fn(),
    } as unknown as CommandContext
  })

  describe('clear command', () => {
    it('should have correct metadata', () => {
      expect(clear.name).toBe('clear')
      expect(clear.category).toBe('system')
      expect(clear.description).toBeDefined()
    })

    it('should reset all state', async () => {
      const result = await clear.execute(context)

      expect(context.setOutput).toHaveBeenCalledWith([])
      expect(context.setActiveGame).toHaveBeenCalledWith(null)
      expect(context.setIsTrippy).toHaveBeenCalledWith(false)
      expect(result).toEqual([])
    })
  })

  describe('help command', () => {
    it('should have correct metadata', () => {
      expect(help.name).toBe('help')
      expect(help.category).toBe('system')
    })

    it('should return list of commands', async () => {
      const result = await help.execute(context)

      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
      expect(result[0]?.text).toContain('COMMANDS')
    })
  })

  describe('whoami command', () => {
    it('should have correct metadata', () => {
      expect(whoami.name).toBe('whoami')
      expect(whoami.category).toBe('system')
    })

    it('should return developer information', async () => {
      const result = await whoami.execute(context)

      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(5)

      const text = JSON.stringify(result)
      expect(text).toContain('DEVELOPER')
      expect(text).toContain('STACK')
    })
  })

  describe('links command', () => {
    it('should have correct metadata', () => {
      expect(links.name).toBe('links')
      expect(links.category).toBe('system')
    })

    it('should return links with URLs', async () => {
      const result = await links.execute(context)

      expect(Array.isArray(result)).toBe(true)

      const hasLink = result.some((line) => line.isLink === true)
      expect(hasLink).toBe(true)
    })
  })
})

describe('Effect Commands', () => {
  let context: CommandContext

  beforeEach(() => {
    context = {
      setOutput: vi.fn(),
      setActiveGame: vi.fn(),
      setIsTrippy: vi.fn(),
    } as unknown as CommandContext
  })

  describe('trippy command', () => {
    it('should have correct metadata', () => {
      expect(trippy.name).toBe('trippy')
      expect(trippy.category).toBe('effects')
    })

    it('should enable trippy mode', async () => {
      const result = await trippy.execute(context)

      expect(context.setIsTrippy).toHaveBeenCalledWith(true)
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
    })
  })

  describe('sober command', () => {
    it('should have correct metadata', () => {
      expect(sober.name).toBe('sober')
      expect(sober.category).toBe('effects')
    })

    it('should disable trippy mode', async () => {
      const result = await sober.execute(context)

      expect(context.setIsTrippy).toHaveBeenCalledWith(false)
      expect(Array.isArray(result)).toBe(true)
    })
  })
})

describe('Info Commands', () => {
  let context: CommandContext

  beforeEach(() => {
    context = {
      setOutput: vi.fn(),
      setActiveGame: vi.fn(),
      setIsTrippy: vi.fn(),
    } as unknown as CommandContext
  })

  describe('time command', () => {
    it('should have correct metadata', () => {
      expect(time.name).toBe('time')
      expect(time.category).toBe('info')
    })

    it('should return time information', async () => {
      const result = await time.execute(context)

      expect(Array.isArray(result)).toBe(true)

      const text = JSON.stringify(result)
      expect(text).toContain('TIME')
      expect(text).toContain(':')
    })
  })

  describe('crypto command', () => {
    it('should have correct metadata', () => {
      expect(crypto.name).toBe('crypto')
      expect(crypto.category).toBe('info')
    })

    it('should handle no cached data gracefully', async () => {
      localStorage.clear()

      const result = await crypto.execute(context)

      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
    })
  })
})

describe('Service Commands', () => {
  let context: CommandContext

  beforeEach(() => {
    context = {
      setOutput: vi.fn(),
      setActiveGame: vi.fn(),
      setIsTrippy: vi.fn(),
    } as unknown as CommandContext
  })

  describe('services command', () => {
    it('should have correct metadata', () => {
      expect(services.name).toBe('services')
      expect(services.category).toBe('services')
    })

    it('should list available services', async () => {
      const result = await services.execute(context)

      expect(Array.isArray(result)).toBe(true)

      const text = JSON.stringify(result)
      expect(text).toContain('web-dev')
      expect(text).toContain('mobile-dev')
      expect(text).toContain('security')
    })
  })

  describe('web-dev command', () => {
    it('should return web development information', async () => {
      const result = await webDev.execute(context)

      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(5)

      const text = JSON.stringify(result)
      expect(text).toContain('WEB')
    })
  })

  describe('mobile-dev command', () => {
    it('should return mobile development information', async () => {
      const result = await mobileDev.execute(context)

      expect(Array.isArray(result)).toBe(true)

      const text = JSON.stringify(result)
      expect(text).toContain('MOBILE')
    })
  })

  describe('security command', () => {
    it('should return security services information', async () => {
      const result = await security.execute(context)

      expect(Array.isArray(result)).toBe(true)

      const text = JSON.stringify(result)
      expect(text).toContain('SECURITY')
    })
  })
})

describe('Game Commands', () => {
  let context: CommandContext

  beforeEach(() => {
    context = {
      setOutput: vi.fn(),
      setActiveGame: vi.fn(),
      setIsTrippy: vi.fn(),
    } as unknown as CommandContext
  })

  describe('games command', () => {
    it('should have correct metadata', () => {
      expect(games.name).toBe('games')
      expect(games.category).toBe('games')
    })

    it('should list available games', async () => {
      const result = await games.execute(context)

      expect(Array.isArray(result)).toBe(true)

      const text = JSON.stringify(result)
      expect(text).toContain('snake')
      expect(text).toContain('sparrow')
    })
  })

  describe('snake command', () => {
    it('should have correct metadata', () => {
      expect(snake.name).toBe('snake')
      expect(snake.category).toBe('games')
    })

    it('should activate snake game', async () => {
      const result = await snake.execute(context)

      expect(context.setActiveGame).toHaveBeenCalledWith('snake')
      expect(Array.isArray(result)).toBe(true)
    })
  })

  describe('sparrow command', () => {
    it('should activate sparrow game', async () => {
      const result = await sparrow.execute(context)

      expect(context.setActiveGame).toHaveBeenCalledWith('sparrow')
      expect(Array.isArray(result)).toBe(true)
    })
  })
})

describe('Command Output Format', () => {
  let context: CommandContext

  beforeEach(() => {
    context = {
      setOutput: vi.fn(),
      setActiveGame: vi.fn(),
      setIsTrippy: vi.fn(),
      parsed: {
        command: '',
        args: [],
        flags: [],
        options: {},
        raw: '',
      },
    } as unknown as CommandContext
  })

  it('all commands should return arrays', async () => {
    const commands = registry.getAll()

    for (const cmd of commands) {
      const result = await cmd.execute(context)
      expect(Array.isArray(result)).toBe(true)
    }
  })

  it('output objects should have valid structure', async () => {
    const result = await help.execute(context)

    result.forEach((line: OutputObject) => {
      // Each line should have text or parts
      const hasText = typeof line.text === 'string'
      const hasParts = Array.isArray(line.parts)

      expect(hasText || hasParts).toBe(true)

      // If it has parts, each part should have text and color
      if (hasParts) {
        line.parts?.forEach((part) => {
          expect(typeof part.text).toBe('string')
          expect(typeof part.color).toBe('string')
        })
      }

      // If it has color, should be a valid Tailwind class
      if (line.color) {
        expect(typeof line.color).toBe('string')
        expect(line.color.length).toBeGreaterThan(0)
      }
    })
  })

  it('link outputs should have required fields', async () => {
    const result = await links.execute(context)

    const linkLines = result.filter((line) => line.isLink === true)

    linkLines.forEach((link) => {
      expect(typeof link.text).toBe('string')
      expect(typeof link.url).toBe('string')
      expect(link.url?.startsWith('http')).toBe(true)
    })
  })
})

describe('Command Execution via Registry', () => {
  let context: CommandContext

  beforeEach(() => {
    context = {
      setOutput: vi.fn(),
      setActiveGame: vi.fn(),
      setIsTrippy: vi.fn(),
      parsed: {
        command: '',
        args: [],
        flags: [],
        options: {},
        raw: '',
      },
    } as unknown as CommandContext
  })

  it('should execute command by name', async () => {
    const result = await registry.execute('help', context)

    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThan(0)
  })

  it('should throw error for non-existent command', async () => {
    await expect(registry.execute('nonexistent', context)).rejects.toThrow()
  })

  it('should execute all commands without errors', async () => {
    const commands = registry.getNames()

    for (const cmdName of commands) {
      const result = await registry.execute(cmdName, context)
      expect(Array.isArray(result)).toBe(true)
    }
  })
})
