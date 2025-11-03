/**
 * @fileoverview base64 command - Enhanced base64 encoding/decoding with file support
 */

import { createCommand, CommandCategory } from '../../core/Command'
import { formatHeader, formatText, formatEmptyLine } from '../../core/formatters'
import { hasFlag } from '../../core/ArgumentParser'
import { getFileSystem } from '../../core/VirtualFileSystem'

export const base64 = createCommand({
  name: 'base64',
  description: 'Encode or decode base64 strings and files',
  category: CommandCategory.DEVTOOLS,
  usage: 'base64 [options] <text|file>',
  aliases: ['b64'],

  examples: [
    {
      command: 'base64 "Hello World"',
      description: 'Encode text to base64',
      output: 'SGVsbG8gV29ybGQ=',
    },
    {
      command: 'base64 -d SGVsbG8gV29ybGQ=',
      description: 'Decode base64 to text',
      output: 'Hello World',
    },
    {
      command: 'base64 README.md',
      description: 'Encode file contents to base64',
    },
    {
      command: 'base64 -d -f encoded.txt',
      description: 'Decode file contents from base64',
    },
  ],

  longDescription:
    'Encode or decode data in base64 format. Supports both direct text input and file operations.',

  execute: async ({ parsed }) => {
    if (!parsed || !parsed.args || parsed.args.length === 0) {
      return [formatText('Usage: base64 [options] <text|file>', 'text-yellow-400')]
    }

    const shouldDecode = hasFlag(parsed, 'd') || hasFlag(parsed, 'decode')
    const isFile = hasFlag(parsed, 'f') || hasFlag(parsed, 'file')
    const wrap = hasFlag(parsed, 'w') || hasFlag(parsed, 'wrap')
    const input = parsed.args.join(' ')

    let textToProcess = input

    // If file flag or input looks like a file path, try to read from VFS
    if (isFile || (!input.includes(' ') && input.includes('.'))) {
      const fs = getFileSystem()
      const content = fs.readFile(input)
      if (content !== null) {
        textToProcess = content
      } else if (isFile) {
        return [formatText(`base64: cannot read '${input}': No such file`, 'text-red-500')]
      }
    }

    try {
      let result: string

      if (shouldDecode) {
        // Decode from base64 - remove whitespace/newlines first
        const cleaned = textToProcess.replace(/\s+/g, '')
        result = atob(cleaned)
      } else {
        // Encode to base64
        result = btoa(textToProcess)

        if (wrap && result.length > 76) {
          result = result.match(/.{1,76}/g)?.join('\n') || result
        }
      }

      const lines = result.split('\n')
      const output = [
        formatHeader(shouldDecode ? 'DECODED' : 'ENCODED'),
        formatEmptyLine(),
        ...lines.map((line) => formatText(line, 'text-primary-400')),
      ]

      if (!shouldDecode && !wrap) {
        output.push(formatEmptyLine())
        output.push(
          formatText(
            `Input: ${textToProcess.length} bytes | Output: ${result.length} chars`,
            'text-gray-500',
          ),
        )
      }

      return output
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      return [formatText(`base64: ${errorMessage}`, 'text-red-500')]
    }
  },
})
