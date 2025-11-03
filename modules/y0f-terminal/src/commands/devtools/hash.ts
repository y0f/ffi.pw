/**
 * @fileoverview hash command - Generate cryptographic hashes with multiple algorithms
 */

import { createCommand, CommandCategory } from '../../core/Command'
import { formatHeader, formatMultiPart, formatText, formatEmptyLine } from '../../core/formatters'
import { getOption, hasFlag } from '../../core/ArgumentParser'
import { getFileSystem } from '../../core/VirtualFileSystem'

async function hashText(text: string, algorithm: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hashBuffer = await crypto.subtle.digest(algorithm, data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

export const hash = createCommand({
  name: 'hash',
  description: 'Generate cryptographic hashes with multiple algorithms',
  category: CommandCategory.DEVTOOLS,
  usage: 'hash [options] <text|file>',
  aliases: ['checksum', 'digest'],

  examples: [
    {
      command: 'hash "Hello World"',
      description: 'Generate SHA-256 hash (default)',
    },
    {
      command: 'hash --algo sha1 "test"',
      description: 'Generate SHA-1 hash',
    },
    {
      command: 'hash --all "data"',
      description: 'Generate hashes with all algorithms',
    },
    {
      command: 'hash -f README.md',
      description: 'Hash file contents',
    },
  ],

  longDescription:
    'Generate cryptographic hashes using SHA-1, SHA-256, SHA-384, or SHA-512 algorithms. Supports both text and file inputs.',

  execute: async ({ parsed }) => {
    if (!parsed || !parsed.args || parsed.args.length === 0) {
      return [formatText('Usage: hash [options] <text|file>', 'text-yellow-400')]
    }

    const input = parsed.args.join(' ')
    const algoOption = (getOption(parsed, 'algo', 'sha256') as string).toLowerCase()
    const showAll = hasFlag(parsed, 'all') || hasFlag(parsed, 'a')
    const isFile = hasFlag(parsed, 'f') || hasFlag(parsed, 'file')
    const uppercase = hasFlag(parsed, 'u') || hasFlag(parsed, 'upper')

    let textToHash = input

    if (isFile || (!input.includes(' ') && input.includes('.'))) {
      const fs = getFileSystem()
      const content = fs.readFile(input)
      if (content !== null) {
        textToHash = content
      } else if (isFile) {
        return [formatText(`hash: cannot read '${input}': No such file`, 'text-red-500')]
      }
    }

    try {
      const algorithms: Record<string, string> = {
        sha1: 'SHA-1',
        sha256: 'SHA-256',
        sha384: 'SHA-384',
        sha512: 'SHA-512',
      }

      const output = [formatHeader('CRYPTOGRAPHIC HASH'), formatEmptyLine()]

      if (showAll) {
        for (const name in algorithms) {
          const algo = algorithms[name]
          if (!algo) continue
          const hashValue = await hashText(textToHash, algo)
          const displayHash = uppercase ? hashValue.toUpperCase() : hashValue
          const algoPad = name.toUpperCase().padEnd(10)

          output.push(
            formatMultiPart([
              { text: algoPad, color: 'text-cyan-400' },
              { text: displayHash, color: 'text-primary-400' },
            ]),
          )
        }
      } else {
        const algo = algorithms[algoOption]

        if (!algo) {
          return [
            formatText(
              `hash: unknown algorithm '${algoOption}'. Use: sha1, sha256, sha384, sha512`,
              'text-red-500',
            ),
          ]
        }

        const hashValue = await hashText(textToHash, algo)
        const displayHash = uppercase ? hashValue.toUpperCase() : hashValue

        output.push(
          formatMultiPart([
            { text: `${algoOption.toUpperCase()}:  `, color: 'text-cyan-400' },
            { text: displayHash, color: 'text-primary-400' },
          ]),
        )
      }

      output.push(formatEmptyLine())
      const displayInput = textToHash.length > 50 ? textToHash.substring(0, 50) + '...' : textToHash
      output.push(
        formatMultiPart([
          { text: 'Input:    ', color: 'text-gray-500' },
          { text: displayInput, color: 'text-gray-400' },
        ]),
      )
      output.push(
        formatMultiPart([
          { text: 'Length:   ', color: 'text-gray-500' },
          { text: `${textToHash.length} bytes`, color: 'text-gray-400' },
        ]),
      )

      return output
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      return [formatText(`hash: ${errorMessage}`, 'text-red-500')]
    }
  },
})
