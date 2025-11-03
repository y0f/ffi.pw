/**
 * @fileoverview pwd command - Print working directory
 */

import { createCommand, CommandCategory } from '../../core/Command'
import { formatText } from '../../core/formatters'
import { getFileSystem } from '../../core/VirtualFileSystem'

export const pwd = createCommand({
  name: 'pwd',
  description: 'Print working directory',
  category: CommandCategory.FILESYSTEM,
  usage: 'pwd',

  examples: [
    {
      command: 'pwd',
      description: 'Show current directory path',
    },
  ],

  execute: async () => {
    const fs = getFileSystem()
    const currentPath = fs.getCurrentPath()

    return [formatText(currentPath, 'text-blue-400')]
  },
})
