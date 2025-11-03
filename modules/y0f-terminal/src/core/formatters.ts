/**
 * @fileoverview formatters
 *
 * Provides functions to format text, headers, dividers, links, and multi-part output
 * for consistent terminal display across all commands.
 */

import { TERMINAL, ERROR_MESSAGES } from '../constants'
import { OutputObject, OutputPart } from './Command'

export function formatCommandLine(cmd: string): OutputObject {
  return {
    parts: [
      { text: TERMINAL.USER, color: 'text-primary-400' },
      { text: ':', color: 'text-white' },
      { text: TERMINAL.PATH, color: 'text-primary-400' },
      { text: '# ', color: 'text-white' },
      { text: cmd, color: 'text-gray-200' },
    ],
    isCommand: true,
    className: 'fira',
  }
}

export function formatError(
  command: string,
  message: string = ERROR_MESSAGES.COMMAND_NOT_FOUND,
): OutputObject {
  return {
    parts: [
      { text: `${message}: `, color: 'text-red-500' },
      { text: command, color: 'text-red-400' },
      ...(message === ERROR_MESSAGES.COMMAND_NOT_FOUND
        ? [{ text: ERROR_MESSAGES.HELP_HINT, color: 'text-red-500' }]
        : []),
    ],
    isCommand: false,
  }
}

export function formatHeader(text: string, color: string = 'text-primary-400'): OutputObject {
  return { text, color }
}

export function formatDivider(color: string = 'text-white/20'): OutputObject {
  return { text: '──────────────────────────────────────────────────────', color }
}

export function formatThickDivider(color: string = 'text-white/20'): OutputObject {
  return {
    text: '═══════════════════════════════════════════════════════════════════════════',
    color,
  }
}

export function formatThinDivider(color: string = 'text-white/20'): OutputObject {
  return {
    text: '───────────────────────────────────────────────────────────────────────────',
    color,
  }
}

export function formatText(text: string, color: string = 'text-gray-200'): OutputObject {
  return { text, color }
}

export function formatEmptyLine(): OutputObject {
  return { text: ' ', color: 'text-gray-200' }
}

export function formatBullet(
  text: string,
  color: string = 'text-gray-200',
  bulletColor: string = 'text-primary-400',
): OutputObject {
  return {
    parts: [
      { text: '◈ ', color: bulletColor },
      { text, color },
    ],
  }
}

export function formatLink(text: string, url: string, color: string = 'text-white'): OutputObject {
  return {
    text,
    color,
    isLink: true,
    url,
  }
}

export function formatMultiPart(parts: OutputPart[]): OutputObject {
  return { parts }
}

export function formatCompletionHint(matches: string[] | null | undefined): OutputObject {
  if (!matches || matches.length === 0) {
    return { text: '', color: 'text-gray-200' }
  }

  return {
    parts: [
      { text: 'Available: ', color: 'text-gray-500' },
      { text: matches.join('  '), color: 'text-primary-400' },
    ],
  }
}
