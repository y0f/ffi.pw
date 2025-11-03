import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  type FC,
  type FormEvent,
  type ReactNode,
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import { useCommandHandler } from '../hooks/useCommandHandler'
import { useCommandHistory } from '../hooks/useCommandHistory'
import { useTerminalInput } from '../hooks/useTerminalInput'
import useColorOverrides from '../hooks/useColorOverrides'
import useApplySavedBackground from '../hooks/useApplySavedBackground'
import { BUILTIN_GAME_CONFIGS } from './games'
import { GameErrorBoundary } from './GameErrorBoundary'
import welcomeText from '../config/welcomeText'
import type { OutputObject } from '../core/Command'
import type { GameConfig, GameComponentProps } from '../hooks/useGameHandler'
import '../styles/terminal.css'
import '../styles/trippy.css'

export interface TerminalConfig {
  user: string
  path: string
  defaultWidth: number
  defaultHeight: number
  expandedWidth: number
  expandedHeight: number
  fadeIn: number
  lineTransition: number
}

export interface TerminalTheme {
  isDarkMode: boolean
  background?: string
}

export interface TerminalCallbacks {
  onExpand?: (expanded: boolean) => void
}

export type { GameComponentProps, GameConfig }

export interface TerminalProps {
  config?: TerminalConfig
  theme: TerminalTheme
  callbacks?: TerminalCallbacks
  getGameConfig?: (gameName: string) => GameConfig | null
  headerIcon?: ReactNode
  expandIcon?: ReactNode
  collapseIcon?: ReactNode
}

const DEFAULT_CONFIG: TerminalConfig = {
  user: 'visitor@terminal',
  path: '~',
  defaultWidth: 35,
  defaultHeight: 39,
  expandedWidth: 35,
  expandedHeight: 65,
  fadeIn: 0.5,
  lineTransition: 0.2,
}

