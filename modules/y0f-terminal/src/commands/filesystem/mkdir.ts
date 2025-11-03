/**
 * @fileoverview mkdir command - Create directories in the virtual filesystem
 */

import { createCommand, CommandCategory } from '../../core/Command'
import { formatText } from '../../core/formatters'
import { getFileSystem } from '../../core/VirtualFileSystem'
import { hasFlag } from '../../core/ArgumentParser'

export const mkdir = createCommand({
  name: 'mkdir',
  description: 'Create directories',
  category: CommandCategory.FILESYSTEM,
  usage: 'mkdir [options] <directory...>',
  aliases: ['md'],

  examples: [
    {
      command: 'mkdir test',
      description: 'Create a directory named "test"',
    },
    {
      command: 'mkdir -p foo/bar/baz',
      description: 'Create nested directories',
    },
    {
      command: 'mkdir dir1 dir2 dir3',
      description: 'Create multiple directories',
    },
  ],

  longDescription:
    'Create one or more directories in the virtual filesystem. Use -p to create parent directories as needed.',

  execute: async ({ parsed }) => {
    if (!parsed || !parsed.args || parsed.args.length === 0) {
      return [formatText('mkdir: missing operand', 'text-red-500')]
    }

    const fs = getFileSystem()
    const parents = hasFlag(parsed, 'p')
    const results: string[] = []

    for (const dirPath of parsed.args) {
      const absPath = fs.resolvePath(dirPath)

      if (fs.exists(absPath)) {
        const node = fs.getNode(absPath)
        if (node?.type === 'directory') {
          results.push(`mkdir: cannot create directory '${dirPath}': File exists`)
        } else {
          results.push(`mkdir: cannot create directory '${dirPath}': File exists`)
        }
        continue
      }

      const created = fs.createDirectory(absPath, parents)
      if (!created) {
        results.push(`mkdir: cannot create directory '${dirPath}': No such file or directory`)
      }
    }

    if (results.length === 0) {
      return []
    }

    return results.map((msg) => formatText(msg, 'text-red-500'))
  },
})
