/**
 * @fileoverview cd command - Change directory
 */

import { createCommand, CommandCategory } from '../../core/Command'
import { formatText } from '../../core/formatters'
import { getFileSystem } from '../../core/VirtualFileSystem'
import { getArg } from '../../core/ArgumentParser'

export const cd = createCommand({
  name: 'cd',
  description: 'Change directory',
  category: CommandCategory.FILESYSTEM,
  usage: 'cd [path]',

  examples: [
    {
      command: 'cd /home',
      description: 'Change to /home directory',
    },
    {
      command: 'cd ..',
      description: 'Go up one directory',
    },
    {
      command: 'cd ~',
      description: 'Go to home directory',
    },
    {
      command: 'cd',
      description: 'Go to home directory',
    },
  ],

  execute: async ({ parsed }) => {
    const fs = getFileSystem()
    const path = getArg(parsed, 0, '~')

    const absPath = fs.resolvePath(path)

    if (!fs.exists(absPath)) {
      return [formatText(`cd: ${path}: No such file or directory`, 'text-red-500')]
    }

    if (!fs.isDirectory(absPath)) {
      return [formatText(`cd: ${path}: Not a directory`, 'text-red-500')]
    }

    fs.setCurrentPath(absPath)

    return [formatText(`${absPath}`, 'text-blue-400')]
  },
})
