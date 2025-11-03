/**
 * Terminal library constants
 * These are defaults that can be overridden via Terminal component props
 */

export const TERMINAL = {
  USER: 'visitor@ffi.pw',
  PATH: '~',
} as const

export const ERROR_MESSAGES = {
  COMMAND_NOT_FOUND: 'Command not found',
  COMMAND_ERROR: 'Error executing command',
  HELP_HINT: ". Type 'help' for available commands",
} as const

// Direction mappings for games
export const DIRECTIONS = {
  UP: 'UP',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
} as const

export type Direction = (typeof DIRECTIONS)[keyof typeof DIRECTIONS]

export const DIRECTION_KEYS: Record<string, Direction> = {
  arrowup: DIRECTIONS.UP,
  w: DIRECTIONS.UP,
  arrowdown: DIRECTIONS.DOWN,
  s: DIRECTIONS.DOWN,
  arrowleft: DIRECTIONS.LEFT,
  a: DIRECTIONS.LEFT,
  arrowright: DIRECTIONS.RIGHT,
  d: DIRECTIONS.RIGHT,
}

// Key codes
export const KEYS = {
  ESCAPE: 'escape',
  ENTER: 'enter',
  P: 'p',
} as const

export type KeyCode = (typeof KEYS)[keyof typeof KEYS]

// Snake game configuration
export interface Position {
  x: number
  y: number
}

export interface SnakeColors {
  BACKGROUND: string
  HEAD: string
  BODY: string
  BORDER: string
  TEXT: string
  BUTTON: string
}

export interface SnakeCanvas {
  WIDTH: number
  HEIGHT: number
  DISPLAY_WIDTH: string
  DISPLAY_HEIGHT: string
}

export interface SnakeConfig {
  GRID_SIZE: number
  INITIAL_SNAKE_POSITION: Position[]
  INITIAL_FOOD_POSITION: Position
  GAME_SPEED: number
  SCORE_PER_FOOD: number
  CANVAS: SnakeCanvas
  COLORS: SnakeColors
}

export const SNAKE_CONFIG: SnakeConfig = {
  GRID_SIZE: 15,
  INITIAL_SNAKE_POSITION: [{ x: 7, y: 7 }],
  INITIAL_FOOD_POSITION: { x: 3, y: 3 },
  GAME_SPEED: 150,
  SCORE_PER_FOOD: 10,
  CANVAS: {
    WIDTH: 300,
    HEIGHT: 250,
    DISPLAY_WIDTH: '255px',
    DISPLAY_HEIGHT: '235px',
  },
  COLORS: {
    BACKGROUND: '#000',
    HEAD: '#fff',
    BODY: '#cacaca',
    BORDER: 'primary-600',
    TEXT: 'primary-600',
    BUTTON: 'primary-400',
  },
}