export const Terminal: FC<TerminalProps> = ({
  config = DEFAULT_CONFIG,
  theme,
  callbacks = {},
  getGameConfig,
  headerIcon,
  expandIcon,
  collapseIcon,
}) => {
  const { isDarkMode, background } = theme
  const { onExpand } = callbacks || {}

  // Terminal handles its own styling and color overrides
  useApplySavedBackground({ isDarkMode })
  const { applyColorOverrides } = useColorOverrides()

  const [isExpanded, setIsExpanded] = useState(false)
  const [activeGame, setActiveGame] = useState<string | null>(null)

  const dimensions = useMemo(
    () => ({
      width: isExpanded ? config.expandedWidth : config.defaultWidth,
      height: isExpanded ? config.expandedHeight : config.defaultHeight,
    }),
    [isExpanded, config],
  )

  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const endRef = useRef<HTMLDivElement>(null)

  const gameConfig = useMemo(() => {
    if (!activeGame) return null
    // Use provided getGameConfig or fall back to built-in games
    if (getGameConfig) return getGameConfig(activeGame)
    return BUILTIN_GAME_CONFIGS[activeGame] || null
  }, [activeGame, getGameConfig])

  const { addToHistory, navigateUp, navigateDown } = useCommandHistory()

  const handleSetActiveGame = useCallback((game: string | null) => {
    setActiveGame(game)
    if (game === null) {
      setTimeout(() => inputRef.current?.focus(), 250)
    }
  }, [])

  const handleSetIsExpanded = useCallback(
    (expanded: boolean) => {
      setIsExpanded(expanded)
      onExpand?.(expanded)
    },
    [onExpand],
  )

  const { handleSubmit, isTrippy, output, setOutput } = useCommandHandler({
    setIsExpanded: handleSetIsExpanded,
    setActiveGame: handleSetActiveGame,
  })

  const { input, setInput, handleKeyDown } = useTerminalInput(navigateUp, navigateDown, setOutput)

  const themedOutput = useMemo(
    () => (applyColorOverrides ? applyColorOverrides(output, isDarkMode) : output),
    [output, isDarkMode, applyColorOverrides],
  )

  useEffect(() => {
    setOutput(welcomeText())
    inputRef.current?.focus()
  }, [setOutput])

  const prevOutputLengthRef = useRef(output.length)

  useEffect(() => {
    inputRef.current?.focus()

    // Only scroll if output length changed (new content added)
    // Don't scroll if just animation content updated (same length)
    if (output.length !== prevOutputLengthRef.current) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' })
      prevOutputLengthRef.current = output.length
    }
  }, [output, isExpanded])

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const currentInput = input.trim()
      if (!currentInput) return

      try {
        addToHistory(currentInput)
        await handleSubmit(currentInput, setInput)
      } catch (error) {
        console.error('Error submitting command:', error)
      }
    },
    [input, handleSubmit, addToHistory, setInput],
  )

  const terminalClasses = useMemo(
    () => ({
      container: clsx(
        'rounded-sm overflow-hidden shadow-sm border z-444 relative min-w-[580px] min-h-[342px] max-h-[550px]',
        isTrippy
          ? 'trippy-terminal border-2'
          : isDarkMode
            ? 'border-neutral-200/20'
            : 'border-black/20',
      ),
      header: {
        container: clsx(
          'flex items-center justify-between px-4 py-2.5 border-b',
          isTrippy
            ? 'trippy-terminal'
            : isDarkMode
              ? 'bg-gray-950/70 border-neutral-200/20'
              : 'bg-white/80 border-black/20',
        ),
        icon: clsx(
          'pt-[1px]',
          isTrippy ? 'trippy-text' : isDarkMode ? 'text-gray-400' : 'text-gray-700',
        ),
        text: clsx(
          'fira text-sm pt-[1px]',
          isTrippy ? 'trippy-text' : isDarkMode ? 'text-gray-300' : 'text-gray-700',
        ),
      },
      expandButton: clsx(
        'w-4 h-4 rounded-full flex justify-center items-center',
        isTrippy
          ? 'trippy-bg'
          : isDarkMode
            ? 'bg-gray-400 text-black cursor-pointer'
            : 'bg-gray-700 text-white cursor-pointer',
        !isTrippy && 'cursor-pointer',
      ),
      expandButtonText: clsx('fira-thin text-xs', isDarkMode ? 'text-black' : 'text-white'),
      terminalContent: clsx(
        'terminal-wp relative overflow-y-auto p-4 fira-thin text-sm',
        isTrippy && 'trippy-bg',
        isDarkMode ? 'terminal-scrollbar' : 'terminal-scrollbar-light',
      ),
      terminalPrompt: clsx('fira text-sm', isTrippy && 'trippy-text'),
      promptUser: clsx(isDarkMode ? 'text-primary-400' : 'text-primary-600 fira'),
      promptSeparator: clsx(isDarkMode ? 'text-white' : 'text-black'),
      promptPath: clsx(isDarkMode ? 'text-primary-400' : 'text-primary-600 fira'),
      promptHash: clsx(isDarkMode ? 'text-white' : 'text-black'),
      input: clsx(
        'flex-grow bg-transparent outline-none fira-thin ml-2',
        isTrippy
          ? 'trippy-text placeholder-purple-300'
          : isDarkMode
            ? 'text-gray-200 caret-gray-200'
            : 'text-black caret-black/90',
      ),
      lineContainer: (className?: string) => clsx('mb-0.5', className),
      linkLine: (color?: string, className?: string) =>
        clsx(
          'mb-0.5 underline cursor-pointer hover:opacity-80',
          isTrippy ? 'trippy-text' : color,
          className,
        ),
    }),
    [isDarkMode, isTrippy],
  )

  const renderLine = useCallback(
    (line: OutputObject, i: number) => {
      if (line.parts) {
        return (
          <motion.div
            key={`line-${i}-${line.parts.length}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: config.lineTransition }}
            className={terminalClasses.lineContainer(line.className)}
          >
            {line.parts.map(
              (part: { text: string; color?: string; className?: string }, partIndex: number) => (
                <span key={`part-${i}-${partIndex}`} className={clsx(part.color, part.className)}>
                  {part.text}
                </span>
              ),
            )}
          </motion.div>
        )
      } else {
        return (
          <motion.div
            key={`text-${i}-${line.text?.substring(0, 5)}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: config.lineTransition }}
            className={
              line.isLink
                ? terminalClasses.linkLine(line.color, line.className)
                : terminalClasses.lineContainer(
                    clsx(isTrippy ? 'trippy-text' : line.color, line.className),
                  )
            }
            onClick={line.isLink ? () => window.open(line.url, '_blank') : undefined}
            whileHover={line.isLink ? { x: 2 } : {}}
          >
            {line.text}
          </motion.div>
        )
      }
    },
    [isTrippy, terminalClasses, config.lineTransition],
  )

  const toggleExpanded = useCallback(() => {
    handleSetIsExpanded(!isExpanded)
  }, [isExpanded, handleSetIsExpanded])

  const focusInput = useCallback(() => {
    inputRef.current?.focus()
  }, [])

  const handleGameClose = useCallback(() => {
    setActiveGame(null)
  }, [])

  return (
    <motion.div
      ref={terminalRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: config.fadeIn }}
      className={terminalClasses.container}
      style={{ width: `${dimensions.width}vw`, height: `${dimensions.height}vh` }}
    >
      <div className={terminalClasses.header.container}>
        <div className='flex items-center space-x-2'>
          {headerIcon || <span className={terminalClasses.header.icon}>$</span>}
          <span className={terminalClasses.header.text}>
            {config.user}:{config.path}
          </span>
        </div>
        <div className='flex space-x-2 pt-px'>
          <div className={terminalClasses.expandButton} onClick={toggleExpanded}>
            <div className={terminalClasses.expandButtonText}>
              {isExpanded ? collapseIcon || '-' : expandIcon || '+'}
            </div>
          </div>
        </div>
      </div>

      <div
        className={terminalClasses.terminalContent}
        style={{
          ...(background
            ? {
                backgroundImage: `url(${background})`,
              }
            : {}),
          height: 'calc(100% - 2.5rem)',
          mixBlendMode: isDarkMode ? 'screen' : 'overlay',
        }}
        onClick={focusInput}
      >
        {gameConfig ? (
          <div
            className={
              gameConfig.isJsDos
                ? 'absolute inset-0 z-20'
                : 'absolute inset-0 z-20 flex items-center justify-center'
            }
            onClick={(e) => e.stopPropagation()}
          >
            <GameErrorBoundary gameName={activeGame || 'unknown'} onExit={handleGameClose}>
              {gameConfig.isJsDos ? (
                <gameConfig.component onClose={handleGameClose} isDarkMode={isDarkMode} />
              ) : (
                <div className='w-full max-w-md h-full flex items-center justify-center'>
                  <gameConfig.component onClose={handleGameClose} isDarkMode={isDarkMode} />
                </div>
              )}
            </GameErrorBoundary>
          </div>
        ) : (
          <>
            <div className='whitespace-pre-wrap leading-4'>
              <AnimatePresence>{themedOutput.map(renderLine)}</AnimatePresence>
              <form onSubmit={onSubmit} className='flex items-center mt-1'>
                <span className={terminalClasses.terminalPrompt}>
                  <span className={terminalClasses.promptUser}>{config.user}</span>
                  <span className={terminalClasses.promptSeparator}>:</span>
                  <span className={terminalClasses.promptPath}>{config.path}</span>
                  <span className={terminalClasses.promptHash}>#</span>
                </span>
                <input
                  ref={inputRef}
                  type='text'
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className={terminalClasses.input}
                  autoFocus
                  spellCheck='false'
                  placeholder={isTrippy ? 'Whoa...' : ''}
                />
              </form>
            </div>
            <div ref={endRef} />
          </>
        )}
      </div>
    </motion.div>
  )
}
