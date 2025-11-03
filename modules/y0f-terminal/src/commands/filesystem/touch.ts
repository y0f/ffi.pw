/**
 * @fileoverview touch command - Create empty files or update timestamps
 */

import { createCommand, CommandCategory } from '../../core/Command'
import { formatText } from '../../core/formatters'
import { getFileSystem } from '../../core/VirtualFileSystem'

export const touch = createCommand({
  name: 'touch',
  description: 'Create empty files or update timestamps',
  category: CommandCategory.FILESYSTEM,
  usage: 'touch <file...>',

  examples: [
    {
      command: 'touch newfile.txt',
      description: 'Create an empty file',
    },
    {
      command: 'touch file1.txt file2.txt file3.txt',
      description: 'Create multiple files',
    },
  ],

  longDescription:
    'Create empty files if they do not exist, or update the modification timestamp if they do.',

  execute: async ({ parsed }) => {
    if (!parsed || !parsed.args || parsed.args.length === 0) {
      return [formatText('touch: missing file operand', 'text-red-500')]
    }

    const fs = getFileSystem()
    const results: string[] = []

    for (const filePath of parsed.args) {
      const absPath = fs.resolvePath(filePath)

      if (fs.exists(absPath)) {
        const node = fs.getNode(absPath)
        if (node?.type === 'file') {
          fs.updateTimestamp(absPath)
          continue
        } else {
          results.push(`touch: cannot touch '${filePath}': Is a directory`)
          continue
        }
      }

      const created = fs.createFile(absPath, '')
      if (!created) {
        results.push(`touch: cannot touch '${filePath}': No such file or directory`)
      }
    }

    if (results.length === 0) {
      return []
    }

    return results.map((msg) => formatText(msg, 'text-red-500'))
  },
})
