/**
 * Terminal Core Library
 * A modular, type-safe terminal emulator with command system
 */

// Core types and interfaces
export { CommandCategory, createCommand } from './core/Command'
export type {
  Command,
  CommandCategoryType,
  CommandContext,
  CommandExecute,
  CommandOptions,
  OutputObject,
  OutputPart,
  ParsedCommand,
} from './core/Command'

// Command registry
export { default as registry } from './core/CommandRegistry'
export { ensureCommandsRegistered } from './commands'

export {
  parseCommandInput,
  getArg,
  getOption,
  hasFlag,
  requireArgs,
  requireOptions,
} from './core/ArgumentParser'

// Tab completion
export { TabCompletionManager } from './core/TabCompletion'
// Virtual Filesystem
export { VirtualFileSystem, getFileSystem, resetFileSystem } from './core/VirtualFileSystem'
export type { VirtualFile, FileSystemState } from './core/VirtualFileSystem'

// Alias expansion
export { getAliases, expandAlias } from './commands/system/alias'

export {
  formatHeader,
  formatDivider,
  formatText,
  formatEmptyLine,
  formatBullet,
  formatLink,
  formatMultiPart,
  formatCommandLine,
  formatError,
  formatCompletionHint,
} from './core/formatters'

// Color overrides
export { DEFAULT_COLOR_OVERRIDES, type ColorOverride } from './core/colorOverrides'

// All commands
export * from './commands'

// Config
export { default as welcomeText } from './config/welcomeText'

// Hooks
export { useCommandHandler } from './hooks/useCommandHandler'
export { useCommandHistory } from './hooks/useCommandHistory'
export { useTerminalInput } from './hooks/useTerminalInput'
export { useGameHandler } from './hooks/useGameHandler'
export { default as useColorOverrides } from './hooks/useColorOverrides'
export { default as useApplySavedBackground } from './hooks/useApplySavedBackground'
export { default as useCommandList } from './hooks/useCommandList'
export type { ColorOverridesHook } from './hooks/useColorOverrides'
export type { BackgroundHookOptions } from './hooks/useApplySavedBackground'
export type { UseCommandListReturn } from './hooks/useCommandList'
export type { CommandHandler, CommandHandlerOptions } from './hooks/useCommandHandler'
export type { CommandHistory } from './hooks/useCommandHistory'
export type { TerminalInput } from './hooks/useTerminalInput'
export type {
  GameHandler,
  GameHandlerOptions,
  GameConfig,
  GameComponentProps,
} from './hooks/useGameHandler'

// Components
export { Terminal } from './components/Terminal'
export type {
  TerminalConfig,
  TerminalTheme,
  TerminalCallbacks,
  TerminalProps,
} from './components/Terminal'

// Game components
export {
  Snake,
  Sparrow,
  Doom,
  Bifi,
  Omf,
  JsDosGame,
  BUILTIN_GAME_CONFIGS,
} from './components/games'

// Constants
export {
  TERMINAL,
  SNAKE_CONFIG,
  DIRECTIONS,
  DIRECTION_KEYS,
  KEYS,
  ERROR_MESSAGES,
} from './constants'
export type {
  Position,
  SnakeConfig,
  SnakeColors,
  SnakeCanvas,
  Direction,
  KeyCode,
} from './constants'
