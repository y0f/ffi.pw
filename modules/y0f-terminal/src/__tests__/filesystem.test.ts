/**
 * @fileoverview Tests for filesystem commands
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { VirtualFileSystem, resetFileSystem, getFileSystem } from '../core/VirtualFileSystem'
import { ls } from '../commands/filesystem/ls'
import { cd } from '../commands/filesystem/cd'
import { cat } from '../commands/filesystem/cat'
import { pwd } from '../commands/filesystem/pwd'
import { parseCommandInput } from '../core/ArgumentParser'

describe('VirtualFileSystem', () => {
  let fs: VirtualFileSystem

  beforeEach(() => {
    resetFileSystem()
    fs = getFileSystem()
  })

  it('should start in /home/user directory', () => {
    expect(fs.getCurrentPath()).toBe('/home/user')
  })

  it('should resolve absolute paths', () => {
    expect(fs.resolvePath('/etc')).toBe('/etc')
    expect(fs.resolvePath('/home/user')).toBe('/home/user')
  })

  it('should resolve relative paths', () => {
    fs.setCurrentPath('/home/user')
    expect(fs.resolvePath('.')).toBe('/home/user')
    expect(fs.resolvePath('..')).toBe('/home')
    expect(fs.resolvePath('../..')).toBe('/')
  })

  it('should resolve ~ to home directory', () => {
    expect(fs.resolvePath('~')).toBe('/home/user')
    expect(fs.resolvePath('~/test')).toBe('/home/user/test')
  })

  it('should check if paths exist', () => {
    expect(fs.exists('/home')).toBe(true)
    expect(fs.exists('/home/user')).toBe(true)
    expect(fs.exists('/nonexistent')).toBe(false)
  })

  it('should identify directories', () => {
    expect(fs.isDirectory('/home')).toBe(true)
    expect(fs.isDirectory('/home/user/README.md')).toBe(false)
  })

  it('should identify files', () => {
    expect(fs.isFile('/home/user/README.md')).toBe(true)
    expect(fs.isFile('/home')).toBe(false)
  })

  it('should list directory contents', () => {
    const files = fs.listDirectory('/home/user')
    expect(files).not.toBeNull()
    expect(files?.length).toBeGreaterThan(0)
    expect(files?.some((f) => f.name === 'README.md')).toBe(true)
  })

  it('should read file contents', () => {
    const content = fs.readFile('/home/user/README.md')
    expect(content).not.toBeNull()
    expect(content).toContain('Welcome')
  })

  it('should return null for non-existent files', () => {
    const content = fs.readFile('/nonexistent.txt')
    expect(content).toBeNull()
  })
})

describe('pwd command', () => {
  beforeEach(() => {
    resetFileSystem()
  })

  it('should return current directory', async () => {
    const context: any = { parsed: parseCommandInput('pwd') }
    const result = await pwd.execute(context)

    expect(result.length).toBeGreaterThan(0)
    expect(result[0]?.text).toContain('/home/user')
  })
})

describe('cd command', () => {
  beforeEach(() => {
    resetFileSystem()
  })

  it('should change to absolute path', async () => {
    const fs = getFileSystem()
    const context: any = { parsed: parseCommandInput('cd /etc') }
    await cd.execute(context)

    expect(fs.getCurrentPath()).toBe('/etc')
  })

  it('should change to home with no args', async () => {
    const fs = getFileSystem()
    fs.setCurrentPath('/etc')
    const context: any = { parsed: parseCommandInput('cd') }
    await cd.execute(context)

    expect(fs.getCurrentPath()).toBe('/home/user')
  })

  it('should change to parent directory', async () => {
    const fs = getFileSystem()
    const context: any = { parsed: parseCommandInput('cd ..') }
    await cd.execute(context)

    expect(fs.getCurrentPath()).toBe('/home')
  })

  it('should return error for non-existent directory', async () => {
    const context: any = { parsed: parseCommandInput('cd /nonexistent') }
    const result = await cd.execute(context)

    expect(result[0]?.text).toContain('No such file or directory')
  })

  it('should return error when trying to cd to a file', async () => {
    const context: any = { parsed: parseCommandInput('cd /home/user/README.md') }
    const result = await cd.execute(context)

    expect(result[0]?.text).toContain('Not a directory')
  })
})

describe('ls command', () => {
  beforeEach(() => {
    resetFileSystem()
  })

  it('should list current directory', async () => {
    const context: any = { parsed: parseCommandInput('ls') }
    const result = await ls.execute(context)

    expect(result.length).toBeGreaterThan(0)
  })

  it('should list specified directory', async () => {
    const context: any = { parsed: parseCommandInput('ls /etc') }
    const result = await ls.execute(context)

    expect(result.length).toBeGreaterThan(0)
  })

  it('should return error for non-existent directory', async () => {
    const context: any = { parsed: parseCommandInput('ls /nonexistent') }
    const result = await ls.execute(context)

    expect(result[0]?.text).toContain('cannot access')
  })
})

describe('cat command', () => {
  beforeEach(() => {
    resetFileSystem()
  })

  it('should display file contents', async () => {
    const context: any = { parsed: parseCommandInput('cat README.md') }
    const result = await cat.execute(context)

    expect(result.length).toBeGreaterThan(0)
    expect(result.some((line: any) => line.text?.includes('Welcome'))).toBe(true)
  })

  it('should display file with absolute path', async () => {
    const context: any = { parsed: parseCommandInput('cat /home/user/secrets.txt') }
    const result = await cat.execute(context)

    expect(result.length).toBeGreaterThan(0)
    expect(result.some((line: any) => line.text?.includes('owl'))).toBe(true)
  })

  it('should return error for non-existent file', async () => {
    const context: any = { parsed: parseCommandInput('cat nonexistent.txt') }
    const result = await cat.execute(context)

    expect(result[0]?.text).toContain('No such file or directory')
  })

  it('should return error for directory', async () => {
    const context: any = { parsed: parseCommandInput('cat /home') }
    const result = await cat.execute(context)

    expect(result[0]?.text).toContain('Is a directory')
  })

  it('should show line numbers with -n flag', async () => {
    const context: any = { parsed: parseCommandInput('cat -n README.md') }
    const result = await cat.execute(context)

    expect(result.length).toBeGreaterThan(0)
    // Line numbers should be present
    expect(result[0]?.text).toMatch(/^\s+\d+/)
  })
})
