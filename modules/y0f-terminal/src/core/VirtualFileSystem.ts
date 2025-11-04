/**
 * @fileoverview Virtual File System
 *
 * Simulates a basic filesystem for cat, ls, cd commands.
 * Provides an in-memory file tree with directory navigation.
 */

export interface VirtualFile {
  name: string
  type: 'file' | 'directory'
  content?: string
  children?: Record<string, VirtualFile>
  permissions?: string
  size?: number
  modified?: Date
}

// File size limits to prevent memory leaks
const MAX_FILE_SIZE = 1024 * 1024 // 1MB per file
const MAX_TOTAL_SIZE = 10 * 1024 * 1024 // 10MB total

export interface FileSystemState {
  currentPath: string
  tree: VirtualFile
}

const DEFAULT_FILE_SYSTEM: VirtualFile = {
  name: '/',
  type: 'directory',
  children: {
    home: {
      name: 'home',
      type: 'directory',
      children: {
        user: {
          name: 'user',
          type: 'directory',
          children: {
            'README.md': {
              name: 'README.md',
              type: 'file',
              content: `# Welcome to ffi.pw

## Available Commands
Run \`help\` to see all available commands.

## Features
- 31+ built-in commands
- 6 retro games
- Full TypeScript support
- Virtual filesystem
- Command piping and chaining

Visit /commands for full documentation.
`,
              permissions: 'rw-r--r--',
              size: 256,
            },
            'secrets.txt': {
              name: 'secrets.txt',
              type: 'file',
              content: 'The owl knows... 🦉',
              permissions: 'rw-------',
              size: 19,
            },
          },
        },
      },
    },
    etc: {
      name: 'etc',
      type: 'directory',
      children: {
        'config.json': {
          name: 'config.json',
          type: 'file',
          content: JSON.stringify(
            {
              terminal: {
                theme: 'default',
                fontSize: 14,
                cursorBlink: true,
              },
            },
            null,
            2,
          ),
          permissions: 'rw-r--r--',
          size: 128,
        },
      },
    },
    tmp: {
      name: 'tmp',
      type: 'directory',
      children: {},
    },
  },
}

export class VirtualFileSystem {
  private state: FileSystemState
  private totalSize: number = 0

  constructor(initialTree?: VirtualFile) {
    this.state = {
      currentPath: '/home/user',
      tree: initialTree || DEFAULT_FILE_SYSTEM,
    }
    this.totalSize = this.calculateTotalSize(this.state.tree)
  }

  private calculateTotalSize(node: VirtualFile): number {
    let size = node.size || 0
    if (node.children) {
      for (const child of Object.values(node.children)) {
        size += this.calculateTotalSize(child)
      }
    }
    return size
  }

  getCurrentPath(): string {
    return this.state.currentPath
  }

  setCurrentPath(path: string): void {
    this.state.currentPath = path
  }

  /**
   * Resolve a path (absolute or relative) to an absolute path
   */
  resolvePath(path: string): string {
    if (path.startsWith('/')) {
      return this.normalizePath(path)
    }

    if (path === '~') {
      return '/home/user'
    }

    if (path.startsWith('~/')) {
      return this.normalizePath('/home/user/' + path.slice(2))
    }

    return this.normalizePath(this.state.currentPath + '/' + path)
  }

  /**
   * Normalize a path (resolve . and ..)
   */
  private normalizePath(path: string): string {
    const parts = path.split('/').filter((p) => p && p !== '.')
    const normalized: string[] = []

    for (const part of parts) {
      if (part === '..') {
        normalized.pop()
      } else {
        normalized.push(part)
      }
    }

    return '/' + normalized.join('/')
  }

  /**
   * Get a file or directory at a path
   */
  getNode(path: string): VirtualFile | null {
    const absPath = this.resolvePath(path)
    const parts = absPath.split('/').filter((p) => p)

    let current = this.state.tree

    for (const part of parts) {
      if (!current.children || !current.children[part]) {
        return null
      }
      current = current.children[part]
    }

    return current
  }

  /**
   * List directory contents
   */
  listDirectory(path: string): VirtualFile[] | null {
    const node = this.getNode(path)

    if (!node || node.type !== 'directory') {
      return null
    }

    if (!node.children) {
      return []
    }

    return Object.values(node.children)
  }

