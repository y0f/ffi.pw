/**
 * @fileoverview Tests for advanced filesystem commands (mkdir, touch, rm)
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { mkdir } from '../commands/filesystem/mkdir'
import { touch } from '../commands/filesystem/touch'
import { rm } from '../commands/filesystem/rm'
import { ls } from '../commands/filesystem/ls'
import { cat } from '../commands/filesystem/cat'
import type { CommandContext, OutputObject } from '../core/Command'
import { parseCommandInput } from '../core/ArgumentParser'
import { resetFileSystem } from '../core/VirtualFileSystem'

function createContext(input: string): CommandContext {
  return {
    input,
    parsed: parseCommandInput(input),
  }
}

describe('mkdir command', () => {
  beforeEach(() => {
    resetFileSystem()
  })

  it('should create a new directory', async () => {
    const context = createContext('mkdir testdir')
    const result = (await mkdir.execute(context)) as OutputObject[]

    expect(result).toEqual([])

    const lsResult = (await ls.execute(createContext('ls /home/user'))) as OutputObject[]
    const output = JSON.stringify(lsResult)
    expect(output).toContain('testdir')
  })

  it('should create multiple directories', async () => {
    const context = createContext('mkdir dir1 dir2 dir3')
    const result = (await mkdir.execute(context)) as OutputObject[]

    expect(result).toEqual([])

    const lsResult = (await ls.execute(createContext('ls /home/user'))) as OutputObject[]
    const output = JSON.stringify(lsResult)
    expect(output).toContain('dir1')
    expect(output).toContain('dir2')
    expect(output).toContain('dir3')
  })

  it('should create nested directories with -p flag', async () => {
    const context = createContext('mkdir -p foo/bar/baz')
    const result = (await mkdir.execute(context)) as OutputObject[]

    expect(result).toEqual([])

    const lsResult = (await ls.execute(createContext('ls /home/user/foo/bar'))) as OutputObject[]
    const output = JSON.stringify(lsResult)
    expect(output).toContain('baz')
  })

  it('should fail to create nested directories without -p flag', async () => {
    const context = createContext('mkdir nested/deep/path')
    const result = (await mkdir.execute(context)) as OutputObject[]

    expect(result.length).toBeGreaterThan(0)
    const output = JSON.stringify(result)
    expect(output).toContain('No such file or directory')
  })

  it('should show error when directory already exists', async () => {
    await mkdir.execute(createContext('mkdir testdir'))
    const result = (await mkdir.execute(createContext('mkdir testdir'))) as OutputObject[]

    expect(result.length).toBeGreaterThan(0)
    const output = JSON.stringify(result)
    expect(output).toContain('File exists')
  })

  it('should show error for missing operand', async () => {
    const context = createContext('mkdir')
    const result = (await mkdir.execute(context)) as OutputObject[]

    expect(result.length).toBeGreaterThan(0)
    const output = JSON.stringify(result)
    expect(output).toContain('missing operand')
  })
})

describe('touch command', () => {
  beforeEach(() => {
    resetFileSystem()
  })

  it('should create a new empty file', async () => {
    const context = createContext('touch newfile.txt')
    const result = (await touch.execute(context)) as OutputObject[]

    expect(result).toEqual([])

    const lsResult = (await ls.execute(createContext('ls /home/user'))) as OutputObject[]
    const output = JSON.stringify(lsResult)
    expect(output).toContain('newfile.txt')

    const catResult = (await cat.execute(createContext('cat newfile.txt'))) as OutputObject[]
    expect(catResult.length).toBe(1)
    expect(catResult[0]?.text).toBe('')
  })

  it('should create multiple files', async () => {
    const context = createContext('touch file1.txt file2.txt file3.txt')
    const result = (await touch.execute(context)) as OutputObject[]

    expect(result).toEqual([])

    const lsResult = (await ls.execute(createContext('ls /home/user'))) as OutputObject[]
    const output = JSON.stringify(lsResult)
    expect(output).toContain('file1.txt')
    expect(output).toContain('file2.txt')
    expect(output).toContain('file3.txt')
  })

  it('should update timestamp for existing file', async () => {
    await touch.execute(createContext('touch existingfile.txt'))

    // Touch again - should not fail
    const result = (await touch.execute(createContext('touch existingfile.txt'))) as OutputObject[]
    expect(result).toEqual([])
  })

  it('should show error when touching a directory', async () => {
    await mkdir.execute(createContext('mkdir testdir'))
    const result = (await touch.execute(createContext('touch testdir'))) as OutputObject[]

    expect(result.length).toBeGreaterThan(0)
    const output = JSON.stringify(result)
    expect(output).toContain('Is a directory')
  })

  it('should show error for missing operand', async () => {
    const context = createContext('touch')
    const result = (await touch.execute(context)) as OutputObject[]

    expect(result.length).toBeGreaterThan(0)
    const output = JSON.stringify(result)
    expect(output).toContain('missing file operand')
  })

  it('should fail when parent directory does not exist', async () => {
    const context = createContext('touch nonexistent/file.txt')
    const result = (await touch.execute(context)) as OutputObject[]

    expect(result.length).toBeGreaterThan(0)
    const output = JSON.stringify(result)
    expect(output).toContain('No such file or directory')
  })
})

describe('rm command', () => {
  beforeEach(() => {
    resetFileSystem()
  })

  it('should remove a file', async () => {
    await touch.execute(createContext('touch testfile.txt'))
    const result = (await rm.execute(createContext('rm testfile.txt'))) as OutputObject[]

    expect(result).toEqual([])

    const lsResult = (await ls.execute(createContext('ls /home/user'))) as OutputObject[]
    const output = JSON.stringify(lsResult)
    expect(output).not.toContain('testfile.txt')
  })

  it('should remove multiple files', async () => {
    await touch.execute(createContext('touch file1.txt file2.txt file3.txt'))
    const result = (await rm.execute(
      createContext('rm file1.txt file2.txt file3.txt'),
    )) as OutputObject[]

    expect(result).toEqual([])

    const lsResult = (await ls.execute(createContext('ls /home/user'))) as OutputObject[]
    const output = JSON.stringify(lsResult)
    expect(output).not.toContain('file1.txt')
    expect(output).not.toContain('file2.txt')
    expect(output).not.toContain('file3.txt')
  })

  it('should fail to remove directory without -r flag', async () => {
    await mkdir.execute(createContext('mkdir testdir'))
    const result = (await rm.execute(createContext('rm testdir'))) as OutputObject[]

    expect(result.length).toBeGreaterThan(0)
    const output = JSON.stringify(result)
    expect(output).toContain('Is a directory')
  })

  it('should remove empty directory with -r flag', async () => {
    await mkdir.execute(createContext('mkdir testdir'))
    const result = (await rm.execute(createContext('rm -r testdir'))) as OutputObject[]

    expect(result).toEqual([])

    const lsResult = (await ls.execute(createContext('ls /home/user'))) as OutputObject[]
    const output = JSON.stringify(lsResult)
    expect(output).not.toContain('testdir')
  })

  it('should remove directory with contents recursively', async () => {
    await mkdir.execute(createContext('mkdir -p testdir/subdir'))
    await touch.execute(createContext('touch testdir/file.txt'))
    await touch.execute(createContext('touch testdir/subdir/nested.txt'))

    const result = (await rm.execute(createContext('rm -r testdir'))) as OutputObject[]
    expect(result).toEqual([])

    const lsResult = (await ls.execute(createContext('ls /home/user'))) as OutputObject[]
    const output = JSON.stringify(lsResult)
    expect(output).not.toContain('testdir')
  })

  it('should show error when file does not exist', async () => {
    const result = (await rm.execute(createContext('rm nonexistent.txt'))) as OutputObject[]

    expect(result.length).toBeGreaterThan(0)
    const output = JSON.stringify(result)
    expect(output).toContain('No such file or directory')
  })

  it('should show error for missing operand', async () => {
    const context = createContext('rm')
    const result = (await rm.execute(context)) as OutputObject[]

    expect(result.length).toBeGreaterThan(0)
    const output = JSON.stringify(result)
    expect(output).toContain('missing operand')
  })

  it('should work with --recursive flag', async () => {
    await mkdir.execute(createContext('mkdir testdir'))
    const result = (await rm.execute(createContext('rm --recursive testdir'))) as OutputObject[]

    expect(result).toEqual([])
  })

  it('should work with del alias', async () => {
    await touch.execute(createContext('touch testfile.txt'))
    const result = (await rm.execute(createContext('del testfile.txt'))) as OutputObject[]

    expect(result).toEqual([])
  })
})

describe('filesystem integration', () => {
  beforeEach(() => {
    resetFileSystem()
  })

  it('should create directory, create file inside, and remove both', async () => {
    await mkdir.execute(createContext('mkdir myproject'))

    await touch.execute(createContext('touch myproject/index.html'))
    await touch.execute(createContext('touch myproject/style.css'))

    const lsResult = (await ls.execute(createContext('ls myproject'))) as OutputObject[]
    let output = JSON.stringify(lsResult)
    expect(output).toContain('index.html')
    expect(output).toContain('style.css')

    await rm.execute(createContext('rm -r myproject'))

    const lsResult2 = (await ls.execute(createContext('ls /home/user'))) as OutputObject[]
    output = JSON.stringify(lsResult2)
    expect(output).not.toContain('myproject')
  })

  it('should create nested structure and navigate', async () => {
    await mkdir.execute(createContext('mkdir -p project/src/components'))
    await mkdir.execute(createContext('mkdir -p project/public'))

    await touch.execute(createContext('touch project/README.md'))
    await touch.execute(createContext('touch project/src/index.js'))
    await touch.execute(createContext('touch project/src/components/App.jsx'))

    const lsProject = (await ls.execute(createContext('ls project'))) as OutputObject[]
    const projectOutput = JSON.stringify(lsProject)
    expect(projectOutput).toContain('README.md')
    expect(projectOutput).toContain('src')
    expect(projectOutput).toContain('public')

    const lsSrc = (await ls.execute(createContext('ls project/src'))) as OutputObject[]
    const srcOutput = JSON.stringify(lsSrc)
    expect(srcOutput).toContain('index.js')
    expect(srcOutput).toContain('components')

    const lsComponents = (await ls.execute(
      createContext('ls project/src/components'),
    )) as OutputObject[]
    const componentsOutput = JSON.stringify(lsComponents)
    expect(componentsOutput).toContain('App.jsx')
  })
})
