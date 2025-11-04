/**
 * @fileoverview matrix command - Animated Matrix rain effect
 */

import { createCommand, CommandCategory } from '../../core/Command'
import { formatText } from '../../core/formatters'
import { animateContinuous, createAnimatedCommand } from '../../core/AnimatedCommand'
import type { OutputObject } from '../../core/Command'

const MATRIX_CHARS = 'ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ01234567890'
const COLUMNS = 60
const ROWS = 15
interface RainDrop {
  column: number
  position: number
  speed: number
  trail: string[]
  maxTrailLength: number
}

class MatrixRain {
  private drops: RainDrop[] = []
  private grid: string[][] = []

  constructor() {
    for (let row = 0; row < ROWS; row++) {
      this.grid[row] = new Array(COLUMNS).fill(' ')
    }

    for (let col = 0; col < COLUMNS; col++) {
      if (Math.random() > 0.7) {
        this.drops.push(this.createDrop(col, Math.random() * ROWS))
      }
    }
  }

  private createDrop(column: number, startPosition: number = -1): RainDrop {
    const maxTrailLength = 5 + Math.floor(Math.random() * 10)
    const trail: string[] = []

    // Pre-generate trail characters
    for (let i = 0; i < maxTrailLength; i++) {
      const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]
      if (char !== undefined) {
        trail.push(char)
      }
    }

    return {
      column,
      position: startPosition,
      speed: 0.3 + Math.random() * 0.7,
      trail,
      maxTrailLength,
    }
  }

  update(): void {
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLUMNS; col++) {
        const gridRow = this.grid[row]
        if (gridRow) {
          gridRow[col] = ' '
        }
      }
    }

    for (let i = this.drops.length - 1; i >= 0; i--) {
      const drop = this.drops[i]
      if (!drop) continue

      drop.position += drop.speed

      for (let j = 0; j < drop.trail.length; j++) {
        const row = Math.floor(drop.position - j)
        if (row >= 0 && row < ROWS) {
          const gridRow = this.grid[row]
          const trailChar = drop.trail[j]
          if (gridRow && trailChar !== undefined) {
            gridRow[drop.column] = trailChar
          }
        }
      }

      if (drop.position - drop.maxTrailLength > ROWS) {
        // Randomly regenerate or remove drop
        if (Math.random() > 0.3) {
          this.drops[i] = this.createDrop(drop.column)
        } else {
          this.drops.splice(i, 1)
        }
      }
    }

    // Occasionally add new drops
    if (Math.random() > 0.95 && this.drops.length < COLUMNS * 0.4) {
      const availableColumns = []
      for (let col = 0; col < COLUMNS; col++) {
        if (!this.drops.some((d) => d.column === col)) {
          availableColumns.push(col)
        }
      }
      if (availableColumns.length > 0) {
        const col = availableColumns[Math.floor(Math.random() * availableColumns.length)]
        if (col !== undefined) {
          this.drops.push(this.createDrop(col))
        }
      }
    }

    // Randomly change characters in existing trails
    for (const drop of this.drops) {
      if (Math.random() > 0.9) {
        const indexToChange = Math.floor(Math.random() * drop.trail.length)
        const newChar = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]
        if (newChar !== undefined) {
          drop.trail[indexToChange] = newChar
        }
      }
    }
  }

  render(includeHeader: boolean = true): OutputObject[] {
    const output: OutputObject[] = []

    if (includeHeader) {
      output.push(
        formatText('Entering the Matrix...', 'text-green-400 font-bold'),
        formatText(' '),
        formatText('Type "clear" or another command to exit', 'text-green-600 text-xs'),
        formatText(' '),
      )
    }

    output.push(formatText('═'.repeat(COLUMNS), 'text-green-600 opacity-50'))

    for (let row = 0; row < ROWS; row++) {
      let lineText = ''
      const colorSegments: Array<{ start: number; end: number; color: string }> = []

      for (let col = 0; col < COLUMNS; col++) {
        const gridRow = this.grid[row]
        const char = gridRow ? gridRow[col] : ' '
        lineText += char ?? ' '

        if (char !== ' ') {
          for (const drop of this.drops) {
            if (drop.column === col) {
              const distanceFromHead = drop.position - row
              if (distanceFromHead >= 0 && distanceFromHead < drop.trail.length) {
                const relativePosition = distanceFromHead / drop.trail.length
                let color = 'text-green-500'

                if (relativePosition < 0.15) {
                  color = 'text-green-100 brightness-125'
                } else if (relativePosition < 0.4) {
                  color = 'text-green-300'
                } else if (relativePosition < 0.7) {
                  color = 'text-green-400'
                } else {
                  color = 'text-green-600 opacity-70'
                }

                colorSegments.push({ start: col, end: col + 1, color })
                break
              }
            }
          }
        }
      }

      if (colorSegments.length > 0) {
        const parts = []
        let lastEnd = 0

        for (const segment of colorSegments) {
          if (segment.start > lastEnd) {
            parts.push({ text: lineText.slice(lastEnd, segment.start) })
          }
          parts.push({
            text: lineText.slice(segment.start, segment.end),
            color: segment.color,
          })
          lastEnd = segment.end
        }

        if (lastEnd < lineText.length) {
          parts.push({ text: lineText.slice(lastEnd) })
        }

        output.push({ parts })
      } else {
        output.push({ text: lineText })
      }
    }

    output.push(formatText('═'.repeat(COLUMNS), 'text-green-600 opacity-50'))

    return output
  }
}

const matrixAnimation = {
  start: (context: any) => {
    const rain = new MatrixRain()
    let isFirstRender = true

    animateContinuous(
      () => {
        if (!isFirstRender) {
          rain.update()
        }
        isFirstRender = false

        return rain.render(true)
      },
      15,
      context,
    )
  },
  duration: 0,
}

export const matrix = createCommand({
  name: 'matrix',
  description: 'Animated Matrix digital rain effect',
  category: CommandCategory.EFFECTS,
  usage: 'matrix',

  examples: [
    {
      command: 'matrix',
      description: 'Start the Matrix rain animation',
    },
  ],

  execute: createAnimatedCommand('matrix', matrixAnimation),
})
