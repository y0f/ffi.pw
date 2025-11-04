/**
 * Output Windowing
 * Limits terminal output to prevent memory issues with long-running sessions
 */

import { useMemo } from 'react'
import type { OutputObject } from '../core/Command'
import { formatText, formatDivider } from '../core/formatters'

const MAX_OUTPUT_LINES = 1000 // Keep last 1000 lines
const TRUNCATION_THRESHOLD = 1100 // Start truncating at 1100 lines

export interface OutputWindowConfig {
  maxLines?: number
  truncationThreshold?: number
}

/**
 * Apply output windowing to limit terminal history
 * Keeps the most recent lines and shows a truncation message
 */
export function useOutputWindowing(
  output: OutputObject[],
  config: OutputWindowConfig = {},
): OutputObject[] {
  const { maxLines = MAX_OUTPUT_LINES, truncationThreshold = TRUNCATION_THRESHOLD } = config

  return useMemo(() => {
    if (output.length <= truncationThreshold) {
      return output
    }

    const hiddenCount = output.length - maxLines
    const truncatedOutput = output.slice(-maxLines)

    // Add truncation message at the top
    const truncationMessage: OutputObject[] = [
      formatText(
        `⚠️ Terminal output truncated (${hiddenCount} older lines hidden)`,
        'text-yellow-500',
      ),
      formatText('Use "clear" to reset the terminal', 'text-gray-500'),
      formatDivider(),
    ]

    return [...truncationMessage, ...truncatedOutput]
  }, [output, maxLines, truncationThreshold])
}

/**
 * Get stats about output windowing
 */
export function getOutputStats(output: OutputObject[]) {
  return {
    totalLines: output.length,
    isNearLimit: output.length > MAX_OUTPUT_LINES * 0.8,
    isOverLimit: output.length > MAX_OUTPUT_LINES,
    memoryEstimateMB: (JSON.stringify(output).length / 1024 / 1024).toFixed(2),
  }
}