  /**
   * Read file contents
   */
  readFile(path: string): string | null {
    const node = this.getNode(path)

    if (!node || node.type !== 'file') {
      return null
    }

    return node.content || ''
  }

  /**
   * Check if a path exists
   */
  exists(path: string): boolean {
    return this.getNode(path) !== null
  }

  /**
   * Check if a path is a directory
   */
  isDirectory(path: string): boolean {
    const node = this.getNode(path)
    return node !== null && node.type === 'directory'
  }

  /**
   * Check if a path is a file
   */
  isFile(path: string): boolean {
    const node = this.getNode(path)
    return node !== null && node.type === 'file'
  }

  /**
   * Create a new file
   */
  createFile(path: string, content: string): boolean {
    if (content.length > MAX_FILE_SIZE) {
      console.warn(`File too large: ${content.length} bytes (max ${MAX_FILE_SIZE})`)
      return false
    }

    if (this.totalSize + content.length > MAX_TOTAL_SIZE) {
      console.warn(`Filesystem full: ${this.totalSize} bytes (max ${MAX_TOTAL_SIZE})`)
      return false
    }

    const absPath = this.resolvePath(path)
    const parts = absPath.split('/').filter((p) => p)
    const fileName = parts.pop()

    if (!fileName) return false

    let current = this.state.tree

    for (const part of parts) {
      if (!current.children) {
        current.children = {}
      }
      if (!current.children[part]) {
        return false
      }
      current = current.children[part]
    }

    if (!current.children) {
      current.children = {}
    }

    current.children[fileName] = {
      name: fileName,
      type: 'file',
      content,
      permissions: 'rw-r--r--',
      size: content.length,
      modified: new Date(),
    }

    this.totalSize += content.length

    return true
  }

  /**
   * Create a new directory
   */
  createDirectory(path: string, createParents = false): boolean {
    const absPath = this.resolvePath(path)
    const parts = absPath.split('/').filter((p) => p)
    const dirName = parts.pop()

    if (!dirName) return false

    let current = this.state.tree

    for (const part of parts) {
      if (!current.children) {
        current.children = {}
      }
      if (!current.children[part]) {
        if (!createParents) {
          return false
        }
        current.children[part] = {
          name: part,
          type: 'directory',
          children: {},
          permissions: 'rwxr-xr-x',
          modified: new Date(),
        }
      }
      current = current.children[part]
    }

    if (!current.children) {
      current.children = {}
    }

    current.children[dirName] = {
      name: dirName,
      type: 'directory',
      children: {},
      permissions: 'rwxr-xr-x',
      modified: new Date(),
    }

    return true
  }

  /**
   * Update file/directory timestamp
   */
  updateTimestamp(path: string): boolean {
    const node = this.getNode(path)
    if (!node) return false

    node.modified = new Date()
    return true
  }

  /**
   * Delete a file or directory
   */
  delete(path: string, recursive = false): boolean {
    const absPath = this.resolvePath(path)
    const parts = absPath.split('/').filter((p) => p)
    const fileName = parts.pop()

    if (!fileName) return false

    let current = this.state.tree

    for (const part of parts) {
      if (!current.children || !current.children[part]) {
        return false
      }
      current = current.children[part]
    }

    if (!current.children || !current.children[fileName]) {
      return false
    }

    const node = current.children[fileName]

    // If it's a directory and not empty, require recursive flag
    if (node.type === 'directory' && !recursive) {
      if (node.children && Object.keys(node.children).length > 0) {
        return false
      }
    }

    delete current.children[fileName]
    return true
  }

  /**
   * Get the filesystem state (for persistence)
   */
  getState(): FileSystemState {
    return this.state
  }

  /**
   * Restore filesystem state (from persistence)
   */
  setState(state: FileSystemState): void {
    this.state = state
  }
}

// Singleton instance
let fsInstance: VirtualFileSystem | null = null

export function getFileSystem(): VirtualFileSystem {
  if (!fsInstance) {
    fsInstance = new VirtualFileSystem()
  }
  return fsInstance
}

export function resetFileSystem(): void {
  fsInstance = new VirtualFileSystem()
}
